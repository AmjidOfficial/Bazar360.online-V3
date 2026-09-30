import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/marketplace/Navbar';
import { SidebarNav } from './components/marketplace/SidebarNav';
import { MobileNav } from './components/marketplace/MobileNav';
import { MobileDrawer } from './components/marketplace/MobileDrawer';
import { HomeFeedSkeleton, AutoChoiceSkeleton } from './components/common/ViewSkeletons';

import { HomeFeedView } from './components/marketplace/HomeFeedView';
import { AutoChoiceView } from './components/marketplace/AutoChoiceView';
import { VehicleDetailView } from './components/marketplace/VehicleDetailView';

// Granular chunk loader with automatic error logging and fallback diagnostics
function safeLazy<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) {
  return React.lazy(() => {
    console.log(`[BAZAR360 Lazy] Fetching module chunk for <${componentName} />...`);
    return importFn()
      .then((module) => {
        console.log(`[BAZAR360 Lazy] ✅ Module <${componentName} /> loaded successfully.`);
        return module;
      })
      .catch((error) => {
        console.error(`[BAZAR360 Lazy] ❌ Error loading chunk for <${componentName} />:`, error);
        throw error;
      });
  });
}

// Lazy loaded auxiliary views & tools for optimal background chunk loading
const AISellVehicleView = safeLazy(() => import('./components/marketplace/AISellVehicleView').then(m => ({ default: m.AISellVehicleView })), 'AISellVehicleView');
const SellerCrmView = safeLazy(() => import('./components/marketplace/SellerCrmView').then(m => ({ default: m.SellerCrmView })), 'SellerCrmView');
const ShowroomStorefrontView = safeLazy(() => import('./components/marketplace/ShowroomStorefrontView').then(m => ({ default: m.ShowroomStorefrontView })), 'ShowroomStorefrontView');
const MessagingView = safeLazy(() => import('./components/marketplace/MessagingView').then(m => ({ default: m.MessagingView })), 'MessagingView');
const NotificationsView = safeLazy(() => import('./components/marketplace/NotificationsView').then(m => ({ default: m.NotificationsView })), 'NotificationsView');
const UserProfileView = safeLazy(() => import('./components/marketplace/UserProfileView').then(m => ({ default: m.UserProfileView })), 'UserProfileView');
const VehicleHealthFleetHub = safeLazy(() => import('./components/marketplace/VehicleHealthFleetHub').then(m => ({ default: m.VehicleHealthFleetHub })), 'VehicleHealthFleetHub');
const FinancingTradeInView = safeLazy(() => import('./components/marketplace/FinancingTradeInView').then(m => ({ default: m.FinancingTradeInView })), 'FinancingTradeInView');
const AboutShowroomView = safeLazy(() => import('./components/marketplace/AboutShowroomView').then(m => ({ default: m.AboutShowroomView })), 'AboutShowroomView');
const ContactShowroomView = safeLazy(() => import('./components/marketplace/ContactShowroomView').then(m => ({ default: m.ContactShowroomView })), 'ContactShowroomView');

// Lazy loaded overlay modals
const VehicleCompareModal = safeLazy(() => import('./components/marketplace/VehicleCompareModal').then(m => ({ default: m.VehicleCompareModal })), 'VehicleCompareModal');
const VehicleValuationModal = safeLazy(() => import('./components/marketplace/VehicleValuationModal').then(m => ({ default: m.VehicleValuationModal })), 'VehicleValuationModal');
const LeadActionModals = safeLazy(() => import('./components/marketplace/LeadActionModals').then(m => ({ default: m.LeadActionModals })), 'LeadActionModals');

import { CarListing, Dealer, Lead } from './types';
import { INITIAL_DEALERS, INITIAL_LISTINGS } from './data';
import { 
  dbFetchListings, 
  dbFetchDealers, 
  dbFetchLeads, 
  dbSubmitLead, 
  dbUpdateLeadStatus, 
  dbSaveListing, 
  dbDeleteListing,
  dbUpdateDealer
} from './lib/dbService';
import { analyticsService } from './lib/analyticsService';

