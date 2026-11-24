import { useState, FormEvent } from 'react';
import {
  ArrowRight,
  Building2,
  Home,
  KeyRound,
  Landmark,
  MapPin,
  MessageCircle,
  Search,
  Store,
  Trees,
} from 'lucide-react';
import {
  ListingMode,
  PageRoute,
  PropertyCategory,
  PropertyFilters,
  PropertyListing,
  WhatsAppContext,
} from '../types/property';
import {
  CHENNAI_LOCATIONS,
  DEFAULT_FILTERS,
  GENERATED_IMAGES,
  POPULAR_LOCATIONS,
  PROPERTY_CATEGORIES,
} from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import SafeImage from '../components/SafeImage';

interface HomePageProps {
  properties: PropertyListing[];
  onNavigate: (page: PageRoute) => void;
  onSearchSubmit: (filters: Partial<PropertyFilters>) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onOpenWhatsApp: (context: WhatsAppContext) => void;
}

const CATEGORY_ICONS: Record<PropertyCategory, typeof Home> = {
  'houses-apartments-rent': Home,
  'residential-land-plots-lease': Landmark,
  'commercial-properties': Building2,
  'shops-office-spaces': Store,
  'agricultural-land': Trees,
  'residential-commercial-leasing': KeyRound,
};

