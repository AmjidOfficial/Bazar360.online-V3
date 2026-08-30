import React from 'react';
import { Award, ChevronRight } from 'lucide-react';

interface TopBrandsRailProps {
  onSelectBrand: (brandName: string) => void;
  selectedBrand?: string;
  lang?: 'en' | 'ur';
}

export const TopBrandsRail: React.FC<TopBrandsRailProps> = ({
  onSelectBrand,
  selectedBrand,
  lang = 'en'
}) => {
  const isUrdu = lang === 'ur';

  // Key Pakistani market top brands with direct navigation
  const topPakistaniBrands = [
    { name: 'Toyota', tag: 'Market Leader', code: 'TOY' },
    { name: 'Honda', tag: 'Popular Sedans', code: 'HON' },
    { name: 'Suzuki', tag: 'Economy & City', code: 'SUZ' },
    { name: 'KIA', tag: 'Modern Crossovers', code: 'KIA' },
    { name: 'Hyundai', tag: 'Premium SUVs', code: 'HYU' },
    { name: 'MG', tag: 'British Heritage', code: 'MGG' },
    { name: 'Changan', tag: 'Smart Utility', code: 'CHN' },
    { name: 'Haval', tag: 'Luxury SUVs', code: 'HVL' },
  ];

  return (
    <section className="hidden md:block w-full bg-[var(--color-bg-primary)] py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent-main)]/30 text-[var(--color-accent-main)] flex items-center justify-center shrink-0">
              <Award size={16} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-header)] tracking-tight">
                {isUrdu ? 'پاکستان کے مقبول ترین برانڈز' : 'Top Automotive Brands in Pakistan'}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isUrdu ? 'تلاش کو تیز کرنے کے لیے اہم برانڈز' : 'Fast-track discovery for Pakistan’s most searched vehicle manufacturers'}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Swipeable Rail & Desktop Grid Layout */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-8">
          {topPakistaniBrands.map((brand) => {
            const isSelected = selectedBrand?.toLowerCase() === brand.name.toLowerCase();
            return (
              <button
                key={brand.name}
                type="button"
                onClick={() => onSelectBrand(brand.name)}
                className={`shrink-0 min-w-[140px] sm:min-w-0 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xs ${
                  isSelected
                    ? 'bg-[var(--color-accent-main)] border-[var(--color-accent-main)] text-[#090D14] shadow-md scale-[1.02]'
                    : 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border-[var(--color-border-main)] text-[var(--color-text-main)] hover:border-[var(--color-accent-main)]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg font-mono font-bold text-[10px] flex items-center justify-center ${
                    isSelected 
                      ? 'bg-[#090D14]/20 text-[#090D14]' 
                      : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-accent-main)]'
                  }`}>
                    {brand.code}
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                    isSelected 
                      ? 'bg-[#090D14]/15 border-[#090D14]/20 text-[#090D14]' 
                      : 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)]'
                  }`}>
                    {brand.tag}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full pt-1">
                  <span className={`text-xs font-bold transition-colors ${
                    isSelected ? 'text-[#090D14]' : 'text-[var(--color-text-main)] group-hover:text-[var(--color-accent-main)]'
                  }`}>
                    {brand.name}
                  </span>
                  <ChevronRight size={14} className={`transition-all ${
                    isSelected ? 'text-[#090D14]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-main)] group-hover:translate-x-0.5'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
