import { useCallback, useReducer } from "react";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import Card from "../../components/ui/Card";
import Field, { Input, Select } from "../../components/ui/Field";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { Banner, ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";
import { useInvoiceActions } from "./useInvoiceActions";
import {
  CHASSIS_FIXED_MID,
  brandFor,
  chassisPrefixFor,
  vehicleTypeLabel,
} from "./constants";
import {
  autoBodyType,
  bodyTypeOptions,
  buildChassis,
  buildPayload,
  formFromQuotation,
  formatINR,
  sanitizeChassisPart,
  totalOf,
  vehicleTypeForModel,
} from "./calc";

const LOAD_ERROR = "Couldn't load the vehicle options. Please try again.";

// How two catalogue entries count as "the same option". Prices are part of the
// identity for priced items so an old quotation's stored price never silently
// turns into today's price.
const same = {
  priced: (a, b) => a.name === b.name && Number(a.price) === Number(b.price),
  color: (a, b) => a.name === b.name,
  battery: (a, b) =>
    a.btype === b.btype &&
    Number(a.volt) === Number(b.volt) &&
    Number(a.ampere_hours) === Number(b.ampere_hours) &&
    Number(a.price) === Number(b.price),
  dealer: (a, b) => a.dealerCode === b.dealerCode,
};

const label = {
  priced: (o) => `${o.name} — ${formatINR(o.price)}`,
  color: (o) => o.name,
  battery: (o) =>
    `${o.btype} | ${o.volt}V | ${o.ampere_hours}Ah — ${formatINR(o.price)}`,
  dealer: (o) => `${o.name} (${o.dealerCode})`,
};

// <select> bound to objects. If the current value (e.g. from an old quotation)
// isn't in today's list it is shown as an extra option instead of vanishing.
const ChoiceSelect = ({
  name,
  value,
  options,
  onChange,
  isSame,
  getLabel,
  disabled,
  helper,
  placeholder,
}) => {
  const list = value && !options.some((o) => isSame(o, value)) ? [value, ...options] : options;
  const idx = value ? list.findIndex((o) => isSame(o, value)) : -1;
  return (
    <Field label={name}>
      <Select
        aria-label={name}
        value={idx >= 0 ? String(idx) : ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === "" ? null : list[Number(e.target.value)])}
      >
        <option value="">{placeholder}</option>
        {list.map((o, i) => (
          <option key={i} value={i}>
            {getLabel(o)}
          </option>
        ))}
      </Select>
      {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
    </Field>
  );
};

const SummaryRow = ({ title, right }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-line last:border-b-0 text-sm">
    <div className="min-w-0 text-white font-medium">{title}</div>
    <div className="shrink-0 text-right text-white font-semibold">{right}</div>
  </div>
);

const blankForm = (dealer) => ({
  dealer,
  vehicleType: "",
  model: null,
  bodyType: null,
  color: null,
  battery: null,
  billNumber: "",
  mid1: "",
  mid2: "",
});

const initialBuilderState = (quotation, dealerObj) => ({
  form: quotation ? formFromQuotation(quotation) : blankForm(dealerObj),
  editingId: quotation?.id ?? null,
  ownChassis: quotation?.chassisNumber ?? null,
  snapshot: null,
  savedMeta: null,
  saving: false,
  error: "",
});

const builderReducer = (state, action) => {
  switch (action.type) {
    case "PATCH_FORM":
      return { ...state, form: { ...state.form, ...action.payload } };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SAVE_START":
      return { ...state, saving: true, error: "" };
    case "SAVE_SUCCESS":
      return {
        ...state,
        saving: false,
        error: "",
        editingId: action.payload.editingId,
        ownChassis: action.payload.ownChassis,
        savedMeta: action.payload.savedMeta,
        snapshot: action.payload.snapshot,
      };
    case "SAVE_ERROR":
      return { ...state, saving: false, error: action.payload };
    case "CLEAR":
      return initialBuilderState(null, action.payload.dealerObj);
    default:
      return state;
  }
};

const BuilderForm = ({ catalog, isDealer, dealerObj, quotation, onBack }) => {
  const [state, dispatch] = useReducer(
    builderReducer,
    undefined,
    () => initialBuilderState(quotation, dealerObj),
  );
  const { form, editingId, ownChassis, snapshot, savedMeta, saving, error } = state;
  const { busy, error: docError, run } = useInvoiceActions();

  const patch = (p) => dispatch({ type: "PATCH_FORM", payload: p });

  const chassisNumber = isDealer
    ? null
    : buildChassis(form.vehicleType, form.mid1, form.mid2);
  const partialChassis = !isDealer && !chassisNumber && (form.mid1 || form.mid2);
  const duplicateChassis =
    !!chassisNumber && chassisNumber !== ownChassis && catalog.takenChassis.has(chassisNumber);

  const payload = buildPayload({ ...form, chassisNumber });
  const isSaved = snapshot !== null && JSON.stringify(payload) === snapshot;
  const total = totalOf(form);
  const brand = brandFor(form.vehicleType);

  const handleModelChange = (model) => {
    const vehicleType = model ? vehicleTypeForModel(model.name) : "";
    patch({
      model,
      vehicleType,
      bodyType: model ? autoBodyType(model.name, catalog.bodyTypes) : null,
      // The chassis prefix depends on vehicle type, so a type change clears it.
      ...(vehicleType !== form.vehicleType ? { mid1: "", mid2: "" } : {}),
    });
  };

  const handleSave = async () => {
    if (!form.dealer || !form.model || !form.vehicleType) {
      dispatch({
        type: "SET_ERROR",
        payload: "Dealer, vehicle type and model are required to save quotation.",
      });
      return;
    }
    if (!isDealer && !chassisNumber && !editingId) {
      dispatch({
        type: "SET_ERROR",
        payload: partialChassis
          ? "Please enter both chassis parts with 3 characters."
          : "Please assign a chassis number before saving quotation.",
      });
      return;
    }
    if (partialChassis) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please enter both chassis parts with 3 characters.",
      });
      return;
    }
    if (duplicateChassis) {
      dispatch({
        type: "SET_ERROR",
        payload: "This chassis number is already used. Duplicate not allowed.",
      });
      return;
    }
    if (!form.bodyType) {
      dispatch({ type: "SET_ERROR", payload: "Please select a body type for the chosen model." });
      return;
    }

    dispatch({ type: "SAVE_START" });
    try {
      const res = editingId
        ? await api.put(`/QuotationTable/${editingId}`, payload)
        : await api.post("/QuotationTable", payload);
      const saved = res.data && typeof res.data === "object" ? res.data : {};
      dispatch({
        type: "SAVE_SUCCESS",
        payload: {
          editingId: saved.id ?? editingId,
          ownChassis: payload.chassisNumber,
          savedMeta: { id: saved.id ?? editingId, createdAt: saved.createdAt },
          snapshot: JSON.stringify(payload),
        },
      });
    } catch (err) {
      console.error("Error saving quotation:", err);
      dispatch({
        type: "SAVE_ERROR",
        payload: "Failed to save quotation. Chassis may already be allotted.",
      });
    }
  };

  const handleClear = () => {
    dispatch({ type: "CLEAR", payload: { dealerObj } });
  };

  const docQuotation = { ...payload, ...savedMeta };
  const saveLabel = editingId ? "Update" : isDealer ? "Submit" : "Save Quotation";
  const bodyOptions = form.model
    ? bodyTypeOptions(form.model.name, catalog.bodyTypes)
    : [];
  const hasSelections =
    form.dealer && (form.model || form.bodyType || form.color || form.battery || chassisNumber);

  return (
    <>
      {isSaved && <Banner type="success">Quotation saved successfully.</Banner>}
      {docError && <Banner type="error">{docError}</Banner>}

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">
            {quotation ? "Edit Quotation" : "Build Your Vehicle"}
          </h2>

          {isDealer ? (
            <Field label="Dealer Info">
              <Input
                aria-label="Dealer Info"
                disabled
                value={form.dealer ? `${form.dealer.name} (${form.dealer.dealerCode})` : ""}
                readOnly
              />
            </Field>
          ) : (
            <ChoiceSelect
              name="Select Dealer Info"
              value={form.dealer?.dealerCode ? form.dealer : null}
              options={catalog.dealers}
              isSame={same.dealer}
              getLabel={label.dealer}
              placeholder="Select dealer..."
              onChange={(dealer) => patch({ dealer })}
            />
          )}

          <ChoiceSelect
            name="Select Vehicle Model"
            value={form.model}
            options={catalog.models}
            isSame={same.priced}
            getLabel={label.priced}
            placeholder="Select model..."
            onChange={handleModelChange}
          />

          <Field label="Vehicle Type">
            <Input
              aria-label="Vehicle Type"
              disabled
              readOnly
              value={form.vehicleType ? vehicleTypeLabel(form.vehicleType) : ""}
              placeholder="Set automatically from the model"
            />
          </Field>

          {!isDealer && form.vehicleType && (
            <Field
              label="Chassis Number"
              error={
                duplicateChassis
                  ? "This chassis number is already used. Duplicate not allowed."
                  : partialChassis
                    ? "Enter both chassis parts (3 characters each)."
                    : ""
              }
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-mono text-muted-foreground">
                  {chassisPrefixFor(form.vehicleType)}
                </span>
                <Input
                  aria-label="Chassis part 1"
                  value={form.mid1}
                  maxLength={3}
                  placeholder="XXX"
                  onChange={(e) => patch({ mid1: sanitizeChassisPart(e.target.value) })}
                  className="!w-20 text-center font-mono"
                />
                <span className="font-mono text-muted-foreground">{CHASSIS_FIXED_MID}</span>
                <Input
                  aria-label="Chassis part 2"
                  value={form.mid2}
                  maxLength={3}
                  placeholder="XXX"
                  onChange={(e) => patch({ mid2: sanitizeChassisPart(e.target.value) })}
                  className="!w-20 text-center font-mono"
                />
              </div>
            </Field>
          )}

          <ChoiceSelect
            name="Select Body Type"
            value={form.bodyType}
            options={bodyOptions}
            isSame={same.priced}
            getLabel={label.priced}
            placeholder="Select body type..."
            disabled={!form.model}
            helper={
              !form.model
                ? "Select a model first to see available body types"
                : autoBodyType(form.model.name, catalog.bodyTypes)
                  ? "Body type automatically selected as MS for this model."
                  : ""
            }
            onChange={(bodyType) => patch({ bodyType })}
          />

          <ChoiceSelect
            name="Select Vehicle Color"
            value={form.color}
            options={catalog.colors}
            isSame={same.color}
            getLabel={label.color}
            placeholder="Select color..."
            onChange={(color) => patch({ color })}
          />

          <ChoiceSelect
            name="Select Battery"
            value={form.battery}
            options={catalog.batteries}
            isSame={same.battery}
            getLabel={label.battery}
            placeholder="Select battery..."
            onChange={(battery) => patch({ battery })}
          />

          {!isDealer && (
            <Field label="Bill Number">
              <Input
                aria-label="Bill Number"
                value={form.billNumber}
                onChange={(e) => patch({ billNumber: e.target.value })}
                placeholder="Adding a bill number marks it Dispatched"
              />
            </Field>
          )}
        </Card>

        <Card className="p-6 lg:sticky lg:top-28">
          {!hasSelections ? (
            <p className="text-muted-foreground text-center py-16">
              Please select a dealer or vehicle options
            </p>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Quotation Summary</h2>
              <div>
                {form.dealer && (
                  <div className="py-3 border-b border-line text-sm">
                    <p className="text-white font-medium">Dealer Information</p>
                    <div className="mt-1 text-muted-foreground leading-relaxed">
                      <p className="text-white font-semibold">{form.dealer.name}</p>
                      {form.dealer.gstin && <p>GSTIN: {form.dealer.gstin}</p>}
                      <p>Code: {form.dealer.dealerCode}</p>
                      {form.dealer.address && <p>{form.dealer.address}</p>}
                      {(form.dealer.dist || form.dealer.state || form.dealer.pinCode) && (
                        <p>
                          {[form.dealer.dist, form.dealer.state].filter(Boolean).join(", ")}
                          {form.dealer.pinCode ? ` — ${form.dealer.pinCode}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {form.model && (
                  <SummaryRow
                    title={`Model - ${brand} ${form.model.name}`}
                    right={formatINR(form.model.price)}
                  />
                )}
                {chassisNumber && (
                  <SummaryRow
                    title={<span className="font-mono">Chassis Number - {chassisNumber}</span>}
                    right={`Type — ${vehicleTypeLabel(form.vehicleType)}`}
                  />
                )}
                {form.bodyType && (
                  <SummaryRow
                    title={`Body Type - ${form.bodyType.name}`}
                    right={formatINR(form.bodyType.price)}
                  />
                )}
                {form.color && (
                  <SummaryRow title={`Color - ${form.color.name}`} right="Included" />
                )}
                {form.battery && (
                  <SummaryRow
                    title={`Battery - ${form.battery.btype}`}
                    right={formatINR(form.battery.price)}
                  />
                )}
              </div>
              <p className="text-3xl font-extrabold text-white text-right mt-6">
                Total: {formatINR(total)}
              </p>
            </>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        {isSaved ? (
          <>
            <PrimaryButton onClick={() => run("print", docQuotation)} disabled={!!busy}>
              Print
            </PrimaryButton>
            <SecondaryButton onClick={() => run("pdf", docQuotation)} disabled={!!busy}>
              {busy ? "Preparing..." : "Download PDF"}
            </SecondaryButton>
            <SecondaryButton onClick={onBack}>Back to quotations</SecondaryButton>
          </>
        ) : (
          <PrimaryButton onClick={handleSave} disabled={saving || duplicateChassis}>
            {saving ? "Saving..." : saveLabel}
          </PrimaryButton>
        )}
        <SecondaryButton onClick={handleClear} disabled={saving}>
          Clear Selection
        </SecondaryButton>
      </div>
      {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
    </>
  );
};

const QuotationBuilder = ({ role, dealerObj, quotation, onBack }) => {
  const isDealer = role === "dealer";

  const loader = useCallback(async () => {
    const [dealers, models, bodyTypes, colors, batteries, vehicles] = await Promise.all([
      isDealer ? Promise.resolve({ data: [] }) : api.get("/api/dealer-info"),
      api.get("/api/models"),
      api.get("/api/body-types"),
      api.get("/api/colors"),
      api.get("/api/batteries"),
      // Only used for the duplicate-chassis warning; the server enforces it too.
      api.get("/VehicleTable").catch(() => ({ data: [] })),
    ]);
    const list = (r) => (Array.isArray(r.data) ? r.data : []);
    return {
      dealers: list(dealers),
      models: list(models),
      bodyTypes: list(bodyTypes),
      colors: list(colors),
      batteries: list(batteries),
      takenChassis: new Set(
        list(vehicles).map((v) => v?.chassisNumber?.toUpperCase()).filter(Boolean),
      ),
    };
  }, [isDealer]);

  const { data: catalog, error, loading, reload } = useAsyncData(
    ["quotationCatalog", isDealer ? "dealer" : "subadmin"],
    loader,
    LOAD_ERROR,
  );

  if (loading) return <LoadingCard />;
  if (error) return <ErrorCard message={error} onRetry={reload} />;
  if (isDealer && !quotation && !dealerObj?.dealerCode) {
    return (
      <ErrorCard message="Dealer profile not found for this session. Please log out and sign in again." />
    );
  }

  return (
    <BuilderForm
      catalog={catalog}
      isDealer={isDealer}
      dealerObj={dealerObj}
      quotation={quotation}
      onBack={onBack}
    />
  );
};

export default QuotationBuilder;
