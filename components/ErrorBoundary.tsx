
import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Standard React Error Boundary component.
 * Fix: Explicitly use React.Component to ensure the compiler correctly identifies the base class and provides the 'props' property.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL_RENDER_ERROR", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center p-6 text-center">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-2xl border border-slate-100 dark:border-white/5">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            
            <h1 className="text-3xl font-black text-brand-dark dark:text-white mb-4 tracking-tighter">
              App failed to load
            </h1>
            
            <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-2xl mb-10 text-left overflow-x-auto border border-slate-100 dark:border-white/5">
              <p className="text-red-500 font-bold mb-2 text-sm">{this.state.error?.message}</p>
              <pre className="text-[10px] text-slate-400 font-mono leading-relaxed">
                {this.state.error?.stack?.split('\n').slice(0, 5).join('\n')}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-gradient-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center btn-glow transition-all"
              >
                <RefreshCw size={18} className="mr-3" /> Reload
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center transition-all"
              >
                <Home size={18} className="mr-3" /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Fix: Accessing children through this.props which is now correctly inherited from React.Component
    return this.props.children;
  }
}
