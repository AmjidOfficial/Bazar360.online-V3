import React, { useState } from 'react';
import { ShowroomMember, Dealer } from '../types';
import { dbSaveTeamMember, dbDeleteTeamMember } from '../lib/dbService';
import { uploadBase64ToCloudinary } from '../lib/cloudinaryService';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Phone, 
  Mail, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Upload, 
  Shield, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShowroomTeamManagerProps {
  dealer: Dealer;
  isOwner?: boolean;
  onUpdateDealer?: (updated: Dealer) => void;
}

export function ShowroomTeamManager({ dealer, isOwner = false, onUpdateDealer }: ShowroomTeamManagerProps) {
  const [team, setTeam] = useState<ShowroomMember[]>(dealer.teamMembers || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ShowroomMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    title: string;
    phone: string;
    whatsapp: string;
    email: string;
    photoUrl: string;
    role: 'Owner' | 'Manager' | 'Sales Executive' | 'Salesperson' | 'Marketing' | 'Admin';
  }>({
    name: '',
    title: 'Sales Executive',
    phone: '',
    whatsapp: '',
    email: '',
    photoUrl: '',
    role: 'Sales Executive'
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      title: 'Sales Executive',
      phone: dealer.phone || '',
      whatsapp: dealer.whatsapp || dealer.phone || '',
      email: dealer.email || '',
      photoUrl: '',
      role: 'Sales Executive'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: ShowroomMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      title: member.title,
      phone: member.phone,
      whatsapp: member.whatsapp || member.phone,
      email: member.email || '',
      photoUrl: member.photoUrl || '',
      role: member.role || 'Sales Executive'
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = await uploadBase64ToCloudinary(reader.result as string);
          setFormData(prev => ({ ...prev, photoUrl: typeof result === 'string' ? result : (result as any).secure_url }));
          toast.success('Staff photo uploaded!');
        } catch (err) {
          toast.error('Failed to upload photo. Please try again.');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please enter Name and Phone number.');
      return;
    }

    setSaving(true);
    try {
      const memberId = editingMember ? editingMember.id : `staff-${Date.now()}`;
      
      // Clean phone number for WhatsApp link
      const cleanWhatsapp = formData.whatsapp.replace(/[^0-9+]/g, '');

      const memberToSave: ShowroomMember = {
        id: memberId,
        name: formData.name.trim(),
        title: formData.title.trim(),
        phone: formData.phone.trim(),
        whatsapp: cleanWhatsapp || formData.phone.replace(/[^0-9+]/g, ''),
        email: formData.email.trim(),
        photoUrl: formData.photoUrl,
        role: formData.role,
        active: true
      };

      const updatedTeam = await dbSaveTeamMember(dealer.id, memberToSave);
      setTeam(updatedTeam);
      
      if (onUpdateDealer) {
        onUpdateDealer({ ...dealer, teamMembers: updatedTeam });
      }

      toast.success(editingMember ? 'Staff member updated!' : 'Staff member added!');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save staff member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from staff?`)) return;

    try {
      const updatedTeam = await dbDeleteTeamMember(dealer.id, memberId);
      setTeam(updatedTeam);
      if (onUpdateDealer) {
        onUpdateDealer({ ...dealer, teamMembers: updatedTeam });
      }
      toast.success('Staff member removed.');
    } catch {
      toast.error('Failed to remove staff member.');
    }
  };

  const formatWhatsAppUrl = (phone: string, name: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '92' + clean.slice(1);
    }
    const message = encodeURIComponent(`Hi ${name}, I am contacting you regarding a vehicle listing on Bazar360 (${dealer.name}).`);
    return `https://wa.me/${clean}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-6 shadow-sm">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Users className="text-orange-500" size={22} />
            <h3 className="text-xl font-black font-display tracking-tight text-[var(--color-text-main)]">
              Showroom Staff & Sales Team
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Connect buyers directly with authorized showroom representatives via direct WhatsApp links.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer shrink-0"
          >
            <UserPlus size={16} /> Add Team Member
          </button>
        )}
      </div>

      {/* Staff Grid */}
      {team.length === 0 ? (
        <div className="bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-border-main)] rounded-3xl p-12 text-center space-y-3">
          <Users className="mx-auto text-slate-400 dark:text-slate-600 animate-pulse" size={40} />
          <h4 className="text-sm font-black uppercase tracking-wider text-[var(--color-text-main)]">
            No Team Members Added
          </h4>
          <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
            {isOwner 
              ? 'Add your sales managers and executives so buyers can reach out to specific representatives.' 
              : 'The showroom owner has not published team contact details yet.'}
          </p>
          {isOwner && (
            <button
              onClick={handleOpenAdd}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold text-xs hover:bg-orange-500/20 transition-all cursor-pointer"
            >
              <UserPlus size={14} /> Add First Member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {team.map((member) => (
            <div 
              key={member.id}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-5 space-y-4 shadow-sm hover:border-orange-500/30 transition-all relative flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Top Row: Avatar & Role */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border-2 border-orange-500/30 shrink-0 flex items-center justify-center text-white font-black text-lg uppercase shadow-inner">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name.substring(0, 2)
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-sm text-[var(--color-text-main)] line-clamp-1">
                        {member.name}
                      </h4>
                      <p className="text-[11px] font-bold text-orange-500 font-mono">
                        {member.title}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[9px] font-mono uppercase font-extrabold text-[var(--color-text-muted)]">
                        {member.role || 'Sales Rep'}
                      </span>
                    </div>
                  </div>

                  {/* Owner Controls */}
                  {isOwner && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
                        title="Edit Member"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact info list */}
                <div className="space-y-1.5 text-xs font-mono text-[var(--color-text-muted)] border-t border-[var(--color-border-main)] pt-3">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-orange-500 shrink-0" />
                    <span className="truncate">{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-cyan-500 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Call */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-[var(--color-border-main)] mt-3">
                <a
                  href={formatWhatsAppUrl(member.whatsapp || member.phone, member.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all font-bold text-xs"
                >
                  <MessageSquare size={14} /> WhatsApp
                </a>
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all font-bold text-xs"
                >
                  <Phone size={14} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-main)] pb-4">
              <div className="flex items-center gap-2">
                <Users className="text-orange-500" size={20} />
                <h3 className="text-lg font-black font-display text-[var(--color-text-main)]">
                  {editingMember ? 'Edit Staff Representative' : 'Add Team Representative'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-[var(--color-text-main)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              
              {/* Photo Upload */}
              <div className="flex items-center gap-4 bg-[var(--color-bg-primary)] p-3 rounded-2xl border border-[var(--color-border-main)]">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border border-orange-500/40 shrink-0 flex items-center justify-center text-white font-black text-xl">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    formData.name ? formData.name.substring(0, 2).toUpperCase() : '??'
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[var(--color-text-main)]">
                    Profile Photo
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-extrabold cursor-pointer hover:bg-orange-500/20 transition-all">
                    <Upload size={13} /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                  </label>
                  <p className="text-[9px] text-[var(--color-text-muted)]">Cloudinary powered high-res photo hosting.</p>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block font-bold text-[var(--color-text-main)]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammad Ali"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Title & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-[var(--color-text-main)]">
                    Title / Position
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Sales Director"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[var(--color-text-main)]">
                    Category Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                  >
                    <option value="Owner">Showroom Owner</option>
                    <option value="Manager">General Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Salesperson">Salesperson</option>
                    <option value="Marketing">Marketing / CRM</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-[var(--color-text-main)]">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0300-1234567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[var(--color-text-main)]">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="+923001234567"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block font-bold text-[var(--color-text-main)]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ali@showroom.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-[var(--color-text-main)] focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border-main)] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--color-border-main)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-black hover:bg-orange-600 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Representative'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
