import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, MapPin, Gauge, Fuel, Calendar, Zap } from 'lucide-react';
import { CarListing, Dealer } from '../types';
import { useCurrencyMode } from '../lib/currency';
import { cinematicAudio } from '../lib/cinematicAudio';

export interface HomeVehicleCardProps {
  car: CarListing;
  dealer?: Dealer;
  onSelect: (car: CarListing) => void;
  onToggleFavorite: (car: CarListing) => void;
  isFavorite: boolean;
}

export function HomeVehicleCard({
  car,
  dealer,
  onSelect,
  onToggleFavorite,
  isFavorite,
}: HomeVehicleCardProps) {
  const { renderPrice } = useCurrencyMode();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cinematicAudio.playTick();
    onToggleFavorite(car);
  };

  const handleCardClick = () => {
    cinematicAudio.playClick();
    onSelect(car);
  };

  const imageSrc = car.imageUrl || (car.images && car.images[0]) || '/auto_choice_official_logo.jpg';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className="group bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-sky-500/10 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Vehicle Media Header */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={car.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = '/auto_choice_official_logo.jpg';
          }}
        />

        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {car.isVerified && (
            <span className="flex items-center gap-1 bg-emerald-500/90 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
          {car.condition && (
            <span className="bg-slate-900/80 border border-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
              {car.condition}
            </span>
          )}
        </div>

        {/* Year & City Tag */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
          <span className="font-mono font-bold bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/10">
            {car.year}
          </span>
          {car.city && (
            <span className="flex items-center gap-1 text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/10">
              <MapPin size={11} className="text-sky-400" />
              {car.city}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-black text-white text-base tracking-tight line-clamp-1 group-hover:text-sky-400 transition-colors">
            {car.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            {car.make} {car.model} {car.variant ? `• ${car.variant}` : ''}
          </p>
        </div>

        {/* Specs Pill List */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono py-1 border-y border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Gauge size={12} className="text-sky-400" />
            <span>{typeof car.mileage === 'number' ? `${car.mileage.toLocaleString()} km` : (car.mileage || 'Low km')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel size={12} className="text-sky-400" />
            <span>{car.fuelType || 'Petrol'}</span>
          </div>
        </div>

        {/* Price & Dealer Footer */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Asking Price</span>
            <div className="text-lg font-black text-sky-400 tracking-tight font-mono">
              {renderPrice(car.price)}
            </div>
          </div>
          {dealer && (
            <div className="text-right max-w-[120px]">
              <span className="text-[10px] text-slate-400 block truncate font-medium">{dealer.name}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default HomeVehicleCard;
