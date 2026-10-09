import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  Info, 
  AlertCircle,
  Car,
  CheckCircle,
  Clock,
  Save,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkle,
  Eye,
  Sliders,
  Search
} from 'lucide-react';
import { translations, Language } from '../translations';
import { dbSaveListing } from '../lib/dbService';
import { CarListing, Dealer } from '../types';
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinaryService';
import { applyWatermark } from '../services/WatermarkService';
import { CAR_MODELS } from '../lib/pakistanCarData';

interface UploadingMedia {
  id: string;
  file: File;
  previewUrl: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  error?: string;
}

interface DetailedVehiclePostingPageProps {
  onPostCreated?: (payload: CarListing) => void;
  lang?: Language;
  currentUser?: any;
  contextDealerId?: string;
  dealers?: Dealer[];
}

const VEHICLE_TYPES = [
  { id: 'car', labelKey: 'car' },
  { id: 'suv', labelKey: 'suvJeep' },
  { id: 'van', labelKey: 'van' },
  { id: 'motorcycle', labelKey: 'motorcycle' },
  { id: 'truck', labelKey: 'truck' },
  { id: 'bus', labelKey: 'bus' },
  { id: 'commercial', labelKey: 'commercial' }
];

const VARIANTS_DICTIONARY: Record<string, string[]> = {
  'Corolla': ['XLi', 'GLi', 'Altis', 'Grande', 'SR', '1.6', '1.8'],
  'Yaris': ['GLI 1.3', 'ATIV 1.3', 'ATIV X 1.5', 'Aero'],
  'Fortuner': ['G 2.7', 'Sigma 4 2.8', 'Legender', 'GR-S'],
  'Hilux': ['Single Cabin', 'Double Cabin', 'Revo G', 'Revo V', 'Revo Rocco'],
  'Land Cruiser': ['ZX', 'VX', 'AX', 'TX', 'TX-L', 'Prado'],
  'Aqua': ['L', 'S', 'G', 'G LED', 'GR Sport'],
  'Vitz': ['F 1.0', 'U 1.3', 'Jewela', 'RS 1.5'],
  'Civic': ['VTi Oriel', 'RS Turbo', 'Exi', 'Prosmatec', 'Type R'],
  'City': ['i-VTEC 1.2', 'i-VTEC 1.5', 'Aspire 1.5', 'EX', 'Steermatic'],
  'Vezel': ['G', 'X', 'Z', 'RS Hybrid', 'Play'],
  'Alto': ['VX', 'VXR', 'VXL', 'Sene', 'L', 'G', 'Turbo RS'],
  'Cultus': ['VX', 'VXR', 'VXL', 'Euro II', 'AGS'],
  'Wagon R': ['VX', 'VXR', 'VXL', 'FX', 'FZ'],
  'Swift': ['DX', 'DLX', 'GL', 'GLX', 'GLX CVT'],
  'Mehran': ['VX', 'VXR', 'VX CNG', 'VXR CNG'],
  'Dayz': ['S', 'X', 'Highway Star', 'Bolero'],
  'Note': ['S', 'X', 'E-Power', 'Medalist'],
  'Juke': ['15RX', '15RS', '16GT', 'Nismo']
};

// Exactly 5 tactile items per category according to the master ad-posting wizard spec
const EXTERIOR_FEATURES = [
  'Alloy Rims',
  'Fog Lights',
  'Sunroof',
  'Retractable Mirrors',
  'Body Kit'
];

const INTERIOR_FEATURES = [
  'Power Windows',
  'Power Steering',
  'Central Locking',
  'Heated Seats',
  'Leather Seats'
];

const TECH_FEATURES = [
  'Push Start',
  'Keyless Entry',
  'Cruise Control',
  'Climate Control',
  'Rear Camera'
];

const SAFETY_FEATURES = [
  'Dual Airbags',
  'ABS',
  'Traction Control',
  'Immobilizer Key',
  'Parking Sensors'
];

const DESCRIPTION_AI_QUICK_TAGS = [
  'First Owner',
  'Family Used',
  'Bumper to Bumper Genuine',
  'Islamabad Registered',
  'Peshawar Registered',
  'Excellent Mileage',
  'Non-Accidental',
  'Urgent Sale',
  'Engine 10/10',
  'Suspension 10/10',
  'Scratchless Exterior',
  'All Taxes Paid',
  'Smart Card Available'
];

