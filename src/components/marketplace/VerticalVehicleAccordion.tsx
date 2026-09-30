import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Sparkles, 
  Gauge, 
  Calendar, 
  Fuel, 
  ShieldCheck, 
  MapPin, 
  Heart, 
  ChevronRight,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { CarListing } from '../../types';

interface VerticalVehicleAccordionProps {
  listings: CarListing[];
  onSelectVehicle: (car: CarListing) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const VerticalVehicleAccordion: React.FC<VerticalVehicleAccordionProps> = ({
  listings,
  onSelectVehicle,
  favorites,
  onToggleFavorite,
  formatPrice,
}) => {
  // Take the top 5 curated flagship cars
  const curatedCars = listings.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (curatedCars.length === 0) return null;

  return (
    <section className="relative w-full rounded-3xl bg-[#090D16] border border-slate-800/80 p-5 sm:p-7 shadow-2xl overflow-hidden text-slate-100">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-slate-800/60 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
            <Sparkles size={14} className="text-amber-400" />
            <span>Curated Automotive Collection</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Flagship Showcase
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Explore certified, low-mileage luxury and executive vehicles inspected to factory specifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">Hover or tap card to expand specs</span>
        </div>
      </div>

      {/* Accordion Panels Container (Horizontal expansion on md+, Vertical stacked on mobile) */}
      <div className="relative z-10 hidden md:flex h-[420px] lg:h-[460px] gap-3 w-full">
        {curatedCars.map((car, idx) => {
          const isActive = activeIndex === idx;
          const isFav = favorites.includes(car.id);
          const bgImage = car.imageUrl || (car.images && car.images[0]) || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg';

          return (
            <div
              key={car.id}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => {
                if (isActive) {
                  onSelectVehicle(car);
                } else {
                  setActiveIndex(idx);
                }
              }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border ${
                isActive 
                  ? 'flex-[3.5] border-blue-500/60 shadow-2xl shadow-blue-950/50 ring-1 ring-blue-500/30' 
                  : 'flex-1 border-slate-800/80 hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              {/* Background Media */}
              <img
                src={bgImage}
                alt={car.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out"
                style={{
                  transform: isActive ? 'scale(1.04)' : 'scale(1.12)',
                  filter: isActive ? 'brightness(0.95)' : 'brightness(0.5) contrast(1.1)',
                }}
              />

              {/* Scrim Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isActive 
                  ? 'from-black/95 via-black/40 to-transparent' 
                  : 'from-black/90 via-black/60 to-black/30'
              } transition-opacity duration-300`} />

              {/* Top Bar on Active Card */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5">
                  {car.verified && (
                    <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                      <ShieldCheck size={12} />
                      <span>Certified</span>
                    </span>
                  )}
                  <span className="bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2 py-1 rounded-md border border-white/10">
                    {car.year}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(car.id);
                  }}
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-rose-400 transition-colors shadow-md"
                  aria-label="Save vehicle to favorites"
                >
                  <Heart size={15} className={isFav ? 'text-rose-500 fill-rose-500' : ''} />
                </button>
              </div>

              {/* Inactive State: Vertical Title Text */}
              {!isActive && (
                <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-end z-10 px-2 text-center">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {car.make}
                  </span>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {car.model}
                  </p>
                  <span className="text-[11px] text-slate-400 font-mono mt-1">
                    {formatPrice(car.price).replace('PKR ', '')}
                  </span>
                </div>
              )}

              {/* Active State: Rich Expanded Info Box */}
              {isActive && (
                <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end text-white">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
                      <span>{car.make}</span>
                      <span>·</span>
                      <span>{car.condition || 'Inspected'}</span>
                      <span>·</span>
                      <span>{car.assemblyType || 'Local'}</span>
                    </div>

                    <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight leading-tight line-clamp-1">
                      {car.title}
                    </h3>
                  </div>

                  {/* Price & Location */}
                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-xs text-slate-400 block">Direct Seller Price</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        {formatPrice(car.price)}
                      </span>
                    </div>
                    <div className="text-right text-xs text-slate-300 flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{car.location || car.registrationCity || 'Pakistan'}</span>
                    </div>
                  </div>

                  {/* Key Quick Specs Bar */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                      <Gauge size={14} className="text-blue-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block leading-none">Mileage</span>
                        <span className="font-bold truncate block">{car.mileage?.toLocaleString()} km</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                      <Fuel size={14} className="text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block leading-none">Fuel</span>
                        <span className="font-bold truncate block">{car.fuelType || 'Petrol'}</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                      <Calendar size={14} className="text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block leading-none">Registered</span>
                        <span className="font-bold truncate block">{car.registrationCity || 'Islamabad'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle(car);
                      }}
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-98"
                    >
                      <span>View Full Specifications</span>
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Stacked Responsive Cards */}
      <div className="md:hidden space-y-3">
        {curatedCars.map((car) => {
          const isFav = favorites.includes(car.id);
          const bgImage = car.imageUrl || (car.images && car.images[0]) || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg';

          return (
            <div
              key={car.id}
              onClick={() => onSelectVehicle(car)}
              className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 p-4 cursor-pointer shadow-lg active:scale-99 transition-transform"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                <img src={bgImage} alt={car.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {car.verified && (
                    <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      Certified
                    </span>
                  )}
                  <span className="bg-black/60 text-white text-[9px] px-2 py-0.5 rounded">
                    {car.year}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(car.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <Heart size={14} className={isFav ? 'text-rose-500 fill-rose-500' : ''} />
                </button>

                <div className="absolute bottom-2 left-2.5 text-lg font-black text-emerald-400 font-mono">
                  {formatPrice(car.price)}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm line-clamp-1">{car.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{car.mileage?.toLocaleString()} km</span>
                  <span>·</span>
                  <span>{car.fuelType || 'Petrol'}</span>
                  <span>·</span>
                  <span>{car.location || 'Pakistan'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
