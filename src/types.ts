export const NO_IMAGE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%231f2937'/%3E%3Cpath d='M150 180 L200 130 L250 180' stroke='%234b5563' stroke-width='4' fill='none'/%3E%3Ccircle cx='160' cy='120' r='15' fill='%234b5563'/%3E%3Ctext x='50%25' y='80%25' fill='%239ca3af' font-size='14' font-family='sans-serif' text-anchor='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export type { UserProfile } from './lib/dbService';

export const SUPER_ADMIN_EMAILS = [
  'amjid.bisconni@gmail.com',
  'amjid.psh@gmail.com'
];

export type UserRole = 
  | 'Visitor' 
  | 'Registered User' 
  | 'Seller' 
  | 'Dealer' 
  | 'Showroom Owner' 
  | 'Moderator' 
  | 'Admin' 
  | 'Super Admin';

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  website?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

export interface SocialAccount {
  id?: string;
  platform: string;
  url: string;
  handle?: string;
  username?: string;
}

export interface CarListing {
  id: string;
  title: string;
  make: string;
  model: string;
  vehicleType?: string;
  variant?: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  imageUrl: string;
  verified: boolean;
  featured: boolean;
  dealerId: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  specs: {
    color: string;
    engineSize: string;
    horspower: string;
    regionalSpecs: string;
  };
  approved?: boolean;
  assignedSalesRepId?: string;
  createdBy?: string;
  region?: string;
  location?: string;
  phone?: string;
  sellerPhone?: string;
  sellerName?: string;
  sellerWhatsApp?: string;
  sellerType?: 'Individual' | 'Showroom';
  sellerAvatar?: string;

  condition: 'New' | 'Used';
  engineCC: number;
  exteriorColor: string;
  bodyCondition: 'Total Genuine' | 'Minor Touch-ups' | 'Major Repaint';
  registrationCity: string;
  documentType: 'Smart Card' | 'Original Book' | 'Duplicate';
  tokenTaxPaid: boolean;
  images: string[];
  primaryImage?: string;
  verifiedBadge?: boolean;
  
  assemblyType?: 'Local' | 'Imported';
  features?: string[];
  dentPaintDescription?: string;
  tokenTaxStatus?: 'Paid' | 'Outstanding';
  
  isSold?: boolean;
  isPaused?: boolean;
  isArchived?: boolean;
  isVerified?: boolean;
  city?: string;
  inspectionScore?: number;
  status?: 'Available' | 'Reserved' | 'Sold';

  cloudinaryPublicId?: string;
  cloudinaryPublicIds?: string[];
  cloudinaryFolderPath?: string;
  mediaMetadata?: Array<{
    url: string;
    public_id: string;
    bytes?: number;
    format?: string;
    folder?: string;
    uploadedAt?: string;
  }>;
  videoUrl?: string;
  videoCloudinaryPublicId?: string;
  pdfUrl?: string;
  pdfCloudinaryPublicId?: string;
  pdfTitle?: string;

  ownerId?: string;
  sellerEmail?: string;
  ownerDetails?: {
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: string;
    phone?: string;
    associatedShowroomId?: string;
  };

  topSpeed?: string;
  acceleration?: string;
  range?: string;
}

export type Vehicle = CarListing;

export interface Dealer {
  id: string;
  name: string;
  subtitle?: string;
  tagline?: string;
  location: string;
  city?: string;
  address?: string;
  rating: number;
  vehiclesCount: number;
  followersCount?: string;
  avatarLetter?: string;
  avatarUrl?: string;
  logo?: string;
  logoUrl?: string;
  coverImage?: string;
  phone: string;
  whatsapp?: string;
  landline?: string;
  contactPerson?: string;
  email?: string;
  website?: string;
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  description?: string;
  about?: string;
  socials?: SocialMedia;
  socialAccounts?: SocialAccount[];
  smartSlug?: string;
  slug?: string;
  customSmartUrl?: string;
  taglineCategory?: string;
  passkey?: string;
  theme_choice?: string;
  themeSettings?: Record<string, any>;
  gallery?: string[];
  profilePictureUrl?: string;
  flagshipVerified?: boolean;
  isPrivateLocked?: boolean;
  likes_count?: number;
  teamMembers?: ShowroomStaff[];
  media?: Array<string | {
    url: string;
    type: string;
    public_id?: string;
    caption?: string;
  }>;
  activityFeed?: Array<{
    id: string;
    title: string;
    timestamp: string;
    type: string;
    badge?: string;
    description?: string;
    price?: number | string;
    carId?: string;
    imageUrl?: string;
  }>;
  verified?: boolean;
  ownerUid?: string;
  createdAt?: string;
  updatedAt?: string;
  likesCount?: number;
  reviewsCount?: number;
  trustScore?: number;
  badges?: string[];
}

export interface ShowroomStaff {
  id: string;
  showroomId?: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  title?: string;
  photoUrl?: string;
  active?: boolean;
  role?: any;
  status?: 'Active' | 'Inactive';
  createdAt?: string;
}

export type ShowroomMember = ShowroomStaff;

export type VisitorCategory = 'First Time Visitor' | 'Second Time Visitor' | 'Third Time Visitor' | 'Regular Visitor';
export type LeadCategory = 'Cold' | 'Warm' | 'Hot' | 'VIP';

