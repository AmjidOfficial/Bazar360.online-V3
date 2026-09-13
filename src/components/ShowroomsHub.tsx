import { NO_IMAGE_SVG } from "../types";
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Store, 
  MapPin, 
  Star, 
  QrCode, 
  Search, 
  Compass, 
  ChevronRight, 
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Dealer, CarListing } from '../types';
import { LazyImage } from './LazyImage';
import { cinematicAudio } from '../lib/cinematicAudio';

interface ShowroomsHubProps {
  dealers: Dealer[];
  listings: CarListing[];
  onSelectDealer: (id: string) => void;
  setSelectedQrDealer: (dealer: Dealer) => void;
  lang: 'en' | 'ur';
}

export default function ShowroomsHub({
  dealers,
  listings,
  onSelectDealer,
  setSelectedQrDealer,
  lang
}: ShowroomsHubProps) {
  const isUrdu = lang === 'ur';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  const t = {
    en: {
      title: 'Verified Showrooms',
      subtitle: 'Browse elite dealership partners, inspect live inventories, and connect instantly',
      searchPlaceholder: 'Search showrooms by name or city...',
      allCities: 'All Cities',
      allSpecialties: 'All Specialties',
      activeListings: 'Active Cars',
      userRating: 'User Rating',
      specialtyTitle: 'Specialty',
      cityTitle: 'Location',
      viewStorefront: 'Visit Showroom HQ',
      noResults: 'No showrooms match your filters. Try clearing filters or searching again.',
      verifiedShowroom: 'Verified Partner Network',
      flagshipTitle: 'Flagship Showroom',
      quickQr: 'QR Navigate',
      peshawar: 'Peshawar',
      islamabad: 'Islamabad',
      lahore: 'Lahore',
      karachi: 'Karachi'
    },
    ur: {
      title: 'تصدیق شدہ شورومز',
      subtitle: 'بazar360 کے بہترین شورومز کی لائیو انوینٹریز دیکھیں اور رابطہ کریں',
      searchPlaceholder: 'نام یا شہر سے شوروم تلاش کریں...',
      allCities: 'تمام شہر',
      allSpecialties: 'تمام مہارتیں',
      activeListings: 'فعال گاڑیاں',
      userRating: 'درجہ بندی',
      specialtyTitle: 'خصوصیت',
      cityTitle: 'مقام',
      viewStorefront: 'شوروم ایچ کیو وزٹ کریں',
      noResults: 'کوئی شوروم دستیاب نہیں ہے۔ براہ کرم فلٹرز تبدیل کریں۔',
      verifiedShowroom: 'تصدیق شدہ پارٹنر نیٹ ورک',
      flagshipTitle: 'فلیگ شپ شوروم',
      quickQr: 'کیو آر کوڈ',
      peshawar: 'پشاور',
      islamabad: 'اسلام آباد',
      lahore: 'لاہور',
      karachi: 'کراچی'
    }
  }[lang];

  // Helper to resolve specialty of a dealer based on description & name
  const getDealerSpecialty = (dealer: Dealer): 'Exotic' | 'SUVs' | 'Imports' | 'Economy' => {
    const desc = (dealer.description || '').toLowerCase();
    const name = dealer.name.toLowerCase();
    
    if (name.includes('luxury') || desc.includes('exotic') || desc.includes('luxury') || desc.includes('premium')) {
      return 'Exotic';
    }
    if (desc.includes('suv') || desc.includes('4x4') || desc.includes('prado') || desc.includes('fortuner') || desc.includes('jeep')) {
      return 'SUVs';
    }
    if (desc.includes('import') || desc.includes('jdm') || desc.includes('japanese') || desc.includes('auction')) {
      return 'Imports';
    }
    return 'Economy';
  };

  const specialties = [
    { id: 'All', label: t.allSpecialties, color: 'border-[var(--color-border-main)] bg-[var(--color-bg-tertiary)]' },
    { id: 'Exotic', label: isUrdu ? 'لگژری اور امپورٹڈ' : 'Exotic & Luxury', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
    { id: 'SUVs', label: isUrdu ? 'ایس یو وی اور فور بائی فور' : 'SUVs & 4x4', color: 'border-sky-500/30 bg-sky-500/10 text-sky-400' },
    { id: 'Imports', label: isUrdu ? 'جاپانی اور جے ڈی ایم' : 'Imports & JDM', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
    { id: 'Economy', label: isUrdu ? 'لوکل اور فیملی کارز' : 'Economy & Family', color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400' }
  ];

  const cities = ['All', 'Peshawar', 'Islamabad', 'Lahore', 'Karachi'];

  // Sub-second localized filter chain
  const filteredDealers = useMemo(() => {
    return dealers.filter((dealer) => {
      // 1. Text Search query filter
      const text = searchQuery.toLowerCase();
      const matchesSearch = 
        dealer.name.toLowerCase().includes(text) || 
        (dealer.description || '').toLowerCase().includes(text) ||
        dealer.location.toLowerCase().includes(text);
      
      if (!matchesSearch) return false;

      // 2. City filter
      if (selectedCity !== 'All') {
        const matchesCity = dealer.location.toLowerCase().includes(selectedCity.toLowerCase());
        if (!matchesCity) return false;
      }

      // 3. Specialty filter
      if (selectedSpecialty !== 'All') {
        const specialty = getDealerSpecialty(dealer);
        if (specialty !== selectedSpecialty) return false;
      }

      return true;
    });
  }, [dealers, searchQuery, selectedCity, selectedSpecialty]);

  const isRtl = lang === 'ur';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in text-left text-[var(--color-text-header)] font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* HEADER SECTION with dynamic subtle stats indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--color-border-main)] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--color-accent-main)]/10 text-[var(--color-accent-main)] border border-[var(--color-accent-main)]/20">
              <Compass size={16} className="animate-spin-slow" />
            </span>
            <span className="text-[10px] font-mono font-bold text-[var(--color-accent-main)] uppercase tracking-widest block">{t.verifiedShowroom}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-[var(--color-text-header)]">
            {t.title}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Live Counter tag */}
        <div className="flex items-center gap-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-2xl px-4 py-2.5 shrink-0 self-start md:self-center shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-main)] animate-pulse shadow-sm shadow-[var(--color-accent-main)]/50" />
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-header)]">
            {dealers.length} {isUrdu ? 'ڈیلرز لائیو' : 'Dealers Online'}
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-5 md:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          
          {/* Main search field */}
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-main)] text-xs rounded-xl py-3.5 ${
                isRtl ? 'pl-11 pr-4' : 'pl-4 pr-11'
              } focus:border-[var(--color-accent-main)] focus:bg-[var(--color-bg-secondary)] focus:ring-1 focus:ring-[var(--color-accent-main)]/30 outline-none text-[var(--color-text-header)] font-medium placeholder-[var(--color-text-muted)]`}
            />
            <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] ${
              isRtl ? 'left-4' : 'right-4'
            }`} />
          </div>

          {/* City selector row */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:inline">{t.cityTitle}:</span>
            <div className="flex flex-wrap gap-1.5 bg-[var(--color-bg-tertiary)] p-1 rounded-xl border border-[var(--color-border-main)]">
              {cities.map((city) => {
                const isSel = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => {
                      cinematicAudio.playClick();
                      setSelectedCity(city);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-[var(--color-accent-main)] text-[#090D14] shadow-xs' 
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-secondary)]'
                    }`}
                  >
                    {city === 'All' ? t.allCities : (isUrdu && city === 'Peshawar' ? 'پشاور' : isUrdu && city === 'Islamabad' ? 'اسلام آباد' : city)}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* SHOWROOM CARDS GRID */}
      {filteredDealers.length > 0 ? (
        <div className="grid gap-5 items-stretch w-full" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
          {filteredDealers.map((dealer) => {
            const spec = getDealerSpecialty(dealer);
            const count = listings.filter((l) => l.dealerId === dealer.id).length;
            const specObj = specialties.find((s) => s.id === spec);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={dealer.id}
                onClick={() => {
                  cinematicAudio.playClick();
                  onSelectDealer(dealer.id);
                }}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl overflow-hidden group hover:border-[var(--color-accent-main)]/50 hover:-translate-y-1 duration-300 cursor-pointer relative shadow-xs flex flex-col justify-between"
              >
                {/* Visual Top Branding Banner */}
                <div className="h-40 sm:h-44 bg-slate-950 relative flex items-center justify-center overflow-hidden shrink-0">
                  <LazyImage
                    alt={`${dealer.name} Cover`}
                    className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 object-cover object-center"
                    src={dealer.coverImage || NO_IMAGE_SVG}
                    width={400}
                    height={176}
                  />
                  
                  {/* Subtle Top-left specialty badge overlay */}
                  <span className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-md ${specObj?.color}`}>
                    {specObj?.label}
                  </span>

                  {/* Floating QR Code button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cinematicAudio.playClick();
                      setSelectedQrDealer(dealer);
                    }}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-[var(--color-accent-main)] text-[var(--color-text-header)] hover:text-[#090D14] flex items-center justify-center border border-white/10 transition-all shadow-xs duration-200 cursor-pointer backdrop-blur-md"
                    title={t.quickQr}
                  >
                    <QrCode size={13} />
                  </button>

                  {/* Centered Overlaid Logo Badge (Crisp Auto-Fit) */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--color-bg-secondary)] flex items-center justify-center z-10 shadow-xl border-2 border-[var(--color-border-main)] p-1.5 overflow-hidden backdrop-blur-md">
                    {(dealer.logoUrl || dealer.logo || dealer.avatarUrl) ? (
                      <LazyImage
                        src={dealer.logoUrl || dealer.logo || dealer.avatarUrl}
                        alt={dealer.name}
                        className="w-full h-full object-contain object-center rounded-xl"
                        width={80}
                        height={80}
                      />
                    ) : (
                      <span className="font-display font-bold text-xl text-[var(--color-accent-main)] uppercase">
                        {dealer.avatarLetter || dealer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-[var(--color-text-header)] text-sm group-hover:text-[var(--color-accent-main)] transition-colors uppercase tracking-tight line-clamp-1">
                        {dealer.name}
                      </h3>
                      {dealer.flagshipVerified && (
                        <span className="text-[8px] bg-[var(--color-accent-main)]/10 text-[var(--color-accent-main)] border border-[var(--color-accent-main)]/20 font-bold px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 flex items-center gap-0.5">
                          <ShieldCheck size={10} />
                          {t.flagshipTitle}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[var(--color-text-muted)] text-[10px] flex items-center gap-1 font-sans uppercase tracking-wider font-bold">
                      <MapPin size={11} className="text-[var(--color-accent-main)]" /> 
                      <span>{dealer.location}</span>
                    </p>

                    <p className="text-[var(--color-text-muted)] text-xs leading-relaxed line-clamp-2 pr-2 font-normal">
                      {dealer.description}
                    </p>
                  </div>

                  {/* Card bottom footer statistics */}
                  <div className="border-t border-[var(--color-border-main)] pt-4 flex items-center justify-between">
                    
                    {/* Rating display */}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-text-header)]">
                      <Star size={11} className="fill-amber-500 text-amber-500" />
                      <span>{dealer.rating}</span>
                      <span className="text-[var(--color-text-muted)]">/ 5</span>
                    </div>

                    {/* Stock Counter */}
                    <div className="text-[10px] font-bold text-[var(--color-text-header)] flex items-center gap-1.5">
                      <span className="bg-[var(--color-accent-main)]/10 text-[var(--color-accent-main)] px-2 py-0.5 rounded-lg border border-[var(--color-accent-main)]/15">
                        {count} {t.activeListings}
                      </span>
                    </div>

                  </div>

                </div>

                {/* Hover action card ribbon */}
                <div className="bg-[var(--color-bg-tertiary)] border-t border-[var(--color-border-main)] py-2.5 px-5 text-center text-[10px] font-bold text-[var(--color-accent-main)] group-hover:text-[var(--color-accent-hover)] uppercase tracking-widest transition-all flex items-center justify-center gap-1 rounded-b-3xl">
                  <span>{t.viewStorefront}</span>
                  <ChevronRight size={12} className="group-hover:translate-x-1 duration-150" />
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty feedback state */
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
          <Store size={36} className="text-[var(--color-text-muted)] animate-pulse" />
          <p className="text-[var(--color-text-muted)] text-xs max-w-sm mx-auto font-medium">
            {t.noResults}
          </p>
        </div>
      )}

    </div>
  );
}

