import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, Car } from 'lucide-react';
import { CarListing, Lead } from '../../types';

interface LeadActionModalProps {
  type: 'test-drive' | 'inspection' | 'offer';
  isOpen: boolean;
  onClose: () => void;
  vehicle: CarListing;
  onSubmitLead: (lead: Partial<Lead>) => void;
  formatPrice: (price: number) => string;
}

export const LeadActionModals: React.FC<LeadActionModalProps> = ({
  type,
  isOpen,
  onClose,
  vehicle,
  onSubmitLead,
  formatPrice,
}) => {
  if (!isOpen || !vehicle) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [offerPrice, setOfferPrice] = useState(vehicle.price * 0.95);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let inquiryMsg = '';
    if (type === 'test-drive') {
      inquiryMsg = `Requested Test Drive on ${date}. Notes: ${notes || 'None'}`;
    } else if (type === 'inspection') {
      inquiryMsg = `Requested 200+ Point Bazar360 Inspection. Preferred Date: ${date}.`;
    } else {
      inquiryMsg = `Submitted Cash Offer of ${formatPrice(offerPrice)}. Original demand: ${formatPrice(vehicle.price)}. Notes: ${notes}`;
    }

    onSubmitLead({
      id: `lead-${Date.now()}`,
      userName: name || 'Interested Buyer',
      userPhone: phone || '03001234567',
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      vehiclePrice: vehicle.price,
      vehicleImage: vehicle.imageUrl || vehicle.images?.[0],
      inquiryMessage: inquiryMsg,
      inquiryDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'New',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const titles = {
    'test-drive': 'Book a Verified Test Drive',
    'inspection': 'Request 200+ Point Inspection',
    'offer': 'Make a Direct Cash Offer',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900">{titles[type]}</h3>
            <p className="text-xs text-slate-500 truncate">{vehicle.title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Request Sent Successfully!</h4>
            <p className="text-xs text-slate-500">The seller has been notified on WhatsApp and Bazar360.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Asad Khan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            {type === 'test-drive' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Test Drive Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            )}

            {type === 'offer' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Cash Offer: <span className="text-blue-600 font-mono">{formatPrice(offerPrice)}</span>
                </label>
                <input
                  type="number"
                  step="50000"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any questions about the vehicle condition or transfer?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
