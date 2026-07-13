import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ERROR BOUNDARY CATACLYSM] Uncaught React rendering crash:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear localStorage or problematic states if needed, but simple reload is best first
      this.setState({ hasError: false, error: null });
      window.location.reload();
    } catch (e) {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDe = typeof window !== 'undefined' && (window.location.pathname.includes('/de') || navigator.language.startsWith('de'));

      return (
        <div id="error-boundary-root" className="min-h-[500px] flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-800 text-center font-sans">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-black">
              ⚠
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-2">
              {isDe ? 'Ein unerwarteter Fehler ist aufgetreten' : 'Something went wrong'}
            </h1>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {isDe 
                ? 'Die Anwendung konnte nicht korrekt gerendert werden. Möglicherweise wurde die Seite aktualisiert oder es liegt ein temporärer Konflikt vor.' 
                : 'The application encountered a critical rendering error. It might be due to a temporary layout conflict or connection lag.'}
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-left font-mono bg-slate-100 p-3 rounded-lg overflow-x-auto text-red-700 max-h-36 mb-6 leading-normal border border-slate-150">
                {this.state.error.name}: {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-xs transition duration-150 shadow-sm shadow-blue-200"
            >
              {isDe ? 'Anwendung neu laden' : 'Reload Application'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
