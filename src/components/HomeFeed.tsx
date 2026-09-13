import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, MapPin, Search, ShieldCheck, Store, Tag, Wrench, Phone, Sparkles } from 'lucide-react';
import { CarListing, Dealer } from '../types';
import HomeVehicleCard from './HomeVehicleCard';

interface HomeFeedProps {
  listings: CarListing[];
  dealers: Dealer[];
  onSelectListing: (car: CarListing) => void;
  onSelectDealer?: (dealerId: string) => void;
  onToggleCompare: (car: CarListing) => void;
  compareList: CarListing[];
  onToggleFavorite: (car: CarListing) => void;
  favoritesList: CarListing[];
  recentViewsList?: CarListing[];
  lang: 'en' | 'ur';
  setTab: (tab: string) => void;
  setSelectedCategory?: (category: string) => void;
  setSearchQuery?: (query: string) => void;
}

export function HomeFeed({ listings, dealers, onSelectListing, onSelectDealer, onToggleFavorite, favoritesList, setTab, setSearchQuery }: HomeFeedProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const realListings = useMemo(() => (Array.isArray(listings) ? listings : []).filter((car) => car?.id), [listings]);
  const availableListings = useMemo(() => realListings.filter((car) => car.status !== 'Sold' && !car.isSold && !car.isArchived), [realListings]);
  const realShowrooms = useMemo(() => (Array.isArray(dealers) ? dealers : []).filter((dealer) => dealer?.id && dealer?.name), [dealers]);
  const latestListings = useMemo(() => [...availableListings].sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0,8), [availableListings]);
  const verifiedListings = useMemo(() => availableListings.filter((car) => car.verified || car.approved).slice(0,4), [availableListings]);
  const heroCar = verifiedListings[0] || latestListings[0];
  const heroImage = heroCar?.primaryImage || heroCar?.imageUrl || heroCar?.images?.[0] || '';
  const featuredShowroom = realShowrooms.find((dealer) => dealer.coverImage) || realShowrooms[0];

  const galleryImages = useMemo(() => {
    const output: Array<{url:string; showroom:Dealer}> = [];
    for (const showroom of realShowrooms) {
      const media = [...(showroom.gallery || []), ...(showroom.media || []), ...(showroom.activityFeed || []).map((post) => post.imageUrl)].filter(Boolean);
      for (const url of media) {
        if (!output.some((item) => item.url === url)) output.push({ url, showroom });
        if (output.length >= 5) break;
      }
      if (output.length >= 5) break;
    }
    return output;
  }, [realShowrooms]);

  const brands = useMemo(() => {
    const counts = new Map<string,number>();
    realListings.forEach((car) => { const make=(car.make||'').trim(); if(make) counts.set(make,(counts.get(make)||0)+1); });
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8);
  }, [realListings]);

  const filteredLatest = useMemo(() => {
    if (activeCategory === 'All') return latestListings;
    return latestListings.filter((car) => {
      const text = `${car.vehicleType || ''} ${car.title || ''} ${car.model || ''} ${car.tags?.join(' ') || ''}`.toLowerCase();
      if (activeCategory === 'Sedans') return text.includes('sedan');
      if (activeCategory === 'SUVs') return /suv|sportage|tucson|fortuner|prado|land cruiser/.test(text);
      if (activeCategory === '4x4') return /4x4|pickup|revo|hilux|land cruiser/.test(text);
      if (activeCategory === 'Electric') return car.fuelType === 'Electric';
      return true;
    });
  }, [activeCategory, latestListings]);

  const doSearch = () => { setSearchQuery?.(query.trim()); setTab('search'); };
  const browseCategory = (label:string) => { setActiveCategory(label); if(label !== 'All'){ setSearchQuery?.(label); setTab('search'); } };

  return (
    <main className="b360-reference-home pb-16">
      <section className="b360-reference-hero">
        {heroImage ? <img src={heroImage} alt={`${heroCar?.make || 'Vehicle'} ${heroCar?.model || ''}`} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" referrerPolicy="no-referrer" /> : null}
        <div className="b360-reference-hero-overlay" />
        <div className="b360-shell relative z-10 grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-end lg:py-24">
          <div className="max-w-2xl">
            <div className="b360-eyebrow b360-eyebrow-light"><Sparkles size={13} />Pakistan's smart automotive marketplace</div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">Find your next chapter with Bazar360.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">Browse real vehicles, discover real showrooms and connect directly with the people who posted them.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => setTab('inventory')} className="b360-reference-button b360-reference-button-primary">Browse inventory <ArrowRight size={16} /></button>
              <button type="button" onClick={() => setTab('sell')} className="b360-reference-button b360-reference-button-light">Sell your vehicle <Tag size={16} /></button>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-white/15 pt-5">
              <div><strong>{availableListings.length}</strong><span>Live vehicles</span></div>
              <div><strong>{realShowrooms.length}</strong><span>Showrooms</span></div>
              <div><strong>{realListings.filter((car) => car.verified || car.approved).length}</strong><span>Verified vehicles</span></div>
            </div>
          </div>
          <div className="b360-search-panel">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-900 shadow-sm">
              <Search size={19} className="text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && doSearch()} placeholder="Search make, model, city..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" aria-label="Search vehicles" />
              <button type="button" onClick={doSearch} className="b360-search-button">Search</button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['Make','City','Fuel','Price'].map((label) => <button key={label} type="button" onClick={() => setTab('search')} className="b360-search-filter"><span>{label}</span><strong>{label === 'City' ? 'Peshawar' : 'Any'}</strong></button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="b360-light-section">
        <div className="b360-shell">
          <div className="b360-section-head"><div><p className="b360-eyebrow">Our vehicles</p><h2>Find your perfect ride</h2><p>Only live marketplace inventory is shown here. When there is no real data, we say so.</p></div><button type="button" onClick={() => setTab('inventory')} className="b360-text-link">View all inventory <ArrowRight size={15} /></button></div>
          <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
            {['All','Sedans','SUVs','4x4','Electric'].map((label) => <button key={label} type="button" onClick={() => browseCategory(label)} className={`b360-category-chip ${activeCategory === label ? 'is-active' : ''}`}>{label}</button>)}
          </div>
          {filteredLatest.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredLatest.slice(0,4).map((car) => <HomeVehicleCard key={car.id} car={car} dealer={realShowrooms.find((dealer) => dealer.id === car.dealerId)} onSelect={onSelectListing} onToggleFavorite={onToggleFavorite} isFavorite={favoritesList.some((item) => item.id === car.id)} />)}
            </div>
          ) : (
            <div className="b360-empty-state">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500"><CarIcon /></div>
              <h3>No live vehicles in this view</h3>
              <p>No dummy cards are used to fill the page. Browse the full inventory or post a real vehicle.</p>
              <div className="mt-5 flex justify-center gap-3"><button type="button" onClick={() => setTab('inventory')} className="b360-reference-button b360-reference-button-dark">Browse inventory</button><button type="button" onClick={() => setTab('sell')} className="b360-reference-button b360-reference-button-primary">Post a vehicle</button></div>
            </div>
          )}
        </div>
      </section>

      <section className="b360-dark-section">
        <div className="b360-shell grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="b360-feature-image">
            {featuredShowroom?.coverImage ? <img src={featuredShowroom.coverImage} alt={featuredShowroom.name} loading="lazy" decoding="async" /> : heroImage ? <img src={heroImage} alt="Bazar360 vehicle" loading="lazy" decoding="async" /> : null}
            <div className="b360-feature-image-overlay"><p className="b360-eyebrow b360-eyebrow-light">Why Bazar360</p><h2>More than a listing. A direct connection.</h2><p>Real seller details, real showroom information and real vehicle media stay at the center of the experience.</p></div>
          </div>
          <div className="space-y-5">
            {[
              ['Real vehicle information','Listing details come from the live marketplace database.',ShieldCheck],
              ['Direct seller connection','Use the contact actions attached to the real listing or showroom.',Phone],
              ['Verified showroom discovery','Open a showroom and see its own public profile and inventory.',Store],
              ['Built for trust','Clear status, ownership and verification states replace noisy visual effects.',CheckCircle2],
            ].map(([title,copy,Icon]) => <div key={String(title)} className="b360-trust-row"><span><Icon size={18} /></span><div><h3>{String(title)}</h3><p>{String(copy)}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="b360-light-section">
        <div className="b360-shell">
          <div className="b360-section-head"><div><p className="b360-eyebrow">How it works</p><h2>A simple process to get you on the road</h2><p>Keep the journey clear. The platform should help users move from discovery to contact without extra noise.</p></div></div>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              ['01','Choose your vehicle','Search the actual listings that match what you need.'],
              ['02','Review real details','Check price, mileage, condition, media and seller information.'],
              ['03','Connect directly','Contact the individual seller or showroom shown on the listing.'],
              ['04','Make your decision','Save, compare, revisit or move forward on your own terms.'],
            ].map(([number,title,copy]) => <div key={number} className="b360-process-card"><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
          </div>
        </div>
      </section>

      {realShowrooms.length > 0 ? <section className="b360-dark-section"><div className="b360-shell"><div className="b360-section-head b360-section-head-dark"><div><p className="b360-eyebrow b360-eyebrow-light">Verified showrooms</p><h2>Meet the businesses behind the inventory</h2><p>Showroom cards below are generated from the live showroom collection.</p></div><button type="button" onClick={() => setTab('dealers')} className="b360-text-link b360-text-link-light">View showrooms <ArrowRight size={15} /></button></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{realShowrooms.slice(0,3).map((dealer) => <button key={dealer.id} type="button" onClick={() => onSelectDealer?.(dealer.id)} className="b360-showroom-card"><div className="relative aspect-[16/9] overflow-hidden">{dealer.coverImage ? <img src={dealer.coverImage} alt={dealer.name} loading="lazy" decoding="async" /> : <div className="grid h-full place-items-center bg-slate-800 text-slate-400"><Store size={28} /></div>}{dealer.verified || dealer.flagshipVerified ? <span className="b360-home-badge b360-home-badge-dark absolute left-3 top-3"><ShieldCheck size={12} /> Verified</span> : null}</div><div className="p-5 text-left"><div className="flex items-start justify-between gap-3"><div><h3>{dealer.name}</h3><p>{dealer.subtitle || dealer.description}</p></div><ChevronRight size={18} className="shrink-0 text-orange-400" /></div><div className="mt-4 flex items-center gap-4 text-xs text-slate-400"><span className="flex items-center gap-1"><MapPin size={12} />{dealer.location || 'Location not listed'}</span><span>{Number(dealer.vehiclesCount) || 0} vehicles</span></div></div></button>)}</div></div></section> : null}

      <section className="b360-light-section"><div className="b360-shell"><div className="b360-section-head"><div><p className="b360-eyebrow">Services</p><h2>Everything you need under one roof</h2><p>Simple entry points for buyers, sellers and automotive businesses.</p></div></div><div className="grid divide-y rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">{[
        ['Buy cars','Search and compare live listings.',Search,() => setTab('inventory')],
        ['Sell your car','Create a real listing with your own media.',Tag,() => setTab('sell')],
        ['Find showrooms','Discover real businesses and their inventory.',Store,() => setTab('dealers')],
        ['Auto services','Open the automotive service tools.',Wrench,() => setTab('concierge')],
      ].map(([title,copy,Icon,action]) => <button key={String(title)} type="button" onClick={action as () => void} className="b360-service-card"><span><Icon size={19} /></span><h3>{String(title)}</h3><p>{String(copy)}</p><ArrowRight size={15} /></button>)}</div></div></section>

      {galleryImages.length > 0 ? <section className="b360-dark-section"><div className="b360-shell"><div className="b360-section-head b360-section-head-dark"><div><p className="b360-eyebrow b360-eyebrow-light">Our gallery</p><h2>Moments that move us</h2><p>Media pulled from real showroom galleries and activity feeds.</p></div></div><div className="b360-gallery">{galleryImages.map(({url,showroom},index) => <button key={`${url}-${index}`} type="button" onClick={() => onSelectDealer?.(showroom.id)} className={index===0 ? 'b360-gallery-main' : ''}><img src={url} alt={`${showroom.name} showroom media`} loading="lazy" decoding="async" /></button>)}</div></div></section> : null}

      {brands.length > 0 ? <section className="b360-brand-strip"><div className="b360-shell"><div className="b360-section-head"><div><p className="b360-eyebrow">Brands in the marketplace</p><h2>Driven by real listings</h2></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{brands.map(([brand,count]) => <button key={brand} type="button" onClick={() => { setSearchQuery?.(brand); setTab('search'); }} className="b360-brand-chip"><span>{brand}</span><small>{count} listing{count === 1 ? '' : 's'}</small></button>)}</div></div></section> : null}

      <section className="b360-final-cta"><div className="b360-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="b360-eyebrow b360-eyebrow-light">Ready to drive?</p><h2>Your next vehicle is closer than you think.</h2><p>Start with the live marketplace, or add your own vehicle when you are ready.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={() => setTab('inventory')} className="b360-reference-button b360-reference-button-primary">Browse cars <ArrowRight size={16} /></button><button type="button" onClick={() => setTab('sell')} className="b360-reference-button b360-reference-button-light">Post a vehicle <Tag size={16} /></button></div></div></section>
    </main>
  );
}

function CarIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true"><path d="M5 17h14l-1.2-6.2a2 2 0 0 0-2-1.6H8.2a2 2 0 0 0-2 1.6L5 17Z" /><path d="M4 17v2M20 17v2M7 17h10M7.5 13h9" /></svg>;
}
