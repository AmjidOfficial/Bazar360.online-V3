import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { INITIAL_DEALERS, INITIAL_LISTINGS } from '../data';
import { CarListing, Dealer } from '../types';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
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

/**
 * Serializes a list of Sitemap entries into a valid XML Sitemap 0.9 string
 */
export function serializeToSitemapXml(entries: SitemapEntry[]): string {
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

/**
 * Generates sitemap entries from dealers and listings
 */
export function generateSitemapEntries(
  dealers: Dealer[],
  listings: CarListing[],
  baseUrl = 'https://bazar360.online'
): SitemapEntry[] {
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

  const seenUrls = new Set<string>(entries.map((e) => e.loc));

  // Add Dealer Showrooms & Smart Links
  dealers.forEach((dealer) => {
    const dealerUrl = `${normalizedBase}/dealers/${dealer.id}`;
    if (!seenUrls.has(dealerUrl)) {
      seenUrls.add(dealerUrl);
      entries.push({
        loc: dealerUrl,
        lastmod: formatDate(dealer.updatedAt || (dealer as any).createdAt),
        changefreq: 'daily',
        priority: '0.85',
      });
    }

    if (dealer.smartSlug) {
      const smartSlugUrl = `${normalizedBase}/${dealer.smartSlug}`;
      if (!seenUrls.has(smartSlugUrl)) {
        seenUrls.add(smartSlugUrl);
        entries.push({
          loc: smartSlugUrl,
          lastmod: formatDate(dealer.updatedAt || (dealer as any).createdAt),
          changefreq: 'daily',
          priority: '0.85',
        });
      }
    }
  });

  // Add Vehicle Listings
  listings.forEach((car) => {
    const vehicleUrl = `${normalizedBase}/vehicle/${car.id}`;
    if (!seenUrls.has(vehicleUrl)) {
      seenUrls.add(vehicleUrl);
      entries.push({
        loc: vehicleUrl,
        lastmod: formatDate(car.updatedAt || (car as any).createdAt || (car as any).datePosted),
        changefreq: 'daily',
        priority: '0.8',
      });
    }
  });

  return entries;
}

/**
 * Fetches all vehicle listings and dealer showrooms from Firestore and serializes into sitemap.xml
 */
export async function fetchAndGenerateSitemapXml(baseUrl = 'https://bazar360.online'): Promise<string> {
  let listings: CarListing[] = [];
  let dealers: Dealer[] = [];

  try {
    const listingsSnap = await getDocs(collection(db, 'listings'));
    if (!listingsSnap.empty) {
      listings = listingsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CarListing));
    }
  } catch (err) {
    console.warn('[Sitemap Client] Could not fetch listings from Firestore, falling back to seed:', err);
  }

  try {
    const dealersSnap = await getDocs(collection(db, 'dealers'));
    if (!dealersSnap.empty) {
      dealers = dealersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Dealer));
    }
  } catch (err) {
    console.warn('[Sitemap Client] Could not fetch dealers from Firestore, falling back to seed:', err);
  }

  // Graceful fallback to static seed data
  if (listings.length === 0) listings = INITIAL_LISTINGS;
  if (dealers.length === 0) dealers = INITIAL_DEALERS;

  const entries = generateSitemapEntries(dealers, listings, baseUrl);
  return serializeToSitemapXml(entries);
}

/**
 * Utility to trigger client-side download of the sitemap.xml file
 */
export async function downloadSitemapXml(customXml?: string, filename = 'sitemap.xml'): Promise<void> {
  const xml = customXml || (await fetchAndGenerateSitemapXml());
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
