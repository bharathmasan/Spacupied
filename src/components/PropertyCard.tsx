import { ArrowUpRight, MapPin } from 'lucide-react';
import { PropertyListing } from '../types/property';
import { CATEGORY_LABELS } from '../data/properties';
import SafeImage from './SafeImage';

interface PropertyCardProps {
  property: PropertyListing;
  onSelect: (property: PropertyListing) => void;
}

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:shadow-[0_12px_32px_rgba(124,58,237,0.08)] flex flex-col">
      <button
        type="button"
        onClick={() => onSelect(property)}
        className="text-left flex flex-col flex-1 w-full focus-visible:outline-2 focus-visible:outline-[#7C3AED]"
      >
        {/* 4:3 Architectural Photo */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <SafeImage
            src={property.images[0]}
            alt={`${property.title} in ${property.location}, Chennai`}
            fallbackLabel={property.location}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        {/* Structured Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Unboxed Metadata (Zero Pills) */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-[#71717A] mb-2">
            <span className="font-semibold text-[#7C3AED]">
              {property.listingMode === 'rent' ? 'For Rent' : 'For Lease'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{property.isSample ? 'Sample Listing' : 'Owner Submitted'}</span>
            <span aria-hidden="true">·</span>
            <span>{property.availability}</span>
          </div>

          <h3 className="text-[1.05rem] font-semibold text-[#222222] leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-2 mb-1.5">
            {property.title}
          </h3>

          <p className="flex items-center gap-1.5 text-sm text-[#52525B] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
            <span className="truncate">
              {property.microLocation}, Chennai
            </span>
          </p>

          {/* Clean Specification Line */}
          <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-[#52525B] pb-4 mb-4 border-b border-neutral-100 tabular-nums">
            <span>{property.areaDisplay}</span>
            {property.bedrooms !== null && (
              <>
                <span aria-hidden="true">·</span>
                <span>{property.bedrooms} BHK</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[180px]">{CATEGORY_LABELS[property.category]}</span>
          </div>

          {/* Aligned Bottom Price Row */}
          <div className="mt-auto flex items-baseline justify-between gap-3">
            <div>
              <p className="text-base font-bold text-[#222222] tabular-nums">
                {property.priceLabel}
              </p>
              <p className="text-[11px] text-[#71717A] truncate max-w-[190px]">
                {property.referenceCode}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C3AED] whitespace-nowrap shrink-0">
              View Details
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
