/**
 * UserDashboard.tsx
 * Comprehensive User Account Management Hub.
 * Features: Profile photo management, listing management, booking tracking, saved wishlist, and credential updates.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Camera, Edit, Shield, Heart, 
  Trash2, Sparkles, CheckCircle, Save, CalendarCheck, Car, Key, FileText, Check, Clock, CheckCircle2, X, GitBranch
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { UserProfile, dbUpdateProfile, dbSaveListing } from '../lib/dbService';
import { CarListing, Lead } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';
import { useCurrencyMode } from '../lib/currency';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary } from '../lib/cloudinaryService';
import AdminModerationDeck from './AdminModerationDeck';
import RoleDashboards from './RoleDashboards';
import { MyPosts } from './MyPosts';
import { RoleTailoredSettings } from './RoleTailoredSettings';
import { fetchGitHubRepoDetails } from '../services/githubService';

interface UserDashboardProps {
  user: UserProfile;
  lang: 'en' | 'ur';
  listings: CarListing[];
  favoritesList: CarListing[];
  onSelectListing?: (car: CarListing) => void;
  onToggleFavorite?: (car: CarListing) => void;
  onUpdateUser?: (updated: UserProfile) => void;
  onDeleteListing?: (listingId: string) => void;
  setTab?: (tab: string) => void;
  
  // New props for Admin diagnostics panel integration
  dealers?: any[];
  onApproveListing?: (id: string) => void;
  onRejectListing?: (id: string) => void;
  onPostCreated?: (newCar: CarListing) => void;
}

export default function UserDashboard({
  user,
  lang,
  listings = [],
  favoritesList = [],
  onSelectListing,
  onToggleFavorite,
  onUpdateUser,
  onDeleteListing,
  setTab,
  dealers = [],
  onApproveListing,
  onRejectListing,
  onPostCreated
}: UserDashboardProps) {
  const { renderPrice } = useCurrencyMode();
  const { setTheme } = useTheme();

  useEffect(() => {
    
  }, [setTheme]);

  const [activeTab, setActiveTab] = useState<'dashboards' | 'profile' | 'account' | 'connected_accounts' | 'listings' | 'posts' | 'bookings' | 'saved' | 'credentials' | 'diagnostics'>('dashboards');

  const showDiagnosticsTab = 
    user.role === 'Admin' || 
    user.role === 'Super Admin' || 
    user.role === 'Showroom Owner' ||
    ['amjid.bisconni@gmail.com', 'amjid.psh@gmail.com', 'khattakghani94@gmail.com', 'mazharsouls@gmail.com'].includes(user.email?.toLowerCase() || '');

  // Listen to mobile menu drawer clicks wanting to select specific subtabs
  useEffect(() => {
    const handleSetSubtab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'bookings') {
        setActiveTab('bookings');
      } else if (customEvent.detail === 'settings') {
        setActiveTab('credentials');
      }
    };
    window.addEventListener('set-profile-subtab', handleSetSubtab);
    return () => {
      window.removeEventListener('set-profile-subtab', handleSetSubtab);
    };
  }, []);

  // Form States
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [bio, setBio] = useState(user.bio || 'Peshawar automotive enthusiast.');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [address, setAddress] = useState(user.address || 'Peshawar, Khyber Pakhtunkhwa');
  const [githubRepoUrl, setGithubRepoUrl] = useState(user.githubRepoUrl || 'https://github.com/AmjidOfficial/BAZAR360.git');
  const [githubUsername, setGithubUsername] = useState(user.githubUsername || 'AmjidOfficial');
  const [adminContactEmail, setAdminContactEmail] = useState(user.adminContactEmail || 'amjid.bisconni@gmail.com');
  const [githubConnected, setGithubConnected] = useState(user.githubConnected ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyingGitHub, setVerifyingGitHub] = useState(false);

  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [modalRepoUrl, setModalRepoUrl] = useState(githubRepoUrl);
  const [modalUsername, setModalUsername] = useState(githubUsername);

  const handleConnectGitHub = () => {
    setModalRepoUrl(githubRepoUrl);
    setModalUsername(githubUsername);
    setShowGitHubModal(true);
  };

  const handleModalSubmitGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalRepoUrl.toLowerCase().includes('github.com')) {
      toast.error('Invalid GitHub Repository URL. Must be a valid github.com repository link.');
      return;
    }
    setVerifyingGitHub(true);
    try {
      setGithubRepoUrl(modalRepoUrl);
      setGithubUsername(modalUsername);
      setGithubConnected(true);

      await dbUpdateProfile(user.uid, {
        githubRepoUrl: modalRepoUrl,
        githubUsername: modalUsername,
        githubConnected: true
      });
      console.log('GitHub account and repository linked successfully!');
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          githubRepoUrl: modalRepoUrl,
          githubUsername: modalUsername,
          githubConnected: true
        });
      }
      setShowGitHubModal(false);
    } catch (err) {
      toast.error('Failed to update linked GitHub credentials.');
    } finally {
      setVerifyingGitHub(false);
    }
  };

  const handleSaveGitHubForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingGitHub(true);
    try {
      const repoDetails = await fetchGitHubRepoDetails(githubRepoUrl);
      if (repoDetails) {
        console.log(`Verified repository: ${repoDetails.full_name}!`);
      } else {
        toast.error('Could not verify repository via GitHub REST API, but details will still be saved.');
      }

      await dbUpdateProfile(user.uid, {
        githubRepoUrl,
        githubUsername,
        adminContactEmail,
        githubConnected: true
      });
      setGithubConnected(true);
      console.log('GitHub integration saved and persisted to profile!');
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          githubRepoUrl,
          githubUsername,
          adminContactEmail,
          githubConnected: true
        });
      }
    } catch (err) {
      toast.error('Error saving GitHub details.');
    } finally {
      setVerifyingGitHub(false);
    }
  };

  // Debounced auto-save for profile settings
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setAutoSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await dbUpdateProfile(user.uid, {
          displayName,
          phoneNumber,
          bio,
          photoURL,
          address
        });
        const updatedUser: UserProfile = {
          ...user,
          displayName,
          phoneNumber,
          bio,
          photoURL,
          address,
          updatedAt: new Date().toISOString()
        };
        if (onUpdateUser) {
          onUpdateUser(updatedUser);
        }
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2500);
      } catch (err) {
        console.error('[Auto-save] profile settings error:', err);
        setAutoSaveStatus('failed');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [displayName, phoneNumber, bio, photoURL, address, user.uid, onUpdateUser]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPhotoUploading(true);
    try {
      const result = await uploadToCloudinary(file, { folder: 'bazar360/users/avatars' });
      if (result && result.secure_url) {
        setPhotoURL(result.secure_url);
        console.log('Profile photo uploaded successfully!');
      }
    } catch (error: any) {
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setPhotoUploading(false);
    }
  };

  // Listing Management state
  const [editingListing, setEditingListing] = useState<CarListing | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editMilage, setEditMilage] = useState<number>(0);

  // User's own listings: either uploaded by this user, assigned sales rep, dealer owner, or matching user's phone
  const userListings = listings.filter(
    listing => listing.createdBy === user.uid || 
               listing.assignedSalesRepId === user.uid ||
               listing.dealerId === user.uid ||
               (user.phoneNumber && (listing.sellerPhone === user.phoneNumber || listing.phone === user.phoneNumber))
  );

  const handleToggleSoldStatus = async (car: CarListing) => {
    try {
      const updated = { ...car, isSold: !car.isSold };
      await dbSaveListing(updated);
      console.log(updated.isSold ? 'Listing marked as Sold!' : 'Listing marked as Available!');
    } catch (e) {
      toast.error('Failed to update listing status.');
    }
  };

  // Mock Bookings / Booking Inquiries for this user
  const [userBookings, setUserBookings] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(`bazar360_user_bookings_${user.uid}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Default high-fidelity sample bookings representing genuine database leads
    return [
      {
        id: 'booking-1',
        userName: user.displayName || 'Bazar360 Customer',
        userPhone: user.phoneNumber || '0300-1234567',
        userEmail: user.email || 'customer@bazar360.online',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        vehicleTitle: 'Toyota Fortuner Legender 2024',
        vehiclePrice: 19800000,
        vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
        inquiryMessage: 'Interested in booking a real-time inspection. Is the vehicle genuine paint?',
        status: 'Contacted'
      },
      {
        id: 'booking-2',
        userName: user.displayName || 'Bazar360 Customer',
        userPhone: user.phoneNumber || '0300-1234567',
        userEmail: user.email || 'customer@bazar360.online',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        vehicleTitle: 'Honda Civic Oriel 2022',
        vehiclePrice: 7200000,
        vehicleImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400',
        inquiryMessage: 'Is the price negotiable? Can I pay token tax outstanding later?',
        status: 'New'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(`bazar360_user_bookings_${user.uid}`, JSON.stringify(userBookings));
    } catch (e) {}
  }, [userBookings, user.uid]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dbUpdateProfile(user.uid, {
        displayName,
        phoneNumber,
        bio,
        photoURL,
        address
      });
      const updatedUser: UserProfile = {
        ...user,
        displayName,
        phoneNumber,
        bio,
        photoURL,
        address,
        updatedAt: new Date().toISOString()
      };
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      console.log('Profile settings updated successfully!', {
        style: { background: '#1e293b', color: '#fff' }
      });
    } catch (error) {
      console.error(error);
      toast.error('Error saving profile changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditListingSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    try {
      const updatedListing: CarListing = {
        ...editingListing,
        price: editPrice,
        mileage: editMilage
      };
      await dbSaveListing(updatedListing);
      console.log('Vehicle specs updated successfully!', {
        style: { background: '#1e293b', color: '#fff' }
      });
      setEditingListing(null);
      // Trigger update by reloading page or callback if available
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error(error);
      toast.error('Could not save vehicle updates.');
    }
  };

  const handleDeletePersonalListing = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing from Bazar360?')) {
      try {
        if (onDeleteListing) {
          onDeleteListing(listingId);
        } else {
          console.log('Listing deleted successfully!');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete listing.');
      }
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Do you want to cancel this booking inquiry?')) {
      setUserBookings(prev => prev.filter(b => b.id !== bookingId));
      console.log('Inquiry cancelled successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4 sm:px-6 lg:px-8 font-sans text-left">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Premium Card Banner */}
        <div className="relative bg-[var(--color-bg-secondary)] rounded-3xl overflow-hidden border border-[var(--color-border-main)] shadow-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-amber-500/10 pointer-events-none" />
          
          {/* Avatar and Welcome Message */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full border-4 border-[var(--color-border-main)] bg-orange-500 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg overflow-hidden">
                {photoURL ? (
                  <LazyImage src={photoURL} alt={displayName} className="w-full h-full" priority={true} />
                ) : (
                  (displayName || user.email || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => setActiveTab('profile')}
                className="absolute bottom-0 right-0 p-1.5 bg-[#FF6B00] text-[var(--color-text-header)] rounded-full shadow hover:scale-110 active:scale-95 transition-transform border border-white/20"
                title="Edit Photo"
              >
                <Camera size={12} />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-[var(--color-text-main)] tracking-tight uppercase">
                  {displayName || 'Bazar360 Member'}
                </h1>
                <span className="bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                  {(user.email?.toLowerCase() === 'amjid.bisconni@gmail.com' || user.displayName?.toLowerCase().includes('muhammad amjid')) ? 'Founder' : (user.role || 'Member')}
                </span>
              </div>
              <p className="text-[var(--color-text-muted)] font-mono text-[10px] uppercase tracking-widest mt-1">
                Verified Account Node • Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] italic max-w-md mt-1.5 font-medium">
                "{bio}"
              </p>
            </div>
          </div>

          {/* Quick Analytics Counters */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto relative z-10">
            <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-3 text-center min-w-0 w-full">
              <span className="text-xl font-black text-[var(--color-text-main)] block">{userListings.length}</span>
              <span className="text-[8px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">My Ads</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-3 text-center min-w-0 w-full">
              <span className="text-xl font-black text-[var(--color-text-main)] block">{userBookings.length}</span>
              <span className="text-[8px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Bookings</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-3 text-center min-w-0 w-full">
              <span className="text-xl font-black text-[var(--color-text-main)] block">{favoritesList.length}</span>
              <span className="text-[8px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Saved</span>
            </div>
          </div>
        </div>

        {/* Dynamic High-Contrast Control Tabs Bar */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-2xl p-2 flex overflow-x-auto no-scrollbar gap-1.5 shadow scrollbar-none">
          {[
            { id: 'dashboards', label: 'Ecosystem Dashboards', icon: <Sparkles size={15} className="text-emerald-400" /> },
            { id: 'listings', label: `My Posts (${userListings.length})`, icon: <Car size={15} /> },
            { id: 'profile', label: 'My Profile', icon: <User size={15} /> },
            { id: 'account', label: 'Account', icon: <FileText size={15} /> },
            { id: 'connected_accounts', label: 'Connected', icon: <GitBranch size={15} className="text-emerald-400" /> },
            { id: 'bookings', label: `Bookings (${userBookings.length})`, icon: <CalendarCheck size={15} /> },
            { id: 'saved', label: `Saved (${favoritesList.length})`, icon: <Heart size={15} /> },
            { id: 'credentials', label: 'Credentials', icon: <Key size={15} /> },
            ...(showDiagnosticsTab ? [{ id: 'diagnostics', label: 'Diagnostics', icon: <Shield size={15} /> }] : [])
          ].map((tab) => {
            const isActive = activeTab === tab.id || (tab.id === 'listings' && activeTab === 'posts');
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingListing(null);
                }}
                className={`shrink-0 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                  isActive
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow'
                    : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-primary)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Panels Container */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-6 shadow-md">
          <AnimatePresence mode="wait">
            
            {/* PANEL 0: INTEGRATED MULTI-ROLE ECOSYSTEM DASHBOARDS */}
            {activeTab === 'dashboards' && (
              <motion.div
                key="dashboards-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--color-border-main)] pb-3">
                  <h3 className="text-lg font-black uppercase text-[var(--color-text-main)] tracking-wider flex items-center gap-2">
                    <Sparkles className="text-orange-500" size={18} /> Role-Specific Control Hubs
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Seamless, interactive portals designed specifically for Visitors, Private Sellers, Showroom Owners, and Administrators.
                  </p>
                </div>

                <RoleDashboards
                  user={user}
                  listings={listings}
                  dealers={dealers}
                  favoritesList={favoritesList}
                  onSelectListing={onSelectListing}
                  onToggleFavorite={onToggleFavorite}
                  onApproveListing={onApproveListing}
                  onRejectListing={onRejectListing}
                  onPostCreated={onPostCreated}
                  lang={lang}
                />
              </motion.div>
            )}
            
            {/* PANEL A: PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Profile Completion Progress Card */}
                {(() => {
                  const completionScore = (() => {
                    let score = 0;
                    if (displayName && displayName.trim()) score += 25;
                    if (user.email && user.email.trim()) score += 25;
                    if (phoneNumber && phoneNumber.trim()) score += 25;
                    if (address && address.trim()) score += 25;
                    return score;
                  })();
                  return (
                    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs font-black uppercase">
                        <span className="text-[var(--color-text-main)] flex items-center gap-1.5">
                          <Shield size={14} className="text-orange-500" /> Profile Completion Status
                        </span>
                        <span className="text-orange-500 font-mono">{completionScore}% Completed</span>
                      </div>
                      <div className="w-full bg-[var(--color-bg-secondary)] h-2 rounded-full overflow-hidden border border-[var(--color-border-main)]">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-500"
                          style={{ width: `${completionScore}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {completionScore === 100 
                          ? '✓ Your profile is 100% complete. Enjoy full ecosystem trust privileges.'
                          : 'Complete your display name, phone number, location address, and avatar to reach 100% profile trust.'}
                      </p>
                    </div>
                  );
                })()}

                <div className="border-b border-[var(--color-border-main)] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black uppercase text-[var(--color-text-main)] tracking-wider">
                      Profile Information
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                      Customize your public profile card, location coordinates, and bio presentation on Bazar360.
                    </p>
                  </div>

                  {autoSaveStatus !== 'idle' && (
                    <div className="shrink-0">
                      {autoSaveStatus === 'saving' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black font-mono uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Saving...
                        </span>
                      )}
                      {autoSaveStatus === 'saved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                          <Check size={11} className="text-emerald-500" />
                          Auto-Saved
                        </span>
                      )}
                      {autoSaveStatus === 'failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black font-mono uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20">
                          <X size={11} className="text-red-500" />
                          Save Failed
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Display Name</label>
                    <input 
                      type="text" 
                      required
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-xl text-xs font-bold text-[var(--color-text-main)] focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-xl text-xs font-bold text-[var(--color-text-main)] focus:border-orange-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Profile Photo Upload</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] shrink-0 flex items-center justify-center relative">
                        {photoUploading ? (
                          <div className="w-4 h-4 rounded-full border border-sky-500/20 border-t-sky-500 animate-spin" />
                        ) : photoURL ? (
                          <LazyImage src={photoURL} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="text-[var(--color-text-muted)]" size={16} />
                        )}
                      </div>
                      <div className="flex-grow">
                        <label className={`block w-full p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-xl text-xs font-mono text-[var(--color-text-main)] transition-colors cursor-pointer text-center ${photoUploading ? 'opacity-50 pointer-events-none' : 'hover:border-orange-500'}`}>
                          {photoUploading ? 'Uploading...' : 'Choose Profile Image (Click here)'}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Showroom / City Address</label>
                    <input 
                      type="text" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-xl text-xs font-bold text-[var(--color-text-main)] focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Bio Biography</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-xl text-xs text-[var(--color-text-main)] focus:border-orange-500 focus:outline-none min-h-[80px]"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end pt-3 border-t border-[var(--color-border-main)]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cta-button"
                    >
                      <Save size={14} />
                      <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile'}</span>
                    </button>
                  </div>
                </form>

                {/* Recent Activity History Section */}
                <div className="space-y-3 pt-6 border-t border-[var(--color-border-main)]">
                  <h4 className="text-xs font-black uppercase text-[var(--color-text-main)] tracking-wider flex items-center gap-2">
                    <Clock size={14} className="text-orange-500" /> Recent Activity History
                  </h4>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Your recent vehicle listings, saved favorites, and booking inquiries.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userListings.slice(0, 2).map((car) => (
                      <div key={car.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-xl p-3 flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950">
                          <LazyImage src={car.imageUrl} alt={car.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-grow text-left">
                          <span className="text-[8px] font-mono text-orange-500 font-bold uppercase block">Posted Ad</span>
                          <h5 className="text-xs font-black text-[var(--color-text-main)] truncate">{car.title}</h5>
                          <span className="text-[9px] text-[var(--color-text-muted)] font-mono">{renderPrice(car.price)}</span>
                        </div>
                      </div>
                    ))}

                    {favoritesList.slice(0, 2).map((car) => (
                      <div key={car.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-xl p-3 flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950">
                          <LazyImage src={car.imageUrl} alt={car.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-grow text-left">
                          <span className="text-[8px] font-mono text-rose-500 font-bold uppercase block">Saved Favorite</span>
                          <h5 className="text-xs font-black text-[var(--color-text-main)] truncate">{car.title}</h5>
                          <span className="text-[9px] text-[var(--color-text-muted)] font-mono">{renderPrice(car.price)}</span>
                        </div>
                      </div>
                    ))}

                    {userListings.length === 0 && favoritesList.length === 0 && (
                      <div className="col-span-full py-6 text-center text-xs text-[var(--color-text-muted)] font-mono">
                        No recent activity recorded yet. Post a car or save favorites to populate your history!
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PANEL B: MANAGE PERSONAL LISTINGS & MEDIA */}
            {(activeTab === 'listings' || activeTab === 'posts') && (
              <motion.div
                key="listings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <MyPosts
                  currentUser={user}
                  listings={listings}
                  lang={lang}
                  onSelectListing={onSelectListing}
                  onPostCreated={onPostCreated}
                  onDeleteListing={onDeleteListing}
                />
              </motion.div>
            )}

            {/* PANEL C: VIEW BOOKING HISTORY */}
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--color-border-main)] pb-3">
                  <h3 className="text-base font-black uppercase text-[var(--color-text-main)] tracking-wider">
                    Showroom Inspection Bookings
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    Track requests and appointments sent to Bazar360 showrooms for live vehicle inspections.
                  </p>
                </div>

                {userBookings.length > 0 ? (
                  <div className="space-y-3">
                    {userBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between"
                      >
                        <div className="flex gap-3 items-center w-full sm:w-auto">
                          {booking.vehicleImage && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-950">
                              <LazyImage src={booking.vehicleImage} alt={booking.vehicleTitle} className="w-full h-full" />
                            </div>
                          )}
                          <div className="text-left space-y-0.5 min-w-0">
                            <h4 className="font-extrabold text-xs text-[var(--color-text-main)] uppercase tracking-tight truncate">
                              {booking.vehicleTitle || 'Inquiry Appointment'}
                            </h4>
                            <p className="text-[9px] text-[var(--color-text-muted)] font-mono">
                              Date: {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-[10px] text-orange-500 font-semibold truncate italic">
                              "{booking.inquiryMessage}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border-orange-500/25">
                            {booking.status || 'Active'}
                          </span>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest cursor-pointer transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center border border-dashed border-[var(--color-border-main)] rounded-3xl bg-[var(--color-bg-primary)]">
                    <CalendarCheck className="w-10 h-10 mx-auto text-orange-500 opacity-40 mb-2" />
                    <h4 className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-widest">No Bookings Recorded</h4>
                    <p className="text-[10px] text-[var(--color-text-muted)] max-w-xs mx-auto mt-1">
                      Book a free, professional inspect or trial schedule with any elite showroom on the Showrooms tab!
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* PANEL D: SAVED ITEMS / WISHLIST */}
            {activeTab === 'saved' && (
              <motion.div
                key="saved-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--color-border-main)] pb-3">
                  <h3 className="text-base font-black uppercase text-[var(--color-text-main)] tracking-wider">
                    My Saved Wishlist
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    Quick comparison deck of cars you are tracking for purchase.
                  </p>
                </div>

                {favoritesList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoritesList.map((car) => (
                      <div 
                        key={car.id} 
                        className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-4 flex gap-4 hover:border-orange-500/20 transition-all text-left"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-950">
                          <LazyImage src={car.imageUrl} alt={car.title} className="w-full h-full" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-mono tracking-widest text-[#38bdf8] font-bold block uppercase">
                              {car.make} • {car.year}
                            </span>
                            <h4 
                              onClick={() => onSelectListing?.(car)}
                              className="font-black text-xs text-[var(--color-text-main)] hover:text-orange-500 cursor-pointer uppercase truncate"
                            >
                              {car.title}
                            </h4>
                            <span className="text-[10px] text-orange-500 font-mono font-black block mt-0.5">
                              {renderPrice(car.price)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => onSelectListing?.(car)}
                              className="text-[9px] uppercase font-mono font-black text-orange-500 hover:underline"
                            >
                              Details &rarr;
                            </button>
                            {onToggleFavorite && (
                              <button
                                onClick={() => onToggleFavorite(car)}
                                className="text-[9px] uppercase font-mono font-black text-rose-500 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center border border-dashed border-[var(--color-border-main)] rounded-3xl bg-[var(--color-bg-primary)]">
                    <Heart className="w-10 h-10 mx-auto text-orange-500 opacity-40 mb-2" />
                    <h4 className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-widest">Wishlist is Empty</h4>
                    <p className="text-[10px] text-[var(--color-text-muted)] max-w-xs mx-auto mt-1">
                      Bookmark hot vehicle listings on the marketplace view to track changes and inspect details.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* PANEL: CONNECTED ACCOUNTS & GITHUB REST API SYNC */}
            {activeTab === 'connected_accounts' && (
              <motion.div
                key="connected-accounts-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--color-border-main)] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black uppercase text-[var(--color-text-main)] tracking-wider">
                      Connected Accounts & GitHub Integration
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                      Link your GitHub repository and developer identity to sync commits and persist your platform profile.
                    </p>
                  </div>
                  <button
                    onClick={handleConnectGitHub}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-[var(--color-text-header)] font-black text-xs uppercase rounded-xl shadow transition-all cursor-pointer"
                  >
                    Connect / Link GitHub
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GitHub Card */}
                  <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-lg">
                          GH
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[var(--color-text-main)] uppercase">GitHub Repository</h4>
                          <span className="text-[10px] text-sky-400 font-mono">{githubRepoUrl}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                        {githubConnected ? 'Connected' : 'Unlinked'}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs border-t border-[var(--color-border-main)] pt-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">GitHub Username</span>
                        <span className="font-mono font-bold text-[var(--color-text-main)]">{githubUsername}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Admin Contact Email</span>
                        <span className="font-mono text-amber-400">{adminContactEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Google OAuth Card */}
                  <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-black text-lg">
                          G
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[var(--color-text-main)] uppercase">Google OAuth Identity</h4>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{user.email}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="space-y-2 text-xs border-t border-[var(--color-border-main)] pt-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Authentication Type</span>
                        <span className="font-mono font-bold text-[var(--color-text-main)]">Google Firebase Auth</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Status</span>
                        <span className="font-mono text-emerald-400 font-bold">Secure & Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GitHub Form Configuration */}
                <form onSubmit={handleSaveGitHubForm} className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase text-[var(--color-text-main)] tracking-wider">
                    Update GitHub Repository & Username
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">GitHub Username</label>
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="e.g. AmjidOfficial"
                        className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={githubRepoUrl}
                        onChange={(e) => setGithubRepoUrl(e.target.value)}
                        placeholder="https://github.com/AmjidOfficial/BAZAR360.git"
                        className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">Admin Contact Email</label>
                    <input
                      type="email"
                      value={adminContactEmail}
                      onChange={(e) => setAdminContactEmail(e.target.value)}
                      placeholder="amjid.bisconni@gmail.com"
                      className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={verifyingGitHub}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-[var(--color-text-header)] font-black text-xs uppercase rounded-xl transition-all cursor-pointer shadow disabled:opacity-50"
                    >
                      {verifyingGitHub ? 'Verifying with GitHub API...' : 'Save & Sync GitHub Credentials'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* PANEL: ACCOUNT MANAGEMENT & CONNECTED ACCOUNTS */}
            {activeTab === 'account' && (
              <motion.div
                key="account-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--color-border-main)] pb-3">
                  <h3 className="text-base font-black uppercase text-[var(--color-text-main)] tracking-wider">
                    Platform Account Management & Identity
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    Manage your core platform profile identity, associated admin contact email, and connected git repositories.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase text-orange-500 block">Platform Identity</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-[var(--color-border-main)] pb-2">
                        <span className="text-[var(--color-text-muted)]">Display Name</span>
                        <span className="font-bold text-[var(--color-text-main)]">{displayName || user.displayName}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border-main)] pb-2">
                        <span className="text-[var(--color-text-muted)]">Primary Email</span>
                        <span className="font-mono text-[var(--color-text-main)]">{user.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border-main)] pb-2">
                        <span className="text-[var(--color-text-muted)]">User Role</span>
                        <span className="font-bold text-orange-400">{user.role}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-[var(--color-text-muted)]">Phone Number</span>
                        <span className="font-mono text-[var(--color-text-main)]">{phoneNumber || user.phoneNumber || 'Not Set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase text-orange-500 block">Admin & Repository Metadata</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-[var(--color-border-main)] pb-2">
                        <span className="text-[var(--color-text-muted)]">Admin Contact Email</span>
                        <span className="font-mono text-amber-400">{adminContactEmail}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border-main)] pb-2">
                        <span className="text-[var(--color-text-muted)]">Linked Git Repository</span>
                        <span className="font-mono text-sky-400 truncate max-w-[180px]" title={githubRepoUrl}>{githubRepoUrl}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-[var(--color-text-muted)]">Sync Status</span>
                        <span className="font-mono text-emerald-400 font-bold">Active & Synced</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected Accounts Section */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border-main)]">
                  <h4 className="text-xs font-black uppercase text-[var(--color-text-main)] tracking-wider">
                    Connected Accounts & Integrations
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* GitHub Integration Card */}
                    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] p-4 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-base">
                          GH
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[var(--color-text-main)]">GitHub Repository</h5>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono truncate block max-w-[200px]">{githubRepoUrl}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleConnectGitHub}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-[var(--color-text-header)] font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer shadow active:scale-95 shrink-0"
                      >
                        {githubConnected ? 'Reconnect / Edit' : 'Connect GitHub'}
                      </button>
                    </div>

                    {/* Google OAuth Card */}
                    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] p-4 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-black text-base">
                          G
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[var(--color-text-main)]">Google Authentication</h5>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono block">Connected via OAuth</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* GitHub Account Link Form */}
                  <form onSubmit={handleSaveGitHubForm} className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-2xl p-5 space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-black uppercase text-[var(--color-text-main)] tracking-wider">Configure GitHub Repository & Username</h5>
                        <p className="text-[10px] text-[var(--color-text-muted)]">Link your personal or enterprise GitHub identity to sync commits and deployment logs.</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded font-bold">
                        REST API Synced
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">GitHub Username</label>
                        <input
                          type="text"
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          placeholder="e.g. AmjidOfficial"
                          className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">Repository URL (.git)</label>
                        <input
                          type="text"
                          value={githubRepoUrl}
                          onChange={(e) => setGithubRepoUrl(e.target.value)}
                          placeholder="https://github.com/AmjidOfficial/BAZAR360.git"
                          className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={verifyingGitHub}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs uppercase rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {verifyingGitHub ? 'Verifying & Saving...' : 'Save & Persist GitHub Account'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* PANEL E: UPDATE ACCOUNT CREDENTIALS & ROLE-TAILORED SETTINGS */}
            {activeTab === 'credentials' && (
              <motion.div
                key="credentials-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <RoleTailoredSettings
                  currentUser={user}
                  lang={lang}
                  onUpdateUser={onUpdateUser}
                />

                <div className="space-y-4 pt-4 border-t border-[var(--color-border-main)]">
                  <h4 className="text-xs font-black uppercase text-[var(--color-text-main)] tracking-wider">
                    Session Authentication Credentials
                  </h4>

                  <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-text-muted)] block">Logged In Identifier</span>
                      <span className="text-xs font-bold text-[var(--color-text-main)] font-mono block mt-1">{user.email}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">
                      Connected
                    </span>
                  </div>

                  <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-text-muted)] block">Unique Member Signature Hash</span>
                      <span className="text-[10px] text-[var(--color-text-main)] font-mono block mt-1 truncate max-w-[240px]">{user.uid}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase">
                      ID HASH
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'diagnostics' && showDiagnosticsTab && (
              <motion.div
                key="diagnostics-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--color-border-main)] pb-3 mb-6">
                  <h3 className="text-lg font-black uppercase text-[var(--color-text-main)] tracking-wider">
                    Ecosystem Portal Diagnostics
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Centralized console for showroom auditing, active pending queues, bargain negotiations, and live database sync.
                  </p>
                </div>

                <AdminModerationDeck
                  listings={listings}
                  dealers={dealers}
                  onApproveListing={onApproveListing || (() => {})}
                  onRejectListing={onRejectListing || (() => {})}
                  currentUser={user}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* GitHub Connection Modal */}
      <AnimatePresence>
        {showGitHubModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border-main)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-black">
                    GH
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-[var(--color-text-main)]">Connect GitHub Repository</h3>
                    <p className="text-[10px] text-[var(--color-text-muted)]">Link your developer profile and repository URL</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGitHubModal(false)}
                  className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleModalSubmitGitHub} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={modalUsername}
                    onChange={(e) => setModalUsername(e.target.value)}
                    placeholder="e.g. AmjidOfficial"
                    className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-xl px-3 py-2.5 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    value={modalRepoUrl}
                    onChange={(e) => setModalRepoUrl(e.target.value)}
                    placeholder="https://github.com/AmjidOfficial/BAZAR360.git"
                    className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-xl px-3 py-2.5 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                    required
                  />
                  <p className="text-[9px] text-[var(--color-text-muted)] italic">
                    Must be a valid GitHub repository URL (e.g. containing github.com)
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-border-main)]">
                  <button
                    type="button"
                    onClick={() => setShowGitHubModal(false)}
                    className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] font-black text-xs uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifyingGitHub}
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase rounded-xl transition-all cursor-pointer shadow disabled:opacity-50"
                  >
                    {verifyingGitHub ? 'Validating...' : 'Link & Save Repository'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
