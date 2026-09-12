// ============================================================
// Seed data for Akebabi prototype
// Realistic Addis Ababa businesses across sub-cities.
// All photos are Unsplash URLs (royalty-free) as placeholders.
// ============================================================

export type Category =
  | "barber"
  | "cafe"
  | "restaurant"
  | "hotel"
  | "guesthouse"
  | "pharmacy"
  | "salon"
  | "gym"
  | "tailor"
  | "electronics"
  | "supermarket"
  | "laundry";

export type Business = {
  id: string;
  name: string;
  category: Category;
  description: string;
  subCity: string;
  area: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp?: string;
  hours: string;
  openNow: boolean;
  rating: number;
  reviewCount: number;
  photos: string[];
  featured: boolean;
  verified: boolean;
  priceLevel: 1 | 2 | 3; // $ / $$ / $$$
  reviews: {
    author: string;
    rating: number;
    text: string;
    date: string;
  }[];
};

export const CATEGORIES: {
  id: Category;
  label: string;
  amharic: string;
  icon: string; // emoji placeholder - replaced by Lucide icon in UI
}[] = [
  { id: "barber",       label: "Barber",         amharic: "ባለጥበብ", icon: "scissors" },
  { id: "salon",        label: "Salon",          amharic: "ሰራጭ",   icon: "sparkles" },
  { id: "cafe",         label: "Cafe",            amharic: "ቡና ቤት", icon: "coffee" },
  { id: "restaurant",   label: "Restaurant",     amharic: "ሬስቶራንት", icon: "utensils" },
  { id: "hotel",        label: "Hotel",           amharic: "ሆቴል",   icon: "bed" },
  { id: "guesthouse",   label: "Guest House",    amharic: "እንግዳ ቤት", icon: "home" },
  { id: "pharmacy",     label: "Pharmacy",        amharic: "ፋርማሲ", icon: "pill" },
  { id: "gym",          label: "Gym",             amharic: "ጂም",   icon: "dumbbell" },
  { id: "tailor",       label: "Tailor",          amharic: "ልብስ አደራጅ", icon: "shirt" },
  { id: "electronics",  label: "Electronics",     amharic: "ኤሌክትሮኒክስ", icon: "smartphone" },
  { id: "supermarket",  label: "Supermarket",     amharic: "ሱፐርማርኬት", icon: "shopping-cart" },
  { id: "laundry",      label: "Laundry",         amharic: "ልብስ መታጠብ", icon: "washing-machine" },
];

