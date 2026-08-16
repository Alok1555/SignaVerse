// SIGNAVERSE — Error Boundary Component
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[SignaVerse ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div
            className="rounded-3xl p-8 text-center max-w-sm w-full"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-display font-900 text-xl text-text mb-2">Something went wrong</h2>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              className="btn-primary px-6 py-3"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/app/home';
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
