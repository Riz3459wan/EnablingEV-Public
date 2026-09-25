const BrandMark = ({ className = "h-9 w-auto" }) => (
  <div
    className={`flex items-center justify-center rounded-full bg-primary ${className}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  </div>
);

export default BrandMark;
