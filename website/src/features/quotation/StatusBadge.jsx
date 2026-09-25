import { statusBadgeClass } from "./constants";

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${statusBadgeClass(status)}`}
  >
    {status || "Pending"}
  </span>
);

export default StatusBadge;
