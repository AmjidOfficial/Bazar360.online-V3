import React from 'react';
import { 
  Search, 
  ClipboardCheck, 
  Handshake, 
  KeyRound, 
  ArrowRight, 
  Sparkles,
  Check
} from 'lucide-react';

interface FourStageBuyingProcessProps {
  onNavigateToCatalog: () => void;
  onNavigateToSell: () => void;
}

export const FourStageBuyingProcess: React.FC<FourStageBuyingProcessProps> = ({
  onNavigateToCatalog,
  onNavigateToSell,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Discover & Compare',
      desc: 'Browse through certified vehicle listings with full high-res photo sets, inspection scores, and transparent pricing.',
      icon: Search,
    },
    {
      num: '02',
      title: '200-Point Inspection',
      desc: 'Request an in-depth physical diagnostics report and book a door-step or showroom test drive at your convenience.',
      icon: ClipboardCheck,
    },
    {
      num: '03',
      title: 'Secure Bargain & Escrow',
      desc: 'Negotiate price directly with verified sellers through our encrypted offer center with protected token deposit.',
      icon: Handshake,
    },
    {
      num: '04',
      title: 'Transfer & Key Handover',
      desc: 'Seamless biometric excise transfer, biometric verification, and immediate doorstep delivery of your new car.',
      icon: KeyRound,
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-slate-900 via-[#0B132B] to-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Simple, Safe & Transparent</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          How Buying on Bazar360 Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          From initial search to doorstep key handover, we eliminate fraud, middlemen markups, and paperwork headaches.
        </p>
      </div>

      {/* 4 Steps Horizontal Flow */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 hover:border-blue-500/60 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon size={20} />
                  </div>
                  <span className="text-xl font-black font-mono text-slate-600 group-hover:text-blue-400 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold">
                <Check size={13} />
                <span>Verified Step</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Actions */}
      <div className="relative z-10 mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onNavigateToCatalog}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <span>Find Inspected Cars</span>
          <ArrowRight size={15} />
        </button>
        <button
          onClick={onNavigateToSell}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
        >
          <span>List Your Car for Free</span>
        </button>
      </div>
    </section>
  );
};
