import { INVOICE_CSS } from "./invoiceStyles";
import { brandFor } from "./constants";
import { gstBreakdown, splitChassis } from "./calc";

// Everything interpolated into the invoice HTML goes through this. The old app
// pasted dealer names/addresses straight into HTML that was then injected with
// innerHTML / document.write, so a dealer name like <img onerror=...> would run
// in the viewer's session.
export const escapeHtml = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// Quotation number = JPJ- + vehicle type letter (R / C) + the two editable
// chassis parts. Chassis = PREFIX + mid1 + "H268" + mid2.
// The old number used the last 6 characters, which is "268" + mid2: mid1 was
// dropped, so different vehicles could get the same quotation number.
export const invoiceNumberFor = (q) => {
  if (q.chassisNumber) {
    const { mid1, mid2 } = splitChassis(q.chassisNumber);
    if (mid1 && mid2) {
      return `JPJ-${q.vehicleType === "cargo" ? "C" : "R"}${mid1}${mid2}`;
    }
    return `JPJ-${q.chassisNumber.slice(-6)}`; // unexpected chassis format: old behaviour
  }
  return `JPJ-${q.id != null ? `Q${q.id}` : "000000"}`;
};

export const getInvoiceHTML = (q, now = new Date()) => {
  const e = escapeHtml;
  const date = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const brand = brandFor(q.vehicleType);
  const gst = gstBreakdown(q.totalAmount);

  const lineItems = [
    {
      description: `${brand} ${q.modelName}`,
      subtitle: "Base Vehicle Model",
      amount: q.modelPrice,
    },
    q.bodyTypeName && {
      description: q.bodyTypeName,
      subtitle: "Body Type",
      amount: q.bodyTypePrice,
    },
    q.colorName && {
      description: q.colorName,
      subtitle: "Vehicle Color",
      amount: null,
    },
    q.batteryType && {
      description: q.batteryType,
      subtitle: `Battery — ${q.batteryVolt}V, ${q.batteryAmpereHours}Ah`,
      amount: q.batteryPrice,
    },
  ].filter(Boolean);

  const chassis = q.chassisNumber || "To be assigned";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>${INVOICE_CSS}</style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="invoice-header">
      <div>
        <div class="brand-name">${e(brand)}</div>
        <div class="brand-tagline">Vehicle Quotation</div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-label">Quotation No.</div>
        <div class="invoice-number">${e(invoiceNumberFor(q))}</div>
        <div class="invoice-date">${e(date)}</div>
      </div>
    </div>
    <div class="info-strip">
      <div class="info-block">
        <div class="info-section-label">Dealer Information</div>
        <div class="info-name">${e(q.dealerName)}</div>
        <div class="info-line">GSTIN: ${e(q.dealerGstin || "—")}</div>
        <div class="info-line">Code: ${e(q.dealerCode)}</div>
        <div class="info-line">${e(q.dealerAddress)}</div>
        <div class="info-line">${e(q.dealerDistrict)}, ${e(q.dealerState)} — ${e(q.dealerPinCode)}</div>
      </div>
      <div class="info-block">
        <div class="info-section-label">Vehicle Details</div>
        <div class="info-name">${q.vehicleType === "cargo" ? "Cargo / Loader" : "E-Rickshaw"}</div>
        <div class="info-line">Chassis: ${e(chassis)}</div>
      </div>
    </div>
    <div class="items-section">
      <div class="items-header">
        <div class="col-header">Description</div>
        <div class="col-header right">Amount</div>
      </div>
      ${lineItems
        .map(
          (item) => `
      <div class="line-item">
        <div>
          <div class="item-desc">${e(item.description)}</div>
          <div class="item-sub">${e(item.subtitle)}</div>
        </div>
        <div class="item-amount">${item.amount != null ? e(inr(item.amount)) : "Included"}</div>
      </div>`,
        )
        .join("")}
    </div>
    <div class="totals-section">
      <div class="totals-box">
        <div class="subtotal-row">
          <span class="tax-row-label">Subtotal (excl. GST)</span>
          <span class="tax-row-amount">${e(inr(gst.subtotal))}</span>
        </div>
        <div class="tax-row">
          <span class="tax-row-label">CGST (2.5%)</span>
          <span class="tax-row-amount">${e(inr(gst.cgst))}</span>
        </div>
        <div class="tax-row">
          <span class="tax-row-label">SGST (2.5%)</span>
          <span class="tax-row-amount">${e(inr(gst.sgst))}</span>
        </div>
        <div class="total-final">
          <div class="total-final-label">Grand Total</div>
          <div class="total-final-amount">${e(inr(gst.total))}</div>
        </div>
      </div>
    </div>
    <div class="invoice-footer">
      <div class="footer-note">This is a computer-generated quotation. Prices are subject to change.</div>
      <div class="footer-chassis">${e(q.chassisNumber || "")}</div>
    </div>
  </div>
</body>
</html>`;
};

// The invoice is rendered inside a hidden iframe so its global CSS
// (`* { margin: 0 }`, body padding...) can't leak into the app while the PDF is
// being built, and so printing doesn't depend on popups being allowed.
const openInvoiceFrame = async (html) => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:860px;height:1200px;border:0;";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  doc.write(html);
  doc.close();
  await new Promise((r) => setTimeout(r, 400)); // let layout settle
  if (doc.fonts?.ready) {
    await Promise.race([
      doc.fonts.ready.catch(() => {}),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
  }
  return { iframe, doc };
};

const safeFileName = (v) => String(v).replace(/[^A-Za-z0-9_-]/g, "");

export const downloadQuotationPDF = async (q) => {
  // Loaded on demand — these two libraries are heavy and only needed here.
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const { iframe, doc } = await openInvoiceFrame(getInvoiceHTML(q));
  let canvas;
  try {
    canvas = await html2canvas(doc.querySelector(".invoice-wrapper") || doc.body, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  } finally {
    iframe.remove();
  }

  // compress: without it jsPDF stores the page image uncompressed (~13 MB for one invoice).
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const usableW = pageW - margin * 2;
  const usableH = pageH - margin * 2;
  const pxPerMm = canvas.width / usableW;
  const slicePx = Math.floor(usableH * pxPerMm);

  // Cut the tall canvas into page-sized slices so nothing bleeds into margins.
  for (let y = 0, page = 0; y < canvas.height; y += slicePx, page++) {
    const h = Math.min(slicePx, canvas.height - y);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = h;
    const ctx = slice.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
    if (page > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL("image/png"), "PNG", margin, margin, usableW, h / pxPerMm, undefined, "FAST");
  }

  pdf.save(`quotation-${safeFileName(q.chassisNumber || q.id || "draft")}.pdf`);
};

export const printQuotation = async (q) => {
  const { iframe } = await openInvoiceFrame(getInvoiceHTML(q));
  const win = iframe.contentWindow;
  const cleanup = () => iframe.remove();
  win.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 120000); // fallback if afterprint never fires
  win.focus();
  win.print();
};
