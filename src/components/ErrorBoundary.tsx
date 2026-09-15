import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in PARZIO App:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fbf9f6] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#fed488]/30 flex items-center justify-center text-[#775a19] mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#141414]">
            PARZIO Demi-Fine Atelier
          </h2>
          <p className="text-sm text-[#747878] mt-2 max-w-md">
            Something unexpected occurred while rendering. We have logged this for our engineers.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#8c7138] transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Storefront
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
