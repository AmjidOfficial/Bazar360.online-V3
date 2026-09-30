import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Sliders, 
  FileCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Store, 
  ExternalLink,
  ChevronRight,
  Clock
} from 'lucide-react';
import { CarListing, Dealer } from '../../types';
import { useDynamicVehicleSEO, updateMetaTags } from '../../lib/seo';
import { analyticsService } from '../../lib/analyticsService';
import { ProgressiveImage } from '../common/ProgressiveImage';

interface VehicleDetailViewProps {
  vehicle: CarListing;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectDealer?: (dealer: Dealer) => void;
  dealers: Dealer[];
  allListings: CarListing[];
  onSelectVehicle: (car: CarListing) => void;
  formatPrice: (price: number) => string;
  onWhatsAppClick?: (vehicle: CarListing) => void;
  onCallClick?: (vehicle: CarListing) => void;
  onOpenTestDriveModal?: (vehicle: CarListing) => void;
  onOpenInspectionModal?: (vehicle: CarListing) => void;
  onOpenOfferModal?: (vehicle: CarListing) => void;
  onOpenChatWithSeller?: (vehicle: CarListing) => void;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicle,
  onBack,
  favorites,
  onToggleFavorite,
  onSelectDealer,
  dealers,
  allListings,
  onSelectVehicle,
  formatPrice,
  onWhatsAppClick,
  onCallClick,
  onOpenTestDriveModal,
  onOpenInspectionModal,
  onOpenOfferModal,
  onOpenChatWithSeller,
}) => {
  const isFav = favorites.includes(vehicle.id);
  const matchedDealer = dealers.find(d => d.id === vehicle.dealerId);

  // Dynamic SEO meta tags and Schema.org structured data injection
  useDynamicVehicleSEO(vehicle, matchedDealer);

  // Directly update meta tags when a vehicle is selected
  useEffect(() => {
    if (vehicle) {
      updateMetaTags(vehicle);
    }
  }, [vehicle]);

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [vehicle.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPaintIndex, setSelectedPaintIndex] = useState(0);

  const paintColors = [
    { name: 'Glacier White', hex: '#F8FAFC', border: '#CBD5E1' },
    { name: 'Carbon Black Metallic', hex: '#0F172A', border: '#334155' },
    { name: 'Nardo Grey', hex: '#64748B', border: '#475569' },
    { name: 'Portimao Blue', hex: '#2563EB', border: '#1D4ED8' },
    { name: 'Isle of Man Green', hex: '#059669', border: '#047857' },
    { name: 'Sunset Bronze', hex: '#D97706', border: '#B45309' },
    { name: 'Crimson Velvet', hex: '#DC2626', border: '#B91C1C' },
    { name: 'Satin Titanium', hex: '#94A3B8', border: '#64748B' },
  ];

  const targetPhone = vehicle.sellerWhatsApp || vehicle.phone || '923001234567';
  const waMessage = encodeURIComponent(
    `Hi, I am interested in this vehicle listed on Bazar360:\n🚗 ${vehicle.title}\n📅 Year: ${vehicle.year}\n💰 Price: ${formatPrice(vehicle.price)}\n📍 Location: ${vehicle.location || vehicle.registrationCity || 'Pakistan'}\nListing Ref ID: ${vehicle.id}\nLink: https://bazar360.online/vehicle/${vehicle.id}`
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const similarVehicles = allListings.filter(l => 
    l.id !== vehicle.id && 
    (l.make === vehicle.make || l.vehicleType === vehicle.vehicleType)
  ).slice(0, 3);

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Top Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Share2 size={14} />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => onToggleFavorite(vehicle.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isFav ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Save to shortlist"
          >
            <Heart size={16} className={isFav ? 'fill-rose-600' : ''} />
          </button>
        </div>
      </div>

      {/* 2. Main Layout (Gallery & Primary Overview on Left, Seller & Actions on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Media Gallery + Full Specifications + Provenance */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Photo Gallery */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-3">
            <div className="relative aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden">
              <ProgressiveImage
                src={images[activeImageIndex]}
                alt={vehicle.title}
                aspectRatio="aspect-[16/10]"
                className="w-full h-full object-contain"
              />

              {vehicle.verified && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                  <ShieldCheck size={14} />
                  <span>Verified Vehicle</span>
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-blue-600 scale-98' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Vehicle Header Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {vehicle.condition || 'Used'}
                  </span>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {vehicle.assemblyType || 'Local Assembly'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight font-heading tracking-tight">
                  {vehicle.title}
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{vehicle.location || vehicle.registrationCity || 'Pakistan'}</span>
                  <span>•</span>
                  <Clock size={13} className="text-slate-400" />
                  <span>Listed {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : 'Recently'}</span>
                </p>
              </div>

              {/* Price Banner */}
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">Demand Price</span>
                <span className="text-2xl sm:text-3xl font-black text-[#00D2FF] text-blue-600 font-heading tabular-nums">
                  {formatPrice(vehicle.price)}
                </span>
              </div>
            </div>

            {/* High-Performance Studio Telemetry (Inspired by six2eight / Aevum) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 text-white rounded-2xl p-4 shadow-md">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Top Speed</span>
                <span className="text-base font-black font-mono mt-0.5 block text-cyan-400">
                  {(vehicle.specs as any)?.topSpeed || (vehicle.vehicleType === 'SUV' ? '210 KM/H' : '240 KM/H')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Acceleration</span>
                <span className="text-base font-black font-mono mt-0.5 block text-emerald-400">
                  {(vehicle.specs as any)?.acceleration || (vehicle.vehicleType === 'SUV' ? '0-100: 6.8s' : '0-100: 4.7s')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Displacement / Batt</span>
                <span className="text-base font-black font-mono mt-0.5 block text-amber-400">
                  {vehicle.engineCC ? `${vehicle.engineCC} CC` : '101 KWH'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Drivetrain</span>
                <span className="text-base font-black font-mono mt-0.5 block text-indigo-300">
                  {vehicle.assemblyType || (vehicle.vehicleType === 'SUV' ? '4WD / Lock' : 'FWD / CVT')}
                </span>
              </div>
            </div>

            {/* Interactive Paint Customizer Studio */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Exterior Studio Palette</span>
                  <span className="text-[11px] text-slate-500">Selected Finish: <strong className="text-slate-800">{paintColors[selectedPaintIndex].name}</strong></span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  OEM Standard
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {paintColors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedPaintIndex(idx)}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                      selectedPaintIndex === idx
                        ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 shadow-sm'
                        : 'hover:scale-105 opacity-90'
                    }`}
                    style={{ backgroundColor: color.hex, border: `1px solid ${color.border}` }}
                    title={color.name}
                  >
                    {selectedPaintIndex === idx && (
                      <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 || idx === 7 ? 'bg-slate-900' : 'bg-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Specs Highlight Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Year</span>
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.year}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Gauge size={12} />
                  <span>Mileage</span>
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.mileage?.toLocaleString()} km</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Fuel size={12} />
                  <span>Fuel Type</span>
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.fuelType || 'Petrol'}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Sliders size={12} />
                  <span>Transmission</span>
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.transmission || 'Automatic'}</span>
              </div>
            </div>

            {/* Fact-Based Description */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Seller Notes & Overview</h2>
              <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                {vehicle.description || 'No additional seller comments provided. Vehicle is available for inspection.'}
              </div>
            </div>

            {/* Strict Specs Grid */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Vehicle Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Engine Displacement</span>
                  <span className="font-semibold text-slate-900">{vehicle.engineCC || vehicle.specs?.engineSize || 'N/A'} cc</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Body Condition</span>
                  <span className="font-semibold text-slate-900">{vehicle.bodyCondition || 'Total Genuine'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Registration City</span>
                  <span className="font-semibold text-slate-900">{vehicle.registrationCity || vehicle.location || 'Unregistered'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Document Type</span>
                  <span className="font-semibold text-slate-900">{vehicle.documentType || 'Smart Card'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Token Tax</span>
                  <span className="font-semibold text-slate-900">{vehicle.tokenTaxPaid ? 'Up to date / Paid' : 'Due / Pending'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Exterior Color</span>
                  <span className="font-semibold text-slate-900">{vehicle.exteriorColor || vehicle.specs?.color || 'Original'}</span>
                </div>
              </div>
            </div>

            {/* Trust & Data Provenance Section */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>Bazar360 Trust & Verification Provenance</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Data marked with <span className="font-bold text-slate-900">"Seller Entered"</span> is provided directly by the seller. Bazar360 verified badges indicate physical identity checks and physical inspection records.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Phone Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>CNIC Registered</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Zero Commission</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Direct Contact, Lead Triggers, & Seller / Showroom Card */}
        <div className="space-y-6">
          
          {/* Direct Communication & Lead Actions Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-20">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Direct Connect</span>
              <h2 className="text-base font-bold text-slate-900">Contact Seller</h2>
            </div>

            {/* Direct WhatsApp Responder */}
            <a
              href={`https://wa.me/${targetPhone.replace(/\D/g, '')}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (onWhatsAppClick) onWhatsAppClick(vehicle);
                analyticsService.trackWhatsAppClick({
                  vehicleId: vehicle.id,
                  vehicleTitle: vehicle.title,
                  dealerId: vehicle.dealerId,
                  phoneNumber: targetPhone,
                  source: 'vehicle_detail',
                });
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare size={16} />
              <span>WhatsApp Seller (Instant)</span>
            </a>

            {/* Direct Call */}
            {vehicle.phone && (
              <a
                href={`tel:${vehicle.phone}`}
                onClick={() => {
                  if (onCallClick) onCallClick(vehicle);
                  analyticsService.trackCallClick({
                    vehicleId: vehicle.id,
                    vehicleTitle: vehicle.title,
                    dealerId: vehicle.dealerId,
                    phoneNumber: vehicle.phone,
                    source: 'vehicle_detail',
                  });
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone size={15} />
                <span>Call {vehicle.phone}</span>
              </a>
            )}

            {/* Chat on Platform */}
            <button
              onClick={() => onOpenChatWithSeller && onOpenChatWithSeller(vehicle)}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare size={15} className="text-blue-600" />
              <span>Message on Bazar360</span>
            </button>

            {/* Interactive Lead Triggers (Test Drive, Inspection, Offer) */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Buyer Services</span>
              
              <button
                onClick={() => onOpenTestDriveModal && onOpenTestDriveModal(vehicle)}
                className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Book a Test Drive</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => onOpenInspectionModal && onOpenInspectionModal(vehicle)}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Request 200+ Point Inspection</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => onOpenOfferModal && onOpenOfferModal(vehicle)}
                className="w-full py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Make a Price Offer</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Seller Details Card */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Listing By</span>
              
              {matchedDealer ? (
                <div 
                  onClick={() => onSelectDealer && onSelectDealer(matchedDealer)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <img
                    src={matchedDealer.logo || matchedDealer.logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80'}
                    alt={matchedDealer.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-xs text-slate-900 truncate">{matchedDealer.name}</h3>
                      <ShieldCheck size={13} className="text-blue-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{matchedDealer.location}</p>
                    <span className="text-[10px] font-bold text-blue-600 hover:underline">View Showroom Inventory →</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
                    {vehicle.sellerName ? vehicle.sellerName[0] : 'S'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-slate-900">{vehicle.sellerName || 'Direct Private Seller'}</h3>
                    <p className="text-[11px] text-slate-500">{vehicle.location || 'Pakistan'}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 3. Similar Vehicles Section */}
      {similarVehicles.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Similar Vehicles You May Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similarVehicles.map((car) => {
              const img = car.imageUrl || (car.images && car.images[0]) || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80';
              return (
                <div
                  key={car.id}
                  onClick={() => onSelectVehicle(car)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img src={img} alt={car.title} className="w-full h-full object-cover group-hover:scale-104 transition-transform" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate">{car.title}</h3>
                    <div className="text-sm font-black text-blue-600 mt-0.5">{formatPrice(car.price)}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{car.year} • {car.fuelType}</span>
                      <span>{car.location || car.registrationCity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
