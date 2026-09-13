import React, { useState } from 'react';
import { Dealer } from '../types';
import { dbUpdateDealer } from '../lib/dbService';
import { uploadBase64ToCloudinary } from '../lib/cloudinaryService';
import { 
  Building2, 
  Upload, 
  Trash2, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Image as ImageIcon,
  ShieldCheck,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShowroomFacilityGalleryProps {
  dealer: Dealer;
  isOwner?: boolean;
  onUpdateDealer?: (updated: Dealer) => void;
}

const DEFAULT_FACILITY_PRESETS = [
  'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'
];

export function ShowroomFacilityGallery({ dealer, isOwner = false, onUpdateDealer }: ShowroomFacilityGalleryProps) {
  const [gallery, setGallery] = useState<string[]>(
    (dealer.gallery && dealer.gallery.length > 0) ? dealer.gallery : DEFAULT_FACILITY_PRESETS
  );
  const [uploading, setUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    toast.loading('Uploading facility photo to Cloudinary...', { id: 'facility-upload' });

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const result = await uploadBase64ToCloudinary(reader.result as string);
              newUrls.push(typeof result === 'string' ? result : (result as any).secure_url);
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsDataURL(file);
        });
      }

      const updatedGallery = [...newUrls, ...gallery];
      setGallery(updatedGallery);

      // Save to Firestore
      await dbUpdateDealer(dealer.id, {
        gallery: updatedGallery,
        media: updatedGallery
      });

      if (onUpdateDealer) {
        onUpdateDealer({
          ...dealer,
          gallery: updatedGallery,
          media: updatedGallery
        });
      }

      toast.success('Facility photo uploaded successfully!', { id: 'facility-upload' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image. Please try again.', { id: 'facility-upload' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (urlToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this photo from showroom facility gallery?')) return;

    try {
      const updatedGallery = gallery.filter(url => url !== urlToDelete);
      setGallery(updatedGallery);

      await dbUpdateDealer(dealer.id, {
        gallery: updatedGallery
      });

      if (onUpdateDealer) {
        onUpdateDealer({
          ...dealer,
          gallery: updatedGallery
        });
      }

      toast.success('Photo removed.');
    } catch {
      toast.error('Failed to remove photo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-6 shadow-sm">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Building2 className="text-orange-500" size={22} />
            <h3 className="text-xl font-black font-display tracking-tight text-[var(--color-text-main)]">
              Physical Showroom Premises & Facilities
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Explore photos of {dealer.name}'s physical building, executive lounge, showroom floor, and office premises.
          </p>
        </div>

        {isOwner && (
          <label className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer shrink-0">
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Facility Photo'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-border-main)] rounded-3xl p-12 text-center space-y-3">
          <ImageIcon className="mx-auto text-slate-400 dark:text-slate-600" size={40} />
          <h4 className="text-sm font-black uppercase tracking-wider text-[var(--color-text-main)]">
            No Facility Photos Uploaded
          </h4>
          <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
            {isOwner 
              ? 'Upload high-resolution photos of your showroom entrance, executive office, and customer lounge to build trust with online buyers.'
              : 'This dealer has not uploaded photos of their physical premises yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-[var(--color-border-main)] cursor-pointer shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all"
            >
              <img
                src={imgUrl}
                alt={`${dealer.name} Facility ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/20">
                    Facility Photo #{index + 1}
                  </span>
                  {isOwner && (
                    <button
                      onClick={(e) => handleDeleteImage(imgUrl, e)}
                      className="p-2 rounded-xl bg-rose-500/80 text-white hover:bg-rose-600 transition-colors shadow-lg"
                      title="Remove Photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Building2 size={14} className="text-orange-400" /> {(dealer as any).city || dealer.location || 'Showroom Premises'}
                  </span>
                  <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors">
                    <Maximize2 size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
          
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)}
            className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next button */}
          <button
            onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}
            className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
          >
            <ChevronRight size={28} />
          </button>

          {/* Main Image */}
          <div className="max-w-5xl max-h-[85vh] space-y-3 text-center">
            <img
              src={gallery[lightboxIndex]}
              alt={`Facility View ${lightboxIndex + 1}`}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain mx-auto border border-white/20 shadow-2xl"
            />
            <div className="text-white space-y-1">
              <h4 className="font-extrabold text-base tracking-tight">{dealer.name} — Showroom Premises</h4>
              <p className="text-xs text-slate-400 font-mono">
                Photo {lightboxIndex + 1} of {gallery.length} • Certified Facility Inspection
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
