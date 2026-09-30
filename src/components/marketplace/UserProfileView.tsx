import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Car, 
  Heart, 
  MessageSquare, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Trash2, 
  Check, 
  Settings,
  Calendar,
  Gauge
} from 'lucide-react';
import { CarListing, Lead } from '../../types';

interface UserProfileViewProps {
  myListings: CarListing[];
  savedListings: CarListing[];
  leads: Lead[];
  onSelectVehicle: (car: CarListing) => void;
  onDeleteListing: (id: string) => void;
  onMarkAsSold: (id: string) => void;
  formatPrice: (price: number) => string;
  onNavigateToSell: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  myListings,
  savedListings,
  leads,
  onSelectVehicle,
  onDeleteListing,
  onMarkAsSold,
  formatPrice,
  onNavigateToSell,
}) => {
  const [activeTab, setActiveTab] = useState<'my-posts' | 'saved' | 'leads' | 'settings'>('my-posts');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
              MA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Muhammad Ahmad</h1>
                <ShieldCheck size={18} className="text-blue-600" />
              </div>
              <p className="text-xs text-slate-500">Member since 2024 • Peshawar, Pakistan</p>
              
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Phone Verified
                </span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  CNIC Verified
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToSell}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            + Post New Vehicle
          </button>

        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">My Listings</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">{myListings.length}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Saved Vehicles</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">{savedListings.length}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Buyer Inquiries</span>
            <span className="text-base font-black text-blue-600 block mt-0.5">{leads.length}</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'my-posts', label: `My Listings (${myListings.length})`, icon: Car },
          { id: 'saved', label: `Saved Shortlist (${savedListings.length})`, icon: Heart },
          { id: 'leads', label: `Buyer Inquiries (${leads.length})`, icon: MessageSquare },
          { id: 'settings', label: 'Settings & Security', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
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

      {/* 3. Tab Contents */}
      {activeTab === 'my-posts' && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Car size={36} className="mx-auto text-slate-300 mb-2" />
              <h3 className="font-bold text-sm text-slate-800">No active vehicle listings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Post a vehicle ad with zero commission in under 2 minutes.</p>
              <button
                onClick={onNavigateToSell}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                + Post Vehicle Now
              </button>
            </div>
          ) : (
            myListings.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <img
                    src={car.imageUrl || car.images?.[0]}
                    alt={car.title}
                    className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{car.title}</h3>
                    <div className="text-xs font-black text-blue-600 mt-0.5">{formatPrice(car.price)}</div>
                    <span className="text-[11px] text-slate-500 block">{car.year} • {car.location || car.registrationCity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onSelectVehicle(car)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onMarkAsSold(car.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1"
                  >
                    <Check size={12} />
                    <span>Mark Sold</span>
                  </button>
                  <button
                    onClick={() => onDeleteListing(car.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Delete Listing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Saved Shortlist Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Heart size={36} className="mx-auto text-slate-300 mb-2" />
              <h3 className="font-bold text-sm text-slate-800">Your shortlist is empty</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click the heart icon on any vehicle to save it here for comparison.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedListings.map((car) => (
                <div
                  key={car.id}
                  onClick={() => onSelectVehicle(car)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer p-3 flex gap-3"
                >
                  <img
                    src={car.imageUrl || car.images?.[0]}
                    alt={car.title}
                    className="w-24 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 truncate">{car.title}</h4>
                      <div className="text-xs font-black text-blue-600 mt-0.5">{formatPrice(car.price)}</div>
                      <span className="text-[10px] text-slate-500 block">{car.year} • {car.location || car.registrationCity}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 hover:underline">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buyer Inquiries Tab */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Recent Inquiries from Buyers</h3>
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{lead.userName} ({lead.userPhone})</span>
                  <span className="text-slate-500 text-[11px] block">{lead.vehicleTitle}</span>
                  <p className="text-slate-400 text-[10px] italic mt-0.5">"{lead.inquiryMessage}"</p>
                </div>
                <a
                  href={`https://wa.me/${lead.userPhone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
                >
                  <MessageSquare size={12} />
                  <span>WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Marketplace Identity & Notification Preferences</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold block">WhatsApp Inquiry Alerts</span>
                <span className="text-slate-500 text-[11px]">Receive buyer messages directly on your phone</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold block">Verified Seller Badge</span>
                <span className="text-slate-500 text-[11px]">Show verified checkmark on all your listings</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Active</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
