import { statusBadgeClass } from "./constants";

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap font-rr ${statusBadgeClass(status)}`}
  >
    {status || "Pending"}
  </span>
);

export default StatusBadge;
