import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  UserPlus,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  Users,
  Shield,
} from "lucide-react";
import api from "../../api/client";
import Modal from "../../components/ui/Modal";
import Field, { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import useScrollReveal from "../../hooks/useScrollReveal";

const FIXED_PART_1 = "ME9EBCR";
const FIXED_PART_2 = "H268";
const mobilePattern = /^[6-9]\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultValues = {
  chassisMid1: "",
  chassisMid2: "",
  name: "",
  mobileNumber: "",
  emailId: "",
  address: "",
  pincode: "",
  state: "",
  dist: "",
};

const customerSchema = z
  .object({
    chassisMid1: z.string(),
    chassisMid2: z.string(),
    name: z.string().min(1, "This field is required."),
    mobileNumber: z
      .string()
      .min(1, "This field is required.")
      .regex(mobilePattern, "Invalid mobile number."),
    emailId: z
      .string()
      .min(1, "This field is required.")
      .regex(emailPattern, "Invalid email address."),
    address: z.string().min(1, "This field is required."),
    pincode: z.string().min(1, "This field is required."),
    state: z.string().min(1, "This field is required."),
    dist: z.string().min(1, "This field is required."),
  })
  .superRefine((data, ctx) => {
    if (data.chassisMid1.length < 3 || data.chassisMid2.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Chassis number segments must be 3 characters each.",
        path: ["chassisNumber"],
      });
    }
  });

const CustomerForm = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const headerRef = useScrollReveal({ delay: 100 });
  const cardRef = useScrollReveal({ delay: 200 });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const chassisPartChange = (field) => (e) => {
    field.onChange(
      e.target.value
        .replace(/[^0-9A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase(),
    );
    clearErrors("chassisNumber");
  };

  const handlePincodeChange = (field) => async (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    field.onChange(value);
    clearErrors("pincode");
    if (value.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`,
        );
        const [data] = await res.json();
        if (data.Status === "Success") {
          const { State, District } = data.PostOffice[0];
          setValue("state", State);
          setValue("dist", District);
        } else {
          setError("pincode", { message: "Invalid pin code." });
        }
      } catch {
        setError("pincode", { message: "Error fetching location details." });
      }
    }
  };

  const onSubmit = async (data) => {
    const chassisNumber =
      `${FIXED_PART_1}${data.chassisMid1}${FIXED_PART_2}${data.chassisMid2}`.toUpperCase();

    try {
      const validation = await api.post("/VehicleTable/chassis-validate", {
        chassisNumber,
      });
      if (!validation.data.exists) {
        setError("chassisNumber", {
          message: "Invalid or already registered chassis number.",
        });
        return;
      }

      const dealerRes = await api.get(
        `/VehicleTable/dealerCode?chassisNumber=${chassisNumber}`,
      );
      if (dealerRes.status !== 200) {
        alert("Dealer information not found for this chassis number.");
        return;
      }

      const { chassisMid1, chassisMid2, ...customerFields } = data;
      void chassisMid1;
      void chassisMid2;
      const payload = {
        ...customerFields,
        chassisNumber,
        dealerCode: dealerRes.data.dealerNameDealerCode,
      };

      const res = await api.post("/CustomerTable", payload);
      if (res.status === 201) {
        setSubmitted(true);
        handleClose();
      }
    } catch {
      alert("There was an error submitting the form.");
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] float-y" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] float-y"
        style={{ animationDelay: "2s" }}
      />

      <div
        ref={headerRef}
        className="reveal relative text-center mb-8 max-w-lg"
      >
        <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary mb-4">
          <Sparkles size={11} />
          Customer Registration
          <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Register a <span className="text-gradient">Customer</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Register a customer against an existing vehicle chassis number and
          link them to their dealer.
        </p>
      </div>

      <div ref={cardRef} className="reveal-scale relative">
        {submitted && (
          <div className="mb-5 flex items-center gap-2.5 text-emerald-700 text-sm bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl px-4 py-3 animate-scale-in">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Customer registered successfully!
            </span>
          </div>
        )}

        <div className="relative bg-white border border-border rounded-3xl p-8 sm:p-10 text-center max-w-md shadow-2xl shadow-primary/5 hover-lift">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-3xl" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30 animate-bounce-subtle">
            <UserPlus size={28} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="font-bold text-foreground text-lg mb-2">
            Add New Customer
          </h2>
          <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto">
            Fill in customer details against a valid chassis number
          </p>
          <PrimaryButton
            onClick={() => setOpen(true)}
            className="shadow-lg shadow-primary/30 shine relative group !px-8 !py-3"
          >
            <UserPlus size={16} />
            Open Customer Form
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </PrimaryButton>

          {/* Trust strip */}
          <div className="mt-6 pt-5 border-t border-border grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: "Secure" },
              { icon: Users, label: "Verified" },
              { icon: CheckCircle2, label: "Instant" },
            ].map(({ icon: I, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 group"
              >
                <I
                  size={14}
                  className="text-primary group-hover:scale-125 transition-transform"
                />
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        title="Customer Form"
        maxWidth="max-w-lg"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field label="Chassis Number" error={errors.chassisNumber?.message}>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-border font-mono">
              <span className="text-muted-foreground text-xs">
                {FIXED_PART_1}
              </span>
              <Controller
                name="chassisMid1"
                control={control}
                render={({ field }) => (
                  <input
                    maxLength={3}
                    value={field.value}
                    onChange={chassisPartChange(field)}
                    className="w-14 bg-white border-2 border-border rounded-lg text-center text-foreground outline-none focus:border-primary py-2 font-bold uppercase text-sm shadow-sm"
                  />
                )}
              />
              <span className="text-muted-foreground text-xs">
                {FIXED_PART_2}
              </span>
              <Controller
                name="chassisMid2"
                control={control}
                render={({ field }) => (
                  <input
                    maxLength={3}
                    value={field.value}
                    onChange={chassisPartChange(field)}
                    className="w-14 bg-white border-2 border-border rounded-lg text-center text-foreground outline-none focus:border-primary py-2 font-bold uppercase text-sm shadow-sm"
                  />
                )}
              />
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Full Name" error={errors.name?.message}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} error={!!errors.name} required />
                  )}
                />
              </Field>
            </div>
            <Field label="Mobile Number" error={errors.mobileNumber?.message}>
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/[^0-9]/g, "").slice(0, 10),
                      )
                    }
                    error={!!errors.mobileNumber}
                    required
                  />
                )}
              />
            </Field>
            <Field label="Email" error={errors.emailId?.message}>
              <Controller
                name="emailId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    error={!!errors.emailId}
                    required
                  />
                )}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address" error={errors.address?.message}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} error={!!errors.address} required />
                  )}
                />
              </Field>
            </div>
            <Field label="Pin Code" error={errors.pincode?.message}>
              <Controller
                name="pincode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={handlePincodeChange(field)}
                    error={!!errors.pincode}
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
                  <Input {...field} error={!!errors.state} required />
                )}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="District" error={errors.dist?.message}>
                <Controller
                  name="dist"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} error={!!errors.dist} required />
                  )}
                />
              </Field>
            </div>
          </div>

          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full justify-center !py-3 shadow-lg shadow-primary/30 shine relative"
          >
            {isSubmitting ? "Submitting..." : "Register Customer"}
          </PrimaryButton>
        </form>
      </Modal>
    </section>
  );
};

export default CustomerForm;
