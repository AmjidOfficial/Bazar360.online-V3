import React from 'react';
import { RefreshCw, ShieldAlert, Home } from 'lucide-react';
import { Bazar360Logo } from '../common/BrandLogos';

interface GlobalErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  onReset?: () => void;
}

/**
 * GlobalErrorFallback Component in components/ui
 * Features Bazar360 branding, 'Something went wrong' message, and a recovery 'Try Again' button.
 */
export const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  onReset,
}) => {
  const handleReload = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn('Storage clear notice:', e);
    }

    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else if (onReset) {
      onReset();
    }

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#050B1A] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-[#071225] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D2FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#161D6F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex justify-center border-b border-slate-800/80 pb-4">
          <Bazar360Logo size="sm" frame="none" background="transparent" />
        </div>

        {/* Message */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert size={24} />
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight">
            Something went wrong
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
            An unexpected error occurred in the application. Let's try reloading the interface.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 bg-black/40 border border-slate-800 rounded-xl text-center">
            <p className="text-[11px] font-mono text-rose-400/90 break-words line-clamp-3">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleGoHome}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/30 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-98"
          >
            <Home size={14} />
            Go Home
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00D2FF] hover:bg-[#00D2FF]/90 text-[#050B1A] text-xs font-black transition-all cursor-pointer active:scale-98 shadow-lg shadow-[#00D2FF]/10"
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalErrorFallback;
