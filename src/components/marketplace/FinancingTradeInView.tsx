import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  Phone,
  MessageSquare
} from 'lucide-react';
import { CarListing } from '../../types';

interface FinancingTradeInViewProps {
  listings: CarListing[];
  formatPrice: (price: number) => string;
  onNavigateToSell: () => void;
}

export const FinancingTradeInView: React.FC<FinancingTradeInViewProps> = ({
  listings,
  formatPrice,
  onNavigateToSell,
}) => {
  // Financing Calculator States
  const [vehiclePrice, setVehiclePrice] = useState<number>(8500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(14.5); // Conventional KIBOR + spread

  // Trade-In Form States
  const [tradeInMake, setTradeInMake] = useState('Toyota');
  const [tradeInModel, setTradeInModel] = useState('Corolla GLi');
  const [tradeInYear, setTradeInYear] = useState('2019');
  const [tradeInMileage, setTradeInMileage] = useState('55,000');
  const [tradeInCondition, setTradeInCondition] = useState('Total Genuine');
  const [tradeInPhone, setTradeInPhone] = useState('');
  const [tradeInSubmitted, setTradeInSubmitted] = useState(false);

  // Calculations
  const downPaymentAmount = (vehiclePrice * downPaymentPercent) / 100;
  const loanPrincipal = vehiclePrice - downPaymentAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment =
    loanPrincipal > 0 && monthlyInterestRate > 0
      ? (loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
      : 0;

  const handleTradeInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeInSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Calculator size={15} />
          <span>Flexible Automotive Financing & Direct Trade-In</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Vehicle Financing & Instant Trade-In Valuation
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Calculate estimated monthly installments with verified partner banks (Meezan, Bank Alfalah, Dubai Islamic) or trade in your current vehicle with same-day exchange value.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Financing Installment Calculator */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Auto Loan & Islamic Ijarah Calculator</h2>
              <p className="text-xs text-slate-400">Estimate your monthly budget in seconds</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Islamic Ijarah Compatible
            </span>
          </div>

          {/* Quick Vehicle Selector Preset */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Preset Vehicle or Enter Custom Price:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {listings.slice(0, 4).map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => setVehiclePrice(car.price)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    vehiclePrice === car.price
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {car.title} ({formatPrice(car.price)})
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">PKR</span>
              <input
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-14 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Down Payment Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Down Payment ({downPaymentPercent}%):</span>
              <span className="text-blue-600 font-mono">{formatPrice(downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15% (Min)</span>
              <span>30% (Standard)</span>
              <span>50%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Loan Term Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Tenure / Term Duration:</label>
            <div className="grid grid-cols-5 gap-2">
              {[12, 24, 36, 48, 60].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setLoanTermMonths(months)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    loanTermMonths === months
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {months / 12} {months === 12 ? 'Year' : 'Years'}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Estimated Annual Markup / Profit Rate:</span>
              <span className="font-mono text-slate-900">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="9"
              max="22"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Monthly Payment Summary Box */}
          <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-900 block">Estimated Monthly Installment</span>
              <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono mt-0.5">
                {formatPrice(Math.round(monthlyPayment))}
                <span className="text-xs text-blue-600 font-sans font-normal"> / month</span>
              </div>
              <p className="text-[11px] text-blue-800/80 mt-1">Principal financed: {formatPrice(loanPrincipal)} over {loanTermMonths} months</p>
            </div>

            <a
              href={`https://wa.me/923159085086?text=${encodeURIComponent(
                `Hi Auto Choice / Bazar360, I want to apply for vehicle financing for ${formatPrice(vehiclePrice)} with a monthly budget around ${formatPrice(Math.round(monthlyPayment))}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <MessageSquare size={14} />
              <span>Apply via Bank Partner</span>
            </a>
          </div>

        </div>

        {/* Right 5 Cols: Direct Trade-In Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <TrendingUp size={15} />
              <span>Same-Day Exchange Value</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Trade-In Your Current Car</h2>
            <p className="text-xs text-slate-500 mt-1">
              Exchange your used car directly for any verified stock unit at Auto Choice Peshawar with zero hassle.
            </p>

            {tradeInSubmitted ? (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-bold text-emerald-900">Trade-In Valuation Submitted!</h3>
                <p className="text-xs text-emerald-700">
                  Our chief appraiser M. Nasir Mirza will review your {tradeInYear} {tradeInMake} {tradeInModel} and WhatsApp you a certified quote within 30 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setTradeInSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Submit Another Vehicle
                </button>
              </div>
            ) : (
              <form onSubmit={handleTradeInSubmit} className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Make</label>
                    <input
                      type="text"
                      required
                      value={tradeInMake}
                      onChange={(e) => setTradeInMake(e.target.value)}
                      placeholder="e.g. Toyota, Honda"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Model & Variant</label>
                    <input
                      type="text"
                      required
                      value={tradeInModel}
                      onChange={(e) => setTradeInModel(e.target.value)}
                      placeholder="e.g. Yaris, Civic"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Registration Year</label>
                    <input
                      type="text"
                      required
                      value={tradeInYear}
                      onChange={(e) => setTradeInYear(e.target.value)}
                      placeholder="e.g. 2021"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Mileage (km)</label>
                    <input
                      type="text"
                      required
                      value={tradeInMileage}
                      onChange={(e) => setTradeInMileage(e.target.value)}
                      placeholder="e.g. 45,000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Body & Paint Condition</label>
                  <select
                    value={tradeInCondition}
                    onChange={(e) => setTradeInCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Total Genuine">Total Genuine (No Touchups)</option>
                    <option value="Minor Touchups">Minor Touchups (1-2 Pieces)</option>
                    <option value="Shower / Repainted">Shower / Repainted</option>
                    <option value="Accidental Repaired">Repaired / Refurbished</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">WhatsApp / Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={tradeInPhone}
                    onChange={(e) => setTradeInPhone(e.target.value)}
                    placeholder="e.g. 03159085086"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Request Instant Trade-In Quote</span>
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <ShieldCheck size={14} className="text-blue-600" />
              100% Free Appraisal
            </span>
            <button
              onClick={onNavigateToSell}
              className="text-blue-600 hover:underline font-bold"
            >
              Or Sell Directly &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
