import { X } from "lucide-react";

const Lightbox = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#051011]/90 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white bg-card border border-line rounded-full p-2 hover:bg-surface transition-colors"
        aria-label="Close"
      >
        <X size={22} />
      </button>
      <img
        src={src}
        alt="Enlarged view"
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[90vh] rounded-2xl border border-line shadow-2xl object-contain"
      />
    </div>
  );
};

export default Lightbox;
