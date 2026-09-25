import { Construction } from "lucide-react";

const ComingSoon = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-ev-glow px-4 py-24 text-center">
    <div>
      <div className="bg-surface border border-line w-14 h-14 rounded-xl flex items-center justify-center mb-5 mx-auto">
        <Construction size={26} className="text-accent" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        This screen is queued for migration to the new design system in the next batch.
      </p>
    </div>
  </div>
);

export default ComingSoon;