export function App() {
  console.log('[BAZAR360] 4. App component initializing in React lifecycle...');

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam;
    }
    return 'home';
  });
  const [selectedVehicle, setSelectedVehicle] = useState<CarListing | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [autoChoiceCategory, setAutoChoiceCategory] = useState<string>('All');
  const [autoChoiceFilters, setAutoChoiceFilters] = useState<any>({});

  // Global Search & City
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Currency
  const [currencyMode, setCurrencyMode] = useState<'PKR' | 'USD'>('PKR');

  // Data Collections
  const [listings, setListings] = useState<CarListing[]>(INITIAL_LISTINGS);
  const [dealers, setDealers] = useState<Dealer[]>(INITIAL_DEALERS);
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'lead-1',
      userName: 'Kamran Ali',
      userPhone: '03009876543',
      userEmail: 'kamran@example.com',
      vehicleId: 'listing-fortuner-legender-2023',
      vehicleTitle: 'Toyota Fortuner Legender 2.8 4x4',
      vehiclePrice: 19850000,
      inquiryMessage: 'Interested in physical inspection and document verification.',
      inquiryDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'New',
    },
    {
      id: 'lead-2',
      userName: 'Zubair Shah',
      userPhone: '03215554321',
      userEmail: 'zubair@example.com',
      vehicleId: 'listing-civic-rs-2022',
      vehicleTitle: 'Honda Civic RS 1.5 Turbo LL-CVT',
      vehiclePrice: 9250000,
      inquiryMessage: 'Test drive scheduled for tomorrow morning.',
      inquiryDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
    },
  ]);

  // Favorites / Shortlist
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bazar360_favorites');
      return saved ? JSON.parse(saved) : ['listing-fortuner-legender-2023'];
    } catch {
      return ['listing-fortuner-legender-2023'];
    }
  });

  // Modals & Drawers
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [leadActionModal, setLeadActionModal] = useState<{
    isOpen: boolean;
    type: 'test-drive' | 'inspection' | 'offer';
    vehicle: CarListing | null;
  }>({
    isOpen: false,
    type: 'test-drive',
    vehicle: null,
  });

  // Fetch Firestore Data on Mount (with graceful fallback)
  useEffect(() => {
    dbFetchListings().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setListings(fetched);
      }
    });
    dbFetchDealers().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setDealers(fetched);
        
        // Smart Link URL Resolution (e.g., /AutoChoice01 or #AutoChoice01)
        const currentPath = window.location.pathname.replace(/^\//, '').trim();
        const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
        const targetSlug = currentPath || currentHash;

        if (targetSlug && targetSlug !== 'home' && targetSlug !== 'explore' && targetSlug !== 'sell') {
          const matched = fetched.find(
            (d) =>
              (d.smartSlug && d.smartSlug.toLowerCase() === targetSlug.toLowerCase()) ||
              d.id.toLowerCase() === targetSlug.toLowerCase()
          );
          if (matched) {
            setSelectedDealer(matched);
            setCurrentTab('showroom-detail');
          }
        }
      }
    });
    // Popstate listener to handle browser back/forward and URL tabs
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setCurrentTab(tabParam);
      } else {
        setCurrentTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync Favorites to LocalStorage & Track Save Interaction
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isCurrentlySaved = prev.includes(id);
      const updated = isCurrentlySaved ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('bazar360_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage sync skipped', e);
      }

      // Track Save Vehicle engagement metric
      const targetListing = listings.find((l) => l.id === id);
      analyticsService.trackSaveVehicle({
        vehicleId: id,
        vehicleTitle: targetListing?.title,
        isSaved: !isCurrentlySaved,
        price: targetListing?.price,
        dealerId: targetListing?.dealerId,
      });

      return updated;
    });
  };

  // Tracking callbacks for WhatsApp and Phone Call actions
  const handleTrackWhatsApp = (vehicle?: CarListing, source: 'vehicle_detail' | 'home_feed' | 'auto_choice' | 'showroom' = 'vehicle_detail') => {
    analyticsService.trackWhatsAppClick({
      vehicleId: vehicle?.id,
      vehicleTitle: vehicle?.title,
      dealerId: vehicle?.dealerId,
      phoneNumber: vehicle?.sellerWhatsApp || vehicle?.phone,
      source,
    });
  };

  const handleTrackCall = (vehicle?: CarListing, source: 'vehicle_detail' | 'home_feed' | 'auto_choice' | 'showroom' = 'vehicle_detail') => {
    analyticsService.trackCallClick({
      vehicleId: vehicle?.id,
      vehicleTitle: vehicle?.title,
      dealerId: vehicle?.dealerId,
      phoneNumber: vehicle?.phone || vehicle?.sellerPhone,
      source,
    });
  };

  // Currency Formatter
  const formatPrice = (price: number): string => {
    if (!price || isNaN(price)) return 'Price on Call';

    if (currencyMode === 'USD') {
      const usdPrice = Math.round(price / 278);
      return `$${usdPrice.toLocaleString()}`;
    }

    // PKR Lakh & Crore formatting
    if (price >= 10000000) {
      const crore = price / 10000000;
      return `PKR ${crore.toFixed(2)} Crore`;
    }
    if (price >= 100000) {
      const lakh = price / 100000;
      return `PKR ${lakh.toFixed(2)} Lakh`;
    }
    return `PKR ${price.toLocaleString()}`;
  };

  // Nav Handlers
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab !== 'vehicle-detail') setSelectedVehicle(null);
    if (tab !== 'showroom-detail') setSelectedDealer(null);
    try {
      const url = tab === 'home' ? window.location.pathname : `?tab=${tab}`;
      window.history.pushState({ tab }, '', url);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (car: CarListing) => {
    setSelectedVehicle(car);
    setCurrentTab('vehicle-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track vehicle view engagement metric
    analyticsService.trackVehicleView({
      vehicleId: car.id,
      vehicleTitle: car.title,
      price: car.price,
      make: car.make,
      model: car.model,
      dealerId: car.dealerId,
    });
  };

  const handleSelectDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setCurrentTab('showroom-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAutoChoice = (category = 'All', filters = {}) => {
    setAutoChoiceCategory(category);
    setAutoChoiceFilters(filters);
    setCurrentTab('auto-choice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lead Handlers with Firestore Persistence
  const handleAddNewLead = async (newLead: Partial<Lead>) => {
    const localId = newLead.id || `lead-${Date.now()}`;
    const completeLead: Lead = {
      id: localId,
      userName: newLead.userName || 'Anonymous Buyer',
      userPhone: newLead.userPhone || '03000000000',
      userEmail: newLead.userEmail || '',
      vehicleId: newLead.vehicleId || '',
      vehicleTitle: newLead.vehicleTitle || 'Vehicle Inquiry',
      vehiclePrice: newLead.vehiclePrice || 0,
      inquiryMessage: newLead.inquiryMessage || 'Customer submitted inquiry.',
      inquiryDate: newLead.inquiryDate || new Date().toISOString(),
      createdAt: newLead.createdAt || new Date().toISOString(),
      status: (newLead.status as any) || 'New',
      showroomOwnerId: newLead.showroomOwnerId || 'dealer-auto-choice',
      notes: newLead.notes || '',
    };

    setLeads((prev) => [completeLead, ...prev]);

    try {
      const generatedId = await dbSubmitLead(completeLead);
      if (generatedId && generatedId !== localId) {
        setLeads((prev) => prev.map((l) => (l.id === localId ? { ...l, id: generatedId } : l)));
      }
    } catch (err) {
      console.warn('[CRM] Lead saved locally in offline mode:', err);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
    try {
      await dbUpdateLeadStatus(leadId, status);
    } catch (err) {
      console.warn('[CRM] Status updated locally:', err);
    }
  };

  // Listing Handlers with Firestore Persistence
  const handlePublishListing = async (newListing: Partial<CarListing>) => {
    const listingToSave = newListing as CarListing;
    setListings((prev) => [listingToSave, ...prev]);
    setSelectedVehicle(listingToSave);
    setCurrentTab('vehicle-detail');
    try {
      await dbSaveListing(listingToSave);
    } catch (err) {
      console.warn('[Listings] Listing saved locally:', err);
    }
  };

  const handleDeleteListing = async (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    if (selectedVehicle?.id === id) setSelectedVehicle(null);
    try {
      await dbDeleteListing(id);
    } catch (err) {
      console.warn('[Listings] Listing deleted locally:', err);
    }
  };

  const handleMarkAsSold = (id: string) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, isSold: true, status: 'Sold' } : l)));
  };

  // Showroom Smart Link & Passkey Update Handler
  const handleUpdateDealer = async (updatedDealer: Dealer) => {
    setDealers((prev) => prev.map((d) => (d.id === updatedDealer.id ? updatedDealer : d)));
    if (selectedDealer?.id === updatedDealer.id) {
      setSelectedDealer(updatedDealer);
    }
    try {
      await dbUpdateDealer(updatedDealer.id, {
        smartSlug: updatedDealer.smartSlug,
        passkey: updatedDealer.passkey,
        isPrivateLocked: updatedDealer.isPrivateLocked,
        customSmartUrl: updatedDealer.customSmartUrl,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Showrooms] Showroom settings updated locally:', err);
    }
  };

  // Filter listings by global search if search query or city is applied
  const displayedListings = listings.filter((l) => {
    if (selectedCity !== 'All' && l.location !== selectedCity && l.registrationCity !== selectedCity) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMake = l.make?.toLowerCase().includes(q);
      const matchModel = l.model?.toLowerCase().includes(q);
      const matchTitle = l.title?.toLowerCase().includes(q);
      const matchCity = l.location?.toLowerCase().includes(q) || l.registrationCity?.toLowerCase().includes(q);
      if (!matchMake && !matchModel && !matchTitle && !matchCity) return false;
    }
    return true;
  });

  // Dynamic View SEO Metadata Resolution
  const getSeoMetadata = () => {
    if (currentTab === 'vehicle-detail' && selectedVehicle) {
      const priceStr = formatPrice(selectedVehicle.price);
      return {
        title: `${selectedVehicle.year} ${selectedVehicle.title} for Sale in ${selectedVehicle.location || selectedVehicle.registrationCity || 'Pakistan'} | Bazar360`,
        description: `Verified ${selectedVehicle.year} ${selectedVehicle.title} available on Bazar360. Price: ${priceStr}, Mileage: ${selectedVehicle.mileage?.toLocaleString()} km. 200-point physical inspection and biometric transfer clearance.`,
        ogImage: selectedVehicle.imageUrl || (selectedVehicle.images && selectedVehicle.images[0]) || 'https://bazar360.online/og-default.jpg',
        url: `https://bazar360.online/vehicle/${selectedVehicle.id}`,
      };
    }

    if (currentTab === 'showroom-detail' && selectedDealer) {
      return {
        title: `${selectedDealer.name} - Official 3D Virtual Showroom | Bazar360`,
        description: `Visit ${selectedDealer.name} on Bazar360 (${selectedDealer.customSmartUrl || 'bazar360.online/' + selectedDealer.smartSlug}). Explore ${selectedDealer.vehiclesCount || 6}+ verified cars, book doorstep test drives, and view 200-point inspection reports.`,
        ogImage: selectedDealer.logo || selectedDealer.coverImage || 'https://bazar360.online/og-default.jpg',
        url: `https://bazar360.online/${selectedDealer.smartSlug || selectedDealer.id}`,
      };
    }

    if (currentTab === 'auto-choice' || currentTab === 'explore' || currentTab === 'showrooms') {
      return {
        title: 'Auto Choice Verified Inventory | Pakistan Automotive Marketplace | Bazar360',
        description: 'Browse certified cars, jeeps, and luxury SUVs from verified private sellers and certified dealerships across Pakistan with zero middlemen commission.',
        ogImage: 'https://bazar360.online/og-default.jpg',
        url: 'https://bazar360.online/explore',
      };
    }

    if (currentTab === 'sell') {
      return {
        title: 'Sell Your Car with AI Listing & Inspection | Bazar360',
        description: 'List your vehicle in under 2 minutes with AI-generated specs, instant fair-market valuation, and verified buyer inquiries across Pakistan.',
        ogImage: 'https://bazar360.online/og-default.jpg',
        url: 'https://bazar360.online/sell',
      };
    }

    return {
      title: 'BAZAR360 — Pakistan’s Premier Automotive Marketplace & 3D Showroom Platform',
      description: 'Buy and sell inspected cars, jeeps, and luxury vehicles directly. Zero commission, 200-point verified diagnostics, instant valuation, and certified showroom smart links.',
      ogImage: 'https://bazar360.online/og-default.jpg',
      url: 'https://bazar360.online',
    };
  };

  const seo = getSeoMetadata();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Dynamic SEO Head with OpenGraph & Twitter tags */}
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.url} />

        {/* OpenGraph Social Tags */}
        <meta property="og:site_name" content="Bazar360" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:url" content={seo.url} />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.ogImage} />
      </Helmet>

      {/* 1. Universal Sticky Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        favoritesCount={favorites.length}
        unreadMessagesCount={2}
        unreadNotificationsCount={2}
        currencyMode={currencyMode}
        onToggleCurrency={() => setCurrencyMode(prev => prev === 'PKR' ? 'USD' : 'PKR')}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenValuation={() => setIsValuationModalOpen(true)}
      />

      {/* 2. Main App Container (Desktop Sidebar + Center Content Canvas) */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        
        {/* Desktop Left Sidebar */}
        <SidebarNav
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          favoritesCount={favorites.length}
          unreadMessagesCount={2}
          unreadNotificationsCount={2}
          leadsCount={leads.length}
          onOpenCompare={() => setIsCompareModalOpen(true)}
          onOpenValuation={() => setIsValuationModalOpen(true)}
        />

        {/* Center Dynamic Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          
          {/* VIEW ROUTER WITH BRAND-ALIGNED SKELETON LOADERS & 3D PAGE TRANSITIONS */}
          <Suspense fallback={
            currentTab === 'home' ? <HomeFeedSkeleton /> : <AutoChoiceSkeleton />
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentTab}_${selectedVehicle?.id || ''}_${selectedDealer?.id || ''}`}
                initial={{ opacity: 0, y: 14, scale: 0.99, rotateX: 2 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1, 
                  rotateX: 0,
                  transition: { 
                    duration: 0.32, 
                    ease: [0.22, 1, 0.36, 1] 
                  } 
                }}
                exit={{ 
                  opacity: 0, 
                  y: -10, 
                  scale: 0.99, 
                  rotateX: -1.5,
                  transition: { 
                    duration: 0.2, 
                    ease: 'easeIn' 
                  } 
                }}
                className="w-full [transform-style:preserve-3d]"
              >
                {currentTab === 'home' && (
                  <HomeFeedView
                    listings={displayedListings}
                    dealers={dealers}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectVehicle={handleSelectVehicle}
                    onSelectDealer={handleSelectDealer}
                    onNavigateToAutoChoice={handleNavigateToAutoChoice}
                    formatPrice={formatPrice}
                  />
                )}

                {(currentTab === 'auto-choice' || currentTab === 'explore') && (
                  <AutoChoiceView
                    listings={displayedListings}
                    dealers={dealers}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectVehicle={handleSelectVehicle}
                    onSelectDealer={handleSelectDealer}
                    initialCategory={autoChoiceCategory}
                    initialFilters={autoChoiceFilters}
                    formatPrice={formatPrice}
                    onOpenCompare={() => setIsCompareModalOpen(true)}
                    onOpenValuation={() => setIsValuationModalOpen(true)}
                  />
                )}

                {currentTab === 'vehicle-detail' && selectedVehicle && (
                  <VehicleDetailView
                    vehicle={selectedVehicle}
                    onBack={() => handleSelectTab('auto-choice')}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectDealer={handleSelectDealer}
                    dealers={dealers}
                    allListings={listings}
                    onSelectVehicle={handleSelectVehicle}
                    formatPrice={formatPrice}
                    onWhatsAppClick={(veh) => handleTrackWhatsApp(veh, 'vehicle_detail')}
                    onCallClick={(veh) => handleTrackCall(veh, 'vehicle_detail')}
                    onOpenTestDriveModal={(veh) => setLeadActionModal({ isOpen: true, type: 'test-drive', vehicle: veh })}
                    onOpenInspectionModal={(veh) => setLeadActionModal({ isOpen: true, type: 'inspection', vehicle: veh })}
                    onOpenOfferModal={(veh) => setLeadActionModal({ isOpen: true, type: 'offer', vehicle: veh })}
                    onOpenChatWithSeller={(veh) => {
                      setSelectedVehicle(veh);
                      setCurrentTab('messages');
                    }}
                  />
                )}

                {currentTab === 'sell' && (
                  <AISellVehicleView
                    onPublishListing={handlePublishListing}
                    onCancel={() => handleSelectTab('home')}
                  />
                )}

                {(currentTab === 'crm' || currentTab === 'leads') && (
                  <SellerCrmView
                    leads={leads}
                    onUpdateLeadStatus={handleUpdateLeadStatus}
                    onAddNewLead={handleAddNewLead}
                    listings={listings}
                  />
                )}

                {currentTab === 'showroom-detail' && selectedDealer && (
                  <ShowroomStorefrontView
                    dealer={selectedDealer}
                    listings={listings}
                    onBack={() => handleSelectTab('showrooms')}
                    onSelectVehicle={handleSelectVehicle}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    formatPrice={formatPrice}
                    onUpdateDealer={handleUpdateDealer}
                  />
                )}

                {currentTab === 'showrooms' && (
                  <AutoChoiceView
                    listings={displayedListings}
                    dealers={dealers}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectVehicle={handleSelectVehicle}
                    onSelectDealer={handleSelectDealer}
                    initialCategory="Showrooms"
                    formatPrice={formatPrice}
                    onOpenCompare={() => setIsCompareModalOpen(true)}
                    onOpenValuation={() => setIsValuationModalOpen(true)}
                  />
                )}

                {currentTab === 'messages' && (
                  <MessagingView
                    listings={listings}
                    formatPrice={formatPrice}
                    initialVehicle={selectedVehicle}
                  />
                )}

                {currentTab === 'notifications' && (
                  <NotificationsView onSelectTab={handleSelectTab} />
                )}

                {(currentTab === 'saved' || currentTab === 'profile' || currentTab === 'my-posts') && (
                  <UserProfileView
                    myListings={listings.filter((l) => l.sellerType === 'Individual' || l.sellerName?.includes('Muhammad'))}
                    savedListings={listings.filter((l) => favorites.includes(l.id))}
                    leads={leads}
                    onSelectVehicle={handleSelectVehicle}
                    onDeleteListing={handleDeleteListing}
                    onMarkAsSold={handleMarkAsSold}
                    formatPrice={formatPrice}
                    onNavigateToSell={() => handleSelectTab('sell')}
                  />
                )}

                {(currentTab === 'fleet-health' || currentTab === 'diagnostics' || currentTab === 'maintenance') && (
                  <VehicleHealthFleetHub
                    listings={listings}
                    onSelectVehicle={handleSelectVehicle}
                    formatPrice={formatPrice}
                  />
                )}

                {(currentTab === 'financing' || currentTab === 'trade-in') && (
                  <FinancingTradeInView
                    listings={listings}
                    formatPrice={formatPrice}
                    onNavigateToSell={() => handleSelectTab('sell')}
                  />
                )}

                {currentTab === 'about' && (
                  <AboutShowroomView
                    dealer={dealers[0] || INITIAL_DEALERS[0]}
                    onSelectTab={handleSelectTab}
                  />
                )}

                {currentTab === 'contact' && (
                  <ContactShowroomView />
                )}
              </motion.div>
            </AnimatePresence>
          </Suspense>

        </main>

      </div>

      {/* 3. Mobile Bottom 5-Tab Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        unreadMessagesCount={2}
      />

      {/* 4. Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        favoritesCount={favorites.length}
        unreadMessagesCount={2}
        unreadNotificationsCount={2}
        leadsCount={leads.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenValuation={() => setIsValuationModalOpen(true)}
      />

      {/* 5. Tool Modals (Compare, Valuation, Buyer Leads) */}
      <VehicleCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        listings={listings}
        formatPrice={formatPrice}
        onSelectVehicle={handleSelectVehicle}
      />

      <VehicleValuationModal
        isOpen={isValuationModalOpen}
        onClose={() => setIsValuationModalOpen(false)}
        onNavigateToSell={() => {
          setIsValuationModalOpen(false);
          handleSelectTab('sell');
        }}
        formatPrice={formatPrice}
        listings={listings}
      />

      {leadActionModal.vehicle && (
        <LeadActionModals
          type={leadActionModal.type}
          isOpen={leadActionModal.isOpen}
          onClose={() => setLeadActionModal({ isOpen: false, type: 'test-drive', vehicle: null })}
          vehicle={leadActionModal.vehicle}
          onSubmitLead={handleAddNewLead}
          formatPrice={formatPrice}
        />
      )}

    </div>
  );
}
export default App;
