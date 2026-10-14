import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  increment,
  collection,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { VisitorProfile, VisitorCategory, LeadCategory } from '../types';

function generateVisitorId(): string {
  return 'vst-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString().slice(-4);
}

function detectDeviceAndOS(): { deviceType: 'Mobile' | 'Tablet' | 'Desktop'; browser: string; operatingSystem: string } {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { deviceType: 'Desktop', browser: 'Chrome', operatingSystem: 'Linux' };
  }

  const ua = navigator.userAgent;
  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|iPhone|Android|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';

  let operatingSystem = 'Windows';
  if (ua.includes('Mac OS')) operatingSystem = 'macOS';
  else if (ua.includes('Android')) operatingSystem = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) operatingSystem = 'iOS';
  else if (ua.includes('Linux')) operatingSystem = 'Linux';

  return { deviceType, browser, operatingSystem };
}

export function calculateLeadScoreAndCategory(
  searchCount: number,
  viewCount: number,
  callCount: number,
  whatsAppCount: number,
  leadCount: number,
  favoriteCount: number,
  timeOnSiteSeconds: number
): { leadScore: number; leadCategory: LeadCategory } {
  let score = 5; // Base score
  score += Math.min(20, searchCount * 3);
  score += Math.min(25, viewCount * 4);
  score += Math.min(25, whatsAppCount * 15);
  score += Math.min(25, callCount * 15);
  score += Math.min(30, leadCount * 25);
  score += Math.min(15, favoriteCount * 5);
  score += Math.min(15, Math.floor(timeOnSiteSeconds / 60) * 2);

  const finalScore = Math.min(100, Math.max(0, score));

  let category: LeadCategory = 'Cold';
  if (finalScore >= 81) category = 'VIP';
  else if (finalScore >= 56) category = 'Hot';
  else if (finalScore >= 26) category = 'Warm';

  return { leadScore: finalScore, leadCategory: category };
}

export async function initializeVisitorTracking(): Promise<VisitorProfile> {
  let visitorId = '';
  try {
    visitorId = localStorage.getItem('bazar360_visitor_id') || '';
  } catch (e) {
    console.warn('Storage disabled, using session visitor ID.');
  }

  if (!visitorId) {
    visitorId = generateVisitorId();
    try {
      localStorage.setItem('bazar360_visitor_id', visitorId);
    } catch (e) {}
  }

  const { deviceType, browser, operatingSystem } = detectDeviceAndOS();
  const referrer = typeof document !== 'undefined' ? document.referrer || 'Direct' : 'Direct';
  const nowStr = new Date().toISOString();

  let isNewSession = false;
  try {
    if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('bazar360_active_session')) {
      isNewSession = true;
      sessionStorage.setItem('bazar360_active_session', 'true');
    }
  } catch (e) {
    isNewSession = true;
  }

  const visitorRef = doc(db, 'visitors', visitorId);
  let profile: VisitorProfile;

  try {
    const snap = await getDoc(visitorRef);
    if (snap.exists()) {
      const existing = snap.data() as VisitorProfile;
      const sessionCount = isNewSession ? (existing.sessionCount || 1) + 1 : existing.sessionCount || 1;
      const visitCount = existing.visitCount + 1;

      let visitorCategory: VisitorCategory = 'First Time Visitor';
      if (sessionCount === 2) visitorCategory = 'Second Time Visitor';
      else if (sessionCount === 3) visitorCategory = 'Third Time Visitor';
      else if (sessionCount >= 4) visitorCategory = 'Regular Visitor';

      const { leadScore, leadCategory } = calculateLeadScoreAndCategory(
        existing.searchHistory?.length || 0,
        existing.vehicleViews?.length || 0,
        existing.callClicks || 0,
        existing.whatsAppClicks || 0,
        existing.leadSubmissions || 0,
        existing.favorites?.length || 0,
        existing.timeOnSiteSeconds || 0
      );

      profile = {
        ...existing,
        visitorId,
        visitCount,
        sessionCount,
        visitorCategory,
        leadScore,
        leadCategory,
        deviceType,
        browser,
        operatingSystem,
        referrer,
        lastSeenAt: nowStr,
      };

      await updateDoc(visitorRef, {
        visitCount,
        sessionCount,
        visitorCategory,
        leadScore,
        leadCategory,
        deviceType,
        browser,
        operatingSystem,
        referrer,
        lastSeenAt: nowStr
      }).catch(() => {});
    } else {
      profile = {
        visitorId,
        visitCount: 1,
        sessionCount: 1,
        deviceType,
        browser,
        operatingSystem,
        country: 'Pakistan',
        city: 'Peshawar',
        referrer,
        searchHistory: [],
        vehicleViews: [],
        showroomViews: [],
        favorites: [],
        sharesCount: 0,
        whatsAppClicks: 0,
        callClicks: 0,
        leadSubmissions: 0,
        timeOnSiteSeconds: 15,
        visitorCategory: 'First Time Visitor',
        leadCategory: 'Cold',
        leadScore: 10,
        firstSeenAt: nowStr,
        lastSeenAt: nowStr,
      };

      await setDoc(visitorRef, profile).catch(() => {});
    }
  } catch (err) {
    profile = {
      visitorId,
      visitCount: 1,
      sessionCount: 1,
      deviceType,
      browser,
      operatingSystem,
      country: 'Pakistan',
      city: 'Peshawar',
      referrer,
      searchHistory: [],
      vehicleViews: [],
      showroomViews: [],
      favorites: [],
      sharesCount: 0,
      whatsAppClicks: 0,
      callClicks: 0,
      leadSubmissions: 0,
      timeOnSiteSeconds: 15,
      visitorCategory: 'First Time Visitor',
      leadCategory: 'Cold',
      leadScore: 10,
      firstSeenAt: nowStr,
      lastSeenAt: nowStr,
    };
  }

  // Log page view in visitor_logs
  logVisitorAction(visitorId, 'PAGE_VIEW', { path: typeof window !== 'undefined' ? window.location.pathname : '/' });

  return profile;
}

