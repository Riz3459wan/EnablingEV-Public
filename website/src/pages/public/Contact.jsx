import { memo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Phone, Mail, ArrowRight, MapPin } from "lucide-react";
import api from "../../api/client";
import { OFFICES, PHONES, EMAIL } from "../../data/company";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const generateCaptcha = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

const LuxeField = ({ label, error, children, className = "" }) => (
  <div className={className}>
    {label && (
      <label className="block text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/40 mb-2 sm:mb-3">
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="text-amber-300 text-xs mt-2 leading-relaxed">{error}</p>
    )}
  </div>
);

const inputClass =
  "w-full bg-transparent text-white placeholder:text-white/30 outline-none text-sm sm:text-base py-2.5 sm:py-3 border-b border-white/15 focus:border-primary transition-colors duration-300";

const Contact = memo(() => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    pincode: "",
    state: "",
    district: "",
    captcha: "",
  });
  const [captchaValue, setCaptchaValue] = useState(generateCaptcha());
  const [captchaError, setCaptchaError] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const interval = setInterval(
      () => setCaptchaValue(generateCaptcha()),
      60000,
    );
    return () => clearInterval(interval);
  }, []);

  const update = (field) => (e) => {
    let { value } = e.target;
    if (field === "name") value = value.replace(/[^a-zA-Z\s]/g, "");
    if (field === "contact") value = value.replace(/[^0-9]/g, "").slice(0, 10);
    if (field === "pincode") value = value.replace(/[^0-9]/g, "").slice(0, 6);
    setForm((f) => ({ ...f, [field]: value }));
  };

  useEffect(() => {
    if (form.pincode.length !== 6) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${form.pincode}`,
        );
        const data = (await res.json())[0];
        if (!cancelled && data.Status === "Success") {
          const { State, District } = data.PostOffice[0];
          setForm((f) => ({ ...f, state: State, district: District }));
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [form.pincode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.captcha !== captchaValue) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setStatus("submitting");
    try {
      await api.post("/contact", form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-ink text-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-ink border-b border-white/[0.06]">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] rounded-full bg-primary/[0.03] blur-[140px] sm:blur-[160px]" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 lg:pt-48 pb-14 sm:pb-20 lg:pb-28 text-center">
          <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
            <span className="text-eyebrow text-white/50">Get In Touch</span>
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
          </div>

          <h1
            className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.015em] mb-6 sm:mb-8 max-w-4xl mx-auto"
            style={{ animationDelay: "120ms" }}
          >
            Find Us.
            <br />
            <span className="text-primary">Talk To Us.</span>
          </h1>

          <p
            className="animate-fade-up text-lead text-white/60 max-w-2xl mx-auto"
            style={{ animationDelay: "220ms" }}
          >
            Registered office in Ghaziabad, factory in Sahibabad, and a regional
            office in Patna. Reach out, or stop by — we'd be glad to meet.
          </p>
        </div>
      </section>

      {/* ─── Offices + Map ────────────────────────────────────── */}
      <section className="relative bg-ink border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20 items-start">
            {/* Offices */}
            <div>
              <div className="animate-fade-up flex items-center gap-3 mb-8 sm:mb-10">
                <span className="h-px w-6 sm:w-8 bg-primary/60" />
                <span className="text-eyebrow text-white/50">Our Offices</span>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {OFFICES.map((office, i) => (
                  <div
                    key={office.label}
                    className="animate-fade-up pb-6 sm:pb-8 border-b border-white/[0.06] last:border-b-0"
                    style={{ animationDelay: `${100 + i * 80}ms` }}
                  >
                    <div className="flex items-start gap-3 mb-2 sm:mb-3">
                      <MapPin
                        size={14}
                        className="text-primary/70 shrink-0 mt-1"
                      />
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-primary/70">
                        {office.label}
                      </p>
                    </div>
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-sm pl-6">
                      {office.address}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="animate-fade-up mt-10 pt-6 sm:pt-8 border-t border-white/[0.08]"
                style={{ animationDelay: "400ms" }}
              >
                <ul className="space-y-4 sm:space-y-5 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <Phone
                      size={15}
                      className="text-primary/70 shrink-0 mt-1"
                    />
                    <span className="flex flex-col gap-1">
                      {PHONES.map((p) => (
                        <a
                          key={p.href}
                          href={p.href}
                          className="link-luxe text-white/70 hover:text-white transition-colors duration-300"
                        >
                          {p.display}
                        </a>
                      ))}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail size={15} className="text-primary/70 shrink-0 mt-1" />
                    <a
                      href={`mailto:${EMAIL}`}
                      className="link-luxe text-white/70 hover:text-white transition-colors duration-300 break-all"
                    >
                      {EMAIL}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Map */}
            <div
              className="animate-fade-up relative border border-white/[0.06] overflow-hidden h-[350px] sm:h-[450px] lg:h-[700px]"
              style={{ animationDelay: "200ms" }}
            >
              <MapContainer
                key="contact-map"
                center={[28.6139, 77.209]}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  maxZoom={19}
                />
                {OFFICES.map((office) => (
                  <Marker key={office.label} position={office.coords}>
                    <Popup>
                      <strong>{office.label}</strong>
                      <br />
                      {office.address}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Form ─────────────────────────────────────────────── */}
      <section className="relative bg-ink">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20 items-start">
            <div className="max-w-md">
              <div className="animate-fade-up flex items-center gap-3 mb-6 sm:mb-8">
                <span className="h-px w-6 sm:w-8 bg-primary/60" />
                <span className="text-eyebrow text-white/50">
                  Send A Message
                </span>
              </div>

              <h2
                className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-5 sm:mb-6"
                style={{ animationDelay: "120ms" }}
              >
                We'd Love
                <br />
                To Hear
                <br />
                From You.
              </h2>

              <p
                className="animate-fade-up text-lead text-white/65"
                style={{ animationDelay: "220ms" }}
              >
                Questions about our vehicles, dealer enquiries, or service
                support — fill in the form and our team will get back to you
                within 24 hours.
              </p>
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              {status === "success" ? (
                <div className="p-8 sm:p-10 lg:p-16 border border-white/[0.08] text-center">
                  <p className="font-display uppercase text-xl sm:text-2xl text-white mb-4">
                    Message Sent.
                  </p>
                  <p className="text-white/60 text-sm max-w-md mx-auto">
                    Thanks — we've received your message and will get back to
                    you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 sm:space-y-8"
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                    <LuxeField label="Full Name">
                      <input
                        type="text"
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Your name"
                        className={inputClass}
                        required
                      />
                    </LuxeField>
                    <LuxeField label="Email">
                      <input
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@example.com"
                        className={inputClass}
                        required
                      />
                    </LuxeField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                    <LuxeField label="Contact Number">
                      <input
                        type="tel"
                        value={form.contact}
                        onChange={update("contact")}
                        placeholder="10-digit number"
                        className={inputClass}
                        required
                      />
                    </LuxeField>
                    <LuxeField label="Address">
                      <input
                        type="text"
                        value={form.address}
                        onChange={update("address")}
                        placeholder="Street, building, landmark"
                        className={inputClass}
                        required
                      />
                    </LuxeField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                    <LuxeField label="Pin Code">
                      <input
                        type="text"
                        value={form.pincode}
                        onChange={update("pincode")}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className={inputClass}
                        required
                      />
                    </LuxeField>
                    <LuxeField label="State / District">
                      <input
                        type="text"
                        value={[form.district, form.state]
                          .filter(Boolean)
                          .join(", ")}
                        readOnly
                        placeholder="Auto-filled from pincode"
                        className={`${inputClass} cursor-not-allowed`}
                      />
                    </LuxeField>
                  </div>

                  <LuxeField
                    label={`Captcha — Enter: ${captchaValue}`}
                    error={captchaError ? "Captcha does not match." : null}
                  >
                    <input
                      type="text"
                      value={form.captcha}
                      onChange={update("captcha")}
                      placeholder="Enter the 4-digit code"
                      className={inputClass}
                      required
                    />
                  </LuxeField>

                  {status === "error" && (
                    <p className="text-amber-300 text-sm">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group inline-flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.16em] font-semibold text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-none w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "submitting" ? "Sending..." : "Send Message"}
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default Contact;
