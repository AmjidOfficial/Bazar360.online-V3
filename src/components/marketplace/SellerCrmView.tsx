import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Zap, 
  Snowflake, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Search,
  Car,
  ChevronRight
} from 'lucide-react';
import { Lead, CarListing } from '../../types';

interface SellerCrmViewProps {
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: Lead['status']) => void;
  onAddNewLead: (lead: Partial<Lead>) => void;
  listings: CarListing[];
}

export const SellerCrmView: React.FC<SellerCrmViewProps> = ({
  leads,
  onUpdateLeadStatus,
  onAddNewLead,
  listings,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New Lead Form State
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerPhone, setNewBuyerPhone] = useState('');
  const [newBuyerEmail, setNewBuyerEmail] = useState('');
  const [newVehicleId, setNewVehicleId] = useState(listings[0]?.id || '');
  const [newNotes, setNewNotes] = useState('');

  const stages: Array<{ id: Lead['status']; label: string; color: string }> = [
    { id: 'New', label: 'New Inquiries', color: 'border-blue-500' },
    { id: 'Contacted', label: 'Contacted', color: 'border-amber-500' },
    { id: 'Pending', label: 'Test Drive / Visit', color: 'border-purple-500' },
    { id: 'Approved', label: 'Negotiation', color: 'border-indigo-500' },
    { id: 'Converted', label: 'Won / Sold', color: 'border-emerald-500' },
    { id: 'Lost', label: 'Lost / Closed', color: 'border-slate-300' },
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedVehicle = listings.find(l => l.id === newVehicleId);
    
    onAddNewLead({
      id: `lead-${Date.now()}`,
      userName: newBuyerName,
      userPhone: newBuyerPhone,
      userEmail: newBuyerEmail || `${newBuyerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      vehicleId: newVehicleId,
      vehicleTitle: matchedVehicle?.title || 'Vehicle Inquiry',
      vehiclePrice: matchedVehicle?.price || 0,
      vehicleImage: matchedVehicle?.imageUrl || '',
      inquiryMessage: newNotes || 'Interested in vehicle inspection and pricing.',
      inquiryDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'New',
    });

    setNewBuyerName('');
    setNewBuyerPhone('');
    setNewBuyerEmail('');
    setNewNotes('');
    setShowAddLeadModal(false);
  };

  const filteredLeads = leads.filter(l => {
    if (activeFilter !== 'All' && l.status !== activeFilter) return false;
    if (searchLeadQuery && !l.userName?.toLowerCase().includes(searchLeadQuery.toLowerCase()) && !l.vehicleTitle?.toLowerCase().includes(searchLeadQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. CRM Metrics Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users size={22} className="text-blue-600" />
              <span>Seller CRM & Lead Pipeline</span>
            </h1>
            <p className="text-xs text-slate-500">
              Track buyer inquiries, test drive requests, and close sales faster.
            </p>
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Manual Lead</span>
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Leads</span>
            <span className="text-xl font-black text-slate-900 block mt-0.5">{leads.length}</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Active Pipeline</span>
            <span className="text-xl font-black text-blue-600 block mt-0.5">
              {leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Closed Won</span>
            <span className="text-xl font-black text-emerald-600 block mt-0.5">
              {leads.filter(l => l.status === 'Converted').length}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Active Listings</span>
            <span className="text-xl font-black text-slate-900 block mt-0.5">{listings.length}</span>
          </div>
        </div>
      </div>

      {/* 2. Pipeline Controls (Search & Filter) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchLeadQuery}
            onChange={(e) => setSearchLeadQuery(e.target.value)}
            placeholder="Search buyer name or car..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'New', 'Contacted', 'Pending', 'Approved', 'Converted'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                activeFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Pipeline Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {stages.map((col) => {
          const colLeads = filteredLeads.filter(l => (l.status || 'New') === col.id);

          return (
            <div key={col.id} className="bg-slate-100/80 rounded-2xl p-3 space-y-3 min-h-[360px]">
              
              {/* Column Header */}
              <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
                <span className="text-xs font-bold text-slate-800">{col.label}</span>
                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full text-slate-700 shadow-2xs">
                  {colLeads.length}
                </span>
              </div>

              {/* Lead Cards */}
              <div className="space-y-2.5">
                {colLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400">
                    No leads in this stage
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const cleanPhone = lead.userPhone?.replace(/\D/g, '') || '923001234567';
                    const waText = encodeURIComponent(`Hi ${lead.userName}, thank you for inquiring about ${lead.vehicleTitle || 'the vehicle'} on Bazar360.`);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                      >
                        {/* Buyer Info */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 leading-snug">{lead.userName}</h4>
                            <span className="text-[10px] text-slate-400 block font-mono">{lead.userPhone}</span>
                          </div>

                          {/* Lead Activity Score */}
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Flame size={10} className="text-amber-500 fill-amber-500" />
                            <span>Hot</span>
                          </span>
                        </div>

                        {/* Inquired Vehicle Card */}
                        {lead.vehicleTitle && (
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[11px]">
                            <span className="font-semibold text-slate-800 line-clamp-1">{lead.vehicleTitle}</span>
                            {lead.inquiryMessage && (
                              <p className="text-slate-500 text-[10px] mt-0.5 line-clamp-2 italic">
                                "{lead.inquiryMessage}"
                              </p>
                            )}
                          </div>
                        )}

                        {/* Direct Action Triggers (WhatsApp & Call) */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <MessageSquare size={11} />
                            <span>WhatsApp</span>
                          </a>

                          {lead.userPhone && (
                            <a
                              href={`tel:${lead.userPhone}`}
                              className="px-2 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center hover:bg-slate-50"
                            >
                              <Phone size={11} />
                            </a>
                          )}
                        </div>

                        {/* Stage Mover Selector */}
                        <div className="pt-1.5 border-t border-slate-100">
                          <select
                            value={lead.status || 'New'}
                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-700 p-1 cursor-pointer"
                          >
                            <option value="New">Stage: New Inquiry</option>
                            <option value="Contacted">Stage: Contacted</option>
                            <option value="Pending">Stage: Test Drive</option>
                            <option value="Approved">Stage: Negotiation</option>
                            <option value="Converted">Stage: Won / Sold</option>
                            <option value="Lost">Stage: Lost</option>
                          </select>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. Add Manual Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Buyer Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Buyer Full Name</label>
                <input
                  type="text"
                  required
                  value={newBuyerName}
                  onChange={(e) => setNewBuyerName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={newBuyerPhone}
                  onChange={(e) => setNewBuyerPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquired Vehicle</label>
                <select
                  value={newVehicleId}
                  onChange={(e) => setNewVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                >
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>{l.title} ({l.year})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Inquired about cash price & physical inspection timing."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  Save Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
