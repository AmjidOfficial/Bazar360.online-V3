import React, { useState } from 'react';
import { RefreshCw, Home, ShieldAlert, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Bazar360Logo, AutoChoiceLogo } from './common/BrandLogos';

interface GlobalErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  onReset?: () => void;
}

/**
 * GlobalErrorFallback
 * A clean, branded UI state for application error boundaries with cache clearing and instant recovery.
 */
export const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  onReset,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCacheAndReload = async () => {
    setIsClearing(true);
    try {
      // 1. Clear local and session storage safely
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();

        // 2. Clear service worker caches if CacheStorage is available
        if ('caches' in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(cacheKeys.map((name) => window.caches.delete(name)));
        }

        // 3. Unregister active service workers to guarantee clean state
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((reg) => reg.unregister()));
        }
      }
    } catch (clearErr) {
      console.warn('[GlobalErrorFallback] Cache flush note:', clearErr);
    }

    // Trigger boundary reset or full page refresh
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else if (onReset) {
      onReset();
    }
    
    if (typeof window !== 'undefined') {
      window.location.href = window.location.origin;
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#050B1A] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#00D2FF]/20">
      <div className="w-full max-w-lg bg-[#071225] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D2FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <Bazar360Logo size="sm" frame="rounded" background="dark" />
          <div className="h-4 w-[1px] bg-slate-800" />
          <AutoChoiceLogo size="xs" frame="rounded" background="dark" />
        </div>

        {/* Icon & Title */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <ShieldAlert size={28} />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Session Recovery Needed
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            An unexpected interface event occurred. Your account and saved data remain secure in our cloud database.
          </p>
        </div>

        {/* Technical Error Details Accordion (Collapsible) */}
        {error?.message && (
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#050B1A]/80">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-[11px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Diagnostic Details</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showDetails && (
              <div className="p-3 border-t border-slate-800 font-mono text-[10px] text-rose-300/90 break-words max-h-36 overflow-y-auto leading-relaxed">
                {error.message}
                {error.stack && (
                  <pre className="mt-2 text-[9px] text-slate-500 whitespace-pre-wrap overflow-x-auto">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* Primary Actions */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleClearCacheAndReload}
            disabled={isClearing}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-[#00D2FF] hover:from-blue-500 hover:to-[#38d9ff] active:scale-98 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={isClearing ? 'animate-spin' : ''} />
            <span>{isClearing ? 'Clearing Cache & Reloading...' : 'Try Again & Clear Cache'}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoHome}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home size={14} />
              <span>Go to Home</span>
            </button>

            <a
              href="https://wa.me/923159085086?text=Hi%20Bazar360%20Support,%20I%20encountered%20an%20application%20recovery%20screen."
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl border border-slate-700 hover:border-emerald-500/60 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare size={14} />
              <span>Contact Support</span>
            </a>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="text-center pt-2">
          <span className="text-[10px] text-slate-500 font-medium">
            Bazar360 & Auto Choice Automotive Systems • High Availability
          </span>
        </div>

      </div>
    </div>
  );
};

export default GlobalErrorFallback;
