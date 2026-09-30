import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Users, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Car, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Dealer } from '../../types';
import { AutoChoiceLogo, Bazar360Logo } from '../common/BrandLogos';

interface AboutShowroomViewProps {
  dealer: Dealer;
  onSelectTab: (tab: string) => void;
}

export const AboutShowroomView: React.FC<AboutShowroomViewProps> = ({
  dealer,
  onSelectTab,
}) => {
  const team = [
    {
      name: 'Malak Mazhar',
      role: 'Showroom Partner & Fleet Lead',
      phone: '+92 315 9085086',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      bio: 'Leading high-end vehicle acquisitions and executive customer relations across Khyber Pakhtunkhwa and Islamabad.',
    },
    {
      name: 'M. Nasir Mirza',
      role: 'Chief Sales Executive & Appraiser',
      phone: '+92 300 5908508',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      bio: 'Specialist in certified pre-owned Japanese imports, auction verification, and trade-in valuations.',
    },
    {
      name: 'Asfandyar Zafar',
      role: 'Fleet & Diagnostics Manager',
      phone: '+92 312 9085033',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Oversees the 150-point technical inspection bay, OBD-II telemetry scan, and nationwide doorstep deliveries.',
    },
    {
      name: 'Lucas Bennett',
      role: 'Customer Experience Director',
      phone: '+92 314 9198403',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Dedicated to white-glove buying journeys, financing facilitation, and transparent warranty handovers.',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. Hero Brand Story Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Bazar360Logo size="sm" frame="rounded" background="dark" />
            <div className="h-5 w-[1px] bg-slate-700" />
            <AutoChoiceLogo size="sm" frame="rounded" background="dark" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Setting the Gold Standard in Automotive Excellence.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Auto Choice and Bazar360 were founded with a single mission: to eliminate the friction, uncertainty, and hidden costs from buying and selling pre-owned vehicles in Pakistan.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onSelectTab('auto-choice')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Active Inventory</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onSelectTab('contact')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/10 cursor-pointer"
            >
              Visit Our Showroom
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Pillars of Trust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Total Transparency</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every vehicle comes with documented service history, authentic auction sheet verification, and digital paint depth analysis.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero Commission Buying</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct connections between certified buyers and owners. No middlemen markups, no hidden dealer processing fees.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Car size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Nationwide Secure Delivery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Doorstep vehicle handover anywhere in Pakistan with escrow protection and comprehensive transit insurance.
          </p>
        </div>
      </div>

      {/* 3. Meet the Certified Team */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Users size={15} />
              <span>Certified Automotive Advisors</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Meet Our Team</h2>
          </div>
          <span className="text-xs text-slate-500">Auto Choice • Alamas Car Village Ring Road</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div 
              key={member.name}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between group hover:border-blue-300 transition-all"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-slate-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                <span className="text-[11px] font-semibold text-blue-600 block mb-2">{member.role}</span>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{member.bio}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <a
                  href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                  className="p-2 rounded-lg bg-white text-slate-700 hover:text-blue-600 hover:shadow-xs transition-all"
                  title="Call Advisor"
                >
                  <Phone size={14} />
                </a>
                <a
                  href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
