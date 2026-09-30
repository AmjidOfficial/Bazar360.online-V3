import { useEffect } from 'react';
import { CarListing, Dealer } from '../types';

export const SEO_CONSTANTS = {
  SITE_NAME: 'Bazar360',
  SITE_TAGLINE: 'Pakistan’s Premier Verified Automotive Marketplace',
  BASE_URL: 'https://bazar360.online',
  DEFAULT_OG_IMAGE: 'https://bazar360.online/bazar360_official_logo.jpg',
  DEFAULT_DESCRIPTION: 'Pakistan’s premier verified automotive marketplace. Connect directly with verified showrooms and individual sellers with zero commission and instant WhatsApp connect.',
  TWITTER_HANDLE: '@AutoChoicePK',
  CURRENCY: 'PKR',
  DEFAULT_LOCALE: 'en_PK',
} as const;

export interface GeneratedMetaTags {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: Record<string, any>;
}

export interface PageMetaOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  vehicle?: CarListing;
  dealer?: Dealer;
}

/**
 * Format currency amount for SEO title and description
 */
function formatPriceText(price?: number): string {
  if (!price || isNaN(price)) return 'Price on Request';
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Crore`;
  }
  if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lakh`;
  }
  return `PKR ${price.toLocaleString()}`;
}

/**
 * Generates dynamic SEO meta tags and Schema.org structured JSON-LD
 * for individual vehicle listings or marketplace pages.
 */
export function generateVehicleSEO(vehicle: CarListing, dealer?: Dealer): GeneratedMetaTags {
  const city = vehicle.location || vehicle.registrationCity || dealer?.location || 'Pakistan';
  const priceFormatted = formatPriceText(vehicle.price);
  const condition = vehicle.condition || 'Used';
  const fuel = vehicle.fuelType || 'Petrol';
  const trans = vehicle.transmission || 'Automatic';
  const mileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'Low Mileage';

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} for Sale in ${city} | ${priceFormatted} - ${SEO_CONSTANTS.SITE_NAME}`;
  
  const description = `Buy ${condition} ${vehicle.year} ${vehicle.make} ${vehicle.model} in ${city} for ${priceFormatted}. Specs: ${fuel}, ${trans}, ${mileage}. Direct WhatsApp contact with seller & zero commission on Bazar360.`;

  const canonicalUrl = `${SEO_CONSTANTS.BASE_URL}/vehicle/${vehicle.id}`;

  const rawImage = vehicle.imageUrl || (vehicle.images && vehicle.images[0]) || SEO_CONSTANTS.DEFAULT_OG_IMAGE;
  const ogImage = rawImage.startsWith('http') ? rawImage : `${SEO_CONSTANTS.BASE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  // Schema.org Car & Product structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    '@id': canonicalUrl,
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.title ? `- ${vehicle.title}` : ''}`,
    description: description,
    image: [ogImage],
    brand: {
      '@type': 'Brand',
      name: vehicle.make,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year ? String(vehicle.year) : undefined,
    itemCondition: condition.toLowerCase() === 'new' 
      ? 'https://schema.org/NewCondition' 
      : 'https://schema.org/UsedCondition',
    fuelType: fuel,
    vehicleTransmission: trans,
    mileageFromOdometer: vehicle.mileage ? {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage,
      unitCode: 'KMT',
    } : undefined,
    color: vehicle.exteriorColor || vehicle.specs?.color,
    offers: {
      '@type': 'Offer',
      price: vehicle.price || 0,
      priceCurrency: SEO_CONSTANTS.CURRENCY,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: vehicle.isSold ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: canonicalUrl,
      seller: {
        '@type': 'AutoDealer',
        name: dealer?.name || vehicle.sellerName || 'Auto Choice Verified Seller',
        telephone: dealer?.phone || dealer?.whatsapp || vehicle.sellerWhatsApp || vehicle.phone || '+923159085086',
        url: dealer ? `${SEO_CONSTANTS.BASE_URL}/dealers/${dealer.id}` : SEO_CONSTANTS.BASE_URL,
      },
    },
  };

  return {
    title,
    description,
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: 'product',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    jsonLd,
  };
}

/**
 * Dynamically updates document head meta tags and structured data
 */
export function applyDynamicMetaTags(meta: GeneratedMetaTags): () => void {
  if (typeof document === 'undefined') return () => {};

  // 1. Title
  document.title = meta.title;

  // Helper to set or create meta tag
  const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to set or create link tag
  const setLinkTag = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // Standard Meta Tags
  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  setLinkTag('canonical', meta.canonicalUrl);

  // OpenGraph Tags
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.ogTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.ogDescription);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SEO_CONSTANTS.SITE_NAME);

  // Twitter Tags
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', meta.twitterCard);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.twitterTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.twitterDescription);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', meta.twitterImage);

  // JSON-LD Structured Data script
  const jsonLdId = 'bazar360-dynamic-jsonld';
  let jsonScript = document.getElementById(jsonLdId) as HTMLScriptElement | null;
  if (!jsonScript) {
    jsonScript = document.createElement('script');
    jsonScript.id = jsonLdId;
    jsonScript.type = 'application/ld+json';
    document.head.appendChild(jsonScript);
  }
  jsonScript.textContent = JSON.stringify(meta.jsonLd);

  // Return cleanup function to restore defaults if needed
  return () => {
    // Optionally cleanup
  };
}

/**
 * Custom React Hook for seamless SEO tags and Schema.org injection
 */
export function useDynamicVehicleSEO(vehicle?: CarListing | null, dealer?: Dealer | null) {
  useEffect(() => {
    if (!vehicle) return;
    const meta = generateVehicleSEO(vehicle, dealer || undefined);
    const cleanup = applyDynamicMetaTags(meta);
    return cleanup;
  }, [vehicle?.id, vehicle?.title, vehicle?.price, dealer?.id]);
}

/**
 * Helper function to dynamically update meta tags using react-helmet-async concept
 * and direct HTML document head fallback for active vehicle listing SEO indexing.
 */
export function updateMetaTags(data: CarListing): void {
  if (typeof document === 'undefined' || !data) return;

  const city = data.location || data.registrationCity || 'Pakistan';
  const priceFormatted = data.price 
    ? (data.price >= 10000000 
        ? `PKR ${(data.price / 10000000).toFixed(2)} Crore` 
        : `PKR ${(data.price / 100000).toFixed(2)} Lakh`)
    : 'Price on Request';
  
  const title = `${data.year} ${data.make} ${data.model} for Sale in ${city} | ${priceFormatted} - Bazar360`;
  const description = `Buy ${data.condition || 'Used'} ${data.year} ${data.make} ${data.model} in ${city} for ${priceFormatted}. Zero commission and direct WhatsApp connect on Bazar360.`;

  // Update document title
  document.title = title;

  // Update or create meta description tag
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', description);

  // Update OpenGraph details for social search crawlers
  let ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (!ogTitleMeta) {
    ogTitleMeta = document.createElement('meta');
    ogTitleMeta.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitleMeta);
  }
  ogTitleMeta.setAttribute('content', title);

  let ogDescMeta = document.querySelector('meta[property="og:description"]');
  if (!ogDescMeta) {
    ogDescMeta = document.createElement('meta');
    ogDescMeta.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescMeta);
  }
  ogDescMeta.setAttribute('content', description);
  
  console.info(`[SEO] Dynamic Meta Tags updated for listing: ${data.id} - ${title}`);
}

export default {
  SEO_CONSTANTS,
  generateVehicleSEO,
  applyDynamicMetaTags,
  useDynamicVehicleSEO,
  updateMetaTags,
};
