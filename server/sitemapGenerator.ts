import { getApps, initializeApp, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { INITIAL_DEALERS, INITIAL_LISTINGS } from '../src/data';

// Initialize Firebase Admin (lazy)
function getAdminDb(): Firestore | null {
  try {
    let app: App;
    if (getApps().length === 0) {
      try {
        app = initializeApp({
          projectId: firebaseConfig.projectId,
        });
      } catch (e) {
        app = getApp();
      }
    } else {
      app = getApps()[0] || getApp();
    }

    if (firebaseConfig.firestoreDatabaseId) {
      try {
        return getFirestore(app, firebaseConfig.firestoreDatabaseId);
      } catch (e) {
        return getFirestore(app);
      }
    }
    return getFirestore(app);
  } catch (err) {
    console.warn('[Sitemap Generator] Firebase Admin db initialization skipped:', err);
    return null;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function formatDate(isoOrDate?: string | number | Date | null): string {
  try {
    if (!isoOrDate) return new Date().toISOString().split('T')[0];
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export async function generateSitemapXml(baseUrl = 'https://bazar360.online'): Promise<string> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const entries: SitemapEntry[] = [
    {
      loc: `${normalizedBase}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: `${normalizedBase}/explore`,
      lastmod: today,
      changefreq: 'hourly',
      priority: '0.9',
    },
    {
      loc: `${normalizedBase}/showrooms`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      loc: `${normalizedBase}/sell`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: `${normalizedBase}/auto-choice`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
    },
  ];

  const seenUrls = new Set<string>(entries.map(e => e.loc));

  let listings: any[] = [];
  let dealers: any[] = [];

  const db = getAdminDb();
  if (db) {
    try {
      const listingsSnap = await db.collection('listings').get();
      if (!listingsSnap.empty) {
        listings = listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('[Sitemap] Could not fetch listings from Firestore, using initial listings:', err);
    }

    try {
      const dealersSnap = await db.collection('dealers').get();
      if (!dealersSnap.empty) {
        dealers = dealersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('[Sitemap] Could not fetch dealers from Firestore, using initial dealers:', err);
    }
  }

  // Fallback to static seed data if Firestore returned empty or was unavailable
  if (listings.length === 0) {
    listings = INITIAL_LISTINGS;
  }
  if (dealers.length === 0) {
    dealers = INITIAL_DEALERS;
  }

  // Add Dealer Showrooms & Smart Links
  dealers.forEach((dealer) => {
    const dealerUrl = `${normalizedBase}/dealers/${dealer.id}`;
    if (!seenUrls.has(dealerUrl)) {
      seenUrls.add(dealerUrl);
      entries.push({
        loc: dealerUrl,
        lastmod: formatDate(dealer.updatedAt || dealer.createdAt),
        changefreq: 'daily',
        priority: '0.85',
      });
    }

    // Smart link slug (e.g. /AutoChoice01)
    if (dealer.smartSlug) {
      const smartSlugUrl = `${normalizedBase}/${dealer.smartSlug}`;
      if (!seenUrls.has(smartSlugUrl)) {
        seenUrls.add(smartSlugUrl);
        entries.push({
          loc: smartSlugUrl,
          lastmod: formatDate(dealer.updatedAt || dealer.createdAt),
          changefreq: 'daily',
          priority: '0.85',
        });
      }
    }
  });

  // Add Vehicle Listings
  listings.forEach((car) => {
    // Standard vehicle detail path
    const vehicleUrl = `${normalizedBase}/vehicle/${car.id}`;
    if (!seenUrls.has(vehicleUrl)) {
      seenUrls.add(vehicleUrl);
      entries.push({
        loc: vehicleUrl,
        lastmod: formatDate(car.updatedAt || car.createdAt || car.datePosted),
        changefreq: 'daily',
        priority: '0.8',
      });
    }
  });

  // Build standard Sitemap XML
  const xmlRows = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlRows}
</urlset>`;
}