export interface VisitorProfile {
  visitorId: string;
  userId?: string;
  name?: string;
  phone?: string;
  email?: string;
  visitCount: number;
  sessionCount: number;
  ipAddress?: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  browser: string;
  operatingSystem: string;
  country: string;
  city: string;
  referrer: string;
  searchHistory: string[];
  vehicleViews: Array<{
    vehicleId: string;
    title: string;
    timestamp: string;
  }>;
  showroomViews: Array<{
    showroomId: string;
    name: string;
    timestamp: string;
  }>;
  favorites: string[];
  sharesCount: number;
  whatsAppClicks: number;
  callClicks: number;
  leadSubmissions: number;
  timeOnSiteSeconds: number;
  visitorCategory: VisitorCategory;
  leadCategory: LeadCategory;
  leadScore: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface VisitorLog {
  id: string;
  visitorId: string;
  path: string;
  action: 'PAGE_VIEW' | 'SEARCH' | 'VEHICLE_VIEW' | 'WHATSAPP_CLICK' | 'CALL_CLICK' | 'LEAD_SUBMIT' | 'SHARE';
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface Lead {
  id: string;
  visitorId?: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  city?: string;
  vehicleId?: string;
  vehicleTitle?: string;
  vehiclePrice?: number;
  vehicleImage?: string;
  showroomId?: string;
  showroomName?: string;
  showroomOwnerId?: string;
  customerId?: string;
  type?: string;
  title?: string;
  details?: string;
  inquiryMessage?: string;
  inquiryDate?: string;
  metadata?: Record<string, any>;
  leadScore?: number;
  leadCategory?: LeadCategory;
  source?: 'WhatsApp' | 'Phone Call' | 'Inquiry Form' | 'Inspection Booking' | 'Bargain Offer';
  status: 'New' | 'Contacted' | 'In Negotiation' | 'Converted' | 'Lost' | 'Pending' | 'Closed' | 'Approved';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SEOPageMeta {
  id: string;
  urlPath: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  jsonLdSchemas: Array<Record<string, any>>;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  aiEngineSummary: string;
  aiKeywords: string[];
  updatedAt: string;
}

export interface EntityNode {
  id: string;
  entityType: 'Brand' | 'Model' | 'Vehicle' | 'Showroom' | 'Dealer' | 'City' | 'Category' | 'FuelType';
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  relatedEntityIds: string[];
  entityAttributes: Record<string, any>;
  faqQuestions: Array<{ q: string; a: string }>;
  aiSummary: string;
  structuredDataJson: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationship: 'BELONGS_TO' | 'LOCATED_IN' | 'OFFERS_VEHICLE' | 'COMPARES_WITH' | 'SUPPLIES';
  weight: number;
}

export interface ReviewItem {
  id: string;
  targetType?: 'Showroom' | 'Vehicle' | 'Dealer' | 'Platform';
  targetId?: string;
  authorName?: string;
  authorUid?: string;
  author?: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  date?: string;
  createdAt?: string;
}

export type Review = ReviewItem;
export type DetailedReview = ReviewItem;

export interface ServiceBooking {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  serviceType?: string;
  serviceId?: string;
  serviceTitle?: string;
  city: string;
  preferredDate: string;
  preferredTime?: string;
  vehicleInfo?: string;
  vehicleId?: string;
  vehicleTitle?: string;
  vehicleDetails?: string;
  assignedWorkshop?: string;
  assignedTechnician?: string;
  invoice?: any;
  review?: any;
  chatMessages?: any;
  priority?: 'High' | 'Medium' | 'Low' | 'Critical';
  uvLightAnalysisRequested?: boolean;
  status: 'Pending' | 'Confirmed' | 'In-Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text?: string;
  timestamp?: string;
  createdAt?: string;
  type?: string;
  metadata?: Record<string, any>;
  conversationId?: string;
  recipientId?: string;
  message?: string;
  attachments?: any[];
  read?: boolean;
  delivered?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails?: Record<string, any>;
  participantNames?: Record<string, string>;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  lastMessageTime?: string;
  lastMessageSenderId?: string;
  relatedListingTitle?: string;
  relatedListingImage?: string;
  relatedListingPrice?: number;
  relatedListingId?: string;
  relatedShowroomId?: string;
  relatedServiceId?: string;
  relatedLeadId?: string;
  unreadCount?: number | Record<string, number>;
  status?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message?: string;
  body?: string;
  link?: string;
  metadata?: Record<string, any>;
  type: 'INFO' | 'LEAD' | 'BARGAIN' | 'ALERT' | 'SYSTEM' | 'system' | 'messages' | 'leads' | 'services' | 'appointments' | 'reviews';
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface DealerSubscription {
  id: string;
  dealerId: string;
  planName: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Expired' | 'Pending';
  monthlyFee: number;
  startDate: string;
  endDate: string;
}

export interface IndustryConfig {
  industryName?: string;
  activeIndustry?: string;
  slogan?: string;
  heroBadge?: string;
  domain?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  primaryCategoryLabel?: string;
  secondaryCategoryLabel?: string;
  accentColor?: string;
  theme?: Record<string, string>;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  timestamp: string;
}

export interface Bargain {
  id: string;
  carId: string;
  carTitle?: string;
  carPrice?: number;
  buyerUid: string;
  buyerName: string;
  buyerPhone: string;
  offeredPrice: number;
  dealerOwnerUid?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  createdAt: string;
}

export interface SocialComment {
  id: string;
  postId?: string;
  userId?: string;
  authorName?: string;
  userName?: string;
  authorAvatar?: string;
  userAvatar?: string;
  userRole?: string;
  content?: string;
  text?: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  title?: string;
  description?: string;
  badge?: string;
  price?: number | string;
  carId?: string;
  timestamp?: string;
  status?: string;
  authorName?: string;
  authorAvatar?: string;
  userName?: string;
  userAvatar?: string;
  userId?: string;
  userRole?: string;
  authorRole?: string;
  content?: string;
  imageUrl?: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  type?: string;
  showroomId?: string;
  approved?: boolean;
  likesCount?: number;
  commentsCount?: number;
  likes?: string[];
  comments?: SocialComment[];
  createdAt?: string;
}

export type ActivityPost = SocialPost;
