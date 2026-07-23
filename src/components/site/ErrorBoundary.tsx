import { Component, type ErrorInfo, type ReactNode } from "react";
import { logError } from "@/lib/logger";

type Props = { children: ReactNode; name: string; fallback?: ReactNode };
type State = { error: Error | null; correlationId: string | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, correlationId: null };

  static getDerivedStateFromError(error: Error): State {
    const correlationId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    return { error, correlationId };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError(this.props.name, error, {
      correlationId: this.state.correlationId,
      componentStack: info.componentStack,
    });
  }

  reset = () => this.setState({ error: null, correlationId: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Something broke in {this.props.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Correlation ID: <code className="text-xs">{this.state.correlationId}</code>
        </p>
        <button
          onClick={this.reset}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    );
  }
}
