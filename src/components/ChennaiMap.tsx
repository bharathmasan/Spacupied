import { useState } from 'react';
import { Compass, MapPin, Navigation } from 'lucide-react';
import { NearbyLandmark, PropertyListing } from '../types/property';

interface ChennaiMapProps {
  property: PropertyListing;
}

const REFERENCE_LOCALITIES = [
  { name: 'Anna Nagar', x: 42, y: 31 },
  { name: 'T. Nagar', x: 55, y: 47 },
  { name: 'Guindy', x: 51, y: 58 },
  { name: 'Adyar', x: 66, y: 63 },
  { name: 'Besant Nagar', x: 72, y: 67 },
  { name: 'ECR', x: 74, y: 78 },
  { name: 'OMR', x: 64, y: 84 },
  { name: 'Sriperumbudur', x: 18, y: 56 },
];

export default function ChennaiMap({ property }: ChennaiMapProps) {
  const [selectedLandmark, setSelectedLandmark] = useState<NearbyLandmark>(
    property.nearbyLandmarks[0] || {
      name: property.microLocation,
      type: 'Corridor',
      distance: '0.5 km',
    }
  );

  const { x, y, corridor } = property.mapCoords;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#222222]">
            Chennai Location &amp; Corridor Map
          </h3>
          <p className="text-xs text-[#71717A] mt-0.5">
            {property.microLocation} · {corridor}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C3AED] whitespace-nowrap">
          <Compass className="w-3.5 h-3.5" />
          <span>Chennai Metropolitan Area</span>
        </span>
      </div>

      {/* Architectural SVG Cartographic View */}
      <div className="relative bg-[#FAFAFC] w-full aspect-[16/9] sm:aspect-[21/10] overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          role="img"
          aria-label={`Locality map showing ${property.location} in Chennai, Tamil Nadu`}
        >
          {/* Base Land */}
          <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />

          {/* Subtle Architectural Grid */}
          <defs>
            <pattern id="chennai-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#F1F0F7"
                strokeWidth="0.35"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#chennai-grid)" />

          {/* Bay of Bengal Coastline (Eastern Edge) */}
          <path
            d="M 79 0 C 78 18, 76 34, 75 48 C 75 62, 79 76, 82 100 L 100 100 L 100 0 Z"
            fill="#EDE9FE"
            fillOpacity="0.65"
          />
          <path
            d="M 79 0 C 78 18, 76 34, 75 48 C 75 62, 79 76, 82 100"
            fill="none"
            stroke="#C4B5FD"
            strokeWidth="0.7"
          />

          {/* Adyar River Estuary */}
          <path
            d="M 15 61 C 32 59, 48 61, 61 63 C 68 64, 73 64, 77 64"
            fill="none"
            stroke="#DDD6FE"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Major Chennai Corridors: NH-48, Inner Ring Road, Anna Salai, OMR, ECR */}
          {/* NH-48 West Corridor */}
          <path
            d="M 2 55 C 18 56, 36 52, 51 58"
            fill="none"
            stroke="#E4E4E7"
            strokeWidth="0.9"
            strokeDasharray="1.8 1.2"
          />
          {/* Inner Ring / Metro Spine */}
          <path
            d="M 42 15 L 42 35 C 42 46, 47 54, 51 58 L 58 70"
            fill="none"
            stroke="#D4D4D8"
            strokeWidth="0.9"
          />
          {/* Anna Salai / Mount Road */}
          <path
            d="M 70 25 L 55 47 L 51 58 L 41 78"
            fill="none"
            stroke="#C4B5FD"
            strokeWidth="1"
          />
          {/* OMR IT Expressway */}
          <path
            d="M 66 63 L 64 84 L 62 98"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="0.95"
          />
          {/* East Coast Road */}
          <path
            d="M 72 67 L 74 78 L 77 98"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="0.85"
            strokeDasharray="2 1"
          />

          {/* Bay of Bengal Label */}
          <text
            x="88"
            y="46"
            textAnchor="middle"
            fill="#7C3AED"
            fillOpacity="0.65"
            fontSize="2.7"
            fontWeight="600"
            letterSpacing="0.3"
          >
            BAY OF
          </text>
          <text
            x="88"
            y="50"
            textAnchor="middle"
            fill="#7C3AED"
            fillOpacity="0.65"
            fontSize="2.7"
            fontWeight="600"
            letterSpacing="0.3"
          >
            BENGAL
          </text>

          {/* Reference Chennai Localities */}
          {REFERENCE_LOCALITIES.map((loc) => {
            const isCurrent =
              Math.abs(loc.x - x) < 3 && Math.abs(loc.y - y) < 3;
            if (isCurrent) return null;
            return (
              <g key={loc.name}>
                <circle cx={loc.x} cy={loc.y} r="1.05" fill="#A1A1AA" />
                <text
                  x={loc.x + 1.8}
                  y={loc.y + 0.8}
                  fill="#71717A"
                  fontSize="2.45"
                  fontWeight="500"
                >
                  {loc.name}
                </text>
              </g>
            );
          })}

          {/* Selected Property Locality Pin */}
          <g>
            <circle cx={x} cy={y} r="6.5" fill="#7C3AED" fillOpacity="0.14" />
            <circle cx={x} cy={y} r="3.4" fill="#7C3AED" fillOpacity="0.28" />
            <circle
              cx={x}
              cy={y}
              r="1.9"
              fill="#7C3AED"
              stroke="#FFFFFF"
              strokeWidth="0.7"
            />
            <rect
              x={Math.min(Math.max(x - 14, 3), 68)}
              y={Math.max(y - 11.5, 4)}
              width="28"
              height="6.4"
              rx="1.8"
              fill="#222222"
            />
            <text
              x={Math.min(Math.max(x, 17), 82)}
              y={Math.max(y - 7.3, 8.2)}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="2.55"
              fontWeight="600"
            >
              {property.location.length > 18
                ? `${property.location.slice(0, 17)}…`
                : property.location}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Nearby Connectivity Selector */}
      <div className="p-5 bg-white border-t border-neutral-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#222222]">
            Nearby Connectivity &amp; Landmarks
          </span>
          <span className="text-xs text-[#71717A] tabular-nums">
            Selected: {selectedLandmark.name} ({selectedLandmark.distance})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {property.nearbyLandmarks.map((landmark) => {
            const active = selectedLandmark.name === landmark.name;
            return (
              <button
                key={landmark.name}
                type="button"
                onClick={() => setSelectedLandmark(landmark)}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-colors ${
                  active
                    ? 'border-[#7C3AED] bg-[#EDE9FE]/45 text-[#222222]'
                    : 'border-neutral-200 hover:border-[#7C3AED]/40 bg-white text-[#52525B]'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {active ? (
                    <Navigation className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  )}
                  <span className="truncate text-xs font-medium">{landmark.name}</span>
                </span>
                <span className="text-xs font-semibold text-[#7C3AED] tabular-nums shrink-0">
                  {landmark.distance}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
