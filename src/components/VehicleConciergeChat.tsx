import React, { useState, useRef, useEffect } from 'react';
import { CarListing, Dealer } from '../types';
import { Sparkles, Send, Bot, User, RefreshCw, Copy, Check, MessageSquare, Fuel, Wrench, ShieldAlert, BadgePercent, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cinematicAudio } from '../lib/cinematicAudio';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface VehicleConciergeChatProps {
  car: CarListing;
  dealer?: Dealer;
  onOpenInspection?: () => void;
  lang?: 'en' | 'ur';
}

export const VehicleConciergeChat: React.FC<VehicleConciergeChatProps> = ({
  car,
  dealer,
  onOpenInspection,
  lang = 'en'
}) => {
  const carTitle = `${car.year || ''} ${car.make || ''} ${car.model || ''} ${car.variant || ''}`.trim() || car.title || 'Vehicle';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am your **Bazar360 AI Vehicle Concierge** for this **${carTitle}**.\n\nAsk me anything about its **real-world fuel average**, **routine maintenance intervals**, **known Pakistani market watchpoints**, or **parts availability**. How can I assist your evaluation today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    {
      label: '⛽ Fuel Average',
      query: `What is the expected real-world fuel economy (city & highway) for this ${car.year} ${car.make} ${car.model} in Pakistani traffic conditions?`,
      icon: Fuel
    },
    {
      label: '🔧 Maintenance Schedule',
      query: `What are the recommended maintenance intervals (oil viscosity, spark plugs, fluids) for this ${car.engineCC || ''}cc engine at ${car.mileage ? Number(car.mileage).toLocaleString() + ' km' : 'current mileage'}?`,
      icon: Wrench
    },
    {
      label: '⚠️ Buyer Watchpoints',
      query: `What are the top 3-5 mechanical or electrical watchpoints to inspect on a ${car.year} ${car.make} ${car.model} (${car.transmission})?`,
      icon: ShieldAlert
    },
    {
      label: '💰 Parts & Resale',
      query: `How easy is it to source genuine replacement parts in Pakistan, and what is the market resale liquidity for this model?`,
      icon: BadgePercent
    },
    {
      label: '📑 Tax & Transfer',
      query: `Given that the token tax is ${car.tokenTaxPaid ? 'Paid' : 'Unpaid'} and document is ${car.documentType || 'Smart Card'}, what should I verify during the ownership transfer?`,
      icon: FileText
    }
  ];

  const handleSendMessage = async (userText: string) => {
    const query = userText.trim();
    if (!query || loading) return;

    cinematicAudio.playClick();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date()
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Build history for backend API
      const historyPayload = newHistory.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/ai/vehicle-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: car,
          message: query,
          history: historyPayload.slice(-8), // Keep relevant recent context
          lang
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || "I've reviewed the vehicle details. Please ask about any specific maintenance or features.";

      cinematicAudio.playTick();

      setMessages(prev => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: replyText,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error('[Vehicle Concierge] Chat error:', err);
      // Friendly fallback
      setMessages(prev => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: `For this **${car.year} ${car.make} ${car.model}**:\n\n• **Engine & Powertrain:** ${car.engineCC ? `${car.engineCC}cc` : ''} ${car.transmission} ${car.fuelType}.\n• **Mileage Check:** At ${car.mileage ? `${Number(car.mileage).toLocaleString()} km` : 'current mileage'}, verify transmission fluid, brake pads, and suspension bushings.\n• **Advisory:** You can contact the seller directly or book an official Bazar360 200+ Point Inspection.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    cinematicAudio.playTick();
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Chat reset. I am ready to answer any questions about the **${carTitle}**. Choose a prompt or type below!`,
        timestamp: new Date()
      }
    ]);
  };

  // Helper function to render formatted text with markdown-like bold and bullet styling
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-[var(--color-text-main)]">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
          const cleanLine = isBullet ? line.trim().replace(/^[•\-\*]\s*/, '') : line;

          // Parse **bold** parts
          const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
          const parsedContent = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-[var(--color-text-header)]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[var(--color-accent-main)] font-bold shrink-0 mt-0.5">•</span>
                <span className="flex-1">{parsedContent}</span>
              </div>
            );
          }

          return <p key={idx}>{parsedContent}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl overflow-hidden shadow-sm transition-all text-left">
      {/* Concierge Header */}
      <div className="p-4 sm:p-5 border-b border-[var(--color-border-main)] bg-gradient-to-r from-[var(--color-accent-main)]/10 via-transparent to-[var(--color-accent-main)]/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-accent-main)]/15 border border-[var(--color-accent-main)]/30 text-[var(--color-accent-main)] flex items-center justify-center shadow-inner shrink-0">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black font-display uppercase tracking-wider text-[#26344F] dark:text-[var(--color-text-header)]">
                AI Vehicle Concierge
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Gemini 2.5
              </span>
            </div>
            <p className="text-[11px] font-mono text-[var(--color-text-muted)]">
              Ask technical questions, fuel averages & maintenance history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-primary)] border border-transparent hover:border-[var(--color-border-main)] transition-all cursor-pointer"
            title="Reset Conversation"
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-primary)] border border-transparent hover:border-[var(--color-border-main)] transition-all cursor-pointer"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* Quick Prompt Chips Carousel */}
            <div className="p-3 sm:p-4 border-b border-[var(--color-border-main)]/60 bg-[var(--color-bg-primary)]/40 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1 mr-1">
                  <MessageSquare size={12} className="text-[var(--color-accent-main)]" />
                  Suggested:
                </span>
                {quickPrompts.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSendMessage(p.query)}
                      className="px-3 py-1.5 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-accent-main)]/15 border border-[var(--color-border-main)] hover:border-[var(--color-accent-main)]/40 text-[var(--color-text-main)] hover:text-[var(--color-accent-main)] text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 disabled:opacity-50"
                    >
                      <Icon size={12} className="text-[var(--color-accent-main)]" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat History Container */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[380px] sm:max-h-[440px] overflow-y-auto bg-[var(--color-bg-primary)]/20">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[var(--color-accent-main)]/15 border border-[var(--color-accent-main)]/30 text-[var(--color-accent-main)] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 relative group shadow-sm ${
                        isUser
                          ? 'bg-[var(--color-accent-main)] text-[#090D14] rounded-tr-xs font-medium font-sans'
                          : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] rounded-tl-xs'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                          {m.text}
                        </p>
                      ) : (
                        <div>
                          {renderFormattedText(m.text)}
                          
                          <div className="mt-3 pt-2 border-t border-[var(--color-border-main)]/50 flex items-center justify-between gap-2">
                            <span className="text-[9px] font-mono text-[var(--color-text-muted)]">
                              Bazar360 AI Analysis
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(m.text, m.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-accent-main)] transition-colors cursor-pointer"
                              title="Copy Answer"
                            >
                              {copiedId === m.id ? (
                                <>
                                  <Check size={11} className="text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <User size={15} />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-accent-main)]/15 border border-[var(--color-accent-main)]/30 text-[var(--color-accent-main)] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot size={16} />
                  </div>
                  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-2xl rounded-tl-xs p-4 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent-main)] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent-main)] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent-main)] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs font-mono text-[var(--color-text-muted)] ml-2">
                      Consulting vehicle registry & maintenance specs...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 sm:p-4 border-t border-[var(--color-border-main)] bg-[var(--color-bg-secondary)] flex items-center gap-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about this ${car.make || 'car'}'s maintenance, AC, parts or fuel average...`}
                disabled={loading}
                className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] focus:border-[var(--color-accent-main)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-inner disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-3 bg-[var(--color-accent-main)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-[#090D14] font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
              >
                <span>Ask</span>
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleConciergeChat;
