import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Navigation,
  Globe
} from 'lucide-react';
import { AutoChoiceLogo } from '../common/BrandLogos';

export const ContactShowroomView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Vehicle Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <MapPin size={15} />
          <span>Showroom HQ & Customer Concierge</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Visit or Contact Auto Choice Peshawar
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          We invite you to our showroom at Alamas Car Village Ring Road for a private test drive, diagnostic inspection, and coffee with our executive team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Contact Information & Location Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <AutoChoiceLogo size="sm" frame="rounded" background="dark" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Auto Choice Flagship</h3>
                <span className="text-xs text-slate-400">The Right Choice in Luxury & SUV</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <strong className="text-slate-900 block font-semibold">Showroom Address</strong>
                  <span>Alamas Car Village, Ring Road, Peshawar, Khyber Pakhtunkhwa, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                  <Phone size={16} />
                </div>
                <div>
                  <strong className="text-slate-900 block font-semibold">Direct Phone Lines</strong>
                  <span>+92 315 9085086 (Malak Mazhar)</span><br />
                  <span>+92 300 5908508 (M. Nasir Mirza)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5">
                  <Mail size={16} />
                </div>
                <div>
                  <strong className="text-slate-900 block font-semibold">Email Desk</strong>
                  <span>info@bazar360.online • Mazharsouls@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <strong className="text-slate-900 block font-semibold">Showroom Business Hours</strong>
                  <span>Monday – Saturday: 09:00 AM – 09:30 PM</span><br />
                  <span>Sunday: 11:00 AM – 07:00 PM (By Appointment)</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href="https://wa.me/923159085086?text=Hi%20Auto%20Choice%20Peshawar%2C%20I%20would%20like%20to%20inquire%20about%20your%20current%20inventory%20and%20schedule%20a%20visit."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={15} />
              <span>Chat Directly on WhatsApp</span>
            </a>
          </div>

          {/* Interactive Map Direction Assist */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Navigation size={15} />
              <span>GPS Navigation Landmark</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Located on Main Ring Road Peshawar near Alamas Car Village. Easily accessible from Motorway M-1 Interchange (10 mins drive).
            </p>
            <a
              href="https://maps.google.com/?q=Alamas+Car+Village+Ring+Road+Peshawar"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold"
            >
              <span>Open in Google Maps</span>
              <span>&rarr;</span>
            </a>
          </div>

        </div>

        {/* Right 7 Cols: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Send a Message or Request a Callback</h2>
          <p className="text-xs text-slate-500 mb-6">Our senior sales advisors respond within 15 minutes during business hours.</p>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-emerald-900">Message Received!</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you, {name}. Your inquiry has been routed to Auto Choice executive team. We will call or WhatsApp you at {phone}.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Khan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0315 9085086"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Purpose</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Vehicle Purchase">Buy a Vehicle from Stock</option>
                  <option value="Test Drive Booking">Schedule a Showroom Test Drive</option>
                  <option value="Trade-In Exchange">Trade-In My Vehicle</option>
                  <option value="Diagnostics Inspection">Vehicle Health & Diagnostics Bay</option>
                  <option value="General Inquiry">General Marketplace Question</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Message / Specific Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the vehicle you are looking for (Make, Year, Budget) or questions about our inventory..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
