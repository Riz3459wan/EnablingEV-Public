export const Card = ({ className = "", children }) => (
  <div
    className={`bg-card border border-border rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

export default Card;