export default function DetailedVehiclePostingPage({ onPostCreated, lang = 'en', currentUser, contextDealerId, dealers = [] }: DetailedVehiclePostingPageProps) {
  const t = translations[lang];

  // 6-Step Wizard State (1: Core Info, 2: Exterior, 3: Interior, 4: Tech, 5: Safety, 6: Media & Review)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // PAGE 1: Basic Vehicle Info (Core Details)
  const [vehicleType, setVehicleType] = useState('car');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Corolla');
  const [customModel, setCustomModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [engineCC, setEngineCC] = useState('1300');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>('Petrol');
  const [color, setColor] = useState('');
  const [registrationCity, setRegistrationCity] = useState('');
  const [condition, setCondition] = useState<'New' | 'Used'>('Used');
  const [bodyCondition, setBodyCondition] = useState<'Total Genuine' | 'Minor Touch-ups' | 'Major Repaint'>('Total Genuine');
  const [assemblyType, setAssemblyType] = useState<'Local' | 'Imported'>('Local');

  // Redesign Spec States
  const [registrationYear, setRegistrationYear] = useState<string>('2023');
  const [makeModelQuery, setMakeModelQuery] = useState('Toyota Corolla');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customVariant, setCustomVariant] = useState('');
  const [isCustomVariantActive, setIsCustomVariantActive] = useState(false);
  const [isCustomCCActive, setIsCustomCCActive] = useState(false);
  const [customCC, setCustomCC] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [isCustomColorActive, setIsCustomColorActive] = useState(false);
  const [customDescription, setCustomDescription] = useState('');
  const [allowWhatsApp, setAllowWhatsApp] = useState(true);

  const ALL_MAKE_MODELS = useMemo(() => {
    const list: { make: string; model: string }[] = [];
    Object.entries(CAR_MODELS).forEach(([mk, mdls]) => {
      mdls.forEach((mdl) => {
        list.push({ make: mk, model: mdl });
      });
    });
    return list;
  }, []);

  const filteredMakeModels = useMemo(() => {
    if (!makeModelQuery.trim()) return [];
    const q = makeModelQuery.toLowerCase();
    return ALL_MAKE_MODELS.filter(
      (item) =>
        item.make.toLowerCase().includes(q) || item.model.toLowerCase().includes(q)
    );
  }, [makeModelQuery, ALL_MAKE_MODELS]);

  const POPULAR_MODELS = useMemo(() => [
    { make: 'Suzuki', model: 'Alto' },
    { make: 'Toyota', model: 'Corolla' },
    { make: 'Honda', model: 'Civic' },
    { make: 'Honda', model: 'City' },
    { make: 'Suzuki', model: 'Wagon R' },
    { make: 'Toyota', model: 'Aqua' },
    { make: 'Toyota', model: 'Land Cruiser' }
  ], []);

  // Seller & Showroom Details (Page 1)
  const [postingMode, setPostingMode] = useState<'individual' | 'showroom'>('individual');
  const [selectedShowroomForPost, setSelectedShowroomForPost] = useState<string>(contextDealerId || (dealers[0]?.id || 'auto-choice-peshawar'));
  const [sellerName, setSellerName] = useState(currentUser?.displayName || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phoneNumber || '');
  const [sellerWhatsApp, setSellerWhatsApp] = useState(currentUser?.phoneNumber || '');
  const [location, setLocation] = useState(currentUser?.city || 'Peshawar, Pakistan');

  // PAGE 2: Exterior & Appearance Toggles
  const [selectedExteriorFeatures, setSelectedExteriorFeatures] = useState<string[]>([]);

  // PAGE 3: Interior & Comfort Toggles
  const [selectedInteriorFeatures, setSelectedInteriorFeatures] = useState<string[]>([]);

  // PAGE 4: Tech & Convenience Toggles
  const [selectedTechFeatures, setSelectedTechFeatures] = useState<string[]>([]);

  // PAGE 5: Safety & Security Toggles
  const [selectedSafetyFeatures, setSelectedSafetyFeatures] = useState<string[]>([]);

  // PAGE 6: Media Upload State & Refs
  const [photos, setPhotos] = useState<UploadingMedia[]>([]);
  const [videos, setVideos] = useState<UploadingMedia[]>([]);
  const [pdfs, setPdfs] = useState<UploadingMedia[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Restore draft on mount
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName) setSellerName(currentUser.displayName);
      if (currentUser.phoneNumber) {
        setSellerPhone(currentUser.phoneNumber);
        setSellerWhatsApp(currentUser.phoneNumber);
      }
      if (currentUser.city) setLocation(currentUser.city + ', Pakistan');
    }

    try {
      const savedDraft = localStorage.getItem('bazar360_post_ad_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed) {
          if (parsed.vehicleType) setVehicleType(parsed.vehicleType);
          if (parsed.make) setMake(parsed.make);
          if (parsed.model) setModel(parsed.model);
          if (parsed.customModel) setCustomModel(parsed.customModel);
          if (parsed.variant) setVariant(parsed.variant);
          if (parsed.year) setYear(parsed.year);
          if (parsed.price) setPrice(parsed.price);
          if (parsed.mileage) setMileage(parsed.mileage);
          if (parsed.engineCC) setEngineCC(parsed.engineCC);
          if (parsed.transmission) setTransmission(parsed.transmission);
          if (parsed.fuelType) setFuelType(parsed.fuelType);
          if (parsed.color) setColor(parsed.color);
          if (parsed.registrationCity) setRegistrationCity(parsed.registrationCity);
          if (parsed.condition) setCondition(parsed.condition);
          if (parsed.bodyCondition) setBodyCondition(parsed.bodyCondition);
          if (parsed.assemblyType) setAssemblyType(parsed.assemblyType);
          if (parsed.sellerName) setSellerName(parsed.sellerName);
          if (parsed.sellerPhone) setSellerPhone(parsed.sellerPhone);
          if (parsed.sellerWhatsApp) setSellerWhatsApp(parsed.sellerWhatsApp);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.postingMode) setPostingMode(parsed.postingMode);
          if (Array.isArray(parsed.selectedExteriorFeatures)) setSelectedExteriorFeatures(parsed.selectedExteriorFeatures);
          if (Array.isArray(parsed.selectedInteriorFeatures)) setSelectedInteriorFeatures(parsed.selectedInteriorFeatures);
          if (Array.isArray(parsed.selectedTechFeatures)) setSelectedTechFeatures(parsed.selectedTechFeatures);
          if (Array.isArray(parsed.selectedSafetyFeatures)) setSelectedSafetyFeatures(parsed.selectedSafetyFeatures);
          
          // Spec-specific state restore
          if (parsed.registrationYear) setRegistrationYear(parsed.registrationYear);
          if (parsed.makeModelQuery) setMakeModelQuery(parsed.makeModelQuery);
          if (parsed.customVariant) setCustomVariant(parsed.customVariant);
          if (parsed.isCustomVariantActive !== undefined) setIsCustomVariantActive(parsed.isCustomVariantActive);
          if (parsed.isCustomCCActive !== undefined) setIsCustomCCActive(parsed.isCustomCCActive);
          if (parsed.customCC) setCustomCC(parsed.customCC);
          if (parsed.customColor) setCustomColor(parsed.customColor);
          if (parsed.isCustomColorActive !== undefined) setIsCustomColorActive(parsed.isCustomColorActive);
          if (parsed.customDescription) setCustomDescription(parsed.customDescription);
          if (parsed.allowWhatsApp !== undefined) setAllowWhatsApp(parsed.allowWhatsApp);

          if (parsed.step && parsed.step >= 1 && parsed.step <= 6) setStep(parsed.step);
          setDraftRestored(true);
          console.log(lang === 'ur' ? 'محفوظ شدہ کاپی بحال ہو گئی۔' : 'Auto-saved advertisement draft restored!', {
            icon: '💾',
            style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }
          });
        }
      }
    } catch (e) {
      console.warn('Draft restoration notice:', e);
    }
  }, [currentUser]);

  // Submission / Loading Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-save form state to localStorage
  useEffect(() => {
    if (success) return;
    try {
      const draftPayload = {
        vehicleType, make, model, customModel, variant, year, price, mileage,
        engineCC, transmission, fuelType, color, registrationCity, condition,
        bodyCondition, assemblyType, sellerName, sellerPhone, sellerWhatsApp, location,
        postingMode, selectedExteriorFeatures, selectedInteriorFeatures,
        selectedTechFeatures, selectedSafetyFeatures, step,
        registrationYear, makeModelQuery, customVariant, isCustomVariantActive,
        isCustomCCActive, customCC, customColor, isCustomColorActive,
        customDescription, allowWhatsApp,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('bazar360_post_ad_draft', JSON.stringify(draftPayload));
    } catch (e) {
      // ignore
    }
  }, [
    vehicleType, make, model, customModel, variant, year, price, mileage,
    engineCC, transmission, fuelType, color, registrationCity, condition,
    bodyCondition, assemblyType, sellerName, sellerPhone, sellerWhatsApp, location,
    postingMode, selectedExteriorFeatures, selectedInteriorFeatures,
    selectedTechFeatures, selectedSafetyFeatures, step, success,
    registrationYear, makeModelQuery, customVariant, isCustomVariantActive,
    isCustomCCActive, customCC, customColor, isCustomColorActive,
    customDescription, allowWhatsApp
  ]);

  const handleClearDraft = () => {
    localStorage.removeItem('bazar360_post_ad_draft');
    setDraftRestored(false);
    toast(lang === 'ur' ? 'کاپی ڈرافٹ صاف کر دی گئی' : 'Draft cleared from storage', { icon: '🗑️' });
  };

  // Derived Model options
  const modelOptions = useMemo(() => {
    return CAR_MODELS[make] || [];
  }, [make]);

  // Adjust model if make changes
  useEffect(() => {
    if (modelOptions.length > 0) {
      setModel(modelOptions[0]);
    } else {
      setModel('Other');
    }
  }, [make, modelOptions]);

  // Generate Year range
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear + 1; y >= 1990; y--) {
      years.push(y);
    }
    return years;
  }, []);

  // Toggle helper for feature lists
  const toggleFeature = (feature: string, setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelected((prev) => 
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  // Compress image on the client side using canvas
  const compressImage = (file: File): Promise<{ previewUrl: string; size: number; file: File }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve({
                previewUrl: URL.createObjectURL(compressedFile),
                size: compressedFile.size,
                file: compressedFile
              });
            } else {
              resolve({
                previewUrl: URL.createObjectURL(file),
                size: file.size,
                file
              });
            }
          }, 'image/jpeg', 0.82);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Media upload handlers
  const uploadMediaFile = async (item: UploadingMedia, isVideo: boolean) => {
    const updateStatus = (id: string, updates: Partial<UploadingMedia>) => {
      if (isVideo) {
        setVideos((prev) => prev.map((m) => m.id === id ? { ...m, ...updates } : m));
      } else {
        setPhotos((prev) => prev.map((m) => m.id === id ? { ...m, ...updates } : m));
      }
    };

    updateStatus(item.id, { status: 'uploading', progress: 0 });

    try {
      const result = await uploadToCloudinary(item.file, {
        compress: !isVideo,
        onProgress: (p) => {
          updateStatus(item.id, { progress: p });
        },
        maxRetries: 3,
        resourceType: isVideo ? 'video' : 'image',
        folder: isVideo ? 'bazar360/listings/videos' : 'bazar360/listings/photos'
      });

      updateStatus(item.id, {
        status: 'success',
        progress: 100,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id
      });
    } catch (err: any) {
      console.error('[Cloudinary] Upload failed for', item.file.name, err);
      updateStatus(item.id, {
        status: 'error',
        error: err.message || 'Upload failed'
      });
    }
  };

  const handlePhotoFiles = async (files: FileList) => {
    if (photos.length >= 10) {
      toast.error(lang === 'ur' ? 'آپ زیادہ سے زیادہ 10 تصاویر منتخب کر سکتے ہیں۔' : 'You can upload a maximum of 10 images.');
      return;
    }
    
    setIsCompressing(true);
    const incoming = Array.from(files).slice(0, 10 - photos.length);

    for (const f of incoming) {
      if (f.type.startsWith('image/')) {
        let finalFile = f;
        try {
          const comp = await compressImage(f);
          finalFile = comp.file;
        } catch (err) {
          console.warn('[DetailedVehiclePostingPage] Compression failed, fallback to raw:', err);
        }

        // Apply professional brand watermark
        try {
          const watermarkedDataUrl = await applyWatermark(finalFile);
          const arr = watermarkedDataUrl.split(',');
          const mime = arr[0].match(/:(.*?);/)![1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          finalFile = new File([u8arr], finalFile.name, { type: mime });
        } catch (err) {
          console.warn('[DetailedVehiclePostingPage] Watermarking failed, fallback to compressed image:', err);
        }

        const previewUrl = URL.createObjectURL(finalFile);
        const newItem: UploadingMedia = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file: finalFile,
          previewUrl,
          size: finalFile.size,
          progress: 0,
          status: 'pending'
        };

        setPhotos((prev) => [...prev, newItem]);
        uploadMediaFile(newItem, false);
      }
    }
    setIsCompressing(false);
  };

  const handleVideoFiles = (files: FileList) => {
    if (videos.length >= 10) {
      toast.error(lang === 'ur' ? 'آپ زیادہ سے زیادہ 10 ویڈیوز منتخب کر سکتے ہیں۔' : 'You can upload a maximum of 10 videos.');
      return;
    }

    const incoming = Array.from(files).slice(0, 10 - videos.length);
    for (const v of incoming) {
      if (v.type.startsWith('video/')) {
        const previewUrl = URL.createObjectURL(v);
        const newItem: UploadingMedia = {
          id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file: v,
          previewUrl,
          size: v.size,
          progress: 0,
          status: 'pending'
        };

        setVideos((prev) => [...prev, newItem]);
        uploadMediaFile(newItem, true);
      }
    }
  };

  const removePhoto = async (idx: number) => {
    const photo = photos[idx];
    if (photo && photo.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(photo.cloudinaryPublicId, 'image');
      } catch (err) {
        console.warn('[DetailedVehiclePostingPage] Error deleting photo from Cloudinary:', err);
      }
    }
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeVideo = async (idx: number) => {
    const video = videos[idx];
    if (video && video.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(video.cloudinaryPublicId, 'video');
      } catch (err) {
        console.warn('[DetailedVehiclePostingPage] Error deleting video from Cloudinary:', err);
      }
    }
    setVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadPdfFile = async (item: UploadingMedia) => {
    const updateStatus = (id: string, updates: Partial<UploadingMedia>) => {
      setPdfs((prev) => prev.map((m) => m.id === id ? { ...m, ...updates } : m));
    };

    updateStatus(item.id, { status: 'uploading', progress: 0 });

    try {
      const result = await uploadToCloudinary(item.file, {
        compress: false,
        onProgress: (p) => {
          updateStatus(item.id, { progress: p });
        },
        maxRetries: 3,
        resourceType: 'raw',
        folder: 'bazar360/listings/pdfs'
      });

      updateStatus(item.id, {
        status: 'success',
        progress: 100,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id
      });
    } catch (err: any) {
      console.error('[Cloudinary] PDF upload failed for', item.file.name, err);
      updateStatus(item.id, {
        status: 'error',
        error: err.message || 'Upload failed'
      });
    }
  };

  const handlePdfFiles = (files: FileList) => {
    if (pdfs.length >= 3) {
      toast.error(lang === 'ur' ? 'آپ زیادہ سے زیادہ 3 پی ڈی ایف فائلیں منتخب کر سکتے ہیں۔' : 'You can upload a maximum of 3 PDF documents.');
      return;
    }

    const incoming = Array.from(files).slice(0, 3 - pdfs.length);
    for (const p of incoming) {
      if (p.type === 'application/pdf' || p.name.toLowerCase().endsWith('.pdf')) {
        const newItem: UploadingMedia = {
          id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file: p,
          previewUrl: '',
          size: p.size,
          progress: 0,
          status: 'pending'
        };

        setPdfs((prev) => [...prev, newItem]);
        uploadPdfFile(newItem);
      } else {
        toast.error(lang === 'ur' ? 'صرف پی ڈی ایف فائلیں ہی اپ لوڈ کی جا سکتی ہیں۔' : 'Only PDF files are supported.');
      }
    }
  };

  const removePdf = async (idx: number) => {
    const pdf = pdfs[idx];
    if (pdf && pdf.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(pdf.cloudinaryPublicId, 'raw');
      } catch (err) {
        console.warn('[DetailedVehiclePostingPage] Error deleting PDF from Cloudinary:', err);
      }
    }
    setPdfs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Step Validation Helpers
  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!vehicleType || !make || (!model && !customModel)) {
        const msg = lang === 'ur' ? 'براہ کرم گاڑی کی قسم، میک اور ماڈل منتخب کریں۔' : 'Please select Vehicle Type, Make, and Model.';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      if (model === 'Other' && !customModel.trim()) {
        const msg = lang === 'ur' ? 'براہ کرم اپنی گاڑی کا نام درج کریں۔' : 'Please enter your custom vehicle model name.';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      if (!price || Number(price) <= 0 || isNaN(Number(price))) {
        const msg = lang === 'ur' ? 'براہ کرم درست قیمت (PKR) درج کریں۔' : 'Please enter a valid price in PKR (greater than 0).';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      if (mileage === '' || Number(mileage) < 0 || isNaN(Number(mileage))) {
        const msg = lang === 'ur' ? 'براہ کرم مائلیج درج کریں۔' : 'Please enter valid vehicle mileage in km.';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      if (!registrationCity.trim()) {
        const msg = lang === 'ur' ? 'براہ کرم رجسٹریشن کا شہر منتخب کریں۔' : 'Please select or enter the Registration City.';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      if (!sellerName.trim() || !sellerPhone.trim() || !location.trim()) {
        const msg = lang === 'ur' ? 'براہ کرم نام، فون نمبر اور مقام درج کریں۔' : 'Please fill in seller name, phone number, and city location.';
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Page 2: Exterior Features -> Go to Step 3
      setStep(3);
    } else if (step === 3) {
      // Page 3: Interior Features -> Go to Step 4
      setStep(4);
    } else if (step === 4) {
      // Page 4: Tech Features -> Go to Step 5
      setStep(5);
    } else if (step === 5) {
      // Page 5: Safety Features -> Go to Step 6 (Media & Review)
      setStep(6);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  // Submit listing directly to Firebase (Admin approval queue)
  const handlePublish = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    if (photos.length === 0) {
      const msg = lang === 'ur' ? 'براہ کرم کم از کم ایک تصویر اپ لوڈ کریں۔' : 'Please upload at least 1 image of your vehicle.';
      setErrorMessage(msg);
      toast.error(msg);
      setIsSubmitting(false);
      return;
    }

    const pendingUploads = [...photos, ...videos, ...pdfs].filter(m => m.status === 'uploading' || m.status === 'pending');
    if (pendingUploads.length > 0) {
      const msg = lang === 'ur' ? 'براہ کرم تمام فائلوں کے اپ لوڈ ہونے کا انتظار کریں۔' : 'Please wait for all media files to complete uploading.';
      setErrorMessage(msg);
      toast.error(msg);
      setIsSubmitting(false);
      return;
    }

    const failedUploads = [...photos, ...videos, ...pdfs].filter(m => m.status === 'error');
    if (failedUploads.length > 0) {
      const msg = lang === 'ur' ? 'کچھ فائلوں کو اپ لوڈ کرنے میں خرابی پیش آئی۔' : 'Some media files failed to upload. Please delete or retry failed uploads.';
      setErrorMessage(msg);
      toast.error(msg);
      setIsSubmitting(false);
      return;
    }

    const resolvedModelName = model === 'Other' ? customModel : model;
    const resolvedVariant = isCustomVariantActive ? customVariant : variant;
    const resolvedCC = isCustomCCActive ? Number(customCC) : Number(engineCC);
    const resolvedColor = isCustomColorActive ? customColor : color;

    const allFeatures = [
      ...selectedExteriorFeatures,
      ...selectedInteriorFeatures,
      ...selectedTechFeatures,
      ...selectedSafetyFeatures
    ];

    const defaultDesc = `A beautifully maintained ${condition.toLowerCase()} ${make} ${resolvedModelName} ${resolvedVariant} located in ${location}. Features include ${allFeatures.length > 0 ? allFeatures.join(', ') : 'complete standard equipment'}. Contact seller ${sellerName} via ${sellerPhone} or WhatsApp.`;
    const resolvedDescription = customDescription.trim() || defaultDesc;

    const listingId = `listing-${Date.now()}`;

    const uploadedPhotoUrls = photos.map(p => p.cloudinaryUrl).filter(Boolean) as string[];
    const uploadedPhotoPublicIds = photos.map(p => p.cloudinaryPublicId).filter(Boolean) as string[];
    const primaryPhotoUrl = uploadedPhotoUrls[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';
    const primaryPhotoPublicId = uploadedPhotoPublicIds[0] || '';

    const primaryVideo = videos.find(v => v.status === 'success');
    const primaryPdf = pdfs.find(p => p.status === 'success');

    const payload: CarListing = {
      id: listingId,
      title: `${year} ${make} ${resolvedModelName} ${resolvedVariant}`.trim(),
      make,
      model: resolvedModelName,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      fuelType,
      transmission,
      imageUrl: primaryPhotoUrl,
      verified: false,
      featured: false,
      dealerId: postingMode === 'showroom' ? (selectedShowroomForPost || 'auto-choice-peshawar') : 'private',
      createdBy: currentUser?.uid || 'guest-seller',
      assignedSalesRepId: currentUser?.uid || 'guest-seller',
      phone: sellerPhone,
      sellerPhone: sellerPhone,
      sellerName: sellerName,
      sellerWhatsApp: allowWhatsApp ? sellerPhone : sellerWhatsApp,
      sellerType: postingMode === 'showroom' ? 'Showroom' : 'Individual',
      description: resolvedDescription,
      createdAt: new Date().toISOString(),
      tags: [vehicleType, condition, fuelType, transmission, assemblyType, ...allFeatures],
      features: allFeatures,
      specs: {
        color: resolvedColor,
        engineSize: `${resolvedCC} cc`,
        horspower: `${Math.round(resolvedCC * 0.08 || 100)} HP`,
        regionalSpecs: assemblyType === 'Imported' ? 'Imported Assembly' : 'Local Assembly'
      },
      approved: false, // Pending Founder / Admin Approval
      condition,
      engineCC: resolvedCC,
      exteriorColor: resolvedColor,
      bodyCondition: bodyCondition,
      registrationCity,
      documentType: 'Smart Card',
      tokenTaxPaid: true,
      images: uploadedPhotoUrls,
      assemblyType: assemblyType,
      tokenTaxStatus: 'Paid',

      // Embed registrationYear in metadata so we don't lose it
      range: `Registration Year: ${registrationYear}`,

      cloudinaryPublicId: primaryPhotoPublicId,
      cloudinaryPublicIds: uploadedPhotoPublicIds,
      videoUrl: primaryVideo?.cloudinaryUrl || '',
      videoCloudinaryPublicId: primaryVideo?.cloudinaryPublicId || '',
      pdfUrl: primaryPdf?.cloudinaryUrl || '',
      pdfCloudinaryPublicId: primaryPdf?.cloudinaryPublicId || '',
      pdfTitle: primaryPdf?.file.name || ''
    };

    try {
      await dbSaveListing(payload);
      localStorage.removeItem('bazar360_post_ad_draft');
      toast.success(lang === 'ur' ? 'اشتہار کامیابی سے شائع ہو گیا!' : 'Advertisement published successfully!');
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        if (onPostCreated) {
          onPostCreated(payload);
        }
      }, 1500);
    } catch (err: any) {
      console.warn('Firestore remote notice during save, proceed with local cached save:', err);
      localStorage.removeItem('bazar360_post_ad_draft');
      toast.success(lang === 'ur' ? 'اشتہار محفوظ ہو گیا!' : 'Advertisement saved to inventory!');
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        if (onPostCreated) {
          onPostCreated(payload);
        }
      }, 1500);
    }
  };

  const formatPrice = (val: string) => {
    const num = parseFloat(val.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const stepLabels = [
    { num: 1, label: t.step1 },
    { num: 2, label: t.step2 },
    { num: 3, label: t.step3 },
    { num: 4, label: t.step4 },
    { num: 5, label: t.step5 },
    { num: 6, label: t.step6 }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-950/95 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 relative shadow-2xl overflow-hidden text-left" id="modern-6-step-posting-wizard">
      
      {/* Background ambient glow overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#38BDF8]/10 blur-3xl rounded-full pointer-events-none" />

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle size={44} className="animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {lang === 'ur' ? 'اشتہار کامیابی سے جمع ہو گیا!' : 'Advertisement Submitted!'}
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              {t.adSubmittedSuccess}
            </p>
          </div>
          <div className="flex items-center gap-2 justify-center text-xs text-orange-400 font-mono font-black uppercase">
            <Clock size={14} /> {lang === 'ur' ? 'ایڈمن کی منظوری کے لیے زیر التوا' : 'Pending Founder / Administrative Review'}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Header Progress Matrix */}
          <div className="mb-6 border-b border-white/10 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#38BDF8]/10 text-[#38BDF8] px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border border-[#38BDF8]/20">
                  <Sparkles size={11} className="animate-pulse" /> {t.lessThan60Seconds}
                </div>
                {draftRestored && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase border border-emerald-500/20">
                    <Save size={11} /> Auto-Saved Draft
                    <button
                      onClick={handleClearDraft}
                      className="ml-1 text-zinc-400 hover:text-rose-400 font-bold"
                      title="Clear draft"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <span className="text-zinc-400 font-mono text-xs font-black">
                Step {step} of 6
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-3 text-white">
              {t.wizardTitle}
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              {t.wizardSubtitle}
            </p>

            {/* 6-Step Stepper Indicator Bar */}
            <div className="flex items-center justify-between mt-6 gap-1 relative z-10 overflow-x-auto pb-1 no-scrollbar">
              {stepLabels.map((s) => (
                <div key={s.num} className="flex-1 min-w-[50px] flex flex-col items-center">
                  <button 
                    type="button"
                    onClick={() => {
                      if (s.num < step) setStep(s.num as any);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-mono font-black transition-all duration-300 cursor-pointer ${
                      step === s.num
                        ? 'bg-[#38BDF8] text-slate-950 scale-110 shadow-lg shadow-[#38BDF8]/20 ring-2 ring-[#38BDF8]/40'
                        : step > s.num
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-900 border border-white/10 text-zinc-600'
                    }`}
                  >
                    {step > s.num ? <Check size={13} strokeWidth={4} /> : s.num}
                  </button>
                  <span className={`text-[8px] sm:text-[9px] font-mono font-bold mt-1.5 uppercase text-center truncate max-w-[65px] ${
                    step === s.num ? 'text-[#38BDF8]' : step > s.num ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Wizard Core */}
          <div className="min-h-[320px] py-2">
            <AnimatePresence mode="wait">
              
              {/* PAGE 1: Basic Vehicle Info & Core Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h2 className="text-sm font-black uppercase text-white font-mono flex items-center gap-2">
                      <Car size={16} className="text-[#38BDF8]" /> Page 1: Basic Vehicle Info (Core Details)
                    </h2>
                    <span className="text-[10px] text-zinc-500 font-mono">No Checkboxes</span>
                  </div>

                  {/* Vehicle Type Selection Grid */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-mono font-black uppercase block">{t.vehicleType} *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {VEHICLE_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setVehicleType(type.id)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            vehicleType === type.id
                              ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8] scale-[1.02] shadow-md'
                              : 'bg-slate-900/60 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <Car size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{t[type.labelKey as keyof typeof t] || type.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smart Make & Model Selection with AI Autocomplete */}
                  <div className="space-y-2 relative">
                    <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                      Search Make & Model *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type brand or model name (e.g. Corolla, Civic, Alto)..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] pr-10 font-bold"
                        value={makeModelQuery}
                        onChange={(e) => {
                          setMakeModelQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    </div>

                    {/* Auto-complete dropdown list */}
                    {showSuggestions && filteredMakeModels.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-slate-900 border border-white/10 rounded-xl max-h-56 overflow-y-auto shadow-2xl divide-y divide-white/5">
                        {filteredMakeModels.map((item) => (
                          <button
                            key={`${item.make}-${item.model}`}
                            type="button"
                            onClick={() => {
                              setMake(item.make);
                              setModel(item.model);
                              setMakeModelQuery(`${item.make} ${item.model}`);
                              setShowSuggestions(false);
                              const defaultVars = VARIANTS_DICTIONARY[item.model];
                              if (defaultVars && defaultVars.length > 0) {
                                setVariant(defaultVars[0]);
                                setIsCustomVariantActive(false);
                              } else {
                                setVariant('');
                                setIsCustomVariantActive(true);
                              }
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs text-white font-bold transition-colors flex items-center justify-between"
                          >
                            <span>{item.make} <span className="text-[#38BDF8]">{item.model}</span></span>
                            <span className="text-[10px] text-zinc-500 font-mono">Select</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Popular models quick search pills */}
                    <div className="pt-1.5 space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase block">Or Tap Popular Model:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_MODELS.map((item) => (
                          <button
                            key={`${item.make}-${item.model}`}
                            type="button"
                            onClick={() => {
                              setMake(item.make);
                              setModel(item.model);
                              setMakeModelQuery(`${item.make} ${item.model}`);
                              setShowSuggestions(false);
                              const defaultVars = VARIANTS_DICTIONARY[item.model];
                              if (defaultVars && defaultVars.length > 0) {
                                setVariant(defaultVars[0]);
                                setIsCustomVariantActive(false);
                              } else {
                                setVariant('');
                                setIsCustomVariantActive(true);
                              }
                            }}
                            className={`px-3 py-1 text-[10px] font-mono rounded-full border transition-all ${
                              model === item.model
                                ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8] font-bold'
                                : 'bg-slate-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {item.model}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Variant Selection Pills */}
                  {model && (
                    <div className="space-y-2 pt-1">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                        Select Variant / Trim *
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {(VARIANTS_DICTIONARY[model] || []).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              setVariant(v);
                              setIsCustomVariantActive(false);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                              variant === v && !isCustomVariantActive
                                ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8] font-black'
                                : 'bg-slate-900 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomVariantActive(true);
                            setVariant('');
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            isCustomVariantActive
                              ? 'bg-orange-500 text-slate-950 border-orange-500 font-black'
                              : 'bg-slate-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          Other / Custom Variant
                        </button>
                      </div>

                      {isCustomVariantActive && (
                        <div className="pt-1.5 animate-fade-in">
                          <input
                            type="text"
                            placeholder="Type variant name manually (e.g. GLi Limited Edition)..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                            value={customVariant}
                            onChange={(e) => setCustomVariant(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assembly Type Toggle */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-mono font-black uppercase block">Assembly Type *</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-xl border border-white/10 max-w-sm">
                      <button
                        type="button"
                        onClick={() => setAssemblyType('Local')}
                        className={`py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                          assemblyType === 'Local' ? 'bg-[#38BDF8] text-slate-950 font-black shadow-lg' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Local (Pakistan Assembled)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssemblyType('Imported')}
                        className={`py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                          assemblyType === 'Imported' ? 'bg-[#38BDF8] text-slate-950 font-black shadow-lg' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Imported (JDM / CBU)
                      </button>
                    </div>
                  </div>

                  {/* Separated Model Year and Registration Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                        Model Year *
                      </label>
                      <select
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-mono font-bold"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                      >
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                        Registration Year *
                      </label>
                      <select
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-mono font-bold"
                        value={registrationYear}
                        onChange={(e) => setRegistrationYear(e.target.value)}
                      >
                        <option value="Unregistered">Unregistered</option>
                        <option value="Apply for Registration">Apply for Registration</option>
                        {yearOptions.map((y) => (
                          <option key={y} value={y.toString()}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Expected Price and Mileage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">{t.price} *</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={t.pricePlaceholder}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-mono font-black pr-12"
                          value={price}
                          onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#38BDF8] font-mono font-black uppercase tracking-wider">PKR</span>
                      </div>
                      {price && <span className="text-[10px] text-zinc-500 font-mono">Rs. {formatPrice(price)}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">{t.mileage} *</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={t.mileagePlaceholder}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-mono font-black pr-12"
                          value={mileage}
                          onChange={(e) => setMileage(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-mono uppercase">KM</span>
                      </div>
                    </div>
                  </div>

                  {/* Standardized CC Range Selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                      Engine Capacity (CC Displacement) *
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['660', '1000', '1300', '1500', '1800', '2000', '2400', '2700', '3000', '4600'].map((cc) => (
                        <button
                          key={cc}
                          type="button"
                          onClick={() => {
                            setEngineCC(cc);
                            setIsCustomCCActive(false);
                          }}
                          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
                            engineCC === cc && !isCustomCCActive
                              ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8] font-black'
                              : 'bg-slate-900 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {cc}cc
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCCActive(true);
                          setEngineCC('');
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          isCustomCCActive
                            ? 'bg-orange-500 text-slate-950 border-orange-500 font-black'
                            : 'bg-slate-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        Other CC
                      </button>
                    </div>

                    {isCustomCCActive && (
                      <div className="pt-1.5 animate-fade-in relative max-w-xs">
                        <input
                          type="text"
                          placeholder="e.g. 1242"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 pr-10 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-mono font-bold"
                          value={customCC}
                          onChange={(e) => setCustomCC(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono uppercase">CC</span>
                      </div>
                    )}
                  </div>

                  {/* Exterior Color Swatches Grid */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                      Exterior Color *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { name: 'White', colorHex: '#FFFFFF' },
                        { name: 'Silver', colorHex: '#D1D5DB' },
                        { name: 'Black', colorHex: '#111827' },
                        { name: 'Grey', colorHex: '#6B7280' },
                        { name: 'Blue', colorHex: '#2563EB' },
                        { name: 'Red', colorHex: '#DC2626' },
                        { name: 'Gold', colorHex: '#D97706' },
                        { name: 'Maroon', colorHex: '#7F1D1D' },
                        { name: 'Green', colorHex: '#059669' }
                      ].map((c) => {
                        const isSelected = color === c.name && !isCustomColorActive;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setColor(c.name);
                              setIsCustomColorActive(false);
                            }}
                            className={`p-2 rounded-xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer text-center ${
                              isSelected
                                ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8] scale-[1.02]'
                                : 'bg-slate-900 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            <div
                              className="w-5 h-5 rounded-full border border-white/20"
                              style={{ backgroundColor: c.colorHex }}
                            />
                            <span className="text-[10px] font-bold uppercase">{c.name}</span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomColorActive(true);
                          setColor('');
                        }}
                        className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                          isCustomColorActive
                            ? 'bg-orange-500/10 border-orange-500 text-orange-400 scale-[1.02]'
                            : 'bg-slate-900 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 border border-white/20" />
                        <span className="text-[10px] font-bold uppercase">Other</span>
                      </button>
                    </div>

                    {isCustomColorActive && (
                      <div className="pt-1.5 animate-fade-in max-w-xs">
                        <input
                          type="text"
                          placeholder="e.g. Metallic Blue"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Transmission and Fuel Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">{t.transmission} *</label>
                      <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1.5 rounded-xl border border-white/10 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setTransmission('Automatic')}
                          className={`py-2.5 font-bold uppercase rounded-lg transition-all cursor-pointer ${
                            transmission === 'Automatic' ? 'bg-orange-500 text-slate-950 font-black shadow-md' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Auto
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransmission('Manual')}
                          className={`py-2.5 font-bold uppercase rounded-lg transition-all cursor-pointer ${
                            transmission === 'Manual' ? 'bg-orange-500 text-slate-950 font-black shadow-md' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Manual
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">{t.fuelType} *</label>
                      <select
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-bold"
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value as any)}
                      >
                        <option value="Petrol">{t.petrol}</option>
                        <option value="Diesel">{t.diesel}</option>
                        <option value="Hybrid">{t.hybrid}</option>
                        <option value="Electric">{t.electric}</option>
                      </select>
                    </div>
                  </div>

                  {/* City Hub Location and Registration City Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                        Current Location City *
                      </label>
                      <select
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-bold font-mono"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        {['Peshawar, Pakistan', 'Lahore, Pakistan', 'Karachi, Pakistan', 'Islamabad, Pakistan', 'Faisalabad, Pakistan', 'Rawalpindi, Pakistan', 'Quetta, Pakistan', 'Mardan, Pakistan', 'Multan, Pakistan', 'Gujranwala, Pakistan', 'Sialkot, Pakistan', 'Abbottabad, Pakistan', 'Swat, Pakistan'].map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">
                        Registration Location *
                      </label>
                      <select
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-bold font-mono"
                        value={registrationCity}
                        onChange={(e) => setRegistrationCity(e.target.value)}
                      >
                        <option value="">Select Registration</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">KPK (Khyber Pakhtunkhwa)</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Unregistered">Unregistered</option>
                      </select>
                    </div>
                  </div>

                  {/* Condition & Body Condition */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">{t.condition} *</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setCondition('Used')}
                          className={`py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                            condition === 'Used' ? 'bg-[#38BDF8] text-slate-950 font-black shadow-md' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {t.used}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCondition('New')}
                          className={`py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                            condition === 'New' ? 'bg-[#38BDF8] text-slate-950 font-black shadow-md' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {t.new}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-mono font-black uppercase block">{t.bodyCondition} *</label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1.5 rounded-xl border border-white/10 text-[10px]">
                        {(['Total Genuine', 'Minor Touch-ups', 'Major Repaint'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setBodyCondition(opt)}
                            className={`py-2 rounded-lg font-bold transition-all uppercase cursor-pointer text-center ${
                              bodyCondition === opt ? 'bg-[#38BDF8]/20 border border-[#38BDF8] text-[#38BDF8]' : 'text-zinc-400 border border-transparent'
                            }`}
                          >
                            {opt === 'Total Genuine' ? t.totalGenuine : opt === 'Minor Touch-ups' ? t.minorTouchUps : t.majorRepaint}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Seller / Showroom Ownership Section */}
                  <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 space-y-4 mt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[#38BDF8] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                        <User size={14} /> Seller & Posting Details
                      </label>
                      <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                        <button
                          type="button"
                          onClick={() => setPostingMode('individual')}
                          className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                            postingMode === 'individual' ? 'bg-orange-500 text-slate-950' : 'text-zinc-400'
                          }`}
                        >
                          Individual
                        </button>
                        <button
                          type="button"
                          onClick={() => setPostingMode('showroom')}
                          className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                            postingMode === 'showroom' ? 'bg-orange-500 text-slate-950' : 'text-zinc-400'
                          }`}
                        >
                          Showroom
                        </button>
                      </div>
                    </div>

                    {postingMode === 'showroom' && (
                      <div className="space-y-1.5 animate-fade-in">
                        <label className="text-[10px] text-zinc-400 font-mono font-black uppercase block">Select Target Showroom *</label>
                        <select
                          value={selectedShowroomForPost}
                          onChange={(e) => setSelectedShowroomForPost(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                        >
                          {dealers.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({(d as any).city || d.location || 'Peshawar'})
                            </option>
                          ))}
                          {dealers.length === 0 && (
                            <option value="auto-choice-peshawar">Auto Choice Peshawar Flagship</option>
                          )}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-zinc-400 font-mono font-black uppercase block">{t.sellerName} *</label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => { setSellerName('Malak Mazhar'); setSellerPhone('+923159085086'); setLocation('Auto Choice Peshawar, Ring Road'); }}
                              className="text-[9px] font-mono font-bold text-amber-400 hover:underline bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20"
                            >
                              + Malak Mazhar
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSellerName('Muhammad Amjid'); setSellerPhone('+923149198403'); setLocation('Ring Road, Peshawar'); }}
                              className="text-[9px] font-mono font-bold text-sky-400 hover:underline bg-sky-400/10 px-1.5 py-0.5 rounded border border-sky-400/20"
                            >
                              + Muhammad Amjid
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder={t.sellerNamePlaceholder}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                          value={sellerName}
                          onChange={(e) => setSellerName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-mono font-black uppercase block">{t.sellerPhone} *</label>
                        <input
                          type="text"
                          placeholder={t.sellerPhonePlaceholder}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                          value={sellerPhone}
                          onChange={(e) => setSellerPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-mono font-black uppercase block">{t.location} *</label>
                        <input
                          type="text"
                          placeholder={t.locationPlaceholder}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAGE 2: Exterior & Styling (Visuals) */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h2 className="text-base font-black uppercase text-white font-mono flex items-center gap-2">
                        <Sparkle size={18} className="text-amber-400" /> Page 2: Exterior & Appearance
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Select exterior styling and lighting options for your vehicle</p>
                    </div>
                    <span className="text-xs text-amber-400 font-mono font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      {selectedExteriorFeatures.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                    {EXTERIOR_FEATURES.map((feature) => {
                      const isChecked = selectedExteriorFeatures.includes(feature);
                      return (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => toggleFeature(feature, setSelectedExteriorFeatures)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                            isChecked
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10 scale-[1.01]'
                              : 'bg-slate-900/60 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">{feature}</span>
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-slate-950 scale-110'
                              : 'border-white/20 group-hover:border-white/40'
                          }`}>
                            {isChecked && <Check size={12} strokeWidth={4} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* PAGE 3: Comfort & Interior (Cabin Experience) */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h2 className="text-base font-black uppercase text-white font-mono flex items-center gap-2">
                        <Layers size={18} className="text-[#38BDF8]" /> Page 3: Interior & Comfort
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Toggle cabin experience, seating and environmental controls</p>
                    </div>
                    <span className="text-xs text-[#38BDF8] font-mono font-bold bg-[#38BDF8]/10 px-2.5 py-1 rounded-full border border-[#38BDF8]/20">
                      {selectedInteriorFeatures.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                    {INTERIOR_FEATURES.map((feature) => {
                      const isChecked = selectedInteriorFeatures.includes(feature);
                      return (
                        <div
                          key={feature}
                          onClick={() => toggleFeature(feature, setSelectedInteriorFeatures)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8] shadow-lg shadow-[#38BDF8]/10 scale-[1.01]'
                              : 'bg-slate-900/60 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-slate-900'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold uppercase tracking-wider block">{feature}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">Cabin Comfort Option</span>
                          </div>
                          <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#38BDF8] border-[#38BDF8] text-slate-950 scale-110'
                              : 'border-white/20'
                          }`}>
                            {isChecked && <Check size={14} strokeWidth={4} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* PAGE 4: Technology & Convenience (Smart Features) */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h2 className="text-base font-black uppercase text-white font-mono flex items-center gap-2">
                        <Cpu size={18} className="text-emerald-400" /> Page 4: Tech & Convenience
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Select smart infotainment, navigation and driver assist tech</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                      {selectedTechFeatures.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                    {TECH_FEATURES.map((feature) => {
                      const isChecked = selectedTechFeatures.includes(feature);
                      return (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => toggleFeature(feature, setSelectedTechFeatures)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                              : 'bg-slate-900/60 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">{feature}</span>
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 scale-110'
                              : 'border-white/20'
                          }`}>
                            {isChecked && <Check size={12} strokeWidth={4} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* PAGE 5: Safety & Security (Essential Protection) */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h2 className="text-base font-black uppercase text-white font-mono flex items-center gap-2">
                        <ShieldCheck size={18} className="text-rose-400" /> Page 5: Safety & Security
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Toggle active safety systems, airbags and security features</p>
                    </div>
                    <span className="text-xs text-rose-400 font-mono font-bold bg-rose-400/10 px-2.5 py-1 rounded-full border border-rose-400/20">
                      {selectedSafetyFeatures.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                    {SAFETY_FEATURES.map((feature) => {
                      const isChecked = selectedSafetyFeatures.includes(feature);
                      return (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => toggleFeature(feature, setSelectedSafetyFeatures)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10 scale-[1.01]'
                              : 'bg-slate-900/60 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">{feature}</span>
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-rose-500 border-rose-500 text-slate-950 scale-110'
                              : 'border-white/20'
                          }`}>
                            {isChecked && <Check size={12} strokeWidth={4} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* PAGE 6: Media Upload & Review Summary */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h2 className="text-base font-black uppercase text-white font-mono flex items-center gap-2">
                      <ImageIcon size={18} className="text-[#38BDF8]" /> Page 6: Media & Final Review Summary
                    </h2>
                    <span className="text-xs text-[#38BDF8] font-mono font-bold bg-[#38BDF8]/10 px-2.5 py-1 rounded-full border border-[#38BDF8]/20">
                      Cloudinary Optimized
                    </span>
                  </div>

                  {/* Drag & Drop Visual Box */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files) await handlePhotoFiles(e.dataTransfer.files);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      isDragging ? 'border-[#38BDF8] bg-[#38BDF8]/5' : 'border-white/10 bg-slate-900/50 hover:border-white/20'
                    }`}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload size={28} className={`text-zinc-500 transition-colors ${isDragging ? 'text-[#38BDF8]' : ''}`} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">{t.dragDropText}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.orBrowse}</p>
                    </div>
                  </div>

                  {/* Custom upload buttons bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="p-3 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#38BDF8] transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white"
                    >
                      <Camera size={16} className="text-orange-400" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest">{t.cameraUpload}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="p-3 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#38BDF8] transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white"
                    >
                      <ImageIcon size={16} className="text-[#38BDF8]" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest">{lang === 'ur' ? 'تصاویر' : 'Gallery Images'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="p-3 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#38BDF8] transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white"
                    >
                      <VideoIcon size={16} className="text-emerald-400" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest">{lang === 'ur' ? 'ویڈیو' : 'Upload Videos'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="p-3 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#38BDF8] transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white"
                    >
                      <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest">{lang === 'ur' ? 'پی ڈی ایف' : 'Upload PDF'}</span>
                    </button>
                  </div>

                  {/* Hidden inputs */}
                  <input type="file" multiple accept="image/*" ref={imageInputRef} className="hidden" onChange={async (e) => { if (e.target.files) await handlePhotoFiles(e.target.files); }} />
                  <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={async (e) => { if (e.target.files) await handlePhotoFiles(e.target.files); }} />
                  <input type="file" multiple accept="video/*" ref={videoInputRef} className="hidden" onChange={(e) => { if (e.target.files) handleVideoFiles(e.target.files); }} />
                  <input type="file" multiple accept="application/pdf" ref={pdfInputRef} className="hidden" onChange={(e) => { if (e.target.files) handlePdfFiles(e.target.files); }} />

                  {/* Image compression progress */}
                  {isCompressing && (
                    <div className="flex items-center gap-2.5 bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 px-4 py-3 rounded-xl text-xs font-mono">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-[#38BDF8]" />
                      <span>{t.compressionProgress}</span>
                    </div>
                  )}

                  {/* Photo Previews Matrix */}
                  {photos.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] text-zinc-400 font-mono font-black uppercase tracking-widest block">Uploaded Images ({photos.length} / 10):</span>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {photos.map((p, idx) => (
                          <div key={p.id || idx} className="aspect-square bg-slate-900 border border-white/10 rounded-xl relative overflow-hidden group">
                            {p.status === 'uploading' && (
                              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-1 z-10">
                                <div className="w-6 h-6 rounded-full border-2 border-[#38BDF8]/20 border-t-[#38BDF8] animate-spin" />
                                <span className="text-[8px] font-mono font-bold text-[#38BDF8]">{p.progress}%</span>
                              </div>
                            )}

                            {p.status === 'error' && (
                              <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center gap-1 z-10 p-1 text-center">
                                <AlertCircle size={14} className="text-red-400 animate-pulse" />
                                <button type="button" onClick={() => uploadMediaFile(p, false)} className="px-1 py-0.5 bg-red-500/20 text-[7px] font-mono font-black uppercase text-red-300 border border-red-500/30 rounded cursor-pointer">
                                  Retry
                                </button>
                              </div>
                            )}

                            <img src={p.previewUrl} alt="preview" width={128} height={128} className={`w-full h-full object-cover ${p.status === 'uploading' ? 'blur-xs saturate-50' : ''}`} />

                            {p.status === 'success' && (
                              <div className="absolute top-1 left-1 bg-emerald-500/80 text-white rounded-full p-0.5 z-10 shadow-lg">
                                <Check size={8} strokeWidth={4} />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                              <button type="button" onClick={() => removePhoto(idx)} className="p-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/40 transition-colors cursor-pointer">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live-Updating Specification & Feature Summary Card */}
                  <div className="border border-white/10 rounded-2xl p-5 bg-slate-900/70 space-y-4">
                    <h3 className="text-xs font-mono font-black uppercase text-[#38BDF8] border-b border-white/10 pb-2 flex items-center justify-between">
                      <span>Live Ad Review Summary</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Auto Choice Certified Format</span>
                    </h3>

                    <div className="flex gap-4 items-center">
                      <img 
                        src={photos[0]?.previewUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'} 
                        alt="listing cover" 
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <h4 className="text-base font-black text-white">{year} {make} {model === 'Other' ? customModel : model} {variant}</h4>
                        <p className="text-xs text-[#38BDF8] font-mono font-black mt-0.5">Rs. {formatPrice(price)} PKR</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1">{mileage ? Number(mileage).toLocaleString() : 0} KM • {fuelType} • {transmission} • {registrationCity || 'Pakistan'} • {assemblyType}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-white/5 pt-3">
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block">Condition</span>
                        <span className="font-bold text-white uppercase">{condition}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block">Body Condition</span>
                        <span className="font-bold text-white uppercase">{bodyCondition}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block">Seller Name</span>
                        <span className="font-bold text-white">{sellerName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block">Contact Phone</span>
                        <span className="font-bold text-white font-mono">{sellerPhone}</span>
                      </div>
                    </div>

                    {/* Feature Badges Across All 4 Categories */}
                    <div className="border-t border-white/5 pt-3 space-y-2">
                      <span className="text-[10px] text-zinc-400 font-mono font-black uppercase block">Selected Specifications & Features:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedExteriorFeatures.map(f => (
                          <span key={f} className="bg-amber-500/10 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/20">
                            {f}
                          </span>
                        ))}
                        {selectedInteriorFeatures.map(f => (
                          <span key={f} className="bg-[#38BDF8]/10 text-[#38BDF8] text-[9px] font-mono px-2 py-0.5 rounded border border-[#38BDF8]/20">
                            {f}
                          </span>
                        ))}
                        {selectedTechFeatures.map(f => (
                          <span key={f} className="bg-emerald-500/10 text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                            {f}
                          </span>
                        ))}
                        {selectedSafetyFeatures.map(f => (
                          <span key={f} className="bg-rose-500/10 text-rose-300 text-[9px] font-mono px-2 py-0.5 rounded border border-rose-500/20">
                            {f}
                          </span>
                        ))}
                        {selectedExteriorFeatures.length === 0 && selectedInteriorFeatures.length === 0 && selectedTechFeatures.length === 0 && selectedSafetyFeatures.length === 0 && (
                          <span className="text-zinc-500 text-[10px] font-mono italic">Standard factory features</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Founder Approval Queue Notice */}
                  <div className="flex gap-3 bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl text-xs text-orange-400 font-sans leading-relaxed">
                    <Info size={18} className="shrink-0 text-orange-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold uppercase tracking-wider font-mono">Founder / Administrative Review Queue</p>
                      <p className="text-zinc-400 text-[11px]">{t.approvalNotice}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Validation Feedback */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 p-3 rounded-xl mt-4">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Stepper Buttons Panel */}
          <div className="mt-8 pt-4 border-t border-white/10 flex justify-between gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={{ minHeight: '48px' }}
                className="px-6 rounded-xl border border-white/10 text-xs font-mono font-black uppercase text-zinc-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <ChevronLeft size={14} strokeWidth={3} /> {t.back}
              </button>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{ minHeight: '48px' }}
                className="w-full bg-[#38BDF8] text-slate-950 text-xs font-mono font-black uppercase rounded-xl hover:bg-[#38BDF8]/90 transition-all flex items-center justify-center gap-2 ml-auto cursor-pointer shadow-lg shadow-[#38BDF8]/20"
              >
                {lang === 'ur' ? 'اگلا مرحلہ' : 'Next Step'} <ChevronRight size={14} strokeWidth={3} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                style={{ minHeight: '48px' }}
                className="w-full bg-orange-500 text-slate-950 text-xs font-mono font-black uppercase rounded-xl hover:bg-orange-500/90 transition-all flex items-center justify-center gap-2 ml-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
              >
                {isSubmitting ? t.loading : t.publishAd}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
