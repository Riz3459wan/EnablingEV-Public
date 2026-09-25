import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  ArrowRight,
  Store,
  MapPin,
  Building2,
} from "lucide-react";
import api from "../../api/client";
import Field, { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import useScrollReveal from "../../hooks/useScrollReveal";

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

const DealerForm = () => {
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useScrollReveal({ delay: 100 });

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
    try {
      const res = await api.post("/dealer/", data);
      if (res.status === 201)
        setSubmitted({ name: data.name, emailId: data.emailId });
    } catch {
      alert("There was an error submitting the form. Please try again later.");
    }
  };

  if (submitted) {
    return (
      <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] float-y" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] float-y"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative w-full max-w-lg">
          <div className="bg-white border border-border rounded-3xl p-8 sm:p-10 text-center shadow-2xl animate-scale-in">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce-subtle">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Request Submitted!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              Thanks{submitted.name ? `, ${submitted.name}` : ""}. Your dealer
              registration request is now pending admin review. Once approved,
              an activation code will be sent to{" "}
              <span className="text-primary font-bold">
                {submitted.emailId}
              </span>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <PrimaryButton
                onClick={() => navigate("/")}
                className="shadow-lg shadow-primary/30 shine relative"
              >
                Back to Home
              </PrimaryButton>
              <Link
                to="/dealerActivate"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg font-semibold text-sm border border-border text-foreground hover:border-primary hover:bg-primary/5 transition-all"
              >
                I Have My Code <ArrowRight size={15} />
              </Link>
            </div>
            <Link
              to="/dealerStatus"
              className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors mt-5 underline-sweep inline-block"
            >
              Check my request status later →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] float-y" />
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] float-y"
        style={{ animationDelay: "2s" }}
      />

      <div ref={cardRef} className="reveal relative w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-xs font-semibold text-primary mb-4">
            <Store size={12} />
            Dealer Onboarding
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Become a <span className="text-gradient">Dealer</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Submit your business details to request authorized dealer status.
            Our team will review and email you an activation code once approved.
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 sm:p-10 shadow-2xl shadow-primary/5 glow-border">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-md">
                  <Building2 size={14} className="text-white" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Business & Contact Details
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
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
                </div>
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
                <div className="sm:col-span-2">
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
                          placeholder="15-digit GSTIN"
                          error={!!errors.gstin}
                          required
                        />
                      )}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <MapPin size={14} className="text-white" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Location & Office Jurisdiction
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
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
                          placeholder="Building, Street, Landmark"
                          error={!!errors.address}
                          required
                        />
                      )}
                    />
                  </Field>
                </div>
                <Field
                  label={loadingPincode ? "PIN Code (Fetching...)" : "PIN Code"}
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

            <div className="pt-2 space-y-3">
              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center py-3 text-sm font-bold shadow-lg shadow-primary/30 shine relative"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration Request"}
                <ArrowRight size={16} />
              </PrimaryButton>
              <div className="text-center">
                <Link
                  to="/dealerLogin"
                  className="inline-block text-sm text-muted-foreground hover:text-primary transition-colors underline-sweep"
                >
                  Already registered?{" "}
                  <span className="text-primary font-semibold">
                    Sign in here
                  </span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DealerForm;
