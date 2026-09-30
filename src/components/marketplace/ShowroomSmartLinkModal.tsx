import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  KeyRound, 
  ShieldCheck, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles, 
  Lock, 
  Unlock, 
  Globe, 
  Share2, 
  MessageSquare,
  Save,
  AlertCircle
} from 'lucide-react';
import { Dealer } from '../../types';

interface ShowroomSmartLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealer: Dealer;
  onUpdateDealer: (updatedDealer: Dealer) => void;
}

export const ShowroomSmartLinkModal: React.FC<ShowroomSmartLinkModalProps> = ({
  isOpen,
  onClose,
  dealer,
  onUpdateDealer,
}) => {
  const [slug, setSlug] = useState<string>(dealer.smartSlug || 'AutoChoice01');
  const [passkey, setPasskey] = useState<string>(dealer.passkey || 'Choice360');
  const [isLocked, setIsLocked] = useState<boolean>(dealer.isPrivateLocked || false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);

  if (!isOpen) return null;

  const smartUrl = `https://bazar360.online/${slug.trim() || 'AutoChoice01'}`;
  const inviteMessage = `🚗 *Welcome to ${dealer.name} Official Showroom!*\n\nExplore our certified inventory, 200-point inspected cars, and book doorstep test drives:\n🔗 *Smart Link:* ${smartUrl}\n🔑 *Showroom Passkey:* ${passkey}\n\n📍 ${dealer.location}\n📞 WhatsApp: +${dealer.whatsapp || '923159085086'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(smartUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteMessage);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleSaveSettings = () => {
    const cleanSlug = slug.trim().replace(/[^a-zA-Z0-9_-]/g, '') || 'AutoChoice01';
    const cleanPasskey = passkey.trim() || 'Choice360';
    
    const updated: Dealer = {
      ...dealer,
      smartSlug: cleanSlug,
      passkey: cleanPasskey,
      isPrivateLocked: isLocked,
      customSmartUrl: `bazar360.online/${cleanSlug}`,
      updatedAt: new Date().toISOString(),
    };

    onUpdateDealer(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Sparkles size={14} />
            <span>Showroom Identity & Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Smart Link & Passkey Portal
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage your branded vanity URL and unique showroom access security for <span className="font-semibold text-white">{dealer.name}</span>.
          </p>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* 1. Smart Link Vanity Slug */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-blue-600" />
                <span>Showroom Smart Link Slug</span>
              </span>
              <span className="text-[10px] text-slate-400 normal-case">Instant short link</span>
            </label>

            <div className="flex rounded-xl shadow-xs border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <span className="inline-flex items-center px-3.5 bg-slate-100 text-slate-500 text-xs font-mono select-none border-r border-slate-200">
                bazar360.online/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="AutoChoice01"
                className="flex-1 min-w-0 block w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>Preview:</span>
              <span className="font-mono text-blue-600 font-semibold">{smartUrl}</span>
            </p>
          </div>

          {/* 2. Showroom Unique Passkey */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound size={14} className="text-amber-600" />
                <span>Showroom Passkey / Secret PIN</span>
              </span>
              <span className="text-[10px] text-amber-600 font-semibold normal-case">Easy to remember for clients</span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Choice360"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Clients and sales executives can use this passkey to verify exclusive access, VIP pricing, and direct dealer bookings.
            </p>
          </div>

          {/* 3. Access Lock Setting */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Require Passkey for VIP Entry</span>
                {isLocked ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock size={10} />
                    <span>Protected</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Unlock size={10} />
                    <span>Public</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {isLocked 
                  ? 'Visitors must enter the showroom passkey before viewing exclusive inventory.' 
                  : 'Showroom is openly accessible to all buyers on the marketplace.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLocked(!isLocked)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isLocked ? 'bg-amber-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isLocked ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Quick Share & Copy Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Direct Sharing
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Smart Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyInvite}
                className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedInvite ? <Check size={14} className="text-emerald-700" /> : <MessageSquare size={14} className="text-emerald-700" />}
                <span>{copiedInvite ? 'Invite Copied!' : 'Copy WhatsApp Invite'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-98"
          >
            {isSaved ? (
              <>
                <Check size={15} />
                <span>Updated & Saved!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Smart Link & Passkey</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
