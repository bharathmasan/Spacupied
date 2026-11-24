import { useState, FormEvent, ChangeEvent } from 'react';
import { CheckCircle2, ImagePlus, ShieldCheck } from 'lucide-react';
import {
  AvailabilityStatus,
  ListingMode,
  PropertyCategory,
  PropertyListing,
} from '../types/property';
import {
  CHENNAI_LOCATIONS,
  GENERATED_IMAGES,
  PROPERTY_CATEGORIES,
  formatINR,
} from '../data/properties';
import SafeImage from '../components/SafeImage';

interface ListPropertyPageProps {
  onPublishProperty: (property: PropertyListing) => void;
  onViewProperty: (property: PropertyListing) => void;
}

const AMENITY_PRESETS = [
  'Covered Parking',
  '100% Power Backup',
  '24/7 Perimeter Security',
  'Lift Access',
  'High-Speed Fiber Ready',
  'Rainwater Harvesting',
  'Three-Phase Power',
  'Borewell & Water Supply',
  'Compound Wall & Gate',
  'Clear Title Documentation',
];

const PRESET_PHOTOS = [
  { label: 'Residential Apartment', src: GENERATED_IMAGES.adyarApartment },
  { label: 'Independent House / Villa', src: GENERATED_IMAGES.annaNagarHouse },
  { label: 'Residential Land / Plot', src: GENERATED_IMAGES.ecrPlot },
  { label: 'Commercial Building', src: GENERATED_IMAGES.guindyCommercial },
  { label: 'Retail Showroom / Shop', src: GENERATED_IMAGES.tNagarShop },
  { label: 'Office Suite', src: GENERATED_IMAGES.omrOffice },
  { label: 'Agricultural Land', src: GENERATED_IMAGES.kanchipuramAgri },
];

const LOCATION_COORDS: Record<string, { x: number; y: number; corridor: string }> = {
  Adyar: { x: 66, y: 63, corridor: 'Adyar Residential Core' },
  'Anna Nagar': { x: 42, y: 31, corridor: 'Anna Nagar 2nd Avenue' },
  'Besant Nagar': { x: 72, y: 67, corridor: 'Besant Nagar Coastal Belt' },
  'East Coast Road (ECR)': { x: 74, y: 78, corridor: 'East Coast Road (SH-49)' },
  Guindy: { x: 51, y: 58, corridor: 'Guindy Commercial Hub' },
  'OMR / Sholinganallur': { x: 64, y: 84, corridor: 'OMR IT Expressway' },
  'Sriperumbudur Outskirts': { x: 18, y: 56, corridor: 'NH-48 Western Outskirts' },
  'T. Nagar': { x: 55, y: 47, corridor: 'T. Nagar Commercial Core' },
  Velachery: { x: 56, y: 71, corridor: 'Velachery South Hub' },
  Mylapore: { x: 67, y: 49, corridor: 'Mylapore Heritage Core' },
};

