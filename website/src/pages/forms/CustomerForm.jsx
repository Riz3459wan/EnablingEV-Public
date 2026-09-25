import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  UserPlus,
  CheckCircle2,
  ArrowRight,
  Plus,
  Shield,
  Users,
  Clock,
} from "lucide-react";
import api from "../../api/client";
import Modal from "../../components/ui/Modal";
import Field, { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useDealerInfo } from "../../auth/useDealerInfo";

// ─── Toggle: set to false to use REAL API ────────────────────
const USE_MOCK = true;

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
  const { dealerInfo, dealerCode } = useDealerInfo();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      // ══════════════════════════════════════════════════════════
      // MOCK DATA
      // ══════════════════════════════════════════════════════════
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        setSubmitted(true);
        handleClose();
        return;
      }

      // ══════════════════════════════════════════════════════════
      // REAL API
      // ══════════════════════════════════════════════════════════
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
    <DashboardLayout
      dealerName={dealerInfo?.name || "Dealer"}
      dealerCode={dealerCode}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            Dealer
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            Register Customer
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            Register a customer against an existing vehicle chassis number.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm border bg-primary/[0.08] border-primary/30 text-primary flex items-center gap-2">
            <CheckCircle2 size={14} />
            Customer registered successfully.
          </div>
        )}

        {/* CTA Card */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 sm:p-10 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-5">
            <UserPlus size={22} className="text-primary" strokeWidth={1.75} />
          </div>
          <h2 className="font-display uppercase text-white text-lg tracking-[-0.01em] mb-2">
            Add New Customer
          </h2>
          <p className="text-xs text-white/45 mb-6 max-w-xs mx-auto leading-relaxed">
            Fill in customer details against a valid chassis number
          </p>
          <PrimaryButton
            onClick={() => setOpen(true)}
            className="!bg-primary !text-ink hover:!brightness-110 !rounded-full !px-7 !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold"
          >
            <Plus size={14} />
            Open Customer Form
          </PrimaryButton>

          {/* Info strip */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: "Secure" },
              { icon: Users, label: "Verified" },
              { icon: Clock, label: "Instant" },
            ].map(({ icon: I, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <I size={14} className="text-primary" />
                <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-white/40 font-rr">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          title="Customer Form"
          maxWidth="max-w-lg"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Chassis */}
            <Field label="Chassis Number" error={errors.chassisNumber?.message}>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.1] font-mono">
                <span className="text-white/40 text-xs">{FIXED_PART_1}</span>
                <Controller
                  name="chassisMid1"
                  control={control}
                  render={({ field }) => (
                    <input
                      maxLength={3}
                      value={field.value}
                      onChange={chassisPartChange(field)}
                      className="w-14 bg-ink border-2 border-white/[0.1] rounded-lg text-center text-white outline-none focus:border-primary/60 py-2 font-bold uppercase text-sm"
                    />
                  )}
                />
                <span className="text-white/40 text-xs">{FIXED_PART_2}</span>
                <Controller
                  name="chassisMid2"
                  control={control}
                  render={({ field }) => (
                    <input
                      maxLength={3}
                      value={field.value}
                      onChange={chassisPartChange(field)}
                      className="w-14 bg-ink border-2 border-white/[0.1] rounded-lg text-center text-white outline-none focus:border-primary/60 py-2 font-bold uppercase text-sm"
                    />
                  )}
                />
              </div>
            </Field>

            {/* Name */}
            <Field label="Full Name" error={errors.name?.message}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    error={!!errors.name}
                    placeholder="Customer name"
                    required
                  />
                )}
              />
            </Field>

            {/* Mobile + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
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
                      placeholder="10-digit number"
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
                      placeholder="customer@example.com"
                      error={!!errors.emailId}
                      required
                    />
                  )}
                />
              </Field>
            </div>

            {/* Address */}
            <Field label="Address" error={errors.address?.message}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Street, building, landmark"
                    error={!!errors.address}
                    required
                  />
                )}
              />
            </Field>

            {/* Pin + State */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Pin Code" error={errors.pincode?.message}>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={handlePincodeChange(field)}
                      placeholder="6-digit pincode"
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
                    <Input
                      {...field}
                      placeholder="State"
                      error={!!errors.state}
                      required
                    />
                  )}
                />
              </Field>
            </div>

            {/* District */}
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

            {/* Submit */}
            <PrimaryButton
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center !bg-primary !text-ink hover:!brightness-110 !rounded-full !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold"
            >
              {isSubmitting ? (
                <>
                  <ArrowRight size={14} className="animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  Register Customer
                </>
              )}
            </PrimaryButton>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default CustomerForm;
