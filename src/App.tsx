import React, { useState, useEffect } from 'react';
import { 
  Car, Search, Store, ShieldCheck, Phone, MessageCircle, MapPin, Gauge, 
  Fuel, Calendar, PlusCircle, User, LogOut, CheckCircle2, ChevronRight, Filter, Heart, X, Sparkles, SlidersHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CarListing, Dealer, UserProfile, NO_IMAGE_SVG } from './types';
import { dbFetchListings, dbFetchDealers, dbSaveListing, dbSaveLead, seedDatabaseIfEmpty } from './lib/dbService';
import { useAuth } from './components/AuthContext';
import { LazyImage } from './components/ui/LazyImage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'inventory' | 'dealers' | 'sell' | 'admin' | 'detail'>('home');
  const [listings, setListings] = useState<CarListing[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedListing, setSelectedListing] = useState<CarListing | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  // Load database on mount
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        await seedDatabaseIfEmpty();
        const d = await dbFetchDealers();
        const l = await dbFetchListings();
        setDealers(d);
        setListings(l);
      } catch (err) {
        console.warn('Using local fallback inventory:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const filteredListings = listings.filter(car => {
    const matchesSearch = (car.title + ' ' + car.make + ' ' + car.model).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMake = selectedMake === 'All' || car.make.toLowerCase() === selectedMake.toLowerCase();
    const matchesCity = selectedCity === 'All' || (car.city || '').toLowerCase() === selectedCity.toLowerCase() || (car.registrationCity || '').toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesMake && matchesCity;
  });

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F1F5F9] font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentTab('home'); setSelectedListing(null); }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-slate-950 font-black text-xl">
            B360
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              BAZAR360 <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 uppercase">The Auto Choice</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Pakistan's Elite Automotive Marketplace</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
          <button onClick={() => { setCurrentTab('home'); setSelectedListing(null); }} className={`hover:text-sky-400 transition-colors cursor-pointer ${currentTab === 'home' ? 'text-sky-400' : ''}`}>Home</button>
          <button onClick={() => { setCurrentTab('inventory'); setSelectedListing(null); }} className={`hover:text-sky-400 transition-colors cursor-pointer ${currentTab === 'inventory' ? 'text-sky-400' : ''}`}>Inventory</button>
          <button onClick={() => { setCurrentTab('dealers'); setSelectedListing(null); }} className={`hover:text-sky-400 transition-colors cursor-pointer ${currentTab === 'dealers' ? 'text-sky-400' : ''}`}>Showrooms</button>
          <button onClick={() => setCurrentTab('sell')} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 rounded-xl font-black shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer">
            <PlusCircle size={15} /> Post Ad Free
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b192e] border border-sky-500/20 p-6 sm:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
                  <Sparkles size={13} /> Peshawar's #1 Certified Automotive Hub
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Certified Luxury & Used Vehicles In One Showroom.
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Experience transparent buying, verified multi-point inspections, and direct dealer negotiations at Auto Choice.
                </p>

                {/* Quick Search Bar */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row gap-3 shadow-xl">
                  <div className="flex-1 flex items-center gap-2 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800">
                    <Search size={16} className="text-sky-400 shrink-0" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search make, model, or keyword..." 
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden"
                    />
                  </div>
                  <button 
                    onClick={() => setCurrentTab('inventory')}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Search Now
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Listings Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Featured Inventory</h3>
                  <p className="text-xs text-slate-400">Hand-picked verified vehicles ready for immediate delivery</p>
                </div>
                <button 
                  onClick={() => setCurrentTab('inventory')}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                >
                  View All ({listings.length}) <ChevronRight size={14} />
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.slice(0, 6).map(car => (
                    <div 
                      key={car.id}
                      onClick={() => { setSelectedListing(car); setCurrentTab('detail'); }}
                      className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all flex flex-col"
                    >
                      <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
                        <img 
                          src={car.imageUrl || (car.images && car.images[0]) || NO_IMAGE_SVG} 
                          alt={car.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {car.isVerified && (
                            <span className="flex items-center gap-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                              <ShieldCheck size={11} /> Verified
                            </span>
                          )}
                          <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {car.condition || 'Used'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-black text-white text-base group-hover:text-sky-400 transition-colors line-clamp-1">{car.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{car.year} • {car.make} {car.model}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono py-2 border-y border-slate-800">
                          <div className="flex items-center gap-1.5"><Gauge size={13} className="text-sky-400" /> {car.mileage?.toLocaleString()} km</div>
                          <div className="flex items-center gap-1.5"><Fuel size={13} className="text-sky-400" /> {car.fuelType || 'Petrol'}</div>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Asking Price</span>
                            <span className="text-lg font-black text-sky-400 font-mono">PKR {(car.price || 0).toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
                            View Details
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-white">Vehicle Inventory Explorer</h2>
                <p className="text-xs text-slate-400">Showing {filteredListings.length} verified available vehicles</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inventory..."
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                />
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-hidden"
                >
                  <option value="All">All Makes</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Audi">Audi</option>
                </select>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-hidden"
                >
                  <option value="All">All Cities</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(car => (
                <div 
                  key={car.id}
                  onClick={() => { setSelectedListing(car); setCurrentTab('detail'); }}
                  className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all flex flex-col"
                >
                  <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
                    <img 
                      src={car.imageUrl || (car.images && car.images[0]) || NO_IMAGE_SVG} 
                      alt={car.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-black text-white text-base group-hover:text-sky-400 transition-colors line-clamp-1">{car.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{car.year} • {car.make} {car.model}</p>
                    </div>
                    <div className="flex items-end justify-between pt-2 border-t border-slate-800">
                      <span className="text-lg font-black text-sky-400 font-mono">PKR {(car.price || 0).toLocaleString()}</span>
                      <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">View Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'detail' && selectedListing && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <button 
              onClick={() => setCurrentTab('inventory')}
              className="text-xs font-bold text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              ← Back to Inventory
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-6 sm:p-8 space-y-6">
              <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-950">
                <img 
                  src={selectedListing.imageUrl || (selectedListing.images && selectedListing.images[0]) || NO_IMAGE_SVG} 
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedListing.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedListing.year} • {selectedListing.make} {selectedListing.model} • {selectedListing.city || 'Peshawar'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Asking Price</span>
                  <span className="text-2xl font-black text-sky-400 font-mono">PKR {(selectedListing.price || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <div><span className="text-slate-500 block">Mileage</span><strong className="text-white">{selectedListing.mileage?.toLocaleString()} km</strong></div>
                <div><span className="text-slate-500 block">Transmission</span><strong className="text-white">{selectedListing.transmission || 'Automatic'}</strong></div>
                <div><span className="text-slate-500 block">Fuel Type</span><strong className="text-white">{selectedListing.fuelType || 'Petrol'}</strong></div>
                <div><span className="text-slate-500 block">Engine CC</span><strong className="text-white">{selectedListing.engineCC || 1800} cc</strong></div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Seller Contact & Showroom</h3>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-black text-white text-sm block">Auto Choice Official Hub — Peshawar</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-sky-400" /> Almas Car Valley, Ring Road Peshawar</span>
                  </div>
                  <a 
                    href="https://wa.me/923129085033" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'dealers' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-black text-white">Verified Showrooms Network</h2>
              <p className="text-xs text-slate-400">Browse elite certified partner dealerships across Pakistan</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers.map(dealer => (
                <div key={dealer.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-black text-lg">
                      {dealer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base">{dealer.name}</h4>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={11} className="text-sky-400" /> {dealer.location || 'Peshawar'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{dealer.description || 'Verified premier automotive showroom partner.'}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">Verified Partner</span>
                    <button 
                      onClick={() => { setSelectedDealer(dealer); setCurrentTab('detail'); }}
                      className="text-xs font-bold text-sky-400 hover:underline"
                    >
                      Visit Storefront →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'sell' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">Post Your Vehicle Free</h2>
              <p className="text-xs text-slate-400 mt-1">List your car on Pakistan's premier marketplace in seconds</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);
              const newCar: CarListing = {
                id: `car-${Date.now()}`,
                title: String(formData.get('title') || 'Toyota Car'),
                make: String(formData.get('make') || 'Toyota'),
                model: String(formData.get('model') || 'Corolla'),
                year: Number(formData.get('year') || 2023),
                price: Number(formData.get('price') || 5000000),
                mileage: Number(formData.get('mileage') || 10000),
                fuelType: 'Petrol',
                transmission: 'Automatic',
                imageUrl: String(formData.get('imageUrl') || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'),
                verified: true,
                featured: false,
                dealerId: 'auto-choice-peshawar',
                description: String(formData.get('description') || 'Clean conditioned vehicle.'),
                createdAt: new Date().toISOString(),
                tags: ['Featured'],
                specs: { color: 'White', engineSize: '1.8L', horspower: '140hp', regionalSpecs: 'Pakistan' },
                condition: 'Used',
                engineCC: 1800,
                exteriorColor: 'White',
                bodyCondition: 'Total Genuine',
                registrationCity: 'Peshawar',
                documentType: 'Original Book',
                tokenTaxPaid: true,
                images: [String(formData.get('imageUrl') || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800')],
                city: 'Peshawar'
              };

              try {
                await dbSaveListing(newCar);
                setListings(prev => [newCar, ...prev]);
                toast.success('Vehicle successfully listed!');
                setCurrentTab('inventory');
              } catch (err) {
                toast.error('Failed to post listing.');
              }
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Listing Title</label>
                <input required name="title" placeholder="e.g. Toyota Corolla Altis Grande 1.8 CVT" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Make</label>
                  <input required name="make" placeholder="Toyota" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Model</label>
                  <input required name="model" placeholder="Corolla" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Year</label>
                  <input required type="number" name="year" defaultValue={2023} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Price (PKR)</label>
                  <input required type="number" name="price" defaultValue={7500000} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Mileage (km)</label>
                  <input required type="number" name="mileage" defaultValue={15000} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Image URL</label>
                <input required name="imageUrl" defaultValue="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea name="description" rows={3} placeholder="Vehicle condition, maintenance history..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer">
                Publish Listing
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 sm:px-8 text-center text-xs text-slate-400 space-y-2">
        <p>© 2026 Bazar360.online — Auto Choice: The Right Choice. All rights reserved.</p>
        <p className="text-[10px] font-mono text-slate-500">Peshawar Flagship Automotive Hub • Almas Car Valley Ring Road</p>
      </footer>
    </div>
  );
}