export const BUSINESSES: Business[] = [
  // ============ BOLE ============
  {
    id: "b1",
    name: "Bole Cuts Barbershop",
    category: "barber",
    description:
      "Premium barbershop near Africa Junction. Two chairs, walk-ins welcome. Specializing in fades, line-ups, and traditional Ethiopian cuts.",
    subCity: "Bole",
    area: "Africa Junction",
    lat: 9.0084,
    lng: 38.7575,
    phone: "+251911234567",
    whatsapp: "+251911234567",
    hours: "Mon-Sat 8:00-20:00, Sun 10:00-18:00",
    openNow: true,
    rating: 4.7,
    reviewCount: 124,
    photos: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    ],
    featured: true,
    verified: true,
    priceLevel: 2,
    reviews: [
      { author: "Selam T.", rating: 5, text: "Best fade in Bole. Abebe knows what he's doing.", date: "2 days ago" },
      { author: "Yonas G.", rating: 4, text: "Quick, clean, professional. Slight wait on Saturdays.", date: "1 week ago" },
      { author: "Mahlet K.", rating: 5, text: "My son's first haircut was here. Very patient with kids.", date: "3 weeks ago" },
    ],
  },
  {
    id: "b2",
    name: "Tomoca Coffee — Bole",
    category: "cafe",
    description:
      "Legendary Ethiopian coffee in the heart of Bole. Espresso, macchiato, and freshly-roasted beans to take home. Established 1953.",
    subCity: "Bole",
    area: "Bole Road",
    lat: 9.0092,
    lng: 38.7612,
    phone: "+251911555888",
    hours: "Mon-Sun 6:30-21:00",
    openNow: true,
    rating: 4.9,
    reviewCount: 412,
    photos: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?w=800&q=80",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
    ],
    featured: true,
    verified: true,
    priceLevel: 1,
    reviews: [
      { author: "Bethel A.", rating: 5, text: "The macchiato here is the best in Addis. Period.", date: "yesterday" },
      { author: "Robel M.", rating: 5, text: "Smell of roasting coffee hits you from the street. Authentic experience.", date: "5 days ago" },
    ],
  },
  {
    id: "b3",
    name: "Skylight Hotel",
    category: "hotel",
    description:
      "Modern 4-star hotel near Bole International Airport. Free airport shuttle, rooftop restaurant, fitness center, and conference rooms.",
    subCity: "Bole",
    area: "Near Airport",
    lat: 8.9912,
    lng: 38.7842,
    phone: "+251115187000",
    whatsapp: "+251911888999",
    hours: "Open 24/7",
    openNow: true,
    rating: 4.5,
    reviewCount: 287,
    photos: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    ],
    featured: true,
    verified: true,
    priceLevel: 3,
    reviews: [
      { author: "Samuel B.", rating: 5, text: "5-minute walk from arrivals. Clean, quiet, professional staff.", date: "4 days ago" },
      { author: "Helen W.", rating: 4, text: "Breakfast buffet is excellent. Rooms a bit small for the price.", date: "2 weeks ago" },
    ],
  },
  {
    id: "b4",
    name: "Yod Abyssinia Cultural Restaurant",
    category: "restaurant",
    description:
      "Traditional Ethiopian cuisine with live cultural music and dancing. Injera platters, kitfo, gored gored, and vegetarian options daily.",
    subCity: "Bole",
    area: "Bole Medhanealem",
    lat: 9.0125,
    lng: 38.7641,
    phone: "+251116631234",
    hours: "Mon-Sun 11:30-23:00",
    openNow: true,
    rating: 4.6,
    reviewCount: 198,
    photos: [
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      "https://images.unsplash.com/photo-1532768773974-064e5d02b8a4?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 2,
    reviews: [
      { author: "Marcus L.", rating: 5, text: "Best doro wat in Addis. The cultural show is a bonus.", date: "1 week ago" },
      { author: "Almaz T.", rating: 4, text: "Tourist-friendly but the food is genuinely good. Service can be slow on weekends.", date: "3 weeks ago" },
    ],
  },

  // ============ PIASSA ============
  {
    id: "b5",
    name: "Piassa Old-Town Barbers",
    category: "barber",
    description:
      "Historic barbershop in Piassa since 1972. Hot towel shaves, classic cuts, and the famous Italian-Ethiopian fusion style.",
    subCity: "Piassa",
    area: "Maidan",
    lat: 9.0379,
    lng: 38.7429,
    phone: "+251911002233",
    hours: "Mon-Sat 7:30-19:30, Sun closed",
    openNow: true,
    rating: 4.8,
    reviewCount: 89,
    photos: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 1,
    reviews: [
      { author: "Daniel H.", rating: 5, text: "Old-school feel, master barbers. A Piassa institution.", date: "2 weeks ago" },
      { author: "Eyob M.", rating: 5, text: "Got the best hot-towel shave of my life. ₪150 well spent.", date: "1 month ago" },
    ],
  },
  {
    id: "b6",
    name: "Lion International Bank Branch Pharmacy",
    category: "pharmacy",
    description:
      "24-hour pharmacy in central Piassa. Prescription filling, over-the-counter medicines, and basic first-aid supplies.",
    subCity: "Piassa",
    area: "Churchill Road",
    lat: 9.0358,
    lng: 38.7455,
    phone: "+251115511234",
    hours: "Open 24 hours",
    openNow: true,
    rating: 4.3,
    reviewCount: 67,
    photos: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f929?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 1,
    reviews: [
      { author: "Sara K.", rating: 4, text: "Open 24/7 saved me at 2am when my kid had fever. Grateful.", date: "5 days ago" },
      { author: "Tekle G.", rating: 4, text: "Well-stocked, but English labeling could be better.", date: "2 weeks ago" },
    ],
  },
  {
    id: "b7",
    name: "Athletic Center Piassa",
    category: "gym",
    description:
      "Full-service gym with cardio, weights, and group classes. Personal training available. Day passes for travelers.",
    subCity: "Piassa",
    area: "Piazza Square",
    lat: 9.0385,
    lng: 38.7438,
    phone: "+251912345678",
    hours: "Mon-Sat 5:30-22:00, Sun 8:00-14:00",
    openNow: true,
    rating: 4.4,
    reviewCount: 134,
    photos: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    ],
    featured: false,
    verified: false,
    priceLevel: 2,
    reviews: [
      { author: "Mike T.", rating: 5, text: "Best squat rack in Piassa. Mornings are quiet.", date: "3 days ago" },
      { author: "Lydia B.", rating: 3, text: "Equipment is OK but can get crowded after 6pm.", date: "1 week ago" },
    ],
  },

  // ============ MEKANISA ============
  {
    id: "b8",
    name: "Mekanisa Family Salon",
    category: "salon",
    description:
      "Hair, nails, and beauty treatments for women and children. Walk-ins welcome. Famous for traditional Ethiopian braiding.",
    subCity: "Mekanisa",
    area: "Mekanisa Square",
    lat: 8.9884,
    lng: 38.7318,
    phone: "+251913667788",
    whatsapp: "+251913667788",
    hours: "Mon-Sat 9:00-19:00, Sun 10:00-16:00",
    openNow: true,
    rating: 4.5,
    reviewCount: 78,
    photos: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 1,
    reviews: [
      { author: "Rahel A.", rating: 5, text: "Got my wedding braids done here. Beautiful work.", date: "1 week ago" },
      { author: "Selam T.", rating: 4, text: "Friendly staff, slightly long wait on weekends.", date: "2 weeks ago" },
    ],
  },
  {
    id: "b9",
    name: "Merkato Mini-Mart",
    category: "supermarket",
    description:
      "Neighborhood supermarket with fresh produce, packaged goods, and household items. ATM inside. Free delivery within 2km.",
    subCity: "Mekanisa",
    area: "Mekanisa Road",
    lat: 8.9895,
    lng: 38.7332,
    phone: "+251911445566",
    hours: "Mon-Sat 7:00-21:00, Sun 8:00-20:00",
    openNow: true,
    rating: 4.2,
    reviewCount: 56,
    photos: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      "https://images.unsplash.com/photo-1604719312566-8912e9227436?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 1,
    reviews: [
      { author: "Genet M.", rating: 4, text: "Convenient, well-stocked. Veggies could be fresher.", date: "4 days ago" },
    ],
  },

  // ============ MEGENAGNA ============
  {
    id: "b10",
    name: "Megenagna Home Guest House",
    category: "guesthouse",
    description:
      "Family-run guest house with 8 clean rooms. Walking distance to Megenagna metro. Breakfast included. Great for budget travelers.",
    subCity: "Megenagna",
    area: "Near Megenagna Circle",
    lat: 9.0215,
    lng: 38.7655,
    phone: "+251911776655",
    hours: "Open 24/7",
    openNow: true,
    rating: 4.4,
    reviewCount: 92,
    photos: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 1,
    reviews: [
      { author: "Anna P.", rating: 5, text: "Homely and quiet. The breakfast (firfir + bread) was lovely.", date: "3 days ago" },
      { author: "Joseph K.", rating: 4, text: "Great value. WiFi a bit spotty.", date: "1 week ago" },
    ],
  },
  {
    id: "b11",
    name: "TechFix Megenagna",
    category: "electronics",
    description:
      "Phone and laptop repair shop. Screen replacements, battery swaps, software issues. Same-day service for most repairs.",
    subCity: "Megenagna",
    area: "Megenagna Tower",
    lat: 9.0208,
    lng: 38.7662,
    phone: "+251914567890",
    whatsapp: "+251914567890",
    hours: "Mon-Sat 8:30-20:00, Sun closed",
    openNow: true,
    rating: 4.6,
    reviewCount: 143,
    photos: [
      "https://images.unsplash.com/photo-1581993192873-bf5b1d5a8a8b?w=800&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    ],
    featured: true,
    verified: true,
    priceLevel: 2,
    reviews: [
      { author: "Nahom T.", rating: 5, text: "Fixed my cracked iPhone screen in 45 minutes. Fair price.", date: "yesterday" },
      { author: "Hanna G.", rating: 5, text: "Honest diagnosis - told me my laptop wasn't worth fixing.", date: "1 week ago" },
    ],
  },

  // ============ KAZANCHIS ============
  {
    id: "b12",
    name: "Kazanchis Business Hotel",
    category: "hotel",
    description:
      "Business-focused hotel in the heart of Kazanchis. Conference rooms, fast WiFi, walking distance to government offices and banks.",
    subCity: "Kazanchis",
    area: "Mauritania Street",
    lat: 9.0154,
    lng: 38.7589,
    phone: "+251115551234",
    hours: "Open 24/7",
    openNow: true,
    rating: 4.3,
    reviewCount: 167,
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 3,
    reviews: [
      { author: "David O.", rating: 4, text: "Great for business trips. Fast WiFi, quiet rooms, good breakfast.", date: "5 days ago" },
    ],
  },
  {
    id: "b13",
    name: "Cafe Eugenia — Kazanchis",
    category: "cafe",
    description:
      "Modern third-wave coffee shop. Single-origin Ethiopian beans, pour-over bar, fresh pastries. Power outlets at every table.",
    subCity: "Kazanchis",
    area: "Behind City Hall",
    lat: 9.0171,
    lng: 38.7601,
    phone: "+251911234098",
    hours: "Mon-Sat 7:00-20:00, Sun 8:00-18:00",
    openNow: true,
    rating: 4.7,
    reviewCount: 234,
    photos: [
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 2,
    reviews: [
      { author: "Selam T.", rating: 5, text: "My favorite remote-work spot. Pour-over is excellent.", date: "yesterday" },
      { author: "Mike W.", rating: 5, text: "The yirgacheffe pour-over changed my life.", date: "2 weeks ago" },
    ],
  },

  // ============ SARBET ============
  {
    id: "b14",
    name: "Sarbet Suits & Tailoring",
    category: "tailor",
    description:
      "Custom suits, traditional Ethiopian clothing, and alterations. Three-day turnaround on most items. Walk-ins welcome for measurements.",
    subCity: "Sarbet",
    area: "Sarbet Center",
    lat: 9.0128,
    lng: 38.7382,
    phone: "+251911876543",
    hours: "Mon-Sat 8:30-19:00, Sun closed",
    openNow: false,
    rating: 4.8,
    reviewCount: 61,
    photos: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
      "https://images.unsplash.com/photo-1590357131151-5a3d7e5f3a0b?w=800&q=80",
    ],
    featured: false,
    verified: true,
    priceLevel: 3,
    reviews: [
      { author: "Tewodros A.", rating: 5, text: "Wedding suit fit perfectly. Master craftsmanship.", date: "1 month ago" },
      { author: "Meri T.", rating: 5, text: "Altered my mother's traditional dress perfectly.", date: "2 weeks ago" },
    ],
  },

  // ============ 22 MAZORIA / 4 KILO ============
  {
    id: "b15",
    name: "QuickWash 22 Mazoria",
    category: "laundry",
    description:
      "Wash-dry-fold service in 24 hours. Self-service machines available. Dry cleaning and traditional cloth care specialty.",
    subCity: "22 Mazoria",
    area: "Near Ambassador Cinema",
    lat: 9.0292,
    lng: 38.7491,
    phone: "+251911665544",
    hours: "Mon-Sat 7:00-20:00, Sun 9:00-15:00",
    openNow: true,
    rating: 4.1,
    reviewCount: 38,
    photos: [
      "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80",
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
    ],
    featured: false,
    verified: false,
    priceLevel: 1,
    reviews: [
      { author: "Hana B.", rating: 4, text: "Quick and cheap. Folded everything nicely.", date: "1 week ago" },
      { author: "Solomon T.", rating: 4, text: "Decent wash, friendly owner. Recommended.", date: "2 weeks ago" },
    ],
  },
];

