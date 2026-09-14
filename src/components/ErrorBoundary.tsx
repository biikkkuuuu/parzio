import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, MessageSquare, ChevronDown, ShieldCheck, Home } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  incidentId: string;
  showTechDetails: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      incidentId: `ERR-${Math.floor(10000 + Math.random() * 90000)}`,
      showTechDetails: false
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('🚨 [PARZIO ENTERPRISE ERROR LOG]', {
      incident: this.state.incidentId,
      time: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public handleClearCacheAndReset = () => {
    try {
      sessionStorage.clear();
      // Keep cart intact in localStorage if exists, or refresh cleanly
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      const waMessage = encodeURIComponent(
        `Hi Parzio Atelier Team, my storefront page encountered an incident (#${this.state.incidentId}). Please assist me with my jewellery order.`
      );

      return (
        <div className="min-h-screen bg-[#fbf9f6] text-[#141414] flex flex-col justify-between selection:bg-[#fed488]/40">
          
          {/* Header */}
          <header className="py-4 px-6 border-b border-[#eae5dc] bg-white/90 backdrop-blur-md flex items-center justify-between">
            <Logo className="h-7 w-auto" />
            <span className="text-[11px] font-mono text-[#8c7138] bg-[#f2ece1] px-2.5 py-1 rounded-full border border-[#dfd7ca]">
              Incident Reference: #{this.state.incidentId}
            </span>
          </header>

          {/* Main Error Centerpiece */}
          <main className="max-w-xl mx-auto px-4 py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-5 shadow-xs">
              <AlertTriangle className="w-8 h-8 stroke-[1.8]" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c7138] mb-1">
              Atelier Service Protection
            </span>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight">
              Our Artisans Are Tuning This View
            </h1>

            <p className="text-xs sm:text-sm text-[#747878] mt-2.5 max-w-md leading-relaxed">
              An unexpected rendering exception occurred. Your saved bag and cart items remain 100% secure.
            </p>

            {/* Recovery Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button
                onClick={this.handleReload}
                className="px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Storefront</span>
              </button>

              <button
                onClick={this.handleClearCacheAndReset}
                className="px-6 py-2.5 rounded-full bg-white border border-[#141414] text-[#141414] hover:bg-[#faf8f5] text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>

            {/* Direct WhatsApp Concierge Support */}
            <div className="mt-8 p-4 rounded-2xl bg-white border border-[#eae5dc] shadow-xs text-left w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141414]">Need Immediate Assistance?</p>
                  <p className="text-[11px] text-[#747878]">Chat directly with PARZIO customer care on WhatsApp.</p>
                </div>
              </div>
              <a
                href={`https://wa.me/919106694317?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors"
              >
                Chat Now
              </a>
            </div>

            {/* Collapsible Technical Diagnostics for Client & Developers */}
            <div className="w-full mt-6 text-left">
              <button
                type="button"
                onClick={() => this.setState({ showTechDetails: !this.state.showTechDetails })}
                className="flex items-center justify-between w-full p-2.5 text-[11px] font-semibold text-[#747878] hover:text-[#141414] transition-colors"
              >
                <span>Technical Diagnostics (For Engineers)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${this.state.showTechDetails ? 'rotate-180' : ''}`} />
              </button>

              {this.state.showTechDetails && (
                <div className="p-3 mt-1 rounded-xl bg-neutral-900 text-neutral-300 font-mono text-[10px] overflow-x-auto max-h-48 border border-neutral-800">
                  <p className="text-amber-400 font-bold mb-1">
                    Incident: #{this.state.incidentId}
                  </p>
                  <p className="text-rose-400">
                    {this.state.error?.toString() || 'Unknown Runtime Exception'}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-neutral-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>

          </main>

          {/* Footer */}
          <footer className="py-4 px-6 border-t border-[#eae5dc] text-center text-xs text-[#747878] bg-white flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8c7138]" />
            <span>PARZIO Atelier System Sentinel Active • Zero Data Loss Guaranteed</span>
          </footer>

        </div>
      );
    }

    return this.props.children;
  }
}

