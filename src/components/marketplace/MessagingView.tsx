import React, { useState } from 'react';
import { MessageSquare, Send, Car, CheckCheck, Clock, User, ArrowLeft, Phone } from 'lucide-react';
import { CarListing } from '../../types';

interface MessagingViewProps {
  listings: CarListing[];
  formatPrice: (price: number) => string;
  initialVehicle?: CarListing | null;
}

interface Thread {
  id: string;
  senderName: string;
  senderPhone: string;
  vehicle: CarListing;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Array<{ id: string; sender: 'me' | 'them'; text: string; time: string }>;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  listings,
  formatPrice,
  initialVehicle,
}) => {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 'thread-1',
      senderName: 'Auto Choice Flagship Showroom',
      senderPhone: '0300-9876543',
      vehicle: initialVehicle || listings[0] || {} as CarListing,
      lastMessage: 'The car is available for inspection at our showroom.',
      time: '10:45 AM',
      unread: false,
      messages: [
        { id: 'm1', sender: 'me', text: 'Hi! Is this vehicle still available for inspection?', time: '10:40 AM' },
        { id: 'm2', sender: 'them', text: 'Yes, it is available at our main Ring Road showroom with complete original documents.', time: '10:45 AM' },
      ],
    },
    {
      id: 'thread-2',
      senderName: 'Tariq Mehmood (Private Seller)',
      senderPhone: '0333-1234567',
      vehicle: listings[1] || listings[0] || {} as CarListing,
      lastMessage: 'Token tax is completely paid till June 2026.',
      time: 'Yesterday',
      unread: false,
      messages: [
        { id: 'm1', sender: 'me', text: 'Is the token tax up to date?', time: 'Yesterday' },
        { id: 'm2', sender: 'them', text: 'Token tax is completely paid till June 2026.', time: 'Yesterday' },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || !activeThread) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: message,
          time: 'Just now',
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    }));

    setInputText('');

    // Simulate instant dealership automated response
    setTimeout(() => {
      const replyMsg = {
        id: `msg-reply-${Date.now()}`,
        sender: 'them' as const,
        text: 'Thank you for reaching out! You can also connect directly on WhatsApp or visit our location anytime between 10 AM to 9 PM.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            lastMessage: replyMsg.text,
            time: 'Just now',
            messages: [...t.messages, replyMsg],
          };
        }
        return t;
      }));
    }, 1200);
  };

  const quickPrompts = [
    'Is this car available?',
    'What is your final cash demand?',
    'When can I schedule a test drive?',
    'Are documents 100% verified?',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs h-[calc(100vh-8rem)] flex flex-col md:flex-row">
      
      {/* 1. Conversations Left Column */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            <span>Direct Messages</span>
          </h2>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            {threads.length} Chats
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {threads.map((t) => {
            const isSelected = t.id === activeThread?.id;
            return (
              <div
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-sm">
                  {t.senderName[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{t.senderName}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{t.time}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 truncate block">
                    {t.vehicle?.title || 'Vehicle'}
                  </span>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{t.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Active Chat Window */}
      {activeThread ? (
        <div className={`flex-1 flex flex-col bg-slate-50/40 ${activeThreadId ? 'flex' : 'hidden md:flex'}`}>
          
          {/* Top Bar with Pinned Vehicle Context */}
          <div className="bg-white p-3.5 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button 
                onClick={() => setActiveThreadId('')}
                className="md:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className="font-bold text-xs text-slate-900 truncate">{activeThread.senderName}</h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online on Bazar360</span>
                </span>
              </div>
            </div>

            {/* Pinned Vehicle Mini-Card */}
            {activeThread.vehicle?.title && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 shrink-0 max-w-[220px] sm:max-w-xs">
                <img 
                  src={activeThread.vehicle.imageUrl || activeThread.vehicle.images?.[0]} 
                  alt="" 
                  className="w-8 h-8 rounded-lg object-cover" 
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 truncate">{activeThread.vehicle.title}</div>
                  <div className="text-[10px] font-black text-blue-600">{formatPrice(activeThread.vehicle.price)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeThread.messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm rounded-2xl px-4 py-2.5 text-xs shadow-2xs space-y-1 ${
                    isMe ? 'bg-blue-600 text-white rounded-tr-xs' : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs'
                  }`}>
                    <p className="leading-relaxed">{m.text}</p>
                    <div className={`text-[9px] flex items-center justify-end gap-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                      <span>{m.time}</span>
                      {isMe && <CheckCheck size={11} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[11px] font-semibold text-slate-600 shrink-0 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your inquiry here..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-slate-400 text-xs">
          Select a conversation from the left to start messaging.
        </div>
      )}

    </div>
  );
};