// Addis Ababa center coordinates (Megenagna area)
export const ADDIS_CENTER = { lat: 9.0225, lng: 38.7625 };

// Simulated user location (Bole, near Africa Junction)
export const USER_LOCATION = { lat: 9.0084, lng: 38.7575 };

// Haversine distance calculation (km)
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function walkingTime(km: number): string {
  const mins = Math.max(1, Math.round(km * 12));
  return `${mins} min walk`;
}

// ============================================================
// Deals / Promotions
// ============================================================
export type Deal = {
  businessId: string;
  title: string;
  description: string;
  discount: string;          // e.g. "20% OFF"
  validUntil: string;        // human-readable
  validUntilDays: number;    // for countdown
};

export const DEALS: Deal[] = [
  {
    businessId: "b1",
    title: "Friday Fade Special",
    description: "20% off all fade haircuts every Friday this month. Walk-ins welcome.",
    discount: "20% OFF",
    validUntil: "3 days left",
    validUntilDays: 3,
  },
  {
    businessId: "b2",
    title: "Buy 2 Get 1 Free",
    description: "Buy 2 bags of freshly-roasted Yirgacheffe beans, get 1 free. Limited stock.",
    discount: "1 FREE",
    validUntil: "5 days left",
    validUntilDays: 5,
  },
  {
    businessId: "b3",
    title: "Weekend Stay Package",
    description: "Stay 2 nights Friday-Sunday, get free airport pickup + breakfast.",
    discount: "FREE pickup",
    validUntil: "9 days left",
    validUntilDays: 9,
  },
  {
    businessId: "b11",
    title: "Screen Repair 15% Off",
    description: "15% off all phone screen replacements this week. Same-day service.",
    discount: "15% OFF",
    validUntil: "1 day left",
    validUntilDays: 1,
  },
  {
    businessId: "b13",
    title: "Pour-Over Happy Hour",
    description: "Every weekday 3-5pm: pour-over coffee 25% off. Quiet work time.",
    discount: "25% OFF",
    validUntil: "12 days left",
    validUntilDays: 12,
  },
];

