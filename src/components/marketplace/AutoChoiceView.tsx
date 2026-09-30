import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  Store, 
  SlidersHorizontal, 
  X, 
  ShieldCheck, 
  Heart, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Gauge, 
  Fuel, 
  MapPin, 
  Scale, 
  Calculator, 
  RotateCcw,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CarListing, Dealer } from '../../types';
import { PAKISTAN_BRANDS, PAKISTAN_CITIES, CAR_MODELS, BIKE_BRANDS, BIKE_MODELS, COMMERCIAL_BRANDS, COMMERCIAL_MODELS } from '../../lib/pakistanCarData';
import { AutoChoiceLogo } from '../common/BrandLogos';
import { ProgressiveImage } from '../common/ProgressiveImage';

interface AutoChoiceViewProps {
  listings: CarListing[];
  dealers: Dealer[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectVehicle: (car: CarListing) => void;
  onSelectDealer: (dealer: Dealer) => void;
  initialCategory?: string;
  initialFilters?: any;
  formatPrice: (price: number) => string;
  onOpenCompare: () => void;
  onOpenValuation: () => void;
}

export const AutoChoiceView: React.FC<AutoChoiceViewProps> = ({
  listings,
  dealers,
  favorites,
  onToggleFavorite,
  onSelectVehicle,
  onSelectDealer,
  initialCategory = 'All',
  initialFilters = {},
  formatPrice,
  onOpenCompare,
  onOpenValuation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [make, setMake] = useState<string>(initialFilters.make || 'All');
  const [model, setModel] = useState<string>(initialFilters.model || 'All');
  const [city, setCity] = useState<string>(initialFilters.city || 'All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(initialFilters.maxPrice || 50000000);
  const [fuelType, setFuelType] = useState<string>('All');
  const [transmission, setTransmission] = useState<string>('All');
  const [condition, setCondition] = useState<string>('All');
  const [assemblyType, setAssemblyType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const categories = [
    { id: 'All', label: 'All Vehicles', icon: Car },
    { id: 'Cars', label: 'Cars', icon: Car },
    { id: 'Bikes', label: 'Bikes', icon: Bike },
    { id: 'Trucks', label: 'Commercial & Trucks', icon: Truck },
    { id: 'EV', label: 'EVs & Hybrid', icon: Zap },
    { id: 'Showrooms', label: 'Showrooms', icon: Store },
  ];

  // Derive available makes and models based on category
  const availableMakes = useMemo(() => {
    if (selectedCategory === 'Bikes') return BIKE_BRANDS;
    if (selectedCategory === 'Trucks') return COMMERCIAL_BRANDS;
    return PAKISTAN_BRANDS;
  }, [selectedCategory]);

  const availableModels = useMemo(() => {
    if (make === 'All') return [];
    if (selectedCategory === 'Bikes') return BIKE_MODELS[make] || [];
    if (selectedCategory === 'Trucks') return COMMERCIAL_MODELS[make] || [];
    return CAR_MODELS[make] || [];
  }, [make, selectedCategory]);

  const resetFilters = () => {
    setMake('All');
    setModel('All');
    setCity('All');
    setMinPrice(0);
    setMaxPrice(50000000);
    setFuelType('All');
    setTransmission('All');
    setCondition('All');
    setAssemblyType('All');
    setSortBy('latest');
    setCurrentPage(1);
  };

  // Filter listings based on active selections
  const filteredListings = useMemo(() => {
    return listings.filter((car) => {
      if (car.isSold || car.isArchived) return false;

      // Category filter
      if (selectedCategory === 'Cars') {
        if (car.vehicleType && car.vehicleType !== 'car') return false;
      } else if (selectedCategory === 'Bikes') {
        if (car.vehicleType !== 'bike' && car.vehicleType !== 'motorcycle') return false;
      } else if (selectedCategory === 'Trucks') {
        if (car.vehicleType !== 'commercial' && car.vehicleType !== 'truck') return false;
      } else if (selectedCategory === 'EV') {
        if (car.fuelType !== 'Electric' && car.fuelType !== 'Hybrid') return false;
      }

      // Make & Model
      if (make !== 'All' && car.make !== make) return false;
      if (model !== 'All' && car.model !== model) return false;

      // City
      if (city !== 'All' && car.location !== city && car.registrationCity !== city) return false;

      // Price
      if (car.price < minPrice || car.price > maxPrice) return false;

      // Fuel Type
      if (fuelType !== 'All' && car.fuelType !== fuelType) return false;

      // Transmission
      if (transmission !== 'All' && car.transmission !== transmission) return false;

      // Condition
      if (condition !== 'All' && car.condition !== condition) return false;

      // Assembly
      if (assemblyType !== 'All' && car.assemblyType !== assemblyType) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'year-desc') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'mileage-asc') return (a.mileage || 0) - (b.mileage || 0);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [
    listings,
    selectedCategory,
    make,
    model,
    city,
    minPrice,
    maxPrice,
    fuelType,
    transmission,
    condition,
    assemblyType,
    sortBy,
  ]);

  // Paginated Results
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(start, start + itemsPerPage);
  }, [filteredListings, currentPage, itemsPerPage]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header Banner & Category Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AutoChoiceLogo size="md" frame="glow" background="white" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Auto Choice Verified Catalog
              </h1>
              <p className="text-xs text-slate-500">
                Direct verified owner and showroom vehicles across Pakistan
              </p>
            </div>
          </div>

          {/* Quick Helper Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCompare}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale size={14} className="text-blue-600" />
              <span>Compare (2)</span>
            </button>
            <button
              type="button"
              onClick={onOpenValuation}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200/60"
            >
              <Calculator size={14} className="text-blue-600" />
              <span>Car Valuation</span>
            </button>
            <button
              type="button"
              onClick={() => setShowMobileFilterModal(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setMake('All');
                  setModel('All');
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon size={15} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Content Grid (Sidebar Filters + Vehicle Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-blue-600" />
              <span>Filter Inventory</span>
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>

          {/* Make Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Make</label>
            <select
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel('All');
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Makes</option>
              {availableMakes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Model</label>
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setCurrentPage(1);
              }}
              disabled={make === 'All' || availableModels.length === 0}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-40 cursor-pointer"
            >
              <option value="All">All Models</option>
              {availableModels.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              <span>Max Budget</span>
              <span className="text-blue-600 font-mono font-bold">
                {maxPrice >= 50000000 ? 'Any' : `${(maxPrice / 100000).toFixed(0)} Lakh`}
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="50000000"
              step="500000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>5 Lakh</span>
              <span>2.5 Cr</span>
              <span>5 Cr+</span>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">City</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Pakistan</option>
              {PAKISTAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Transmission & Fuel */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => {
                  setTransmission(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Fuel</label>
              <select
                value={fuelType}
                onChange={(e) => {
                  setFuelType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          {/* Assembly */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Assembly</label>
            <div className="grid grid-cols-3 gap-1">
              {['All', 'Local', 'Imported'].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAssemblyType(a);
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    assemblyType === a
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 3. Main Vehicle Grid Column */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Sort & Count Bar */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-800">
              Showing <span className="text-blue-600 font-mono font-bold">{filteredListings.length}</span> vehicles
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="latest">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="mileage-asc">Mileage: Lowest First</option>
              </select>
            </div>
          </div>

          {/* If Showrooms tab selected */}
          {selectedCategory === 'Showrooms' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dealers.map((dealer) => (
                <div
                  key={dealer.id}
                  onClick={() => onSelectDealer(dealer)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer p-4 space-y-3 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dealer.logo || dealer.logoUrl || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg'}
                      alt={dealer.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 truncate">{dealer.name}</h3>
                        <ShieldCheck size={15} className="text-blue-600 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="shrink-0 text-slate-400" />
                        <span className="truncate">{dealer.location}</span>
                      </p>
                      <div className="text-xs font-semibold text-amber-600 mt-1">
                        ★ {dealer.rating || 4.9} Verified Dealer
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {dealer.description || 'Verified automotive dealership specializing in inspected certified vehicles.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{dealer.vehiclesCount || 6} Listed Vehicles</span>
                    <span className="text-blue-600 font-bold group-hover:underline">View Showroom →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            /* Genuine Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Car size={44} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching vehicles found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, choosing a different city, or resetting your filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Vehicle Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedListings.map((car) => {
                const isFav = favorites.includes(car.id);
                const img = car.imageUrl || (car.images && car.images[0]) || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg';
                const targetPhone = car.sellerWhatsApp || car.phone || '923001234567';
                const waText = encodeURIComponent(
                  `Hi, I am interested in your vehicle listed on Bazar360:\n🚗 ${car.title}\n📅 Year: ${car.year}\n💰 Price: ${formatPrice(car.price)}\n📍 Location: ${car.location || car.registrationCity || 'Pakistan'}\nListing Ref: ${car.id}`
                );

                return (
                  <div
                    key={car.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Box with Progressive Loading */}
                    <div 
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => onSelectVehicle(car)}
                    >
                      <ProgressiveImage
                        src={img}
                        alt={car.title}
                        aspectRatio="aspect-[16/10]"
                        className="group-hover:scale-105"
                      />

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

                      {car.verified && (
                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <ShieldCheck size={12} />
                          <span>Verified</span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {car.condition || 'Inspected'} · {car.assemblyType || 'Local'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => onSelectVehicle(car)}
                          className="font-bold text-slate-900 text-sm leading-snug hover:text-blue-600 cursor-pointer line-clamp-1 transition-colors"
                        >
                          {car.title}
                        </h3>

                        <div className="text-base font-black text-blue-600 mt-1 font-mono">
                          {formatPrice(car.price)}
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-3 gap-1.5 mt-3 text-xs text-slate-600">
                          <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                            <Calendar size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{car.year}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                            <Gauge size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{car.mileage?.toLocaleString()} km</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                            <Fuel size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{car.fuelType || 'Petrol'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={12} className="shrink-0 text-slate-400" />
                            {car.location || car.registrationCity || 'Pakistan'}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {car.sellerType || 'Seller'}
                          </span>
                        </div>
                      </div>

                      {/* Contact Buttons */}
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectVehicle(car)}
                          className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          View Vehicle
                        </button>

                        <a
                          href={`https://wa.me/${targetPhone.replace(/\D/g, '')}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                          title="WhatsApp Inquiry"
                        >
                          <MessageSquare size={14} />
                        </a>

                        {car.phone && (
                          <a
                            href={`tel:${car.phone}`}
                            className="px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center transition-colors"
                            title="Call Seller"
                          >
                            <Phone size={14} />
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION FOR AUTO CHOICE */}
          {selectedCategory !== 'Showrooms' && totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mt-6">
              <div className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({filteredListings.length} total results)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(p)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
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

      </div>

      {/* Mobile Filter Sheet Modal */}
      {showMobileFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
                <button 
                  type="button"
                  onClick={() => setShowMobileFilterModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Filter options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Make</label>
                <select
                  value={make}
                  onChange={(e) => {
                    setMake(e.target.value);
                    setModel('All');
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="All">All Makes</option>
                  {availableMakes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="All">All Cities</option>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Budget (PKR)</label>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="500000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-blue-600"
                />
                <span className="text-xs text-blue-600 font-bold block mt-1">
                  {maxPrice >= 50000000 ? 'Any Budget' : `${(maxPrice / 100000).toFixed(0)} Lakh`}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