export default function ListPropertyPage({
  onPublishProperty,
  onViewProperty,
}: ListPropertyPageProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('houses-apartments-rent');
  const [listingMode, setListingMode] = useState<ListingMode>('rent');
  const [location, setLocation] = useState('Adyar');
  const [microLocation, setMicroLocation] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [depositOrTenure, setDepositOrTenure] = useState('');
  const [areaValue, setAreaValue] = useState('');
  const [areaUnit, setAreaUnit] = useState<'sq.ft.' | 'Grounds' | 'Acres'>('sq.ft.');
  const [bedrooms, setBedrooms] = useState<string>('3');
  const [availability, setAvailability] = useState<AvailabilityStatus>('Immediate');
  const [facing, setFacing] = useState('East Facing');
  const [listedByRole, setListedByRole] = useState<
    'Property Owner' | 'Landowner' | 'Commercial Landlord'
  >('Property Owner');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Covered Parking',
    '24/7 Perimeter Security',
  ]);
  const [selectedImage, setSelectedImage] = useState<string>(
    GENERATED_IMAGES.adyarApartment
  );
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [publishedProperty, setPublishedProperty] = useState<PropertyListing | null>(null);

  const isResidentialCategory =
    category === 'houses-apartments-rent' ||
    category === 'residential-commercial-leasing';

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid JPG, PNG, or WebP property image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPreview(reader.result);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || title.trim().length < 6) {
      setError('Please enter a descriptive property title (at least 6 characters).');
      return;
    }
    const parsedPrice = Number(priceAmount);
    if (!parsedPrice || parsedPrice <= 0) {
      setError('Please enter a valid rental or lease amount in INR.');
      return;
    }
    const parsedArea = Number(areaValue);
    if (!parsedArea || parsedArea <= 0) {
      setError('Please enter a valid property area size.');
      return;
    }
    if (!ownerName.trim()) {
      setError('Please enter the property owner or landlord name.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(ownerEmail.trim())) {
      setError('Please provide a valid email address for enquiry notifications.');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a brief property description (at least 20 characters).');
      return;
    }

    const areaSqFt =
      areaUnit === 'Acres'
        ? Math.round(parsedArea * 43560)
        : areaUnit === 'Grounds'
        ? Math.round(parsedArea * 2400)
        : Math.round(parsedArea);

    const areaDisplay =
      areaUnit === 'sq.ft.'
        ? `${areaSqFt.toLocaleString('en-IN')} sq.ft.`
        : `${parsedArea} ${areaUnit} (${areaSqFt.toLocaleString('en-IN')} sq.ft.)`;

    const isRent = listingMode === 'rent';
    const priceLabel = isRent
      ? `${formatINR(parsedPrice)} / month`
      : parsedPrice >= 100000
      ? `₹${(parsedPrice / 100000).toFixed(1)} Lakhs / lease`
      : `${formatINR(parsedPrice)} / lease`;

    const coords = LOCATION_COORDS[location] || {
      x: 56,
      y: 54,
      corridor: `${location}, Chennai`,
    };

    const refNum = Math.floor(700 + Math.random() * 299);
    const newListing: PropertyListing = {
      id: `spc-owner-${Date.now()}`,
      title: title.trim(),
      category,
      listingMode,
      location,
      microLocation: microLocation.trim() || `${location}, Chennai`,
      city: 'Chennai',
      state: 'Tamil Nadu',
      rentalPriceMonthly: isRent ? parsedPrice : null,
      leasePriceTotal: !isRent ? parsedPrice : null,
      priceLabel,
      depositOrTenure:
        depositOrTenure.trim() ||
        (isRent
          ? 'Standard Chennai rental deposit · 11-month agreement'
          : 'Structured multi-year registered lease'),
      areaSqFt,
      areaDisplay,
      bedrooms:
        isResidentialCategory && bedrooms !== 'na' ? Number(bedrooms) : null,
      bathrooms:
        isResidentialCategory && bedrooms !== 'na' ? Number(bedrooms) : null,
      availability,
      furnishingOrZoning:
        category === 'agricultural-land'
          ? 'Agricultural Classification'
          : category === 'residential-land-plots-lease'
          ? 'Residential Plot Zone'
          : category === 'commercial-properties' || category === 'shops-office-spaces'
          ? 'Commercial Premise'
          : 'Residential Space',
      facing,
      description: description.trim(),
      amenities:
        selectedAmenities.length > 0 ? selectedAmenities : ['Clear Documentation'],
      images: [uploadedPreview || selectedImage],
      featured: true,
      isSample: false,
      mapCoords: coords,
      nearbyLandmarks: [
        { name: `${location} Main Arterial Road`, type: 'Corridor', distance: '0.6 km' },
        { name: 'Nearest Chennai Metro / MRTS Access', type: 'Transit', distance: '2.0 km' },
        { name: `${location} Commercial Center`, type: 'Hub', distance: '1.4 km' },
      ],
      listedByRole,
      referenceCode: `SPC-OWN-${refNum}`,
    };

    onPublishProperty(newListing);
    setPublishedProperty(newListing);
  };

  const resetForm = () => {
    setTitle('');
    setMicroLocation('');
    setPriceAmount('');
    setDepositOrTenure('');
    setAreaValue('');
    setDescription('');
    setUploadedPreview(null);
    setPublishedProperty(null);
  };

  if (publishedProperty) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <p className="text-xs font-semibold text-[#7C3AED] tabular-nums">
            Reference Code: {publishedProperty.referenceCode}
          </p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-semibold text-[#222222]"
          >
            Your Property Is Now Listed on Spacupied
          </h1>
          <p className="text-sm text-[#52525B] leading-relaxed max-w-lg mx-auto">
            <span className="font-semibold text-[#222222]">{publishedProperty.title}</span>{' '}
            in {publishedProperty.location}, Chennai has been added to the active directory.
            Your personal contact details remain private and are never displayed publicly.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onViewProperty(publishedProperty)}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
            >
              View Your Listing
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-[#7C3AED] bg-[#EDE9FE]/60 hover:bg-[#EDE9FE] rounded-xl transition-colors"
            >
              List Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-10">
        <p className="text-xs font-semibold text-[#7C3AED] mb-2">
          For Property Owners, Landlords &amp; Landowners in Chennai
        </p>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl sm:text-4xl font-semibold text-[#222222] tracking-tight mb-3"
        >
          List Your Property
        </h1>
        <p className="text-sm sm:text-base text-[#52525B] max-w-2xl leading-relaxed">
          Share your residential house, apartment, plot, commercial space, retail shop,
          office, or agricultural parcel for rent or lease across Chennai. All enquiries are
          routed cleanly without displaying your phone number publicly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-8"
      >
        {/* Step 1: Core Property Classification */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#222222] pb-2 border-b border-neutral-100">
            01. Property Details &amp; Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="lp-title"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Property Title
              </label>
              <input
                id="lp-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Spacious 3 BHK Independent Floor in Adyar"
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="lp-category"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Property Category
              </label>
              <select
                id="lp-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                {PROPERTY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#222222] mb-1.5">
                Transaction Type
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['rent', 'lease'] as ListingMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setListingMode(mode)}
                    className={`h-11 text-sm font-semibold rounded-xl border transition-colors ${
                      listingMode === mode
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                        : 'bg-white text-[#52525B] border-neutral-200 hover:border-[#7C3AED]/40'
                    }`}
                  >
                    {mode === 'rent' ? 'Monthly Rent' : 'Long-Term Lease'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="lp-location"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Chennai Locality
              </label>
              <select
                id="lp-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                {CHENNAI_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lp-micro"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Sub-Locality / Road (optional)
              </label>
              <input
                id="lp-micro"
                type="text"
                value={microLocation}
                onChange={(e) => setMicroLocation(e.target.value)}
                placeholder="e.g., Gandhi Nagar, 2nd Avenue"
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Step 2: Pricing & Dimensions */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#222222] pb-2 border-b border-neutral-100">
            02. Pricing, Area &amp; Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="lp-price"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                {listingMode === 'rent'
                  ? 'Monthly Rent (INR ₹)'
                  : 'Total / Annual Lease Price (INR ₹)'}
              </label>
              <input
                id="lp-price"
                type="number"
                min="1000"
                required
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                placeholder={listingMode === 'rent' ? '65000' : '2400000'}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="lp-area"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Property Size
              </label>
              <div className="flex gap-2">
                <input
                  id="lp-area"
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  placeholder="2100"
                  className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none tabular-nums"
                />
                <select
                  aria-label="Area unit"
                  value={areaUnit}
                  onChange={(e) =>
                    setAreaUnit(e.target.value as 'sq.ft.' | 'Grounds' | 'Acres')
                  }
                  className="h-11 px-2.5 text-xs font-medium text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none shrink-0"
                >
                  <option value="sq.ft.">sq.ft.</option>
                  <option value="Grounds">Grounds</option>
                  <option value="Acres">Acres</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="lp-availability"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Availability
              </label>
              <select
                id="lp-availability"
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value as AvailabilityStatus)
                }
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="Immediate">Immediate</option>
                <option value="Within 30 Days">Within 30 Days</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="lp-deposit"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Deposit or Tenure Terms (optional)
              </label>
              <input
                id="lp-deposit"
                type="text"
                value={depositOrTenure}
                onChange={(e) => setDepositOrTenure(e.target.value)}
                placeholder="e.g., 6 months deposit · 3-year lease"
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="lp-bedrooms"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Bedrooms
              </label>
              <select
                id="lp-bedrooms"
                value={isResidentialCategory ? bedrooms : 'na'}
                disabled={!isResidentialCategory}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none disabled:bg-neutral-50 disabled:text-[#71717A]"
              >
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
                <option value="na">Not Applicable (Land / Commercial)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="lp-facing"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Orientation / Facing
              </label>
              <select
                id="lp-facing"
                value={facing}
                onChange={(e) => setFacing(e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="East Facing">East Facing</option>
                <option value="North Facing">North Facing</option>
                <option value="North-East Corner">North-East Corner</option>
                <option value="South Facing">South Facing</option>
                <option value="West Facing">West Facing</option>
              </select>
            </div>
          </div>
        </section>

        {/* Step 3: Amenities & Description */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#222222] pb-2 border-b border-neutral-100">
            03. Amenities, Description &amp; Photograph
          </h2>

          <div>
            <span className="block text-xs font-semibold text-[#222222] mb-2">
              Select Key Amenities
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITY_PRESETS.map((amenity) => {
                const active = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-colors ${
                      active
                        ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#7C3AED] font-semibold'
                        : 'bg-white border-neutral-200 text-[#52525B] hover:border-[#7C3AED]/40'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="lp-description"
              className="block text-xs font-semibold text-[#222222] mb-1.5"
            >
              Property Description
            </label>
            <textarea
              id="lp-description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe layout, access road, nearby Chennai landmarks, suitability for families or businesses, and lease flexibility..."
              className="w-full px-3.5 py-2.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#222222]">
                Property Photograph (Upload or Choose Representative Preview)
              </span>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] cursor-pointer">
                <ImagePlus className="w-4 h-4" />
                <span>Upload Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>

            {uploadedPreview ? (
              <div className="flex items-center gap-4 p-3 rounded-xl border border-[#7C3AED]/40 bg-[#EDE9FE]/25">
                <div className="w-24 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                  <SafeImage
                    src={uploadedPreview}
                    alt="Uploaded property preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#222222]">
                    Custom photo selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setUploadedPreview(null)}
                    className="text-xs font-medium text-[#7C3AED] hover:underline mt-1"
                  >
                    Remove and use architectural preview
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {PRESET_PHOTOS.map((photo) => (
                  <button
                    key={photo.label}
                    type="button"
                    onClick={() => setSelectedImage(photo.src)}
                    className={`group rounded-xl overflow-hidden border-2 text-left transition-all ${
                      selectedImage === photo.src
                        ? 'border-[#7C3AED]'
                        : 'border-neutral-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full">
                      <SafeImage
                        src={photo.src}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Step 4: Owner Privacy Details */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#222222] pb-2 border-b border-neutral-100">
            04. Owner / Landlord Details (Kept Private)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="lp-role"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Listing Role
              </label>
              <select
                id="lp-role"
                value={listedByRole}
                onChange={(e) =>
                  setListedByRole(
                    e.target.value as
                      | 'Property Owner'
                      | 'Landowner'
                      | 'Commercial Landlord'
                  )
                }
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="Property Owner">Property Owner</option>
                <option value="Landowner">Landowner</option>
                <option value="Commercial Landlord">Commercial Landlord</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="lp-owner-name"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Full Name
              </label>
              <input
                id="lp-owner-name"
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Owner or authorized representative"
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="lp-owner-email"
                className="block text-xs font-semibold text-[#222222] mb-1.5"
              >
                Private Notification Email
              </label>
              <input
                id="lp-owner-email"
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="owner@example.com"
                className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[#52525B] bg-[#EDE9FE]/40 p-4 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
            <span>
              Your email is used strictly for Spacupied enquiry alerts. No phone numbers or
              personal contact details are published publicly on your listing.
            </span>
          </div>
        </section>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
          >
            Publish Property Listing
          </button>
        </div>
      </form>
    </div>
  );
}
