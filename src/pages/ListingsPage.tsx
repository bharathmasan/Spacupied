import { useMemo, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  AvailabilityStatus,
  ListingMode,
  PropertyCategory,
  PropertyFilters,
  PropertyListing,
} from '../types/property';
import {
  CATEGORY_LABELS,
  CHENNAI_LOCATIONS,
  DEFAULT_FILTERS,
  PROPERTY_CATEGORIES,
} from '../data/properties';
import PropertyCard from '../components/PropertyCard';

interface ListingsPageProps {
  properties: PropertyListing[];
  filters: PropertyFilters;
  onChangeFilters: (next: PropertyFilters) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onNavigateListProperty: () => void;
}

export default function ListingsPage({
  properties,
  filters,
  onChangeFilters,
  onSelectProperty,
  onNavigateListProperty,
}: ListingsPageProps) {
  const [showAdvanced, setShowAdvanced] = useState(true);

  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => {
    onChangeFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onChangeFilters({ ...DEFAULT_FILTERS });
  };

  const filteredProperties = useMemo(() => {
    const queryLower = filters.query.trim().toLowerCase();

    const list = properties.filter((item) => {
      if (queryLower) {
        const haystack = [
          item.title,
          item.location,
          item.microLocation,
          item.description,
          CATEGORY_LABELS[item.category],
          item.referenceCode,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(queryLower)) return false;
      }

      if (filters.location !== 'all' && item.location !== filters.location) {
        return false;
      }

      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      if (filters.listingMode !== 'all' && item.listingMode !== filters.listingMode) {
        return false;
      }

      // Universal budget preset filter
      if (filters.budgetRange !== 'all') {
        if (filters.budgetRange === 'under-1l') {
          if (item.rentalPriceMonthly === null || item.rentalPriceMonthly > 100000) {
            return false;
          }
        } else if (filters.budgetRange === '1l-2.5l') {
          if (
            item.rentalPriceMonthly === null ||
            item.rentalPriceMonthly < 100000 ||
            item.rentalPriceMonthly > 250000
          ) {
            return false;
          }
        } else if (filters.budgetRange === 'lease-under-30l') {
          if (item.leasePriceTotal === null || item.leasePriceTotal > 3000000) {
            return false;
          }
        } else if (filters.budgetRange === 'lease-30l-plus') {
          if (item.leasePriceTotal === null || item.leasePriceTotal < 3000000) {
            return false;
          }
        }
      }

      // Dedicated Rental Price (monthly) filter
      if (filters.rentalPriceMax !== 'all') {
        const rent = item.rentalPriceMonthly;
        if (rent === null) return false;
        if (filters.rentalPriceMax === '75000' && rent > 75000) return false;
        if (filters.rentalPriceMax === '125000' && rent > 125000) return false;
        if (filters.rentalPriceMax === '250000' && rent > 250000) return false;
        if (filters.rentalPriceMax === '250000-plus' && rent < 250000) return false;
      }

      // Dedicated Lease Price (total/annual lease) filter
      if (filters.leasePriceMax !== 'all') {
        const lease = item.leasePriceTotal;
        if (lease === null) return false;
        if (filters.leasePriceMax === '1000000' && lease > 1000000) return false;
        if (filters.leasePriceMax === '3000000' && lease > 3000000) return false;
        if (filters.leasePriceMax === '5000000' && lease > 5000000) return false;
        if (filters.leasePriceMax === '5000000-plus' && lease < 5000000) return false;
      }

      // Property size filter
      if (filters.sizeRange !== 'all') {
        if (filters.sizeRange === 'under-2000' && item.areaSqFt >= 2000) return false;
        if (
          filters.sizeRange === '2000-4000' &&
          (item.areaSqFt < 2000 || item.areaSqFt > 4000)
        ) {
          return false;
        }
        if (
          filters.sizeRange === '4000-10000' &&
          (item.areaSqFt < 4000 || item.areaSqFt > 10000)
        ) {
          return false;
        }
        if (filters.sizeRange === '10000-plus' && item.areaSqFt < 10000) return false;
      }

      // Bedrooms filter
      if (filters.bedrooms !== 'all') {
        if (filters.bedrooms === 'na') {
          if (item.bedrooms !== null) return false;
        } else if (filters.bedrooms === '4-plus') {
          if (item.bedrooms === null || item.bedrooms < 4) return false;
        } else {
          const bhk = Number(filters.bedrooms);
          if (item.bedrooms !== bhk) return false;
        }
      }

      // Availability filter
      if (filters.availability !== 'all' && item.availability !== filters.availability) {
        return false;
      }

      return true;
    });

    // Sorting
    const getSortPrice = (p: PropertyListing) =>
      p.rentalPriceMonthly ?? p.leasePriceTotal ?? 0;

    return [...list].sort((a, b) => {
      if (filters.sortBy === 'price-asc') return getSortPrice(a) - getSortPrice(b);
      if (filters.sortBy === 'price-desc') return getSortPrice(b) - getSortPrice(a);
      if (filters.sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      // Default: owner-submitted first, then featured
      if (a.isSample !== b.isSample) return a.isSample ? 1 : -1;
      return Number(b.featured) - Number(a.featured);
    });
  }, [properties, filters]);

  const activeFilterTags: { label: string; onClear: () => void }[] = [];
  if (filters.query.trim()) {
    activeFilterTags.push({
      label: `Search: "${filters.query.trim()}"`,
      onClear: () => updateFilter('query', ''),
    });
  }
  if (filters.location !== 'all') {
    activeFilterTags.push({
      label: `Location: ${filters.location}`,
      onClear: () => updateFilter('location', 'all'),
    });
  }
  if (filters.category !== 'all') {
    activeFilterTags.push({
      label: CATEGORY_LABELS[filters.category],
      onClear: () => updateFilter('category', 'all'),
    });
  }
  if (filters.listingMode !== 'all') {
    activeFilterTags.push({
      label: filters.listingMode === 'rent' ? 'Monthly Rent' : 'Long-Term Lease',
      onClear: () => updateFilter('listingMode', 'all'),
    });
  }
  if (filters.budgetRange !== 'all') {
    activeFilterTags.push({
      label: `Budget preset active`,
      onClear: () => updateFilter('budgetRange', 'all'),
    });
  }
  if (filters.rentalPriceMax !== 'all') {
    activeFilterTags.push({
      label: `Rental price filter`,
      onClear: () => updateFilter('rentalPriceMax', 'all'),
    });
  }
  if (filters.leasePriceMax !== 'all') {
    activeFilterTags.push({
      label: `Lease price filter`,
      onClear: () => updateFilter('leasePriceMax', 'all'),
    });
  }
  if (filters.sizeRange !== 'all') {
    activeFilterTags.push({
      label: `Area: ${filters.sizeRange}`,
      onClear: () => updateFilter('sizeRange', 'all'),
    });
  }
  if (filters.bedrooms !== 'all') {
    activeFilterTags.push({
      label:
        filters.bedrooms === 'na'
          ? 'Commercial / Land'
          : filters.bedrooms === '4-plus'
          ? '4+ BHK'
          : `${filters.bedrooms} BHK`,
      onClear: () => updateFilter('bedrooms', 'all'),
    });
  }
  if (filters.availability !== 'all') {
    activeFilterTags.push({
      label: `Availability: ${filters.availability}`,
      onClear: () => updateFilter('availability', 'all'),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200/80">
        <div>
          <p className="text-xs font-semibold text-[#7C3AED] mb-2">
            Chennai Rental &amp; Leasing Directory
          </p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-3xl sm:text-4xl font-semibold text-[#222222] tracking-tight"
          >
            Explore Chennai Properties
          </h1>
          <p className="text-sm text-[#52525B] mt-2 max-w-2xl">
            Filter across residential homes, plots, commercial buildings, retail shops, offices,
            and agricultural parcels. Sample listings are clearly labeled for transparency.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#222222] bg-white border border-neutral-200 hover:border-[#7C3AED]/50 rounded-xl transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
            <span>{showAdvanced ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          <button
            type="button"
            onClick={onNavigateListProperty}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors whitespace-nowrap"
          >
            List Property
          </button>
        </div>
      </div>

      {/* Category Quick Tabs (Interactive Segmented Filter Controls) */}
      <div
        role="group"
        aria-label="Filter by Property Category"
        className="flex items-center gap-2 overflow-x-auto py-5 border-b border-neutral-100"
      >
        <button
          type="button"
          onClick={() => updateFilter('category', 'all')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
            filters.category === 'all'
              ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
              : 'bg-white text-[#52525B] border-neutral-200 hover:border-[#7C3AED]/40 hover:text-[#222222]'
          }`}
        >
          All Categories
        </button>
        {PROPERTY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => updateFilter('category', cat.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
              filters.category === cat.id
                ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                : 'bg-white text-[#52525B] border-neutral-200 hover:border-[#7C3AED]/40 hover:text-[#222222]'
            }`}
          >
            {cat.shortLabel}
          </button>
        ))}
      </div>

      {/* Comprehensive Search & Filter Panel */}
      {showAdvanced && (
        <section
          aria-label="Property Search Filters"
          className="mt-6 bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 space-y-5"
        >
          {/* Row 1: Keyword, Location, Mode, Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="filter-query"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Keyword or Locality
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="filter-query"
                  type="text"
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  placeholder="Adyar, OMR, villa, showroom..."
                  className="w-full h-11 pl-10 pr-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="filter-location"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Location (Chennai)
              </label>
              <select
                id="filter-location"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
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

            <div>
              <label
                htmlFor="filter-mode"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Rental / Lease Type
              </label>
              <select
                id="filter-mode"
                value={filters.listingMode}
                onChange={(e) =>
                  updateFilter('listingMode', e.target.value as ListingMode | 'all')
                }
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Both Rent &amp; Lease</option>
                <option value="rent">For Rent (Monthly)</option>
                <option value="lease">For Lease (Term)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-availability"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Availability
              </label>
              <select
                id="filter-availability"
                value={filters.availability}
                onChange={(e) =>
                  updateFilter(
                    'availability',
                    e.target.value as AvailabilityStatus | 'all'
                  )
                }
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Any Availability</option>
                <option value="Immediate">Immediate</option>
                <option value="Within 30 Days">Within 30 Days</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {/* Row 2: Rental Price, Lease Price, Property Size, Bedrooms, Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 border-t border-neutral-100">
            <div>
              <label
                htmlFor="filter-rent-price"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Rental Price (Monthly)
              </label>
              <select
                id="filter-rent-price"
                value={filters.rentalPriceMax}
                onChange={(e) => updateFilter('rentalPriceMax', e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Any Monthly Rent</option>
                <option value="75000">Up to ₹75,000 / mo</option>
                <option value="125000">Up to ₹1,25,000 / mo</option>
                <option value="250000">Up to ₹2,50,000 / mo</option>
                <option value="250000-plus">₹2,50,000+ / mo</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-lease-price"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Lease Price (Total / Yr)
              </label>
              <select
                id="filter-lease-price"
                value={filters.leasePriceMax}
                onChange={(e) => updateFilter('leasePriceMax', e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Any Lease Amount</option>
                <option value="1000000">Up to ₹10 Lakhs</option>
                <option value="3000000">Up to ₹30 Lakhs</option>
                <option value="5000000">Up to ₹50 Lakhs</option>
                <option value="5000000-plus">₹50 Lakhs+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-budget"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Budget Preset
              </label>
              <select
                id="filter-budget"
                value={filters.budgetRange}
                onChange={(e) => updateFilter('budgetRange', e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">All Budgets</option>
                <option value="under-1l">Rent under ₹1L / mo</option>
                <option value="1l-2.5l">Rent ₹1L – ₹2.5L / mo</option>
                <option value="lease-under-30l">Lease under ₹30 Lakhs</option>
                <option value="lease-30l-plus">Lease ₹30 Lakhs+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-size"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Property Size
              </label>
              <select
                id="filter-size"
                value={filters.sizeRange}
                onChange={(e) => updateFilter('sizeRange', e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Any Area Size</option>
                <option value="under-2000">Under 2,000 sq.ft.</option>
                <option value="2000-4000">2,000 – 4,000 sq.ft.</option>
                <option value="4000-10000">4,000 – 10,000 sq.ft.</option>
                <option value="10000-plus">10,000+ sq.ft. / Acres</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-bedrooms"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Bedrooms
              </label>
              <select
                id="filter-bedrooms"
                value={filters.bedrooms}
                onChange={(e) => updateFilter('bedrooms', e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4-plus">4+ BHK</option>
                <option value="na">Commercial / Plots / Land</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Results Toolbar & Active Filters */}
      <div className="mt-7 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-sm font-semibold text-[#222222] tabular-nums">
            Showing {filteredProperties.length}{' '}
            {filteredProperties.length === 1 ? 'property' : 'properties'}
          </p>
          {activeFilterTags.length > 0 && (
            <>
              <span aria-hidden="true" className="text-neutral-300">
                |
              </span>
              {activeFilterTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={tag.onClear}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#7C3AED] bg-[#EDE9FE]/65 hover:bg-[#EDE9FE] rounded-lg transition-colors"
                >
                  <span>{tag.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#52525B] hover:text-[#7C3AED] transition-colors ml-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <label htmlFor="sort-properties" className="text-xs font-medium text-[#71717A]">
            Sort by
          </label>
          <select
            id="sort-properties"
            value={filters.sortBy}
            onChange={(e) =>
              updateFilter(
                'sortBy',
                e.target.value as PropertyFilters['sortBy']
              )
            }
            className="h-9 px-3 text-xs font-medium text-[#222222] bg-white border border-neutral-200 rounded-lg focus:border-[#7C3AED] focus:outline-none"
          >
            <option value="featured">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-desc">Largest Area</option>
          </select>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-16 text-center max-w-xl mx-auto my-8">
          <h2 className="text-lg font-semibold text-[#222222] mb-2">
            No properties match these filters
          </h2>
          <p className="text-sm text-[#52525B] mb-6 leading-relaxed">
            Try widening your rental or lease budget, clearing the bedroom filter, or
            exploring all Chennai locations.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      )}
    </div>
  );
}
