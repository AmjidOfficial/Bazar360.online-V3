import { CarListing, Dealer } from './types';

export const INITIAL_DEALERS: Dealer[] = [
  {
    id: 'auto-choice-peshawar',
    name: 'Auto Choice - The Right Choice',
    subtitle: 'The Right Choice | To buy and Sell New and Used Cars, Jeeps and SUVs',
    location: 'Alamas Car Village, Ring Road, Peshawar',
    rating: 4.9,
    vehiclesCount: 0,
    followersCount: '0',
    avatarLetter: 'AC',
    avatarUrl: 'https://res.cloudinary.com/me634xd0/image/upload/v1786719980/bazar360_showroom_logos/gvp4jqzmccmzezbuxkdg.jpg',
    logo: 'https://res.cloudinary.com/me634xd0/image/upload/v1786719980/bazar360_showroom_logos/gvp4jqzmccmzezbuxkdg.jpg',
    logoUrl: 'https://res.cloudinary.com/me634xd0/image/upload/v1786719980/bazar360_showroom_logos/gvp4jqzmccmzezbuxkdg.jpg',
    coverImage: 'https://res.cloudinary.com/me634xd0/image/upload/v1786266378/bazar360_covers/i9rknevddargoerv3xsq.jpg',
    phone: '+923159085086',
    whatsapp: '923159085086',
    description: 'Auto Choice is a premier automotive marketplace specialized in buying and selling immaculate new and used cars, robust jeeps, and luxury premium SUVs. Committed to absolute transparency, nationwide delivery, and personalized customer service all over Pakistan.',
    socials: {
      instagram: 'https://instagram.com/autochoice',
      tiktok: 'https://www.tiktok.com/@grandautochoice',
      website: 'https://bazar360.online/dealers/auto-choice-peshawar',
    },
    smartSlug: 'AutoChoice01',
    passkey: 'Choice360',
    isPrivateLocked: false,
    customSmartUrl: 'bazar360.online/AutoChoice01',
    activityFeed: [],
    teamMembers: [
      {
        id: 'tm-1',
        name: 'Malak Mazhar',
        title: 'Showroom Partner / Services Lead',
        phone: '+923159085086',
        whatsapp: '923159085086',
        email: 'Mazharsouls@gmail.com',
        active: true,
      },
      {
        id: 'tm-3',
        name: 'M. Nasir Mirza',
        title: 'Chief Sales Executive',
        phone: '+923005908508',
        whatsapp: '923005908508',
      },
      {
        id: 'tm-4',
        name: 'Asfandyar Zafar',
        title: 'Fleet & Trade Manager',
        phone: '+923129085033',
        whatsapp: '923129085033',
      },
    ],
  },
];

// Pure Production Array: No mock / dummy vehicles. Only actual live inventory from Firestore & Cloudinary.
export const INITIAL_LISTINGS: CarListing[] = [];
