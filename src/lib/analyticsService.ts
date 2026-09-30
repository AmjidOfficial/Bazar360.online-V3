import { doc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { dbTrackLeadAction } from './dbService';

export interface WhatsAppClickParams {
  vehicleId?: string;
  vehicleTitle?: string;
  dealerId?: string;
  phoneNumber?: string;
  source?: 'vehicle_detail' | 'home_feed' | 'auto_choice' | 'showroom' | 'direct';
}

export interface CallClickParams {
  vehicleId?: string;
  vehicleTitle?: string;
  dealerId?: string;
  phoneNumber?: string;
  source?: 'vehicle_detail' | 'home_feed' | 'auto_choice' | 'showroom' | 'direct';
}

export interface SaveVehicleParams {
  vehicleId: string;
  vehicleTitle?: string;
  isSaved: boolean; // true = added to favorites, false = removed
  price?: number;
  dealerId?: string;
}

export interface VehicleViewParams {
  vehicleId: string;
  vehicleTitle?: string;
  price?: number;
  make?: string;
  model?: string;
  dealerId?: string;
}

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  data: Record<string, any>;
}

const ANALYTICS_STORAGE_KEY = 'bazar360_analytics_buffer';

function getVisitorId(): string {
  try {
    return localStorage.getItem('bazar360_visitor_id') || 'vst-anon';
  } catch {
    return 'vst-anon';
  }
}

function persistLocalEvent(event: AnalyticsEvent) {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const list: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(event);
    if (list.length > 50) list.length = 50; // Keep latest 50
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // Ignore storage quota errors
  }
}

/**
 * Universal Analytics Service for BAZAR360
 * Captures high-fidelity engagement metrics for WhatsApp, Call, Favorites/Saves, and Lead Funnels.
 */
class AnalyticsService {
  /**
   * Track when a user initiates a WhatsApp chat with a seller or showroom
   */
  public async trackWhatsAppClick(params: WhatsAppClickParams): Promise<void> {
    const visitorId = getVisitorId();
    const event: AnalyticsEvent = {
      eventName: 'click_whatsapp',
      timestamp: new Date().toISOString(),
      data: {
        ...params,
        visitorId,
      },
    };

    persistLocalEvent(event);
    console.info('[Analytics] WhatsApp Click:', params);

    // 1. Update Visitor Doc Counters in Firestore
    try {
      if (visitorId && visitorId !== 'vst-anon') {
        const visitorRef = doc(db, 'visitors', visitorId);
        await updateDoc(visitorRef, {
          clicksToWhatsApp: increment(1),
          lastAction: 'WhatsApp Click',
          lastSeen: new Date().toISOString(),
        });
      }
    } catch (err) {
      // Offline fallback
    }

    // 2. Track Lead Action for CRM & Analytics
    try {
      if (params.dealerId || params.vehicleId) {
        await dbTrackLeadAction({
          userName: 'Visitor User',
          userPhone: params.phoneNumber || '',
          userEmail: 'guest@bazar360.online',
          actionType: 'whatsapp_click',
          details: `WhatsApp connect initiated for ${params.vehicleTitle || params.vehicleId || 'vehicle'} (Showroom: ${params.dealerId || 'direct'})`,
          leadSource: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile' : 'Web',
          leadScore: 100,
          leadCategory: 'Warm',
          visitorCategory: 'Guest',
        });
      }
    } catch (err) {
      // Offline fallback
    }
  }

  /**
   * Track when a user initiates a direct phone call
   */
  public async trackCallClick(params: CallClickParams): Promise<void> {
    const visitorId = getVisitorId();
    const event: AnalyticsEvent = {
      eventName: 'click_call',
      timestamp: new Date().toISOString(),
      data: {
        ...params,
        visitorId,
      },
    };

    persistLocalEvent(event);
    console.info('[Analytics] Call Click:', params);

    // 1. Update Visitor Doc Counters in Firestore
    try {
      if (visitorId && visitorId !== 'vst-anon') {
        const visitorRef = doc(db, 'visitors', visitorId);
        await updateDoc(visitorRef, {
          clicksToCall: increment(1),
          lastAction: 'Call Click',
          lastSeen: new Date().toISOString(),
        });
      }
    } catch (err) {
      // Offline fallback
    }

    // 2. Track Lead Action for CRM
    try {
      if (params.dealerId || params.vehicleId) {
        await dbTrackLeadAction({
          userName: 'Visitor User',
          userPhone: params.phoneNumber || '',
          userEmail: 'guest@bazar360.online',
          actionType: 'call_click',
          details: `Direct phone call initiated for ${params.vehicleTitle || params.vehicleId || 'vehicle'} (Showroom: ${params.dealerId || 'direct'})`,
          leadSource: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile' : 'Web',
          leadScore: 100,
          leadCategory: 'Warm',
          visitorCategory: 'Guest',
        });
      }
    } catch (err) {
      // Offline fallback
    }
  }

  /**
   * Track when a user saves or unsaves a vehicle (Add to Shortlist / Favorites)
   */
  public async trackSaveVehicle(params: SaveVehicleParams): Promise<void> {
    const visitorId = getVisitorId();
    const event: AnalyticsEvent = {
      eventName: params.isSaved ? 'save_vehicle' : 'unsave_vehicle',
      timestamp: new Date().toISOString(),
      data: {
        ...params,
        visitorId,
      },
    };

    persistLocalEvent(event);
    console.info(`[Analytics] ${params.isSaved ? 'Save' : 'Unsave'} Vehicle:`, params);

    try {
      if (visitorId && visitorId !== 'vst-anon') {
        const visitorRef = doc(db, 'visitors', visitorId);
        await updateDoc(visitorRef, {
          lastAction: params.isSaved ? `Saved ${params.vehicleId}` : `Unsaved ${params.vehicleId}`,
          lastSeen: new Date().toISOString(),
        });
      }
    } catch (err) {
      // Offline fallback
    }

    // Also record lead action if saved
    if (params.isSaved) {
      try {
        await dbTrackLeadAction({
          userName: 'Visitor User',
          userPhone: '',
          userEmail: 'guest@bazar360.online',
          actionType: 'favorite',
          details: `Saved vehicle ${params.vehicleTitle || params.vehicleId} to shortlist`,
          leadSource: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile' : 'Web',
          leadScore: 50,
          leadCategory: 'Cold',
          visitorCategory: 'Guest',
        });
      } catch (err) {
        // Offline fallback
      }
    }
  }

  /**
   * Track when a user views a vehicle detail page
   */
  public async trackVehicleView(params: VehicleViewParams): Promise<void> {
    const visitorId = getVisitorId();
    const event: AnalyticsEvent = {
      eventName: 'view_vehicle',
      timestamp: new Date().toISOString(),
      data: {
        ...params,
        visitorId,
      },
    };

    persistLocalEvent(event);

    try {
      if (visitorId && visitorId !== 'vst-anon') {
        const visitorRef = doc(db, 'visitors', visitorId);
        await updateDoc(visitorRef, {
          totalViews: increment(1),
          lastSeen: new Date().toISOString(),
        });
      }
    } catch (err) {
      // Offline fallback
    }
  }

  /**
   * Generic custom event tracker
   */
  public async trackEvent(eventName: string, data: Record<string, any> = {}): Promise<void> {
    const visitorId = getVisitorId();
    const event: AnalyticsEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        visitorId,
      },
    };

    persistLocalEvent(event);
    console.info(`[Analytics] Event ${eventName}:`, data);
  }

  /**
   * Get recently buffered engagement events
   */
  public getBufferedEvents(): AnalyticsEvent[] {
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
