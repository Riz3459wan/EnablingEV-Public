import { useState, useCallback } from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import Card from "../../components/ui/Card";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";

const PendingDealerRequests = () => {
  const [actioningId, setActioningId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [banner, setBanner] = useState(null);

  const fetchPending = useCallback(
    async () => (await api.get("/dealer/pending")).data ?? [],
    [],
  );
  const {
    data,
    error,
    loading,
    reload: loadRequests,
    setData: setRequests,
  } = useAsyncData(
    ["pendingDealerRequests"],
    fetchPending,
    "Couldn't load pending requests. Please refresh and try again.",
  );
  const requests = loading ? null : (data ?? []);

  const handleApprove = async (id) => {
    setActioningId(id);
    setBanner(null);
    try {
      await api.post(`/dealer/${id}/approve`);
      setRequests((list) => list.filter((r) => r.id !== id));
      setBanner({
        type: "success",
        text: "Approved — activation code emailed to the dealer.",
      });
    } catch {
      setBanner({ type: "error", text: "Approval failed. Please try again." });
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    setBanner(null);
    try {
      await api.post(`/dealer/${id}/reject`, { reason: rejectReason.trim() });
      setRequests((list) => list.filter((r) => r.id !== id));
      setBanner({ type: "success", text: "Request rejected." });
    } catch {
      setBanner({ type: "error", text: "Reject failed. Please try again." });
    } finally {
      setActioningId(null);
      setRejectingId(null);
      setRejectReason("");
    }
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Pending Dealer Requests
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review new dealer registration requests. Approving sends the dealer an
          activation code by email; rejecting closes the request.
        </p>
      </div>

      {banner && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm border flex items-center gap-2 ${
            banner.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {banner.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}
          {banner.text}
        </div>
      )}

      {/* Loading */}
      {requests === null && !error && (
        <Card className="p-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="p-8 text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <SecondaryButton onClick={loadRequests}>Retry</SecondaryButton>
        </Card>
      )}

      {/* Empty */}
      {requests !== null && !error && requests.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">
            No pending dealer requests right now.
          </p>
          <p className="text-slate-400 text-xs mt-1">
            New requests will appear here.
          </p>
        </Card>
      )}

      {/* List */}
      {requests !== null && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h2 className="text-lg font-bold text-slate-800">
                      {req.name}
                    </h2>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                      Pending
                    </span>
                  </div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wider">
                        Email
                      </dt>
                      <dd className="text-slate-800 font-medium">
                        {req.emailId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wider">
                        Mobile
                      </dt>
                      <dd className="text-slate-800 font-medium">
                        {req.mobileNo}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wider">
                        GSTIN
                      </dt>
                      <dd className="text-slate-800 font-medium font-mono text-xs">
                        {req.gstin}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wider">
                        Location
                      </dt>
                      <dd className="text-slate-800 font-medium">
                        {req.dist}, {req.state} — {req.pinCode}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wider">
                        RTO Office
                      </dt>
                      <dd className="text-slate-800 font-medium">
                        {req.rtoOffice}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-slate-400 uppercase tracking-wider">
                        Address
                      </dt>
                      <dd className="text-slate-800 font-medium">
                        {req.address}
                      </dd>
                    </div>
                    {req.submittedAt && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-slate-400 uppercase tracking-wider">
                          Submitted
                        </dt>
                        <dd className="text-slate-800 font-medium">
                          {new Date(req.submittedAt).toLocaleString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <PrimaryButton
                    onClick={() => handleApprove(req.id)}
                    disabled={actioningId === req.id}
                    className="text-sm px-5 py-2"
                  >
                    {actioningId === req.id ? "Approving..." : "Approve"}
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={() =>
                      setRejectingId((cur) => (cur === req.id ? null : req.id))
                    }
                    disabled={actioningId === req.id}
                    className="text-sm px-5 py-2"
                  >
                    Reject
                  </SecondaryButton>
                </div>
              </div>

              {rejectingId === req.id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="block text-xs font-medium mb-1.5 text-slate-700">
                    Reason (optional, included in the rejection email)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. Incomplete GSTIN details"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <SecondaryButton
                      onClick={() => handleReject(req.id)}
                      disabled={actioningId === req.id}
                      className="text-sm px-5 py-2 whitespace-nowrap !bg-red-500 !text-white !border-red-500 hover:!bg-red-600"
                    >
                      {actioningId === req.id
                        ? "Rejecting..."
                        : "Confirm Reject"}
                    </SecondaryButton>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default PendingDealerRequests;
