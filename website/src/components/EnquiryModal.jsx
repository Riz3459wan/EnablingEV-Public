import { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";

const vehicleOptions = [
  "Electric Passenger",
  "Electric Cargo",
  "Not sure yet",
];

const EnquiryModal = ({
  isOpen,
  onClose,
  type = "product",
  presetVehicle = "",
}) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    vehicle: presetVehicle || vehicleOptions[0],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[0-9]{10}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    if (!form.city.trim()) e.city = "City is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => onClose(), 2200);
    }, 900);
  };

  const update = (field) => (ev) =>
    setForm((f) => ({ ...f, [field]: ev.target.value }));

  const title = type === "dealer" ? "Dealer enquiry" : "Product enquiry";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#051011]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-card border border-line rounded-3xl w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto text-white shadow-2xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {status === "success" ? (
          <div className="py-10 flex flex-col items-center text-center">
            <CheckCircle2 size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">Enquiry sent!</h3>
            <p className="text-muted-foreground text-sm">
              Thanks {form.name.split(" ")[0]}, our team will reach out to you
              at {form.phone} within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <p className="text-accent text-xs font-semibold tracking-wider mb-1 uppercase">
              {type === "dealer" ? "Dealer Network" : "Get In Touch"}
            </p>
            <h3 className="text-2xl font-bold mb-1 text-white">{title}</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Fill in your details and our team will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-200">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-placeholder outline-none transition-colors focus:border-accent ${
                    errors.name ? "border-red-500" : "border-line"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="10-digit number"
                    className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-placeholder outline-none transition-colors focus:border-accent ${
                      errors.phone ? "border-red-500" : "border-line"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-placeholder outline-none transition-colors focus:border-accent ${
                      errors.email ? "border-red-500" : "border-line"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={update("city")}
                    placeholder="Your city"
                    className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-placeholder outline-none transition-colors focus:border-accent ${
                      errors.city ? "border-red-500" : "border-line"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">
                    Vehicle interest
                  </label>
                  <select
                    value={form.vehicle}
                    onChange={update("vehicle")}
                    className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-accent transition-colors"
                  >
                    {vehicleOptions.map((v) => (
                      <option
                        key={v}
                        value={v}
                        className="bg-card text-white"
                      >
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-200">
                  Message (optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={update("message")}
                  rows={3}
                  placeholder="Tell us a bit more..."
                  className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-placeholder outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-primary hover:bg-primary-hover text-background px-6 py-3 rounded-full font-semibold transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Submit enquiry"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
