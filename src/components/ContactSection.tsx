import React from 'react';
import { Dealer } from '../types';
import { 
  Phone, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Linkedin,
  Video, 
  Globe, 
  UserCheck, 
  PhoneCall,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { hoverEffects } from './AnimationProvider';

interface ContactSectionProps {
  dealer: Dealer;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ dealer }) => {
  const formattedWhatsapp = (dealer.whatsapp || '').replace(/\D/g, '');
  const contactPerson = dealer.contactPerson || 'Malak Mazhar';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 1. Hotlines & Direct Advisory */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-6 space-y-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-black tracking-widest uppercase font-display text-[var(--color-text-main)]">Hotlines & Direct Calls</h2>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Reach our sales floor desks directly for fast transactions and advisory.</p>
        </div>
        
        <div className="space-y-4">
          {/* Representative 1: Malak Mazhar */}
          <div className="bg-gradient-to-br from-orange-600/10 to-slate-900/40 border border-orange-500/15 rounded-2xl p-5 space-y-4 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-black">
                <UserCheck size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">Showroom Partner / Services</h4>
                <p className="text-base font-black text-[var(--color-text-main)]">Malak Mazhar</p>
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Contact <span className="text-orange-400 font-bold">Malak Mazhar</span> for custom showroom setup, verified vehicle listings, and corporate queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a 
                href="tel:+923159085086"
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-97 transition-all cursor-pointer"
              >
                <PhoneCall size={12} />
                <span>Call Mazhar</span>
              </a>
              <a 
                href="https://wa.me/923159085086"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-97 transition-all cursor-pointer"
              >
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Representative 2: Muhammad Amjid */}
          <div className="bg-gradient-to-br from-amber-600/10 to-slate-900/40 border border-amber-500/15 rounded-2xl p-5 space-y-4 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black">
                <UserCheck size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">Founder & Showroom Director</h4>
                <p className="text-base font-black text-[var(--color-text-main)]">Muhammad Amjid</p>
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Contact <span className="text-amber-400 font-bold">Muhammad Amjid</span> for verified vehicle checks, trade-ins, and showroom operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a 
                href="tel:+923149198403"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-mono font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-97 transition-all cursor-pointer"
              >
                <PhoneCall size={12} />
                <span>Call Amjid</span>
              </a>
              <a 
                href="https://wa.me/923149198403"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-97 transition-all cursor-pointer"
              >
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {dealer.landline && (
            <a href={`tel:${dealer.landline}`} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] hover:border-orange-500/20 transition-all">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-mono uppercase text-[var(--color-text-muted)]">Showroom Landline</h4>
                <p className="text-sm font-bold text-[var(--color-text-main)] font-mono">{dealer.landline}</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* 2. Social Media & Location */}
      <div className="space-y-6">
        {/* Conditional check: hide social media section if no links provided in dealer.socials */}
        {(dealer.socials?.facebook || dealer.socials?.instagram || dealer.socials?.linkedin || dealer.socials?.tiktok || dealer.socials?.website) && (
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-widest uppercase font-display text-[var(--color-text-main)]">Social Broadcast Media</h2>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Follow our official channels for incoming luxury stock updates.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {dealer.socials?.facebook && (
                <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.985 }} className="w-full">
                  <a 
                    href={dealer.socials.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-4 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Facebook size={18} className="transition-transform duration-300 group-hover:scale-110" /> 
                      Facebook Page
                    </span>
                    <span className="opacity-70 font-mono text-[9px] bg-blue-500/20 px-2 py-0.5 rounded-md transition-all group-hover:bg-blue-500/35">Visit →</span>
                  </a>
                </motion.div>
              )}
              {dealer.socials?.instagram && (
                <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.985 }} className="w-full">
                  <a 
                    href={dealer.socials.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-4 bg-pink-600/10 hover:bg-pink-600/25 border border-pink-500/20 hover:border-pink-500/40 text-pink-400 hover:text-pink-300 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Instagram size={18} className="transition-transform duration-300 group-hover:scale-110" /> 
                      Instagram Feed
                    </span>
                    <span className="opacity-70 font-mono text-[9px] bg-pink-500/20 px-2 py-0.5 rounded-md transition-all group-hover:bg-pink-500/35">Visit →</span>
                  </a>
                </motion.div>
              )}
              {dealer.socials?.linkedin && (
                <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.985 }} className="w-full">
                  <a 
                    href={dealer.socials.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-4 bg-sky-600/10 hover:bg-sky-600/25 border border-sky-500/20 hover:border-sky-500/40 text-sky-400 hover:text-sky-300 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Linkedin size={18} className="transition-transform duration-300 group-hover:scale-110" /> 
                      LinkedIn Network
                    </span>
                    <span className="opacity-70 font-mono text-[9px] bg-sky-500/20 px-2 py-0.5 rounded-md transition-all group-hover:bg-sky-500/35">Visit →</span>
                  </a>
                </motion.div>
              )}
              {dealer.socials?.tiktok && (
                <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.985 }} className="w-full">
                  <a 
                    href={dealer.socials.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-slate-200 hover:text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Video size={18} className="transition-transform duration-300 group-hover:scale-110" /> 
                      TikTok Walkarounds
                    </span>
                    <span className="opacity-70 font-mono text-[9px] bg-white/10 px-2 py-0.5 rounded-md transition-all group-hover:bg-white/20">Visit →</span>
                  </a>
                </motion.div>
              )}
              {dealer.socials?.website && (
                <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.985 }} className="w-full">
                  <a 
                    href={dealer.socials.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-amber-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Globe size={18} className="transition-transform duration-300 group-hover:scale-110" /> 
                      Official Website
                    </span>
                    <span className="opacity-70 font-mono text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md transition-all group-hover:bg-amber-500/35">Visit →</span>
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Location Snapshot */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-6 shadow-sm overflow-hidden relative">
          <h3 className="font-black text-[var(--color-text-main)] mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
            <MapPin size={16} className="text-orange-500" />
            Verified Location
          </h3>
          <div className="w-full h-48 bg-slate-950 border border-[var(--color-border-main)] rounded-2xl relative flex flex-col items-center justify-center text-center overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.728779958931!2d71.55447107629633!3d33.99951667317666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d910d540203f13%3A0xe5a3bb681534f364!2sAuto%20Choice!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 z-0"
              title="Google Maps Auto Choice"
            />
            <div className="relative z-10 p-4 mt-auto w-full bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end pointer-events-none">
              <p className="text-[10px] font-bold text-white uppercase tracking-widest truncate max-w-[200px] text-left drop-shadow-md">{dealer.location}</p>
              <a 
                href={`https://maps.app.goo.gl/CRqELKw2aEchXVrp6`}
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-4 py-2 bg-orange-600 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all hover:bg-orange-700 active:scale-95 cursor-pointer shadow-lg pointer-events-auto"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