export default function HomePage({
  properties,
  onNavigate,
  onSearchSubmit,
  onSelectProperty,
  onOpenWhatsApp,
}: HomePageProps) {
  const [searchLocation, setSearchLocation] = useState('all');
  const [searchCategory, setSearchCategory] = useState<PropertyCategory | 'all'>('all');
  const [searchMode, setSearchMode] = useState<ListingMode | 'all'>('all');
  const [searchBudget, setSearchBudget] = useState('all');

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);

  const handleHeroSearch = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      ...DEFAULT_FILTERS,
      location: searchLocation,
      category: searchCategory,
      listingMode: searchMode,
      budgetRange: searchBudget,
    });
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center py-2">
            <p className="text-sm font-medium text-[#7C3AED] mb-4">
              Chennai, Tamil Nadu · Rental &amp; Leasing Platform
            </p>
            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-[clamp(2.35rem,4.3vw,3.75rem)] font-semibold text-[#222222] leading-[1.1] tracking-[-0.02em] mb-5"
            >
              Find Your Space. Make It Yours.
            </h1>
            <p className="text-base sm:text-[1.0625rem] leading-[1.7] text-[#52525B] max-w-xl mb-8">
              Spacupied connects property owners, landlords, landowners, tenants, and
              businesses across Chennai. Discover residential homes, coastal plots, commercial
              floors, retail storefronts, offices, and agricultural land structured for clear
              rental and long-term leasing.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('listings')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 shadow-xs"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('list-property')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#7C3AED] bg-white border border-[#7C3AED]/40 hover:bg-[#EDE9FE]/55 rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                <span>List Your Property</span>
              </button>
            </div>

            <div className="mt-9 pt-6 border-t border-neutral-200/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-xl font-bold text-[#222222] tabular-nums">6</p>
                <p className="text-xs text-[#71717A] mt-0.5">Space Categories</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#222222] tabular-nums">10+</p>
                <p className="text-xs text-[#71717A] mt-0.5">Chennai Corridors</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#222222]">Direct</p>
                <p className="text-xs text-[#71717A] mt-0.5">Privacy-First Desk</p>
              </div>
            </div>
          </div>

          {/* Right Hero Photography */}
          <div className="lg:col-span-6">
            <div className="w-full h-full min-h-[290px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-neutral-200/80 bg-neutral-50">
              <SafeImage
                src={GENERATED_IMAGES.heroVilla}
                alt="Contemporary sunlit white coastal residence in Chennai, Tamil Nadu"
                fallbackLabel="Spacupied Chennai Architecture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width Prominent Property Search Bar Below Hero Split */}
        <form
          onSubmit={handleHeroSearch}
          aria-label="Property Search"
          className="mt-10 bg-white rounded-2xl border border-neutral-200 shadow-[0_12px_36px_rgba(124,58,237,0.06)] p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
            <div className="lg:col-span-3">
              <label
                htmlFor="hero-location"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Chennai Location
              </label>
              <select
                id="hero-location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">All Chennai Locations</option>
                {CHENNAI_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label
                htmlFor="hero-category"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Property Category
              </label>
              <select
                id="hero-category"
                value={searchCategory}
                onChange={(e) =>
                  setSearchCategory(e.target.value as PropertyCategory | 'all')
                }
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">All Categories</option>
                {PROPERTY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-mode"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Rental / Lease
              </label>
              <select
                id="hero-mode"
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value as ListingMode | 'all')}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Rent &amp; Lease</option>
                <option value="rent">Monthly Rent</option>
                <option value="lease">Long-Term Lease</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-budget"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Budget Range
              </label>
              <select
                id="hero-budget"
                value={searchBudget}
                onChange={(e) => setSearchBudget(e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Any Budget</option>
                <option value="under-1l">Rent under ₹1L / mo</option>
                <option value="1l-2.5l">Rent ₹1L – ₹2.5L / mo</option>
                <option value="lease-under-30l">Lease under ₹30 Lakhs</option>
                <option value="lease-30l-plus">Lease ₹30 Lakhs+</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors whitespace-nowrap"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* 2. Property Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#7C3AED] mb-2">
              Dedicated Property Categories
            </p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight"
            >
              Every Space Category Across Chennai
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('listings')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPERTY_CATEGORIES.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.id];
            const count = properties.filter((p) => p.category === category.id).length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  onSearchSubmit({
                    ...DEFAULT_FILTERS,
                    category: category.id,
                  })
                }
                className="group text-left bg-white rounded-2xl border border-neutral-200/90 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7C3AED]/45 hover:shadow-[0_10px_28px_rgba(124,58,237,0.07)] flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-[#71717A] tabular-nums">
                    {count} {count === 1 ? 'listing' : 'listings'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#222222] group-hover:text-[#7C3AED] transition-colors mb-2">
                  {category.label}
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed mb-5 flex-1">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C3AED]">
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Properties (Sample Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#7C3AED] mb-2">
              Featured Spaces · Illustrative Sample Portfolio
            </p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight"
            >
              Curated Rentals &amp; Leases in Chennai
            </h2>
            <p className="text-sm text-[#52525B] mt-2">
              Representative sample listings demonstrating how residential, plot, commercial,
              retail, and office properties are presented on Spacupied.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('listings')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </section>

      {/* 4. Popular Locations in Chennai */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 border-t border-neutral-100">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold text-[#7C3AED] mb-2">
            Chennai Neighbourhood Guide
          </p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight"
          >
            Popular Locations Across Chennai
          </h2>
          <p className="text-sm text-[#52525B] mt-2">
            Select a neighbourhood to filter available sample and owner-submitted rental or
            lease properties along that corridor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_LOCATIONS.map((loc) => {
            const locCount = properties.filter((p) => p.location === loc.name).length;
            return (
              <button
                key={loc.name}
                type="button"
                onClick={() =>
                  onSearchSubmit({
                    ...DEFAULT_FILTERS,
                    location: loc.name,
                  })
                }
                className="group text-left bg-white rounded-2xl border border-neutral-200/90 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7C3AED]/45 hover:shadow-[0_10px_28px_rgba(124,58,237,0.07)] flex flex-col"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  <SafeImage
                    src={loc.image}
                    alt={`${loc.name}, Chennai real estate corridor`}
                    fallbackLabel={loc.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#71717A] mb-1.5">
                    <span>{loc.corridor}</span>
                    <span className="tabular-nums text-[#7C3AED] font-semibold">
                      {locCount} {locCount === 1 ? 'space' : 'spaces'}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#222222] group-hover:text-[#7C3AED] transition-colors flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
                    <span>{loc.name}</span>
                  </h3>
                  <p className="text-sm text-[#52525B] leading-relaxed">
                    {loc.highlight}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Owner & Landlord Light-Violet CTA Band (Pure Light Aesthetic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="rounded-3xl bg-[#EDE9FE]/55 border border-[#7C3AED]/15 px-6 sm:px-10 lg:px-14 py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#7C3AED] mb-2">
              For Property Owners, Landlords &amp; Landowners
            </p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight mb-3"
            >
              Have a Home, Plot, Commercial Space, or Farmland in Chennai?
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
              Publish your rental or leasing requirement directly on Spacupied. Connect with
              verified tenants and businesses through our structured digital enquiry desk — with
              your personal contact details kept private.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('list-property')}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors whitespace-nowrap"
            >
              List Your Property
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp({
                  subject: 'Listing a Property for Rent or Lease in Chennai',
                })
              }
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#7C3AED] bg-white border border-[#7C3AED]/30 hover:bg-white/80 rounded-xl transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
