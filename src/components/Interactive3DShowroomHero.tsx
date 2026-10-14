import React from 'react';
import { motion } from 'motion/react';
import { Compass, ShieldCheck, ChevronRight, Sparkles, PlusCircle } from 'lucide-react';

export interface Interactive3DShowroomHeroProps {
  onExploreClick: () => void;
  onSellClick: () => void;
  availableCount?: number;
  verifiedCount?: number;
}

export function Interactive3DShowroomHero({
  onExploreClick,
  onSellClick,
  availableCount = 48,
  verifiedCount = 24,
}: Interactive3DShowroomHeroProps) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b192e] border border-sky-500/20 shadow-2xl mb-8 p-6 sm:p-10 lg:p-12">
      {/* Background ambient glow & mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
            <Sparkles size={13} />
            <span>Pakistan's Digital Automotive Ecosystem</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Certified Luxury & Used Vehicles In One Showroom.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Experience transparent buying and verified sales with multi-point digital inspection audits, nationwide delivery, and direct showroom negotiation.
            </p>
          </div>

          {/* Stat Badges */}
          <div className="flex flex-wrap items-center gap-4 py-1">
            <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-2xl">
              <span className="text-xl font-black text-sky-400 font-mono">{availableCount}+</span>
              <span className="text-xs text-slate-400 font-medium">Live Vehicles</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-2xl">
              <ShieldCheck size={20} className="text-emerald-400" />
              <div>
                <span className="text-sm font-black text-emerald-400 font-mono">{verifiedCount}+</span>
                <span className="text-xs text-slate-400 ml-1">Certified Inspected</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-black text-sm tracking-wide shadow-lg hover:shadow-sky-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass size={18} />
              <span>Explore Inventory</span>
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={onSellClick}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm border border-slate-700/80 hover:border-slate-600 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle size={18} className="text-sky-400" />
              <span>Post Vehicle Free</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 flex items-center justify-center group">
            <img
              src="/auto_choice_hero_banner.jpg"
              alt="Auto Choice Showroom Showcase"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/auto_choice_official_logo.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold block">Featured Partner</span>
                <span className="text-xs font-black text-white">Auto Choice — The Right Choice</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Peshawar Hub
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interactive3DShowroomHero;
