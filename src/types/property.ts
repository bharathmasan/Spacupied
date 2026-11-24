export type PropertyCategory =
  | 'houses-apartments-rent'
  | 'residential-land-plots-lease'
  | 'commercial-properties'
  | 'shops-office-spaces'
  | 'agricultural-land'
  | 'residential-commercial-leasing';

export type ListingMode = 'rent' | 'lease';

export type AvailabilityStatus = 'Immediate' | 'Within 30 Days' | 'Upcoming';

export type PageRoute =
  | 'home'
  | 'listings'
  | 'detail'
  | 'list-property'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'privacy';

export interface NearbyLandmark {
  name: string;
  type: 'Transit' | 'Corridor' | 'Hub' | 'Landmark';
  distance: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  category: PropertyCategory;
  listingMode: ListingMode;
  location: string;
  microLocation: string;
  city: 'Chennai';
  state: 'Tamil Nadu';
  /** Monthly rent in INR (for rent listings or monthly-billed commercial leases) */
  rentalPriceMonthly: number | null;
  /** Total lease amount in INR (for lease listings) */
  leasePriceTotal: number | null;
  /** Display unit for primary price */
  priceLabel: string;
  depositOrTenure: string;
  /** Area normalized in sq.ft. for consistent filtering and sorting */
  areaSqFt: number;
  areaDisplay: string;
  bedrooms: number | null;
  bathrooms: number | null;
  availability: AvailabilityStatus;
  furnishingOrZoning: string;
  facing: string;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  /** Clearly distinguishes illustrative sample content from user-submitted listings */
  isSample: boolean;
  /** Normalized coordinates (0-100) for Chennai architectural locality map */
  mapCoords: {
    x: number;
    y: number;
    corridor: string;
  };
  nearbyLandmarks: NearbyLandmark[];
  listedByRole: 'Property Owner' | 'Landowner' | 'Commercial Landlord';
  referenceCode: string;
}

export interface PropertyFilters {
  query: string;
  location: string;
  category: PropertyCategory | 'all';
  listingMode: ListingMode | 'all';
  budgetRange: string;
  rentalPriceMax: string;
  leasePriceMax: string;
  sizeRange: string;
  bedrooms: string;
  availability: AvailabilityStatus | 'all';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'area-desc';
}

export interface WhatsAppContext {
  subject: string;
  propertyTitle?: string;
  referenceCode?: string;
  location?: string;
}

export interface PropertyEnquiryRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  enquiryType: string;
  preferredDate: string;
  message: string;
  submittedAt: string;
}
