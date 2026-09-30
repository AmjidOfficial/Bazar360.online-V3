import React, { useState } from 'react';
import { Calculator, X, Sparkles, CheckCircle2, ArrowRight, BarChart2 } from 'lucide-react';
import { PAKISTAN_BRANDS, PAKISTAN_CITIES, CAR_MODELS } from '../../lib/pakistanCarData';
import { CarListing } from '../../types';

interface VehicleValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSell: () => void;
  formatPrice: (price: number) => string;
  listings?: CarListing[];
}

export const VehicleValuationModal: React.FC<VehicleValuationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSell,
  formatPrice,
  listings = [],
}) => {
  if (!isOpen) return null;

  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Corolla');
  const [year, setYear] = useState(2021);
  const [mileage, setMileage] = useState(45000);
  const [condition, setCondition] = useState<'Total Genuine' | 'Minor Touch-ups' | 'Repainted'>('Total Genuine');
  const [city, setCity] = useState('Peshawar');
  const [calculatedRange, setCalculatedRange] = useState<{ min: number; max: number; fair: number; matchedCount: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Find active market comparables from real inventory
    const comparables = listings.filter(l => 
      l && l.make?.toLowerCase() === make.toLowerCase() && 
      l.model?.toLowerCase().includes(model.toLowerCase()) &&
      l.price > 0
    );

    let base = 5500000;
    if (comparables.length > 0) {
      // Calculate from average of matching active listings
      const total = comparables.reduce((acc, curr) => acc + curr.price, 0);
      base = total / comparables.length;
    } else {
      // Fallback base valuation calculation based on year and model
      if (make === 'Toyota' && model === 'Fortuner') base = 16000000;
      else if (make === 'Toyota' && model === 'Land Cruiser') base = 35000000;
      else if (make === 'Honda' && model === 'Civic') base = 7500000;
      else if (make === 'Suzuki' && model === 'Alto') base = 2600000;
      else if (make === 'Suzuki' && model === 'Cultus') base = 3700000;
      else if (make === 'KIA' && model === 'Sportage') base = 7200000;
      else if (make === 'Hyundai' && model === 'Tucson') base = 7300000;
      else if (make === 'MG' && model === 'HS') base = 6800000;
      else if (make === 'Changan' && model === 'Alsvin') base = 3800000;
    }

    // Adjust for year relative to baseline
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - year;
    base = base * (1 - Math.min(0.6, yearDiff * 0.04));

    // Adjust for mileage
    if (mileage > 50000) base -= Math.min(base * 0.2, (mileage - 50000) * 8);

    // Adjust for condition
    if (condition === 'Minor Touch-ups') base *= 0.94;
    if (condition === 'Repainted') base *= 0.86;

    const fair = Math.round(base / 50000) * 50000;
    const min = Math.round((fair * 0.93) / 50000) * 50000;
    const max = Math.round((fair * 1.06) / 50000) * 50000;

    setCalculatedRange({ min, max, fair, matchedCount: comparables.length });
    setIsCalculating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calculator size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Vehicle Market Valuation</h2>
              <p className="text-xs text-slate-500">Instant fair-market price range based on real Pakistani market data.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Make</label>
              <select
                value={make}
                onChange={(e) => {
                  setMake(e.target.value);
                  setModel(CAR_MODELS[e.target.value]?.[0] || '');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              >
                {PAKISTAN_BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              >
                {CAR_MODELS[make]?.map(m => (
                  <option key={m} value={m}>{m}</option>
                )) || <option value={model}>{model}</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mileage (km)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              >
                <option value="Total Genuine">Total Genuine</option>
                <option value="Minor Touch-ups">Minor Touch-ups</option>
                <option value="Repainted">Repainted</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              >
                {PAKISTAN_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span>{isCalculating ? 'Estimating market price...' : 'Calculate Fair Market Value'}</span>
          </button>
        </form>

        {/* Results Banner */}
        {calculatedRange && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Estimated Market Price in {city}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {calculatedRange.matchedCount > 0 ? `${calculatedRange.matchedCount} Active Comparables` : 'Algorithmic Benchmark'}
              </span>
            </div>

            <div className="text-center py-2 bg-white rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Fair Demand</span>
              <span className="text-xl font-black text-emerald-600">
                {formatPrice(calculatedRange.min)} - {formatPrice(calculatedRange.max)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Target selling average: <strong>{formatPrice(calculatedRange.fair)}</strong>
              </span>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              *Valuation is an estimated benchmark based on condition and year. Final transaction price depends on physical inspection and documentation.
            </p>

            <button
              onClick={() => {
                onClose();
                onNavigateToSell();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>List for This Price on Bazar360</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
