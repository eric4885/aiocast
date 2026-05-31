"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode };

type State = { hasError: boolean };

export class AnalysisErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AnalysisErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">Something went wrong</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            We couldn&apos;t analyze this topic. Try a simpler phrase like &quot;AI tools&quot; or &quot;podcast
            marketing&quot;.
          </p>
          <Button className="mt-8 min-h-11 min-w-[140px]" type="button" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
