import React, { useState } from 'react';
import { ArrowUpRight, Heart, MapPin, ShieldCheck, MessageCircle } from 'lucide-react';
import { CarListing, Dealer } from '../types';
import { getOptimizedUrl } from '../lib/cloudinaryService';
import { InspectionReportModal } from './InspectionReportModal';

interface HomeVehicleCardProps {
  car: CarListing;
  dealer?: Dealer;
  onSelect: (car: CarListing) => void;
  onToggleFavorite?: (car: CarListing) => void;
  isFavorite?: boolean;
}

const formatPakistaniPrice = (price: number) => {
  if (!Number.isFinite(price) || price <= 0) return 'Price on Call';
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Crore`;
  }
  return `PKR ${(price / 100000).toFixed(2)} Lakh`;
};

const formatMileage = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return 'Unregistered';
  return `${Math.round(value / 1000)}k km`;
};

export default function HomeVehicleCard({
  car,
  dealer,
  onSelect,
  onToggleFavorite,
  isFavorite = false,
}: HomeVehicleCardProps) {
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const image = car.primaryImage || car.imageUrl || car.images?.[0] || '';

  const vehicleTitle = `${car.year} ${car.make} ${car.model}`;
  const rawSellerPhone = car.sellerPhone || car.phone || (dealer && (dealer.whatsapp || dealer.phone)) || '923149198403';
  const cleanPhone = rawSellerPhone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${vehicleTitle} listed on BAZAR360 (ID: #${car.id}). Is this available?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <>
      <article className="b360-home-card group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-orange-500/40 cursor-pointer" onClick={() => onSelect(car)}>
        {/* Media Container Locked to 16:9 Aspect Ratio to Prevent Cumulative Layout Shift */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
          {image ? (
            <img
              src={getOptimizedUrl(image, {
                width: 800,
                height: 450,
                crop: 'fill',
                quality: 'auto',
                format: 'auto',
                watermark: false,
              })}
              alt={`${car.make} ${car.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs font-medium text-slate-400">Vehicle image unavailable</div>
          )}

          {/* Badges Overlays */}
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 z-10">
            {car.featured && (
              <span className="bg-[#EA580C] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                Featured Deal
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsInspectionModalOpen(true);
              }}
              className="bg-[#2563EB] hover:bg-blue-600 text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck size={11} />
              <span>200+ Pt Report</span>
            </button>
          </div>

          {onToggleFavorite ? (
            <button
              type="button"
              aria-label={isFavorite ? 'Remove from favorites' : 'Save vehicle'}
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(car);
              }}
              className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white shadow-sm transition backdrop-blur-sm z-10"
            >
              <Heart size={15} fill={isFavorite ? '#F43F5E' : 'none'} className={isFavorite ? 'text-rose-500' : 'text-white'} />
            </button>
          ) : null}
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#EA580C] block leading-none">{car.make}</span>
                <h3 className="truncate text-sm sm:text-base font-bold tracking-tight text-slate-900 mt-1">{car.title || `${car.make} ${car.model}`}</h3>
                <p className="mt-1 text-xs text-slate-500 font-mono">
                  {car.year} · {formatMileage(car.mileage)} · {car.transmission || 'Auto'}
                </p>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-50 text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                <ArrowUpRight size={15} />
              </span>
            </div>

            {/* Price Row */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-base font-black text-slate-900 font-mono tabular-nums">
                {formatPakistaniPrice(car.price)}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-0.5 truncate max-w-[120px]">
                <MapPin size={10} className="shrink-0 text-slate-400" />
                <span className="truncate">{car.registrationCity || car.location || 'Pakistan'}</span>
              </span>
            </div>
          </div>

          {/* Direct WhatsApp CTA Button (42px touch target) */}
          <div className="mt-4 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`WhatsApp chat about ${vehicleTitle}`}
              className="min-h-[42px] w-full rounded-xl bg-[#10B981] hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle size={15} className="shrink-0" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </article>

      <InspectionReportModal
        car={car}
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
      />
    </>
  );
}
