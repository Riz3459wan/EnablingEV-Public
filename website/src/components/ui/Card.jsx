export const Card = ({ className = "", children }) => (
  <div
    className={`bg-white/[0.02] border border-white/[0.08] rounded-xl ${className}`}
  >
    {children}
  </div>
);

export default Card;
