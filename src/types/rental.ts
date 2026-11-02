export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  slot?: 'hero' | 'kitchen' | 'workspace' | 'beach' | 'bathroom';
  createdAt?: string;
}

export interface Property {
  id: string;
  name: string;
  headline: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  taxRate: number; // 0.08
  beds: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareFeet: number;
  wifiSpeedMbps: number;
  rating: number;
  reviewCount: number;
  images: {
    hero: string;
    kitchen: string;
    workspace: string;
    beach: string;
    bathroom: string;
    additionalPhotos?: GalleryPhoto[];
  };
}

export interface Booking {
  id: string;
  confirmationCode: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  purpose: 'vacation' | 'remote_work' | 'family' | 'other';
  needsWorkstationSetup: boolean;
  needsBeachGear: boolean;
  baseTotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  doorPin: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface CategoryRatings {
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  checkIn: number;
  value: number;
}

export interface Review {
  id: string;
  author: string;
  authorLocation: string;
  avatarBg: string;
  date: string;
  stayDate: string;
  rating: number;
  category: 'Digital Nomad' | 'Beach Escape' | 'Couple' | 'Solo Explorer';
  categories: CategoryRatings;
  comment: string;
  hostResponse?: string;
  helpfulCount: number;
  isVerifiedStay: boolean;
  reviewImage?: string;
  source?: 'Airbnb' | 'Direct' | 'Google';
}

export interface LocalAttraction {
  id: string;
  name: string;
  category: 'Beach' | 'Dining' | 'Brewery' | 'Nature' | 'Coffee';
  distance: string;
  travelTime: string;
  mode: 'Walk' | 'Drive' | 'Bike';
  description: string;
  insiderTip: string;
}
