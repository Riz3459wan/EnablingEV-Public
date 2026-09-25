import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import Card from "./Card";
import { SecondaryButton } from "./Button";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Dashboard crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-screen flex items-center justify-center px-4">
          <Card className="p-8 max-w-md text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This screen hit an unexpected error. Reloading usually fixes it.
            </p>
            <SecondaryButton onClick={() => window.location.reload()}>
              Reload
            </SecondaryButton>
          </Card>
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