export async function logVisitorAction(
  visitorId: string, 
  action: 'PAGE_VIEW' | 'SEARCH' | 'VEHICLE_VIEW' | 'WHATSAPP_CLICK' | 'CALL_CLICK' | 'LEAD_SUBMIT' | 'SHARE',
  metadata?: Record<string, any>
): Promise<void> {
  if (!visitorId) return;

  const nowStr = new Date().toISOString();
  try {
    await addDoc(collection(db, 'visitor_logs'), {
      visitorId,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      action,
      metadata: metadata || {},
      timestamp: nowStr
    }).catch(() => {});

    // Update visitor aggregate totals
    const visitorRef = doc(db, 'visitors', visitorId);
    if (action === 'SEARCH' && metadata?.query) {
      await updateDoc(visitorRef, {
        searchHistory: arrayUnion(metadata.query),
        lastSeenAt: nowStr
      }).catch(() => {});
    } else if (action === 'VEHICLE_VIEW' && metadata?.vehicleId) {
      await updateDoc(visitorRef, {
        vehicleViews: arrayUnion({
          vehicleId: metadata.vehicleId,
          title: metadata.title || 'Vehicle',
          timestamp: nowStr
        }),
        lastSeenAt: nowStr
      }).catch(() => {});
    } else if (action === 'WHATSAPP_CLICK') {
      await updateDoc(visitorRef, {
        whatsAppClicks: increment(1),
        lastSeenAt: nowStr
      }).catch(() => {});
    } else if (action === 'CALL_CLICK') {
      await updateDoc(visitorRef, {
        callClicks: increment(1),
        lastSeenAt: nowStr
      }).catch(() => {});
    } else if (action === 'LEAD_SUBMIT') {
      await updateDoc(visitorRef, {
        leadSubmissions: increment(1),
        lastSeenAt: nowStr
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('[VisitorTracking] Log failed:', err);
  }
}

export async function trackSearchQuery(query: string): Promise<void> {
  if (!query || !query.trim()) return;
  try {
    const visitorId = typeof localStorage !== 'undefined' ? localStorage.getItem('bazar360_visitor_id') || '' : '';
    if (visitorId) {
      await logVisitorAction(visitorId, 'SEARCH', { query: query.trim() });
    }
  } catch (e) {
    console.warn('[VisitorTracking] trackSearchQuery bypass:', e);
  }
}

export async function trackVehicleView(vehicleId: string, title?: string): Promise<void> {
  if (!vehicleId) return;
  try {
    const visitorId = typeof localStorage !== 'undefined' ? localStorage.getItem('bazar360_visitor_id') || '' : '';
    if (visitorId) {
      await logVisitorAction(visitorId, 'VEHICLE_VIEW', { vehicleId, title: title || 'Vehicle' });
    }
  } catch (e) {
    console.warn('[VisitorTracking] trackVehicleView bypass:', e);
  }
}


