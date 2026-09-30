import React, { useState } from 'react';
import { Scale, X, Check, ArrowRight, Car } from 'lucide-react';
import { CarListing } from '../../types';

interface VehicleCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: CarListing[];
  formatPrice: (price: number) => string;
  onSelectVehicle: (car: CarListing) => void;
}

export const VehicleCompareModal: React.FC<VehicleCompareModalProps> = ({
  isOpen,
  onClose,
  listings,
  formatPrice,
  onSelectVehicle,
}) => {
  if (!isOpen) return null;

  const [car1Id, setCar1Id] = useState<string>(listings[0]?.id || '');
  const [car2Id, setCar2Id] = useState<string>(listings[1]?.id || listings[0]?.id || '');

  const car1 = listings.find(l => l.id === car1Id);
  const car2 = listings.find(l => l.id === car2Id);

  const specRows = [
    { label: 'Demand Price', val1: car1 ? formatPrice(car1.price) : '-', val2: car2 ? formatPrice(car2.price) : '-' },
    { label: 'Model Year', val1: car1?.year, val2: car2?.year },
    { label: 'Mileage', val1: car1 ? `${car1.mileage?.toLocaleString()} km` : '-', val2: car2 ? `${car2.mileage?.toLocaleString()} km` : '-' },
    { label: 'Engine Size', val1: car1 ? `${car1.engineCC || 1800} cc` : '-', val2: car2 ? `${car2.engineCC || 1500} cc` : '-' },
    { label: 'Transmission', val1: car1?.transmission, val2: car2?.transmission },
    { label: 'Fuel Type', val1: car1?.fuelType, val2: car2?.fuelType },
    { label: 'Body Condition', val1: car1?.bodyCondition || 'Total Genuine', val2: car2?.bodyCondition || 'Total Genuine' },
    { label: 'Assembly', val1: car1?.assemblyType || 'Local', val2: car2?.assemblyType || 'Local' },
    { label: 'Registration City', val1: car1?.registrationCity || car1?.location, val2: car2?.registrationCity || car2?.location },
    { label: 'Document Type', val1: car1?.documentType || 'Smart Card', val2: car2?.documentType || 'Smart Card' },
    { label: 'Token Tax', val1: car1?.tokenTaxPaid ? 'Paid' : 'Pending', val2: car2?.tokenTaxPaid ? 'Paid' : 'Pending' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scale size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Side-by-Side Vehicle Comparison</h2>
              <p className="text-xs text-slate-500">Fact-based comparison across technical specifications.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Vehicle Selectors Header Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Vehicle 1 Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">Vehicle 1</label>
            <select
              value={car1Id}
              onChange={(e) => setCar1Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-900"
            >
              {listings.map(l => (
                <option key={l.id} value={l.id}>{l.title} ({l.year})</option>
              ))}
            </select>

            {car1 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
                <img src={car1.imageUrl || car1.images?.[0]} alt={car1.title} className="w-full h-24 object-cover rounded-lg" />
                <h4 className="font-bold text-xs text-slate-900 truncate mt-1">{car1.title}</h4>
                <div className="text-xs font-black text-blue-600">{formatPrice(car1.price)}</div>
              </div>
            )}
          </div>

          {/* Vehicle 2 Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">Vehicle 2</label>
            <select
              value={car2Id}
              onChange={(e) => setCar2Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-900"
            >
              {listings.map(l => (
                <option key={l.id} value={l.id}>{l.title} ({l.year})</option>
              ))}
            </select>

            {car2 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
                <img src={car2.imageUrl || car2.images?.[0]} alt={car2.title} className="w-full h-24 object-cover rounded-lg" />
                <h4 className="font-bold text-xs text-slate-900 truncate mt-1">{car2.title}</h4>
                <div className="text-xs font-black text-blue-600">{formatPrice(car2.price)}</div>
              </div>
            )}
          </div>

        </div>

        {/* Comparison Specs Matrix Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              {specRows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="p-2.5 font-bold text-slate-600 border-r border-slate-100 w-1/3">
                    {row.label}
                  </td>
                  <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-100 w-1/3 text-center">
                    {row.val1 || '-'}
                  </td>
                  <td className="p-2.5 font-semibold text-slate-900 w-1/3 text-center">
                    {row.val2 || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
          >
            Close
          </button>

          <div className="flex gap-2">
            {car1 && (
              <button
                onClick={() => {
                  onSelectVehicle(car1);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                View Vehicle 1
              </button>
            )}
            {car2 && (
              <button
                onClick={() => {
                  onSelectVehicle(car2);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
              >
                View Vehicle 2
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
