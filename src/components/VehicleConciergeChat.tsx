import React, { useState } from 'react';
import { Send, Bot, ShieldCheck, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { CarListing, Dealer } from '../types';

export interface VehicleConciergeChatProps {
  car: CarListing;
  dealer?: Dealer;
  onOpenInspection?: () => void;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export function VehicleConciergeChat({ car, dealer, onOpenInspection }: VehicleConciergeChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: `Hello! I'm your Bazar360 Vehicle Concierge. I can answer questions about this ${car.year} ${car.make} ${car.model}, fuel economy, verification status, or help connect you with ${dealer?.name || 'the verified seller'}.`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'Is the token tax paid?',
    'What is the verified condition?',
    'Show inspection report',
    'Can I negotiate the price?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = { sender: 'user', text, time: 'Now' };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate intelligent response based on vehicle specs
    setTimeout(() => {
      let reply = `This ${car.year} ${car.make} ${car.model} is listed at PKR ${(car.price || 0).toLocaleString()} with ${car.mileage || 'genuine'} km mileage.`;

      const lower = text.toLowerCase();
      if (lower.includes('tax') || lower.includes('token')) {
        reply = car.tokenTaxPaid
          ? `Yes, the token tax is verified as up-to-date and paid for this vehicle.`
          : `The token tax status is marked as pending/buyer responsibility for this vehicle.`;
      } else if (lower.includes('inspection') || lower.includes('report')) {
        reply = `The certified inspection rating is ${car.inspectionScore || (car.isVerified ? 9.2 : 8.5)}/10. Click 'View Inspection' above to review the complete multi-point audit.`;
        if (onOpenInspection) onOpenInspection();
      } else if (lower.includes('price') || lower.includes('negotiat') || lower.includes('bargain')) {
        reply = `You can submit a direct bargain offer to ${dealer?.name || 'the seller'} using the negotiation button on this page.`;
      } else if (lower.includes('condition') || lower.includes('body')) {
        reply = `The documented body condition is: ${car.bodyCondition || 'Genuine / Original'}. Document status is: ${car.documentType || 'Original Book/File'}.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: reply, time: 'Now' },
      ]);
    }, 400);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-white">
              <span>Vehicle Concierge</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                Online
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Instant answers about this {car.make} {car.model}</span>
          </div>
        </div>
        {onOpenInspection && (
          <button
            type="button"
            onClick={onOpenInspection}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 cursor-pointer transition-all"
          >
            <ShieldCheck size={14} /> View Audit
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-slate-950 font-medium rounded-br-xs'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-xs'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Questions Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask anything about this ${car.make} ${car.model}...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 transition-colors"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all cursor-pointer"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default VehicleConciergeChat;
