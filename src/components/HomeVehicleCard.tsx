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
  const powerOrSpeed = car.specs?.horspower || (car.fuelType === 'Electric' ? '522 HP' : '453 HP');
  const locationName = car.registrationCity || car.location || dealer?.location || 'Pakistan';

  return (
    <>
      <article
        onClick={() => {
          cinematicAudio.playClick();
          onSelect(car);
        }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#171f33] border border-[#00d2ff]/20 hover:border-[#00d2ff]/50 shadow-xl hover:shadow-[0_12px_30px_-10px_rgba(71,214,255,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        {/* Media Container with 16:9 ratio */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0b1326]">
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
            <div className="grid h-full place-items-center text-xs font-mono text-[#859399]">
              Vehicle imagery loading...
            </div>
          )}

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171f33] via-transparent to-black/40 opacity-90" />

          {/* Top Left Glowing Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cinematicAudio.playLuxuryChime();
                setIsInspectionModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-full bg-[#0b1326]/85 backdrop-blur-md text-[#ffb95f] border border-[#ffb95f]/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md hover:bg-[#ffb95f] hover:text-[#2a1700] transition-colors cursor-pointer"
              title="View 200+ Point Inspection Report"
            >
              <Award size={12} className="text-[#ffb95f]" />
              <span>360° Certified</span>
            </button>

            {car.verified && (
              <span className="px-2.5 py-1 rounded-full bg-[#0b1326]/85 backdrop-blur-md text-[#00d2ff] border border-[#00d2ff]/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <ShieldCheck size={12} />
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
              className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#0b1326]/80 hover:bg-[#0b1326] text-white border border-white/10 hover:border-[#00d2ff]/50 shadow-md backdrop-blur-md transition-all active:scale-90 z-10 cursor-pointer"
            >
              <Heart
                size={16}
                fill={isFavorite ? '#ffb95f' : 'none'}
                className={isFavorite ? 'text-[#ffb95f] scale-110 transition-transform' : 'text-white/80 hover:text-white'}
              />
            </button>
          )}

          {/* Bottom Left Floating Price Tag */}
          <div className="absolute bottom-3 left-3 bg-[#0b1326]/90 backdrop-blur-md px-3 py-1 rounded-xl text-[#00d2ff] font-extrabold text-sm sm:text-base border border-[#00d2ff]/30 shadow-lg tracking-tight z-10 font-mono">
            {formatPakistaniPrice(car.price)}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-2.5 bg-gradient-to-b from-[#171f33] to-[#131b2e]">
          <div>
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-[#dae2fd] group-hover:text-[#00d2ff] transition-colors">
                  {car.make} {car.model} {car.variant ? `• ${car.variant}` : ''}
                </h3>
                <p className="text-xs text-[#bbc9cf] font-mono mt-0.5">
                  {car.year} • {formatMileage(car.mileage)} • {car.fuelType || 'Petrol'}
                </p>
              </div>

              <span className="shrink-0 px-2 py-0.5 rounded-lg bg-[#222a3d] text-[#00d2ff] text-[10px] font-bold uppercase tracking-wider border border-[#00d2ff]/20">
                {car.fuelType === 'Electric' ? 'EV' : (car.vehicleType || 'Sedan')}
              </span>
            </div>

            {/* Micro-Telemetry 3-Column Strip */}
            <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 mt-2.5 bg-[#0b1326]/70 rounded-xl text-center border border-[#00d2ff]/10">
              <div className="truncate">
                <span className="text-[9px] font-bold uppercase text-[#859399] block leading-tight">
                  {car.fuelType === 'Electric' ? 'BATTERY' : 'ENGINE'}
                </span>
                <span className="text-xs font-bold text-[#dae2fd] truncate block">
                  {fuelOrBattery}
                </span>
              </div>
              <div className="truncate border-x border-[#222a3d]">
                <span className="text-[9px] font-bold uppercase text-[#859399] block leading-tight">POWER</span>
                <span className="text-xs font-bold text-[#dae2fd] truncate block">
                  {powerOrSpeed}
                </span>
              </div>
              <div className="truncate">
                <span className="text-[9px] font-bold uppercase text-[#859399] block leading-tight">LOCATION</span>
                <span className="text-xs font-bold text-[#dae2fd] truncate block">
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
              className="min-h-[40px] rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] hover:text-[#00d2ff] border border-[#3c494e] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Phone size={13} className="text-[#00d2ff]" />
              <span>Call Inquiry</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="min-h-[40px] rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#47d6ff] hover:opacity-95 text-[#003543] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#00d2ff]/20 active:scale-95 cursor-pointer"
            >
              <MessageCircle size={14} className="fill-[#003543] text-transparent" />
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
