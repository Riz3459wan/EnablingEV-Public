import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Store,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Building2,
  MapPin,
} from "lucide-react";
import api from "../../api/client";
import Field, { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const gstinPattern = /^[0-9A-Z]{15}$/;
const mobilePattern = /^[6-9]\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultValues = {
  name: "",
  mobileNo: "",
  emailId: "",
  gstin: "",
  address: "",
  pinCode: "",
  state: "",
  dist: "",
  rtoOffice: "",
};

const dealerSchema = z.object({
  name: z.string().trim().min(1, "Full name / business name is required."),
  mobileNo: z
    .string()
    .min(1, "Mobile number is required.")
    .regex(mobilePattern, "Enter a valid 10-digit mobile number."),
  emailId: z
    .string()
    .min(1, "Email address is required.")
    .regex(emailPattern, "Enter a valid email address."),
  gstin: z
    .string()
    .min(1, "GSTIN is required.")
    .regex(gstinPattern, "GSTIN must be 15 alphanumeric characters."),
  address: z.string().trim().min(1, "Street address is required."),
  pinCode: z.string().length(6, "Valid 6-digit PIN code required."),
  state: z.string().trim().min(1, "State is required."),
  dist: z.string().trim().min(1, "District is required."),
  rtoOffice: z.string().trim().min(1, "RTO office is required."),
});

const transforms = {
  name: (v) => v.toUpperCase().replace(/[^A-Z\s]/g, ""),
  gstin: (v) =>
    v
      .toUpperCase()
      .slice(0, 15)
      .replace(/[^0-9A-Z]/g, ""),
  mobileNo: (v) => v.replace(/[^0-9]/g, "").slice(0, 10),
  pinCode: (v) => v.replace(/[^0-9]/g, "").slice(0, 6),
};

const DealerForm = () => {
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dealerSchema),
    defaultValues,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handlePinCodeFilled = (value) => {
    if (value.length !== 6) return;
    setLoadingPincode(true);
    fetch(`https://api.postalpincode.in/pincode/${value}`)
      .then((r) => r.json())
      .then(([data]) => {
        if (data.Status === "Success" && data.PostOffice?.length) {
          const { State, District } = data.PostOffice[0];
          setValue("state", State, { shouldValidate: true });
          setValue("dist", District, { shouldValidate: true });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPincode(false));
  };

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      const res = await api.post("/dealer/", data);
      if (res.status === 201) {
        setSubmitted({ name: data.name, emailId: data.emailId });
      }
    } catch {
      setSubmitError(
        "There was an error submitting the form. Please try again later.",
      );
    }
  };

  // ─── SUCCESS VIEW ───
  if (submitted) {
    return (
      <section className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.04] blur-[160px]" />

        <div className="relative max-w-lg mx-auto">
          <Card className="p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={24} className="text-primary" />
            </div>

            <h1 className="font-display uppercase text-white text-[clamp(1.5rem,3vw,2rem)] leading-[1.05] tracking-[-0.01em] mb-4">
              Request Submitted
            </h1>

            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Thanks{submitted.name ? `, ${submitted.name}` : ""}. Your dealer
              registration is now pending admin review. Once approved, an
              activation code will be sent to{" "}
              <span className="text-primary font-semibold">
                {submitted.emailId}
              </span>
              .
            </p>

            <div className="space-y-3 pt-6 border-t border-white/[0.08]">
              <Link
                to="/dealerActivate"
                className="group flex items-center justify-center gap-2 bg-primary text-ink hover:brightness-110 transition-all duration-300 px-6 py-3.5 text-[11px] uppercase tracking-[0.16em] font-bold rounded-full w-full"
              >
                I Have My Activation Code
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/dealerStatus"
                className="group flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/60 hover:text-white transition-colors duration-300 py-3"
              >
                <span className="link-luxe">Check Request Status</span>
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  // ─── FORM VIEW ───
  return (
    <section className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.03] blur-[160px]" />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary font-rr">
              Dealer Onboarding
            </span>
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
          </div>

          <h1 className="font-display uppercase text-white text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.02] tracking-[-0.01em] mb-4">
            Become a Dealer
          </h1>

          <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Submit your business details to request authorized dealer status.
            Our team will review and email you an activation code once approved.
          </p>
        </div>

        {/* Form card */}
        <Card className="p-6 sm:p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-10"
            noValidate
          >
            {/* Business & Contact */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Building2 size={14} className="text-primary" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary font-rr">
                  Business &amp; Contact
                </span>
              </div>

              <Field
                label="Legal Entity / Full Name"
                error={errors.name?.message}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(transforms.name(e.target.value))
                      }
                      placeholder="ENTER REGISTERED NAME"
                      error={!!errors.name}
                      required
                    />
                  )}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Mobile Number" error={errors.mobileNo?.message}>
                  <Controller
                    name="mobileNo"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(transforms.mobileNo(e.target.value))
                        }
                        type="tel"
                        placeholder="10-digit number"
                        error={!!errors.mobileNo}
                        required
                      />
                    )}
                  />
                </Field>

                <Field label="Email Address" error={errors.emailId?.message}>
                  <Controller
                    name="emailId"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="dealer@example.com"
                        error={!!errors.emailId}
                        required
                      />
                    )}
                  />
                </Field>
              </div>

              <Field label="GSTIN" error={errors.gstin?.message}>
                <Controller
                  name="gstin"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(transforms.gstin(e.target.value))
                      }
                      placeholder="15-character GSTIN"
                      error={!!errors.gstin}
                      required
                    />
                  )}
                />
              </Field>
            </div>

            {/* Location & RTO */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary font-rr">
                  Location &amp; RTO
                </span>
              </div>

              <Field
                label="Premises / Street Address"
                error={errors.address?.message}
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Building, street, landmark"
                      error={!!errors.address}
                      required
                    />
                  )}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  label={loadingPincode ? "PIN Code (Fetching…)" : "PIN Code"}
                  error={errors.pinCode?.message}
                >
                  <Controller
                    name="pinCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          const value = transforms.pinCode(e.target.value);
                          field.onChange(value);
                          handlePinCodeFilled(value);
                        }}
                        placeholder="6-digit PIN"
                        error={!!errors.pinCode}
                        required
                      />
                    )}
                  />
                </Field>

                <Field label="District" error={errors.dist?.message}>
                  <Controller
                    name="dist"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="District"
                        error={!!errors.dist}
                        required
                      />
                    )}
                  />
                </Field>

                <Field label="State" error={errors.state?.message}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="State"
                        error={!!errors.state}
                        required
                      />
                    )}
                  />
                </Field>

                <Field label="RTO Office" error={errors.rtoOffice?.message}>
                  <Controller
                    name="rtoOffice"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. DL-01 or Regional RTO"
                        error={!!errors.rtoOffice}
                        required
                      />
                    )}
                  />
                </Field>
              </div>
            </div>

            {submitError && (
              <p className="text-amber-300 text-sm bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-3 leading-relaxed">
                {submitError}
              </p>
            )}

            <div className="pt-4 space-y-4 border-t border-white/[0.08]">
              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center !bg-primary !text-ink hover:!brightness-110 !px-8 !py-4 !text-[12px] !uppercase !tracking-[0.18em] !font-bold !rounded-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Registration
                    <ArrowRight size={14} />
                  </>
                )}
              </PrimaryButton>

              <div className="text-center">
                <Link
                  to="/dealerLogin"
                  className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                >
                  Already registered?{" "}
                  <span className="link-luxe text-primary font-semibold">
                    Sign in here
                  </span>
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default DealerForm;
