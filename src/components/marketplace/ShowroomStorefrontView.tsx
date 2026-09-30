import React, { useState, useMemo } from 'react';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Share2, 
  Star, 
  Car, 
  Users, 
  Info, 
  Calendar, 
  Gauge, 
  Fuel, 
  Heart,
  ArrowLeft,
  Clock,
  Mail,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Link2,
  Lock,
  Unlock,
  Sparkles,
  Copy,
  Check,
  RotateCw
} from 'lucide-react';
import { Dealer, CarListing } from '../../types';
import { Showroom3DInteractiveExperience } from './Showroom3DInteractiveExperience';
import { ShowroomSmartLinkModal } from './ShowroomSmartLinkModal';
import { ShowroomPasskeyUnlockModal } from './ShowroomPasskeyUnlockModal';

interface ShowroomStorefrontViewProps {
  dealer: Dealer;
  listings: CarListing[];
  onBack: () => void;
  onSelectVehicle: (car: CarListing) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  formatPrice: (price: number) => string;
  onUpdateDealer?: (updatedDealer: Dealer) => void;
}

export const ShowroomStorefrontView: React.FC<ShowroomStorefrontViewProps> = ({
  dealer,
  listings,
  onBack,
  onSelectVehicle,
  favorites,
  onToggleFavorite,
  formatPrice,
  onUpdateDealer,
}) => {
  const [activeDealerState, setActiveDealerState] = useState<Dealer>(dealer);
  const [activeTab, setActiveTab] = useState<'3d_showroom' | 'inventory' | 'about' | 'team'>('3d_showroom');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSmartLinkModalOpen, setIsSmartLinkModalOpen] = useState(false);
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!dealer.isPrivateLocked);

  // Pagination for inventory
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filter dealer's inventory
  const dealerListings = useMemo(() => {
    return listings.filter(l => (l.dealerId === activeDealerState.id || !l.dealerId) && !l.isSold && !l.isArchived);
  }, [listings, activeDealerState.id]);

  const totalPages = Math.ceil(dealerListings.length / itemsPerPage) || 1;
  const paginatedDealerListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return dealerListings.slice(start, start + itemsPerPage);
  }, [dealerListings, currentPage, itemsPerPage]);

  const cleanPhone = activeDealerState.whatsapp?.replace(/\D/g, '') || activeDealerState.phone?.replace(/\D/g, '') || '923001234567';
  const smartSlug = activeDealerState.smartSlug || 'AutoChoice01';
  const smartUrl = `https://bazar360.online/${smartSlug}`;
  const passkey = activeDealerState.passkey || 'Choice360';
  const waText = encodeURIComponent(`Hi ${activeDealerState.name}, I am visiting your official showroom on Bazar360 (${smartUrl}).`);

  const handleShare = () => {
    navigator.clipboard.writeText(smartUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDealerUpdate = (updated: Dealer) => {
    setActiveDealerState(updated);
    if (onUpdateDealer) {
      onUpdateDealer(updated);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Universal Smart Link & Passkey Live Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-3 sm:p-4 rounded-2xl text-white shadow-md border border-slate-800">
        
        {/* Left: Back & Smart URL */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={14} />
            <span>Showrooms</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="text-xs font-mono text-cyan-300 font-bold truncate">
              {smartUrl}
            </span>
          </div>
        </div>

        {/* Right: Quick Passkey & Smart Link Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Copy Smart Link */}
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedLink ? 'Copied' : 'Copy Smart Link'}</span>
          </button>

          {/* Passkey Tag / Edit Button */}
          <button
            type="button"
            onClick={() => setIsSmartLinkModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <KeyRound size={13} />
            <span>Passkey: {passkey}</span>
          </button>
        </div>

      </div>

      {/* 2. Showroom Hero Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-slate-950 via-[#0C152B] to-slate-950 relative overflow-hidden">
          <img
            src={activeDealerState.coverImage || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg'}
            alt={activeDealerState.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
          
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
            <Sparkles size={12} className="text-cyan-400" />
            <span>Smart Link: {activeDealerState.smartSlug || 'AutoChoice01'}</span>
          </div>
        </div>

        {/* Profile Info Strip */}
        <div className="p-6 sm:p-8 -mt-12 sm:-mt-14 relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={activeDealerState.logo || activeDealerState.logoUrl || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg'}
                alt={activeDealerState.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-slate-100 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{activeDealerState.name}</h1>
                  <ShieldCheck size={20} className="text-blue-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={13} className="shrink-0 text-slate-400" />
                  <span>{activeDealerState.location}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 font-medium">
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <Star size={13} className="fill-amber-500 text-amber-500" />
                    <span>{activeDealerState.rating || 4.9}</span>
                  </span>
                  <span>·</span>
                  <span>{((activeDealerState as any).reviewsCount || 42)} Reviews</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold">Verified Showroom</span>
                </div>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${cleanPhone}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageSquare size={15} />
                <span>WhatsApp Showroom</span>
              </a>
              {activeDealerState.phone && (
                <a
                  href={`tel:${activeDealerState.phone}`}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone size={15} />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed pt-2">
            {activeDealerState.description || 'Certified automotive dealership offering multi-point physical inspections, biometric transfer facilitation, and door-step test drives.'}
          </p>
        </div>
      </div>

      {/* 3. Sub-Tab Switcher */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        {[
          { id: '3d_showroom', label: '3D Virtual Experience', icon: RotateCw },
          { id: 'inventory', label: `Live Inventory (${dealerListings.length})`, icon: Car },
          { id: 'about', label: 'Diagnostics & Facility', icon: Info },
          { id: 'team', label: 'Sales Advisors', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                isActive ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab 1: 3D Interactive Virtual Showroom */}
      {activeTab === '3d_showroom' && (
        <Showroom3DInteractiveExperience
          dealer={activeDealerState}
          listings={listings}
          onSelectVehicle={onSelectVehicle}
          onOpenSmartLinkModal={() => setIsSmartLinkModalOpen(true)}
          formatPrice={formatPrice}
        />
      )}

      {/* 5. Tab 2: Inventory Grid with Pagination */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedDealerListings.map((car) => {
              const isFav = favorites.includes(car.id);
              const img = car.imageUrl || (car.images && car.images[0]) || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg';
              const targetPhone = car.sellerWhatsApp || activeDealerState.whatsapp || '923001234567';
              const waListingText = encodeURIComponent(
                `Hi ${activeDealerState.name}, I am interested in:\n🚗 ${car.title} (${car.year})\n💰 Price: ${formatPrice(car.price)}`
              );

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                >
                  <div 
                    className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() => onSelectVehicle(car)}
                  >
                    <img src={img} alt={car.title} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(car.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-rose-500 shadow-sm transition-colors cursor-pointer"
                    >
                      <Heart size={16} className={isFav ? 'text-rose-500 fill-rose-500' : ''} />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onSelectVehicle(car)}
                        className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer truncate"
                      >
                        {car.title}
                      </h3>
                      <div className="text-base font-black text-blue-600 mt-1 font-mono">{formatPrice(car.price)}</div>

                      <div className="grid grid-cols-3 gap-1.5 mt-3 text-xs text-slate-600">
                        <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          <span className="truncate">{car.year}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                          <Gauge size={12} className="text-slate-400" />
                          <span className="truncate">{car.mileage?.toLocaleString()} km</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                          <Fuel size={12} className="text-slate-400" />
                          <span className="truncate">{car.fuelType || 'Petrol'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectVehicle(car)}
                        className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${waListingText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Showroom Inventory Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mt-6">
              <div className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({dealerListings.length} total cars)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: Diagnostics & Facility */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">About {activeDealerState.name}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeDealerState.description || 'Certified automotive showroom offering multi-point vehicle diagnostics, computerized paperwork transfers, and door-step vehicle delivery across Pakistan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <Clock className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Working Hours</span>
                <span className="text-xs text-slate-500">Mon - Sat: 10:00 AM - 9:00 PM</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Verification Standard</span>
                <span className="text-xs text-slate-500">100% Legal Document Clearance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Certified Sales Advisors */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Certified Sales Advisors</h3>
          <p className="text-xs text-slate-500">Get in touch directly with our assigned specialists for physical inspections and test drive bookings.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Muhammad Hamza</h4>
                <p className="text-[11px] text-slate-500">Senior Vehicle Consultant</p>
              </div>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hi%20Hamza,%20I%20need%20assistance%20with%20a%20car.`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                Chat
              </a>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Tariq Khan</h4>
                <p className="text-[11px] text-slate-500">Inspection & Documentation Lead</p>
              </div>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hi%20Tariq,%20I%20have%20an%20inspection%20inquiry.`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                Chat
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Smart Link & Passkey Configuration Modal */}
      <ShowroomSmartLinkModal
        isOpen={isSmartLinkModalOpen}
        onClose={() => setIsSmartLinkModalOpen(false)}
        dealer={activeDealerState}
        onUpdateDealer={handleDealerUpdate}
      />

      {/* Passkey Verification Gate */}
      <ShowroomPasskeyUnlockModal
        isOpen={isPasskeyModalOpen}
        onClose={() => setIsPasskeyModalOpen(false)}
        dealer={activeDealerState}
        onUnlockSuccess={() => setIsUnlocked(true)}
      />

    </div>
  );
};
