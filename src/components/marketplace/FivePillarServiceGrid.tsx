import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Banknote, 
  Car, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';

interface FivePillarServiceGridProps {
  onOpenValuation?: () => void;
  onOpenCompare?: () => void;
  onNavigateToCategory?: (cat: string) => void;
}

export const FivePillarServiceGrid: React.FC<FivePillarServiceGridProps> = ({
  onOpenValuation,
  onOpenCompare,
  onNavigateToCategory,
}) => {
  const pillars = [
    {
      id: 'inspection',
      title: '200+ Point Certified Inspection',
      subtitle: 'Engine, transmission, chassis & paint depth scan by master technicians.',
      icon: ShieldCheck,
      badge: 'Certified',
      accent: 'from-blue-600 to-indigo-700',
      tagline: 'Zero hidden defects guarantee',
      cta: 'View Inspection Sample',
      action: () => onNavigateToCategory?.('All'),
    },
    {
      id: 'verification',
      title: 'Biometric & Document Verification',
      subtitle: 'CPLC clearance, token tax paid status, excise record, and original smart card audits.',
      icon: FileCheck2,
      badge: '100% Legal',
      accent: 'from-emerald-600 to-teal-700',
      tagline: 'Instant Excise & Police Record Check',
      cta: 'Verify Vehicle Papers',
      action: () => onNavigateToCategory?.('All'),
    },
    {
      id: 'valuation',
      title: 'Instant Fair-Market Cash Offer',
      subtitle: 'Real-time algorithmic valuation based on 50,000+ live transactions in Pakistan.',
      icon: Banknote,
      badge: 'AI Powered',
      accent: 'from-amber-600 to-orange-700',
      tagline: 'Same-day dealer bids',
      cta: 'Calculate Car Value',
      action: () => onOpenValuation?.(),
    },
    {
      id: 'test-drive',
      title: 'Doorstep Test Drive Booking',
      subtitle: 'Experience your dream car at your home or workplace with verified sales rep.',
      icon: Car,
      badge: 'Convenient',
      accent: 'from-purple-600 to-violet-700',
      tagline: 'Delivered to your doorstep',
      cta: 'Explore Driveable Cars',
      action: () => onNavigateToCategory?.('All'),
    },
    {
      id: 'bargain',
      title: 'Safe Escrow & Smart Bargaining',
      subtitle: 'Transparent digital price negotiations with secure token deposit protection.',
      icon: Scale,
      badge: 'Protected',
      accent: 'from-cyan-600 to-blue-700',
      tagline: 'Direct buyer-to-seller transparency',
      cta: 'Start Smart Offer',
      action: () => onOpenCompare?.(),
    },
  ];

  return (
    <section className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles size={14} />
            <span>Comprehensive Ecosystem</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            5 Pillars of Buyer & Seller Trust
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every transaction is safeguarded by strict physical inspections, legal verifications, and market analytics.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          const isLarge = index === 0;

          return (
            <div
              key={pillar.id}
              onClick={pillar.action}
              className={`group relative bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${
                isLarge ? 'md:col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800' : ''
              }`}
            >
              {/* Top Row */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${
                    isLarge ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  } group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    isLarge ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pillar.badge}
                  </span>
                </div>

                <h3 className={`font-bold text-base tracking-tight mb-1.5 ${
                  isLarge ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'
                } transition-colors`}>
                  {pillar.title}
                </h3>

                <p className={`text-xs leading-relaxed ${
                  isLarge ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {pillar.subtitle}
                </p>
              </div>

              {/* Bottom Tagline & Action */}
              <div className={`pt-4 mt-4 border-t flex items-center justify-between text-xs font-semibold ${
                isLarge ? 'border-slate-800 text-blue-400' : 'border-slate-100 text-blue-600'
              }`}>
                <span className="text-[11px] truncate max-w-[170px] text-slate-400 font-normal">
                  {pillar.tagline}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{pillar.cta}</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
