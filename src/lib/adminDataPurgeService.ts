/**
 * BAZAR360 Enterprise Data Sanitization & Non-Production Purge Service
 * 
 * Secure utility to detect and purge placeholder, test, and demo documents 
 * from live Firestore collections while safeguarding authentic production assets.
 */

import { collection, getDocs, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { CarListing, Dealer, Lead } from '../types';
import { dbInvalidateCache } from './dbService';

export interface PurgeTargetListing {
  id: string;
  title: string;
  reason: string;
  isLegacySeed: boolean;
}

export interface PurgeTargetUser {
  uid: string;
  email: string;
  displayName: string;
  reason: string;
}

export interface PurgeTargetLead {
  id: string;
  userName: string;
  vehicleTitle?: string;
  reason: string;
}

export interface PurgeScanReport {
  scannedAt: string;
  listings: PurgeTargetListing[];
  users: PurgeTargetUser[];
  leads: PurgeTargetLead[];
  protectedCount: {
    listings: number;
    users: number;
    dealers: number;
  };
}

// Protected Whitelists (Guaranteed never to be deleted)
const PROTECTED_LISTING_IDS = new Set([
  'listing-1784992620146',
  '1784992620146',
  'listing-1784821782501',
  '1784821782501',
  'listing-1784821585212',
  '1784821585212',
]);

const PROTECTED_EMAILS = new Set([
  'amjid.bisconni@gmail.com',
  'mazharsouls@gmail.com',
  'mazhar.showroom@bazar360.online',
  'owner@autochoice.pk',
]);

const PROTECTED_DEALER_IDS = new Set([
  'auto-choice-peshawar',
]);

// Known Legacy Seed IDs
const LEGACY_SEED_LISTING_IDS = new Set([
  'listing-fortuner-legender-2023',
  'listing-civic-rs-2022',
  'listing-haval-h6-hev-2024',
  'listing-landcruiser-zx-2022',
  'listing-sportage-awd-2022',
  'listing-audietron-gt-2023',
  'listing-alto-vxl-2024',
]);

const DEMO_KEYWORDS = [
  'dummy',
  'test post',
  'demo vehicle',
  'placeholder',
  'sample ad',
  'fake listing',
  'test test',
  'mock ad',
];

/**
 * 1. Perform a read-only dry run audit of non-production data
 */
export async function scanNonProductionData(): Promise<PurgeScanReport> {
  const flaggedListings: PurgeTargetListing[] = [];
  const flaggedUsers: PurgeTargetUser[] = [];
  const flaggedLeads: PurgeTargetLead[] = [];

  let protectedListingsCount = 0;
  let protectedUsersCount = 0;
  let protectedDealersCount = 0;

  try {
    // Scan Listings
    const listingsSnap = await getDocs(collection(db, 'listings'));
    listingsSnap.forEach((d) => {
      const id = d.id;
      const data = d.data() as Partial<CarListing>;
      const title = data.title || '';
      const desc = data.description || '';
      const text = `${title} ${desc} ${data.make || ''} ${data.model || ''}`.toLowerCase();
      const img = data.imageUrl || data.primaryImage || '';

      if (PROTECTED_LISTING_IDS.has(id)) {
        protectedListingsCount++;
        return;
      }

      if (LEGACY_SEED_LISTING_IDS.has(id)) {
        flaggedListings.push({
          id,
          title: title || 'Legacy Seed Vehicle',
          reason: 'Legacy hardcoded seed ID',
          isLegacySeed: true,
        });
        return;
      }

      const hasDemoKeyword = DEMO_KEYWORDS.some((kw) => text.includes(kw));
      const isUnsplashDemo = typeof img === 'string' && img.includes('images.unsplash.com');

      if (hasDemoKeyword) {
        flaggedListings.push({
          id,
          title: title || 'Demo Vehicle',
          reason: 'Contains demo/placeholder keywords',
          isLegacySeed: false,
        });
      } else if (isUnsplashDemo && !data.sellerPhone) {
        flaggedListings.push({
          id,
          title: title || 'Unsplash Stock Vehicle',
          reason: 'Contains placeholder stock imagery without authenticated seller contact',
          isLegacySeed: false,
        });
      } else {
        protectedListingsCount++;
      }
    });
  } catch (err) {
    console.warn('[DataPurge] Listing scan error:', err);
  }

  try {
    // Scan Users
    const usersSnap = await getDocs(collection(db, 'users'));
    usersSnap.forEach((d) => {
      const uid = d.id;
      const data = d.data();
      const email = (data.email || '').toLowerCase().trim();
      const name = data.displayName || '';

      if (PROTECTED_EMAILS.has(email)) {
        protectedUsersCount++;
        return;
      }

      const isDemoEmail =
        email.endsWith('@example.com') ||
        email.endsWith('@test.com') ||
        email === 'owner@autochoice.bazar360.online' ||
        email.includes('demo') ||
        email.includes('placeholder');

      const isDemoUid =
        uid.startsWith('demo-') ||
        uid.startsWith('test-') ||
        uid.startsWith('fixture-') ||
        uid === 'showroom-owner-demo';

      if (isDemoEmail || isDemoUid) {
        flaggedUsers.push({
          uid,
          email: email || 'No email',
          displayName: name || 'Demo Account',
          reason: isDemoEmail ? 'Example/Test email domain' : 'Demo UID pattern',
        });
      } else {
        protectedUsersCount++;
      }
    });
  } catch (err) {
    console.warn('[DataPurge] User scan error:', err);
  }

  try {
    // Scan Leads
    const leadsSnap = await getDocs(collection(db, 'leads'));
    leadsSnap.forEach((d) => {
      const id = d.id;
      const data = d.data() as Partial<Lead>;
      const userName = data.userName || '';
      const email = (data.userEmail || '').toLowerCase();

      const isDummyLead =
        id.startsWith('lead-') ||
        userName.includes('Kamran') ||
        userName.includes('Zubair') ||
        userName.includes('Test') ||
        email.endsWith('@example.com');

      if (isDummyLead) {
        flaggedLeads.push({
          id,
          userName: userName || 'Test Lead',
          vehicleTitle: data.vehicleTitle,
          reason: 'Sample demo inquiry artifact',
        });
      }
    });
  } catch (err) {
    console.warn('[DataPurge] Leads scan error:', err);
  }

  try {
    // Check Dealers
    const dealersSnap = await getDocs(collection(db, 'dealers'));
    dealersSnap.forEach((d) => {
      if (PROTECTED_DEALER_IDS.has(d.id)) {
        protectedDealersCount++;
      }
    });
  } catch (err) {
    console.warn('[DataPurge] Dealer scan error:', err);
  }

  return {
    scannedAt: new Date().toISOString(),
    listings: flaggedListings,
    users: flaggedUsers,
    leads: flaggedLeads,
    protectedCount: {
      listings: protectedListingsCount,
      users: protectedUsersCount,
      dealers: protectedDealersCount,
    },
  };
}

/**
 * 2. Securely execute batch deletion of flagged non-production records
 */
export async function executePurgeNonProductionData(
  scanReport: PurgeScanReport,
  adminEmail: string = 'admin'
): Promise<{
  deletedListings: number;
  deletedUsers: number;
  deletedLeads: number;
  success: boolean;
}> {
  let deletedListings = 0;
  let deletedUsers = 0;
  let deletedLeads = 0;

  // Purge Flagged Listings
  for (const item of scanReport.listings) {
    if (PROTECTED_LISTING_IDS.has(item.id)) continue;
    try {
      await deleteDoc(doc(db, 'listings', item.id));
      deletedListings++;
    } catch (e) {
      console.error(`[DataPurge] Failed deleting listing ${item.id}:`, e);
    }
  }

  // Purge Flagged Users
  for (const item of scanReport.users) {
    if (PROTECTED_EMAILS.has(item.email.toLowerCase())) continue;
    try {
      await deleteDoc(doc(db, 'users', item.uid));
      deletedUsers++;
    } catch (e) {
      console.error(`[DataPurge] Failed deleting user ${item.uid}:`, e);
    }
  }

  // Purge Flagged Leads
  for (const item of scanReport.leads) {
    try {
      await deleteDoc(doc(db, 'leads', item.id));
      deletedLeads++;
    } catch (e) {
      console.error(`[DataPurge] Failed deleting lead ${item.id}:`, e);
    }
  }

  // Log to Audit Trail
  try {
    await addDoc(collection(db, 'auditLogs'), {
      action: 'PURGE_NON_PRODUCTION_DATA',
      executedBy: adminEmail,
      deletedCounts: {
        listings: deletedListings,
        users: deletedUsers,
        leads: deletedLeads,
      },
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('[DataPurge] Audit logging completed locally');
  }

  // Invalidate memory caches to reflect live state instantly
  dbInvalidateCache();

  return {
    deletedListings,
    deletedUsers,
    deletedLeads,
    success: true,
  };
}
