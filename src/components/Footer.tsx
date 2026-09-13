import React, { useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react';
import { dbSaveSuggestion, Suggestion } from '../lib/dbService';
import Bazar360Logo from './Bazar360Logo';

interface FooterProps {
  lang?: 'en' | 'ur';
  setTab?: (tab: string) => void;
  onOpenSupportDrawer?: () => void;
}

export default function Footer({ lang = 'en', setTab }: FooterProps) {
  const [suggestionText, setSuggestionText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submitSuggestion = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = suggestionText.trim();
    if (!text || status === 'sending') return;
    setStatus('sending');
    try {
      const suggestion: Suggestion = { id: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, user_id: null, suggestion_text: text, submitted_at: new Date().toISOString() };
      await dbSaveSuggestion(suggestion);
      setSuggestionText('');
      setStatus('sent');
      window.setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
    }
  };

  const go = (tab: string) => setTab?.(tab);

  return (
    <footer className="b360-reference-footer">
      <div className="b360-shell">
        <div className="grid gap-12 pb-12 lg:grid-cols-[1.3fr_.8fr_.9fr_1fr]">
          <div>
            <Bazar360Logo variant="footer" theme="dark" size="lg" showTagline={false} />
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{lang === 'ur' ? 'پاکستان کا اسمارٹ آٹوموٹو مارکیٹ پلیس۔ اصل گاڑیاں، اصل شو رومز اور براہ راست رابطہ۔' : "Pakistan's smart automotive marketplace. Real vehicles, real showrooms and direct connections."}</p>
            <div className="mt-6 flex gap-2">
              {[
                ['Facebook', 'https://facebook.com/bazar360.online', Facebook],
                ['Instagram', 'https://instagram.com/bazar360.online', Instagram],
                ['YouTube', 'https://youtube.com/@bazar360online', Youtube],
                ['LinkedIn', 'https://linkedin.com/company/bazar360', Linkedin],
              ].map(([label, href, Icon]) => <a key={String(label)} href={String(href)} target="_blank" rel="noreferrer" className="b360-footer-social" aria-label={String(label)}><Icon size={15} /></a>)}
            </div>
          </div>

          <div>
            <h3 className="b360-footer-title">Quick links</h3>
            <ul className="b360-footer-links">
              <li><button type="button" onClick={() => go('inventory')}>Browse inventory</button></li>
              <li><button type="button" onClick={() => go('dealers')}>Verified showrooms</button></li>
              <li><button type="button" onClick={() => go('sell')}>Sell your vehicle</button></li>
              <li><button type="button" onClick={() => go('concierge')}>Auto services</button></li>
              <li><button type="button" onClick={() => go('community')}>Community</button></li>
              <li><button type="button" onClick={() => go('faq')}>FAQs</button></li>
            </ul>
          </div>

          <div>
            <h3 className="b360-footer-title">Contact</h3>
            <div className="space-y-4 text-sm text-slate-400">
              <a href="tel:+923159085086" className="flex items-start gap-3 hover:text-white"><Phone size={15} className="mt-1 text-orange-400" /><span>+92 315 9085086<br /><small className="text-xs text-slate-500">Auto Choice</small></span></a>
              <a href="tel:+923149198403" className="flex items-start gap-3 hover:text-white"><Phone size={15} className="mt-1 text-orange-400" /><span>+92 314 9198403<br /><small className="text-xs text-slate-500">Bazar360</small></span></a>
              <a href="mailto:info@bazar360.online" className="flex items-start gap-3 hover:text-white"><Mail size={15} className="mt-1 text-orange-400" /><span>info@bazar360.online</span></a>
              <div className="flex items-start gap-3"><MapPin size={15} className="mt-1 text-orange-400" /><span>Peshawar, Khyber Pakhtunkhwa<br />Pakistan</span></div>
            </div>
          </div>

          <div>
            <h3 className="b360-footer-title">Stay connected</h3>
            <p className="text-sm leading-6 text-slate-400">Send feedback or a suggestion. The message goes to the real Bazar360 feedback collection.</p>
            <form onSubmit={submitSuggestion} className="mt-4">
              <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <input value={suggestionText} onChange={(event) => setSuggestionText(event.target.value)} placeholder="Your suggestion" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500" aria-label="Your suggestion" />
                <button type="submit" className="grid min-w-12 place-items-center bg-orange-500 text-white" aria-label="Send suggestion"><Send size={15} /></button>
              </div>
              {status === 'sent' ? <p className="mt-2 text-xs text-emerald-400">Suggestion sent.</p> : null}
              {status === 'error' ? <p className="mt-2 text-xs text-rose-400">Could not send. Please try again.</p> : null}
            </form>
          </div>
        </div>

        <div className="b360-footer-bottom"><span>© {new Date().getFullYear()} Bazar360. All rights reserved.</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Real marketplace data</span><span>Driving connections. Building trust.</span></div>
      </div>
    </footer>
  );
}
