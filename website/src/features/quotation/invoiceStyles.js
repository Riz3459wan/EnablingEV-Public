// Invoice stylesheet, copied verbatim from the old app's getInvoiceHTML().
export const INVOICE_CSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: #f5f4f0;
          color: #1a1a1a;
          padding: 40px;
          font-size: 13px;
          line-height: 1.6;
        }
        .invoice-wrapper {
          max-width: 780px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 24px rgba(0,0,0,0.08);
        }
        .invoice-header {
          background: #e8f0fe;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          border-bottom: 3px solid #3f51b5;
          padding: 36px 48px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          letter-spacing: 0.5px;
          color: #1a237e;
          line-height: 1.2;
        }
        .brand-tagline {
          font-size: 11px;
          color: #5c6bc0;
          margin-top: 4px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .invoice-meta { text-align: right; }
        .invoice-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #5c6bc0;
          margin-bottom: 6px;
        }
        .invoice-number {
          font-size: 18px;
          font-weight: 600;
          color: #1a237e;
          letter-spacing: 0.5px;
        }
        .invoice-date { font-size: 12px; color: #5c6bc0; margin-top: 4px; }
        .info-strip { display: flex; border-bottom: 1px solid #f0ede8; }
        .info-block {
          flex: 1;
          padding: 28px 48px;
          border-right: 1px solid #f0ede8;
        }
        .info-block:last-child { border-right: none; }
        .info-section-label {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .info-name { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 6px; }
        .info-line { color: #6b7280; font-size: 12.5px; margin-bottom: 2px; }
        .badge {
          display: inline-block;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          margin-top: 8px;
        }
        .items-section { padding: 0 48px 0; }
        .items-header {
          display: grid;
          grid-template-columns: 1fr 140px;
          padding: 14px 0;
          border-bottom: 2px solid #111827;
          margin-top: 32px;
        }
        .col-header {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 600;
        }
        .col-header.right { text-align: right; }
        .line-item {
          display: grid;
          grid-template-columns: 1fr 140px;
          padding: 18px 0;
          border-bottom: 1px solid #f0ede8;
          align-items: center;
        }
        .item-desc { font-weight: 600; font-size: 13.5px; color: #111827; }
        .item-sub { font-size: 11.5px; color: #9ca3af; margin-top: 3px; }
        .item-amount { text-align: right; font-size: 14px; font-weight: 500; color: #374151; }
        .totals-section {
          padding: 24px 48px 36px;
          display: flex;
          justify-content: flex-end;
        }
        .totals-box { width: 300px; }
        .tax-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0ede8;
          font-size: 13px;
          color: #6b7280;
        }
        .tax-row-label { font-weight: 500; }
        .tax-row-amount { font-weight: 500; }
        .subtotal-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 2px solid #e8eaf6;
          font-size: 13px;
          color: #374151;
          font-weight: 600;
        }
        .total-final {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #e8f0fe;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          border-radius: 4px;
          border: 2px solid #3f51b5;
          margin-top: 12px;
        }
        .total-final-label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #5c6bc0;
          font-weight: 500;
        }
        .total-final-amount {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a237e;
          letter-spacing: 0.5px;
        }
        .invoice-footer {
          background: #f9fafb;
          border-top: 1px solid #f0ede8;
          padding: 20px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-note { font-size: 11px; color: #9ca3af; }
        .footer-chassis { font-size: 11px; color: #d1d5db; letter-spacing: 1px; font-weight: 500; }
        @media print {
          body { background: white; padding: 0; }
          .invoice-wrapper { box-shadow: none; border-radius: 0; }
        }
`;
