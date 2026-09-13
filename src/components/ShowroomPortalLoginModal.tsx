import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Lock, Mail, User, ShieldCheck, ArrowRight, X, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { UserProfile, dbSaveUserProfile, dbFetchUserProfile } from '../lib/dbService';
import { getFriendlyAuthErrorMessage } from './AuthModal';
import { toast } from 'react-hot-toast';

interface ShowroomPortalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  lang?: 'en' | 'ur';
}

export default function ShowroomPortalLoginModal({
  isOpen,
  onClose,
  onSuccess,
  lang = 'en'
}: ShowroomPortalLoginModalProps) {
  const isUrdu = lang === 'ur';
  const [isRegisteringShowroom, setIsRegisteringShowroom] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showroomName, setShowroomName] = useState('');
  const [city, setCity] = useState('Peshawar');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShowroomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError(isUrdu ? 'براہ کرم تمام خانے پر کریں۔' : 'Please fill in both Username/Email and Password.');
      return;
    }

    setLoading(true);
    setError(null);

    // If input is a raw username without @, convert to standard showroom email identifier
    let loginEmail = usernameOrEmail.trim().toLowerCase();
    if (!loginEmail.includes('@')) {
      loginEmail = `${loginEmail.replace(/\s+/g, '')}@bazar360.online`;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const uid = userCredential.user.uid;
      
      let profile = await dbFetchUserProfile(uid);
      if (!profile) {
        // Fallback profile creation for Showroom Owner
        profile = {
          uid,
          email: userCredential.user.email || loginEmail,
          displayName: userCredential.user.displayName || usernameOrEmail || 'Showroom HQ Manager',
          role: 'Dealer',
          city: city || 'Peshawar',
          phoneNumber: phoneNumber || '+92 315 9085086',
          status: 'Active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await dbSaveUserProfile(profile);
      } else {
        // Ensure role is set to Dealer for Showroom Portal login
        if (profile.role !== 'Admin' && profile.role !== 'Dealer') {
          profile.role = 'Dealer';
          await dbSaveUserProfile(profile);
        }
      }

      toast.success(isUrdu ? 'شو روم پورٹل میں خوش آمدید!' : 'Welcome to Showroom HQ Portal!');
      onSuccess(profile);
      onClose();
    } catch (err: any) {
      console.error('[Showroom Portal Login] Error:', err);
      setError(getFriendlyAuthErrorMessage(err.message || String(err), lang));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNewShowroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim() || !showroomName.trim()) {
      setError(isUrdu ? 'براہ کرم شو روم کی تمام تفصیلات درج کریں۔' : 'Please provide all showroom details.');
      return;
    }

    setLoading(true);
    setError(null);

    let registerEmail = usernameOrEmail.trim().toLowerCase();
    if (!registerEmail.includes('@')) {
      registerEmail = `${registerEmail.replace(/\s+/g, '')}@bazar360.online`;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, password);
      const uid = userCredential.user.uid;

      const showroomProfile: UserProfile = {
        uid,
        email: registerEmail,
        displayName: showroomName.trim(),
        role: 'Dealer',
        city: city || 'Peshawar',
        phoneNumber: phoneNumber || '+92 314 3600000',
        status: 'Active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await dbSaveUserProfile(showroomProfile);
      toast.success(isUrdu ? 'نئے شو روم کا پورٹل رجسٹر ہو گیا!' : 'Showroom Portal Registered Successfully!');
      onSuccess(showroomProfile);
      onClose();
    } catch (err: any) {
      console.error('[Showroom Registration] Error:', err);
      setError(getFriendlyAuthErrorMessage(err.message || String(err), lang));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoShowroom = (demoEmail: string, demoName: string) => {
    setUsernameOrEmail(demoEmail);
    setPassword('Bazar360Pass123');
    setShowroomName(demoName);
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden border border-[var(--color-accent-main)]/30 bg-[#0D111A] text-slate-100 rounded-3xl shadow-2xl p-6 md:p-8"
        >
          {/* Spotlight Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-[var(--color-accent-main)]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--color-accent-main)]/30 bg-[var(--color-accent-main)]/10 text-[var(--color-accent-main)] text-[10px] font-mono tracking-widest uppercase font-bold">
              <Building2 size={12} />
              <span>{isUrdu ? 'شو روم آنر پورٹل' : 'SHOWROOM HQ PORTAL LOGIN'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-display uppercase text-white tracking-tight">
              {isRegisteringShowroom
                ? (isUrdu ? 'نیا شو روم پورٹل بنائیں' : 'Register Showroom HQ')
                : (isUrdu ? 'شو روم لاگ ان کریں' : 'Dealer & Showroom Portal')}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {isUrdu
                ? 'اپنے شو روم کا انوینٹری ڈیجیٹل ڈیش بورڈ، لیڈز اور لائیو سائن ایج کنٹرول کریں۔'
                : 'Access your dedicated Dealership Dashboard, manage active vehicle listings, leads & showroom branding.'}
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="mb-6 p-3 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-xs flex flex-col gap-2 relative z-10">
            <span className="text-[10px] font-mono font-bold text-[var(--color-accent-main)] uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} />
              <span>{isUrdu ? 'کوئیک ڈیمو کریڈینشلز' : 'Quick Showroom Demo Logins'}</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoShowroom('autochoice.peshawar@bazar360.online', 'Auto Choice Peshawar')}
                className="text-left p-2 rounded-xl bg-slate-800/90 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/50 transition-all text-[11px]"
              >
                <div className="font-bold text-amber-300">Auto Choice Peshawar</div>
                <div className="text-[9px] text-slate-400 font-mono">autochoice.peshawar</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoShowroom('mazhar.showroom@bazar360.online', 'Malak Mazhar Motors')}
                className="text-left p-2 rounded-xl bg-slate-800/90 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/50 transition-all text-[11px]"
              >
                <div className="font-bold text-amber-300">Malak Mazhar Motors</div>
                <div className="text-[9px] text-slate-400 font-mono">mazhar.showroom</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={isRegisteringShowroom ? handleRegisterNewShowroom : handleShowroomLogin}
            className="space-y-4 relative z-10"
          >
            {isRegisteringShowroom && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  {isUrdu ? 'شو روم کا نام' : 'Showroom Business Name'}
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={showroomName}
                    onChange={(e) => setShowroomName(e.target.value)}
                    placeholder="e.g. Peshawar Prime Motors"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[var(--color-accent-main)]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                {isUrdu ? 'یوزر نیم یا ای میل' : 'Showroom Username or Email'}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="e.g. autochoice.peshawar or email@bazar360.online"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[var(--color-accent-main)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                {isUrdu ? 'پاس ورڈ' : 'Password'}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[var(--color-accent-main)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isRegisteringShowroom && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                    {isUrdu ? 'شہر' : 'City Location'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[var(--color-accent-main)]"
                  >
                    <option value="Peshawar">Peshawar</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Karachi">Karachi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                    {isUrdu ? 'رابطہ نمبر' : 'Phone Contact'}
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+92 315 9085086"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[var(--color-accent-main)]"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--color-accent-main)] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{isUrdu ? 'پروسیسنگ...' : 'Authenticating...'}</span>
              ) : (
                <>
                  <span>
                    {isRegisteringShowroom
                      ? (isUrdu ? 'شو روم اکاؤنٹ رجسٹر کریں' : 'Register & Enter Showroom HQ')
                      : (isUrdu ? 'شو روم ڈیش بورڈ کھولیں' : 'Login To Showroom HQ Dashboard')}
                  </span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center flex items-center justify-between text-xs text-slate-400 relative z-10">
            <button
              type="button"
              onClick={() => {
                setIsRegisteringShowroom(!isRegisteringShowroom);
                setError(null);
              }}
              className="text-[var(--color-accent-main)] hover:underline font-bold"
            >
              {isRegisteringShowroom
                ? (isUrdu ? 'موجودہ شو روم لاگ ان کریں' : 'Already registered? Login here')
                : (isUrdu ? 'نیا شو روم رجسٹر کریں' : '+ Register New Showroom Dealership')}
            </button>

            <span className="text-[10px] text-slate-500 font-mono">
              Bazar360 HQ Portal
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
