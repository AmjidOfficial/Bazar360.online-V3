import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, Mail, Phone, Sparkles, X } from 'lucide-react';
import { Dealer } from '../types';
import { dbToggleDealerSubscription, dbFetchDealerSubscriptionStatus } from '../lib/dbService';
import { toast } from 'react-hot-toast';

interface ShowroomSubscriptionToggleProps {
  dealer: Dealer;
  currentUser?: { uid?: string; email?: string } | null;
  className?: string;
}

export function ShowroomSubscriptionToggle({ dealer, currentUser, className = '' }: ShowroomSubscriptionToggleProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState(currentUser?.email || '');
  const [subscriberPhone, setSubscriberPhone] = useState('');

  const visitorId = currentUser?.uid || (() => {
    try {
      return localStorage.getItem('bazar360_visitor_id') || 'anon_visitor';
    } catch {
      return 'anon_visitor';
    }
  })();

  useEffect(() => {
    if (dealer?.id) {
      dbFetchDealerSubscriptionStatus(dealer.id, visitorId).then(setIsSubscribed);
    }
  }, [dealer?.id, visitorId]);

  const handleToggleClick = () => {
    if (isSubscribed) {
      // Unsubscribe directly
      executeToggle();
    } else {
      // If no email attached, prompt email modal or execute directly
      if (!currentUser?.email && !subscriberEmail) {
        setShowEmailModal(true);
      } else {
        executeToggle();
      }
    }
  };

  const executeToggle = async (overrideEmail?: string) => {
    setLoading(true);
    try {
      const emailToUse = overrideEmail || subscriberEmail || currentUser?.email || '';
      const newState = await dbToggleDealerSubscription(dealer.id, dealer.name, visitorId, emailToUse);
      
      setIsSubscribed(newState);

      if (newState) {
        toast.success(
          `🔔 Subscribed to ${dealer.name}! You will receive real-time alerts whenever new vehicles are listed.`,
          { duration: 5000 }
        );
      } else {
        toast.success(`Unsubscribed from ${dealer.name} inventory alerts.`);
      }

      setShowEmailModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update subscription preference.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim() && !subscriberPhone.trim()) {
      toast.error('Please enter an Email or Phone number to receive alerts.');
      return;
    }
    executeToggle(subscriberEmail);
  };

  return (
    <div className={`inline-block ${className}`}>
      <button
        onClick={handleToggleClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md border ${
          isSubscribed
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent hover:from-orange-600 hover:to-amber-600'
        }`}
        title={isSubscribed ? 'Click to unsubscribe' : 'Get instant alerts when this dealer posts new inventory'}
      >
        {isSubscribed ? (
          <>
            <BellRing className="text-emerald-500" size={16} />
            <span>Subscribed to Alerts</span>
            <Check size={14} className="text-emerald-500" />
          </>
        ) : (
          <>
            <BellRing size={16} className="animate-pulse" />
            <span>Subscribe for New Inventory Alerts</span>
          </>
        )}
      </button>

      {/* Email Input Modal for Anonymous Visitors */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-[var(--color-border-main)] pb-3">
              <div className="flex items-center gap-2">
                <BellRing className="text-orange-500" size={20} />
                <h3 className="text-base font-black font-display text-[var(--color-text-main)]">
                  Inventory Alert Subscription
                </h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-[var(--color-text-main)]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Get instant automated notifications whenever <strong className="text-[var(--color-text-main)]">{dealer.name}</strong> lists a new vehicle or drops prices.
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-[var(--color-text-main)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={subscriberEmail}
                    onChange={e => setSubscriberEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[var(--color-text-main)]">
                  WhatsApp Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="tel"
                    placeholder="0300-1234567"
                    value={subscriberPhone}
                    onChange={e => setSubscriberPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border-main)]">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white font-black hover:bg-orange-600 transition-all shadow-md"
                >
                  {loading ? 'Subscribing...' : 'Confirm Subscription'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