// ============================================================
// Trending — computed from rating × reviewCount
// ============================================================
export function getTrending(limit = 5): Business[] {
  return [...BUSINESSES]
    .map((b) => ({ b, score: b.rating * Math.log(b.reviewCount + 1) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.b);
}

// ============================================================
// New this week — simulated recent additions
// ============================================================
export const NEW_THIS_WEEK_IDS = ["b15", "b11", "b8"];

export function isNewThisWeek(id: string): boolean {
  return NEW_THIS_WEEK_IDS.includes(id);
}

// ============================================================
// Stats for the home banner
// ============================================================
export const APP_STATS = {
  businesses: BUSINESSES.length,
  subCities: new Set(BUSINESSES.map((b) => b.subCity)).size,
  categories: CATEGORIES.length,
  totalReviews: BUSINESSES.reduce((sum, b) => sum + b.reviewCount, 0),
};

// ============================================================
// Map projection — converts lat/lng to SVG coordinates
// Bounding box covers all 15 businesses with padding
// ============================================================
export const MAP_BOUNDS = {
  minLat: 8.985,
  maxLat: 9.040,
  minLng: 38.730,
  maxLng: 38.787,
};

export const MAP_DIMS = { w: 400, h: 460 };

export function projectToMap(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * MAP_DIMS.w;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * MAP_DIMS.h;
  return { x, y };
}

// User location projected to map
export function getUserMapPos(): { x: number; y: number } {
  return projectToMap(USER_LOCATION.lat, USER_LOCATION.lng);
}

// ============================================================
// Review type (for the working review writer)
// ============================================================
export type Review = {
  author: string;
  rating: number;
  text: string;
  date: string;
};

