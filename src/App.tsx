import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from './components/marketplace/Navbar';
import { SidebarNav } from './components/marketplace/SidebarNav';
import { MobileNav } from './components/marketplace/MobileNav';
import { MobileDrawer } from './components/marketplace/MobileDrawer';

import { HomeFeedView } from './components/marketplace/HomeFeedView';
import { AutoChoiceView } from './components/marketplace/AutoChoiceView';
import { VehicleDetailView } from './components/marketplace/VehicleDetailView';
import { AISellVehicleView } from './components/marketplace/AISellVehicleView';
import { SellerCrmView } from './components/marketplace/SellerCrmView';
import { ShowroomStorefrontView } from './components/marketplace/ShowroomStorefrontView';
import { MessagingView } from './components/marketplace/MessagingView';
import { NotificationsView } from './components/marketplace/NotificationsView';
import { UserProfileView } from './components/marketplace/UserProfileView';
import { VehicleHealthFleetHub } from './components/marketplace/VehicleHealthFleetHub';
import { FinancingTradeInView } from './components/marketplace/FinancingTradeInView';
import { AboutShowroomView } from './components/marketplace/AboutShowroomView';
import { ContactShowroomView } from './components/marketplace/ContactShowroomView';

import { VehicleCompareModal } from './components/marketplace/VehicleCompareModal';
import { VehicleValuationModal } from './components/marketplace/VehicleValuationModal';
import { LeadActionModals } from './components/marketplace/LeadActionModals';
import RoleDashboards from './components/RoleDashboards';
import ShowroomPortalLoginModal from './components/ShowroomPortalLoginModal';

import { useAuth } from './components/AuthContext';
import { CarListing, Dealer, Lead } from './types';
import { INITIAL_DEALERS, INITIAL_LISTINGS } from './data';
import { 
  dbFetchListings, 
  dbFetchDealers, 
  dbSubmitLead, 
  dbUpdateLeadStatus, 
  dbSaveListing, 
  dbDeleteListing,
  dbUpdateDealer
} from './lib/dbService';
import { analyticsService } from './lib/analyticsService';

export function App() {
  console.log('[BAZAR360] App component mounted cleanly without dynamic import dynamic suspension.');

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
  const [listings, setListings] = useState<CarListing[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Favorites / Shortlist
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bazar360_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const { currentUser } = useAuth();
  const [isShowroomLoginModalOpen, setIsShowroomLoginModalOpen] = useState(false);
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

  // Fetch Firestore Data on Mount
  useEffect(() => {
    dbFetchListings().then((fetched) => {
      setListings(fetched || []);
    });
    dbFetchDealers().then((fetched) => {
      setDealers(fetched || []);
      
      if (fetched && fetched.length > 0) {
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

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isCurrentlySaved = prev.includes(id);
      const updated = isCurrentlySaved ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('bazar360_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage sync skipped', e);
      }

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

  const formatPrice = (price: number): string => {
    if (!price || isNaN(price)) return 'Price on Call';

    if (currencyMode === 'USD') {
      const usdPrice = Math.round(price / 278);
      return `$${usdPrice.toLocaleString()}`;
    }

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

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab !== 'vehicle-detail') setSelectedVehicle(null);
    if (tab !== 'showroom-detail') setSelectedDealer(null);
    try {
      const url = tab === 'home' ? window.location.pathname : `?tab=${tab}`;
      window.history.pushState({ tab }, '', url);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (car: CarListing) => {
    setSelectedVehicle(car);
    setCurrentTab('vehicle-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
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
      console.warn('[CRM] Lead saved locally:', err);
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

  const getSeoMetadata = () => {
    if (currentTab === 'vehicle-detail' && selectedVehicle) {
      const priceStr = formatPrice(selectedVehicle.price);
      return {
        title: `${selectedVehicle.year} ${selectedVehicle.title} for Sale in ${selectedVehicle.location || selectedVehicle.registrationCity || 'Pakistan'} | Bazar360`,
        description: `Verified ${selectedVehicle.year} ${selectedVehicle.title} available on Bazar360. Price: ${priceStr}, Mileage: ${selectedVehicle.mileage?.toLocaleString()} km.`,
        ogImage: selectedVehicle.imageUrl || (selectedVehicle.images && selectedVehicle.images[0]) || 'https://bazar360.online/og-default.jpg',
        url: `https://bazar360.online/vehicle/${selectedVehicle.id}`,
      };
    }

    if (currentTab === 'showroom-detail' && selectedDealer) {
      return {
        title: `${selectedDealer.name} - Official 3D Virtual Showroom | Bazar360`,
        description: `Visit ${selectedDealer.name} on Bazar360 (${selectedDealer.customSmartUrl || 'bazar360.online/' + selectedDealer.smartSlug}). Explore verified cars.`,
        ogImage: selectedDealer.logo || selectedDealer.coverImage || 'https://bazar360.online/og-default.jpg',
        url: `https://bazar360.online/${selectedDealer.smartSlug || selectedDealer.id}`,
      };
    }

    return {
      title: 'BAZAR360 — Pakistan’s Premier Automotive Marketplace & 3D Showroom Platform',
      description: 'Buy and sell inspected cars, jeeps, and luxury vehicles directly. Zero commission, 200-point verified diagnostics.',
      ogImage: 'https://bazar360.online/og-default.jpg',
      url: 'https://bazar360.online',
    };
  };

  const seo = getSeoMetadata();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1326] text-slate-900 dark:text-[#DAE2FD] font-sans flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.url} />
        <meta property="og:site_name" content="Bazar360" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:url" content={seo.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.ogImage} />
      </Helmet>

      {/* Header Navbar */}
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
        onOpenShowroomLogin={() => setIsShowroomLoginModalOpen(true)}
      />

      {/* Main Container */}
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

        {/* Center Content View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
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

            {(currentTab === 'showroom-studio' || currentTab === 'dashboard' || currentTab === 'dashboards' || currentTab === 'marketing') && (
              <RoleDashboards
                user={currentUser || {
                  uid: 'showroom-owner-demo',
                  email: 'owner@autochoice.bazar360.online',
                  displayName: 'Auto Choice Peshawar HQ',
                  role: 'Showroom Owner',
                  associatedShowroomId: 'auto-choice-peshawar',
                  dealerId: 'auto-choice-peshawar',
                  city: 'Peshawar',
                  status: 'Active',
                  phoneNumber: '03008593636',
                  createdAt: new Date().toISOString(),
                  lastLogin: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }}
                listings={listings}
                dealers={dealers}
                favoritesList={listings.filter((l) => favorites.includes(l.id))}
                onSelectListing={handleSelectVehicle}
                onToggleFavorite={(car) => handleToggleFavorite(car.id)}
                onPostCreated={handlePublishListing}
                setTab={handleSelectTab}
              />
            )}
          </div>
        </main>

      </div>

      {/* Mobile Nav */}
      {currentTab !== 'vehicle-detail' && (
        <MobileNav
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          unreadMessagesCount={2}
        />
      )}

      {/* Mobile Drawer */}
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
        onOpenShowroomLogin={() => {
          setIsMobileDrawerOpen(false);
          setIsShowroomLoginModalOpen(true);
        }}
      />

      {/* Modals */}
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

      <ShowroomPortalLoginModal
        isOpen={isShowroomLoginModalOpen}
        onClose={() => setIsShowroomLoginModalOpen(false)}
        onSuccess={() => {
          setIsShowroomLoginModalOpen(false);
          handleSelectTab('showroom-studio');
        }}
      />

    </div>
  );
}

export default App;

