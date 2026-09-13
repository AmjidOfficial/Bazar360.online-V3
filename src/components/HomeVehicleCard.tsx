import React from 'react';
import { ArrowUpRight, Heart, MapPin, ShieldCheck } from 'lucide-react';
import { CarListing, Dealer } from '../types';
import { getOptimizedUrl } from '../lib/cloudinaryService';

interface HomeVehicleCardProps {
  car: CarListing;
  dealer?: Dealer;
  onSelect: (car: CarListing) => void;
  onToggleFavorite?: (car: CarListing) => void;
  isFavorite?: boolean;
}

const money = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return 'Price on request';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
};

const mileage = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return 'Mileage not listed';
  return `${new Intl.NumberFormat('en-PK').format(value)} km`;
};

export default function HomeVehicleCard({
  car,
  dealer,
  onSelect,
  onToggleFavorite,
  isFavorite = false,
}: HomeVehicleCardProps) {
  const image = car.primaryImage || car.imageUrl || car.images?.[0] || '';

  return (
    <article className="b360-home-card group" onClick={() => onSelect(car)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={getOptimizedUrl(image, {
              width: 900,
              height: 560,
              crop: 'fill',
              quality: 'auto',
              format: 'auto',
              watermark: false,
            })}
            alt={`${car.make} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs font-medium text-slate-400">Vehicle image unavailable</div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {car.verified || car.approved ? (
            <span className="b360-home-badge b360-home-badge-dark"><ShieldCheck size={12} /> Verified</span>
          ) : null}
          {car.condition ? <span className="b360-home-badge b360-home-badge-light">{car.condition}</span> : null}
        </div>

        {onToggleFavorite ? (
          <button
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Save vehicle'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(car);
            }}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-white"
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-slate-950">{car.title || `${car.make} ${car.model}`}</h3>
            <p className="mt-1 text-xs text-slate-500">{car.year} · {mileage(car.mileage)} · {car.transmission}</p>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700 transition group-hover:bg-orange-500 group-hover:text-white"><ArrowUpRight size={15} /></span>
        </div>

        <div className="mt-4">
          <div className="text-base font-bold text-slate-950">{money(car.price)}</div>
          {dealer?.name ? (
            <div className="mt-1 flex max-w-[190px] items-center gap-1 truncate text-[11px] font-medium text-slate-500"><MapPin size={11} />{dealer.name}</div>
          ) : car.location ? (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500"><MapPin size={11} />{car.location}</div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
