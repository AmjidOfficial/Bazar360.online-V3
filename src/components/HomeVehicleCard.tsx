import React, { useState } from 'react';
import { Heart, Phone, MessageCircle, ShieldCheck, Award } from 'lucide-react';
import { CarListing, Dealer } from '../types';
import { getOptimizedUrl } from '../lib/cloudinaryService';
import { InspectionReportModal } from './InspectionReportModal';
import { cinematicAudio } from '../lib/cinematicAudio';

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
  if (!Number.isFinite(value) || value <= 0) return 'Brand New';
  if (value >= 1000) return `${Math.round(value / 1000)}k km`;
  return `${value} km`;
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

  const vehicleTitle = car.title || `${car.year} ${car.make} ${car.model}`;
  const rawSellerPhone = car.sellerPhone || car.phone || (dealer && (dealer.whatsapp || dealer.phone)) || '923149198403';
  const cleanPhone = rawSellerPhone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${vehicleTitle} listed on BAZAR360 (ID: #${car.id}). Is this available?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;
  const telUrl = `tel:${cleanPhone}`;

  // Performance / Micro-Telemetry derivations
  const fuelOrBattery = car.fuelType === 'Electric' 
    ? '93 kWh Battery' 
    : (car.engineCC ? `${car.engineCC} cc` : (car.specs?.engineSize || '2.0L Turbo'));
  const powerOrSpeed = car.specs?.horspower || (car.fuelType === 'Electric' ? '522 HP' : '150 HP');
  const locationName = car.registrationCity || car.location || dealer?.location || 'Pakistan';

  return (
    <>
      <article
        onClick={() => {
          cinematicAudio.playClick();
          onSelect(car);
        }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-outline)] hover:border-[var(--color-amber-accent)]/60 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        {/* Media Container with 16:9 ratio */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-deep)]">
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
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs font-mono text-[var(--color-text-muted)]">
              Vehicle imagery loading...
            </div>
          )}

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-80" />

          {/* Top Left Glowing Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cinematicAudio.playLuxuryChime();
                setIsInspectionModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[var(--color-amber-accent)] border border-[var(--color-amber-accent)]/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md hover:bg-[var(--color-amber-accent)] hover:text-white transition-colors cursor-pointer"
              title="View 200+ Point Inspection Report"
            >
              <Award size={11} className="text-[var(--color-amber-accent)]" />
              <span>360° Certified</span>
            </button>

            {car.verified && (
              <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <ShieldCheck size={11} className="text-[var(--color-amber-accent)]" />
                <span>Showroom Verified</span>
              </span>
            )}
          </div>

          {/* Top Right Favorite Bookmark */}
          {onToggleFavorite && (
            <button
              type="button"
              aria-label={isFavorite ? 'Remove from favorites' : 'Save vehicle'}
              onClick={(e) => {
                e.stopPropagation();
                cinematicAudio.playClick();
                onToggleFavorite(car);
              }}
              className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 hover:border-[var(--color-amber-accent)]/40 shadow-md backdrop-blur-md transition-all active:scale-90 z-10 cursor-pointer"
            >
              <Heart
                size={14}
                fill={isFavorite ? 'var(--color-amber-accent)' : 'none'}
                className={isFavorite ? 'text-[var(--color-amber-accent)] scale-110 transition-transform' : 'text-white/80 hover:text-white'}
              />
            </button>
          )}

          {/* Bottom Left Floating Price Tag */}
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-[var(--color-amber-accent)] font-extrabold text-sm sm:text-base border border-[var(--color-amber-accent)]/30 shadow-lg tracking-tight z-10">
            {formatPakistaniPrice(car.price)}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-2.5 bg-[var(--color-surface)]">
          <div>
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-amber-accent)] transition-colors">
                  {car.make} {car.model} {car.variant ? `• ${car.variant}` : ''}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-mono mt-0.5">
                  {car.year} • {formatMileage(car.mileage)} • {car.fuelType || 'Petrol'}
                </p>
              </div>

              <span className="shrink-0 px-2 py-0.5 rounded-lg bg-[var(--color-bg-deep)] text-[var(--color-text-secondary)] text-[10px] font-bold uppercase tracking-wider border border-[var(--color-outline)]">
                {car.fuelType === 'Electric' ? 'EV' : (car.vehicleType || 'Sedan')}
              </span>
            </div>

            {/* Micro-Telemetry 3-Column Strip */}
            <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 mt-2.5 bg-[var(--color-bg-deep)] rounded-xl text-center border border-[var(--color-outline)] text-[var(--color-text-main)]">
              <div className="truncate">
                <span className="text-[9px] font-bold uppercase text-[var(--color-text-secondary)] block leading-tight">
                  {car.fuelType === 'Electric' ? 'BATTERY' : 'ENGINE'}
                </span>
                <span className="text-xs font-bold truncate block">
                  {fuelOrBattery}
                </span>
              </div>
              <div className="truncate border-x border-[var(--color-outline)]">
                <span className="text-[9px] font-bold uppercase text-[var(--color-text-secondary)] block leading-tight">POWER</span>
                <span className="text-xs font-bold truncate block">
                  {powerOrSpeed}
                </span>
              </div>
              <div className="truncate">
                <span className="text-[9px] font-bold uppercase text-[var(--color-text-secondary)] block leading-tight">LOCATION</span>
                <span className="text-xs font-bold truncate block">
                  {locationName}
                </span>
              </div>
            </div>
          </div>

          {/* Actions: Dual Call & WhatsApp Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={telUrl}
              onClick={(e) => e.stopPropagation()}
              className="min-h-[40px] rounded-xl bg-[var(--color-bg-deep)] hover:bg-[var(--color-surface-highest)] text-[var(--color-text-main)] border border-[var(--color-outline)] hover:border-[var(--color-amber-accent)]/30 hover:text-[var(--color-amber-accent)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Phone size={12} className="text-[var(--color-amber-accent)]" />
              <span>Call</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="min-h-[40px] rounded-xl bg-gradient-to-r from-[var(--color-amber-accent)] to-[var(--color-secondary-orange)] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-105"
            >
              <MessageCircle size={13} className="fill-white text-transparent" />
              <span>WhatsApp</span>
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
