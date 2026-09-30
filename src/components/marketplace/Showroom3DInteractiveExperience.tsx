import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Eye, 
  Sun, 
  Moon, 
  Flame, 
  ShieldCheck, 
  Gauge, 
  Calendar, 
  Fuel, 
  MapPin, 
  KeyRound, 
  Globe, 
  Share2, 
  Phone, 
  MessageSquare,
  Wrench,
  Award,
  Layers
} from 'lucide-react';
import { Dealer, CarListing } from '../../types';

interface Showroom3DInteractiveExperienceProps {
  dealer: Dealer;
  listings: CarListing[];
  onSelectVehicle: (car: CarListing) => void;
  onOpenSmartLinkModal: () => void;
  formatPrice: (price: number) => string;
}

export const Showroom3DInteractiveExperience: React.FC<Showroom3DInteractiveExperienceProps> = ({
  dealer,
  listings,
  onSelectVehicle,
  onOpenSmartLinkModal,
  formatPrice,
}) => {
  // Studio lighting themes
  const [lightingMode, setLightingMode] = useState<'midnight' | 'studio' | 'sunset'>('midnight');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [activeZone, setActiveZone] = useState<'turntable' | 'diagnostics' | 'lounge'>('turntable');

  // Featured flagship car for the 3D turntable
  const dealerListings = listings.filter(l => l.dealerId === dealer.id || !l.dealerId);
  const flagshipCar = dealerListings[0] || listings[0];

  const handleManualRotate = (delta: number) => {
    setRotationAngle(prev => (prev + delta + 360) % 360);
  };

  const getLightingStyles = () => {
    switch (lightingMode) {
      case 'studio':
        return {
          bg: 'from-slate-800 via-slate-900 to-slate-950',
          ambient: 'bg-white/15',
          accent: 'text-blue-400',
          label: 'Clean Daylight Studio',
        };
      case 'sunset':
        return {
          bg: 'from-amber-950 via-slate-950 to-slate-950',
          ambient: 'bg-amber-500/15',
          accent: 'text-amber-400',
          label: 'Sunset Bronze Glow',
        };
      case 'midnight':
      default:
        return {
          bg: 'from-[#070B14] via-[#0B1224] to-[#050810]',
          ambient: 'bg-cyan-500/15',
          accent: 'text-cyan-400',
          label: 'Midnight Obsidian 3D',
        };
    }
  };

  const currentLight = getLightingStyles();

  return (
    <section className={`relative w-full rounded-3xl bg-gradient-to-b ${currentLight.bg} border border-slate-800 p-5 sm:p-7 text-white shadow-2xl overflow-hidden transition-colors duration-500`}>
      {/* 3D Ambient Volumetric Lights */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[350px] ${currentLight.ambient} rounded-full blur-[120px] pointer-events-none transition-all duration-700`} />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
            <Sparkles size={14} className="animate-pulse" />
            <span>3D Interactive Virtual Showroom</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{dealer.name}</span>
            <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
              bazar360.online/{dealer.smartSlug || 'AutoChoice01'}
            </span>
          </h2>
        </div>

        {/* Smart Link & Studio Lighting Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Studio Light Switcher */}
          <div className="flex items-center bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setLightingMode('midnight')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${lightingMode === 'midnight' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Midnight Obsidian Light"
            >
              <Moon size={14} />
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('studio')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${lightingMode === 'studio' ? 'bg-white text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Daylight Studio Light"
            >
              <Sun size={14} />
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('sunset')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${lightingMode === 'sunset' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Sunset Bronze Light"
            >
              <Flame size={14} />
            </button>
          </div>

          {/* Showroom Passkey & Smart Link Button */}
          <button
            type="button"
            onClick={onOpenSmartLinkModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <KeyRound size={13} />
            <span>Smart Link & Passkey</span>
          </button>
        </div>
      </div>

      {/* Zone Switcher */}
      <div className="relative z-10 flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'turntable', label: '360° Flagship Turntable', icon: RotateCw },
          { id: 'diagnostics', label: '200-Point Inspection Bay', icon: Wrench },
          { id: 'lounge', label: 'VIP Lounge & Advisors', icon: Award },
        ].map((zone) => {
          const Icon = zone.icon;
          const isSelected = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => setActiveZone(zone.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{zone.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Turntable / Interactive Center Stage */}
      {activeZone === 'turntable' && flagshipCar && (
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left / Center 3D Turntable Canvas Stage */}
          <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-4 group">
            
            {/* 3D Floor Grid Projection */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Turntable Pedestal Circle */}
            <div className="absolute bottom-6 w-3/4 aspect-[3/1] rounded-full border border-cyan-500/30 bg-cyan-500/5 blur-[1px] shadow-[0_0_50px_rgba(0,210,255,0.2)] pointer-events-none" />

            {/* Vehicle Main Dynamic Image */}
            <img
              src={flagshipCar.imageUrl || (flagshipCar.images && flagshipCar.images[0]) || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg'}
              alt={flagshipCar.title}
              className="relative z-10 w-full h-full object-contain max-h-[360px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] transition-all duration-300"
              style={{
                transform: `rotateY(${rotationAngle * 0.15}deg) scale(${1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.03})`,
              }}
            />

            {/* Interactive 360 Rotation Controls */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
              <button
                type="button"
                onClick={() => handleManualRotate(-45)}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Rotate Left"
              >
                <RotateCw size={15} className="-scale-x-100" />
              </button>

              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>360° Studio Angle: {rotationAngle}°</span>
              </div>

              <button
                type="button"
                onClick={() => handleManualRotate(45)}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Rotate Right"
              >
                <RotateCw size={15} />
              </button>
            </div>

            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
              <span className="bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                3D Showcase
              </span>
              <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-md border border-white/15 font-mono">
                {flagshipCar.year}
              </span>
            </div>
          </div>

          {/* Right Live Spec HUD */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                {flagshipCar.make} · {flagshipCar.condition || 'Inspected'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                {flagshipCar.title}
              </h3>
              <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
                {formatPrice(flagshipCar.price)}
              </div>
            </div>

            {/* Spec Meters */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Gauge size={14} className="text-blue-400" />
                  <span>Verified Mileage</span>
                </span>
                <span className="font-bold text-white font-mono">{flagshipCar.mileage?.toLocaleString()} km</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Fuel size={14} className="text-amber-400" />
                  <span>Fuel / Engine</span>
                </span>
                <span className="font-bold text-white font-mono">{flagshipCar.fuelType || 'Petrol'}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Excise & CPLC</span>
                </span>
                <span className="font-bold text-emerald-400">100% Cleared</span>
              </div>
            </div>

            {/* View Full Vehicle CTA */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onSelectVehicle(flagshipCar)}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-98"
              >
                <span>Inspect Full Vehicle Details</span>
                <Eye size={15} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Diagnostics Bay Zone */}
      {activeZone === 'diagnostics' && (
        <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 relative">
            <img
              src="/src/assets/images/inspection_diagnostic_bay_1790660979743.jpg"
              alt="Diagnostics Bay"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Hydraulic Lift & Computer Scanner Bay</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">In-House Quality Assurance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every car parked in our showroom undergoes a certified 200-point physical scan covering paint thickness, engine compression, chassis integrity, and digital OBD-II diagnostic fault scans.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-emerald-400 font-bold block">✓ Paint Depth Scan</span>
                <span className="text-[10px] text-slate-400">Total genuine verified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-emerald-400 font-bold block">✓ OBD Diagnostic</span>
                <span className="text-[10px] text-slate-400">Zero check engine faults</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIP Lounge Zone */}
      {activeZone === 'lounge' && (
        <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 relative">
            <img
              src="/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg"
              alt="VIP Lounge"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 text-xs font-bold text-white">
              Executive Consultation Suite
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Direct Executive Access</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enjoy complimentary espresso, private biometric document processing, and transparent pricing negotiations with certified showroom principals.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${dealer.whatsapp?.replace(/\D/g, '') || '923159085086'}?text=Hi%20${dealer.name},%20I%20would%20like%20to%20book%20a%20VIP%20Showroom%20Visit.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare size={14} />
                <span>Book VIP Visit</span>
              </a>
              {dealer.phone && (
                <a
                  href={`tel:${dealer.phone}`}
                  className="px-3.5 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone size={14} />
                  <span>Call Direct</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
