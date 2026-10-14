// BAZAR360 Server-Side OpenGraph & SEO Meta Tags Injector

export async function generateDealerSeo(dealerId: string): Promise<string | null> {
  if (!dealerId) return null;

  const isAutoChoice = dealerId === 'auto-choice-peshawar';
  const name = isAutoChoice ? 'Auto Choice - The Right Choice' : `Showroom ${dealerId}`;
  const description = isAutoChoice
    ? "Auto Choice: The Right Choice is Pakistan's premier automotive showroom in Peshawar for luxury SUVs, jeeps, and immaculate vehicles."
    : `Explore verified vehicles and certified inventory at ${dealerId} on Bazar360.`;
  const url = `https://bazar360.online/dealers/${dealerId}`;
  const image = 'https://res.cloudinary.com/me634xd0/image/upload/v1786719980/bazar360_showroom_logos/gvp4jqzmccmzezbuxkdg.jpg';

  return `
    <title>${name} | Bazar360</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${name} | Bazar360" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${name}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  `;
}

export async function generateVehicleSeo(vehicleId: string): Promise<string | null> {
  if (!vehicleId) return null;

  const url = `https://bazar360.online/vehicle/${vehicleId}`;
  const title = `Vehicle Listing | Bazar360`;
  const description = `Inspect verified vehicle condition, multi-point audit score, and price on Pakistan's premier automotive platform.`;
  const image = 'https://bazar360.online/auto_choice_hero_banner.jpg';

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  `;
}
