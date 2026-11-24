import { useState, FormEvent } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Compass,
  MapPin,
  Maximize2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  PropertyEnquiryRecord,
  PropertyListing,
  WhatsAppContext,
} from '../types/property';
import { CATEGORY_LABELS } from '../data/properties';
import SafeImage from '../components/SafeImage';
import ChennaiMap from '../components/ChennaiMap';

interface PropertyDetailPageProps {
  property: PropertyListing;
  onBack: () => void;
  onOpenWhatsApp: (context: WhatsAppContext) => void;
  onSubmitEnquiry: (record: PropertyEnquiryRecord) => void;
}

export default function PropertyDetailPage({
  property,
  onBack,
  onOpenWhatsApp,
  onSubmitEnquiry,
}: PropertyDetailPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Enquiry Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState('Schedule Site Visit');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState(
    `I am interested in "${property.title}" (${property.referenceCode}) in ${property.location}, Chennai. Please share rental/lease terms and viewing availability.`
  );
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleEnquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address so we can respond.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Please include a brief enquiry message (at least 10 characters).');
      return;
    }

    const enquiryId = `ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
    onSubmitEnquiry({
      id: enquiryId,
      propertyId: property.id,
      propertyTitle: property.title,
      name: name.trim(),
      email: email.trim(),
      enquiryType,
      preferredDate: preferredDate || 'Flexible',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    });
    setSubmittedRef(enquiryId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#52525B] hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </button>
        <p className="hidden sm:block text-xs text-[#71717A]">
          Chennai · {property.location} · {property.referenceCode}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Main Content (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Interactive Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50">
              <SafeImage
                src={property.images[activeImageIndex] || property.images[0]}
                alt={`${property.title} — photo ${activeImageIndex + 1}`}
                fallbackLabel={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {property.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {property.images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View property photograph ${idx + 1}`}
                    className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#7C3AED] shadow-xs'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${property.title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Unboxed Metadata & Pricing */}
          <div className="pb-6 border-b border-neutral-200/80">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#71717A] mb-2.5">
              <span className="font-semibold text-[#7C3AED]">
                {property.listingMode === 'rent' ? 'For Rent' : 'For Lease'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{CATEGORY_LABELS[property.category]}</span>
              <span aria-hidden="true">·</span>
              <span>
                {property.isSample ? 'Illustrative Sample Listing' : 'Owner Submitted Listing'}
              </span>
            </div>

            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-semibold text-[#222222] leading-snug mb-2.5"
            >
              {property.title}
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-[#52525B] mb-5">
              <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <span>
                {property.microLocation}, {property.city}, {property.state}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 bg-[#EDE9FE]/40 border border-[#7C3AED]/15 rounded-2xl px-5 py-4">
              <div>
                <p className="text-xs font-medium text-[#52525B]">
                  {property.listingMode === 'rent'
                    ? 'Indicative Monthly Rent'
                    : 'Indicative Lease Pricing'}
                </p>
                <p className="text-2xl font-bold text-[#222222] tabular-nums mt-0.5">
                  {property.priceLabel}
                </p>
              </div>
              <p className="text-xs text-[#52525B] sm:text-right">
                {property.depositOrTenure}
              </p>
            </div>
          </div>

          {/* Core Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pb-6 border-b border-neutral-200/80">
            <div>
              <p className="text-xs text-[#71717A] flex items-center gap-1.5 mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Property Area</span>
              </p>
              <p className="text-sm font-semibold text-[#222222] tabular-nums">
                {property.areaDisplay}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#71717A] mb-1">Configuration</p>
              <p className="text-sm font-semibold text-[#222222]">
                {property.bedrooms !== null
                  ? `${property.bedrooms} BHK${
                      property.bathrooms ? ` · ${property.bathrooms} Bath` : ''
                    }`
                  : property.furnishingOrZoning}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#71717A] flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Orientation</span>
              </p>
              <p className="text-sm font-semibold text-[#222222]">{property.facing}</p>
            </div>
            <div>
              <p className="text-xs text-[#71717A] flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Availability</span>
              </p>
              <p className="text-sm font-semibold text-[#222222]">
                {property.availability}
              </p>
            </div>
          </div>

          {/* Property Description */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#222222]">Property Overview</h2>
            <p className="text-sm sm:text-[0.95rem] leading-[1.75] text-[#52525B]">
              {property.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-[#71717A]">
              <span>Listed By: {property.listedByRole}</span>
              <span>Classification: {property.furnishingOrZoning}</span>
              <span>Reference: {property.referenceCode}</span>
            </div>
          </section>

          {/* Amenities & Features */}
          <section className="space-y-4 pt-2 border-t border-neutral-100">
            <h2 className="text-lg font-semibold text-[#222222]">
              Amenities &amp; Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 text-sm text-[#222222] py-1.5"
                >
                  <span className="w-5 h-5 rounded-md bg-[#EDE9FE] text-[#7C3AED] inline-flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Location & Interactive Chennai Map */}
          <section className="pt-2">
            <ChennaiMap property={property} />
          </section>
        </div>

        {/* Right Sticky Enquiry Form & WhatsApp Sidebar (4 Columns) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-[0_8px_28px_rgba(124,58,237,0.05)]">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#222222]">
                Enquire About This Space
              </h2>
              <p className="text-xs text-[#71717A] mt-1">
                Submit your rental or leasing enquiry directly to Spacupied’s Chennai desk.
              </p>
            </div>

            {submittedRef ? (
              <div className="py-4 space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#222222]">
                    Enquiry Submitted Successfully
                  </h3>
                  <p className="text-xs text-[#71717A] mt-1 tabular-nums">
                    Reference ID: {submittedRef}
                  </p>
                </div>
                <p className="text-sm text-[#52525B] leading-relaxed">
                  Thank you, {name}. Your enquiry regarding{' '}
                  <span className="font-medium text-[#222222]">{property.title}</span> has
                  been recorded. Our Chennai coordination desk will follow up via email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-[#7C3AED] bg-[#EDE9FE]/60 hover:bg-[#EDE9FE] rounded-xl transition-colors"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="enq-name"
                    className="block text-xs font-semibold text-[#222222] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="enq-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enq-email"
                    className="block text-xs font-semibold text-[#222222] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="enq-type"
                      className="block text-xs font-semibold text-[#222222] mb-1.5"
                    >
                      Enquiry Purpose
                    </label>
                    <select
                      id="enq-type"
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                    >
                      <option value="Schedule Site Visit">Schedule Site Visit</option>
                      <option value="Request Lease / Rent Terms">
                        Request Lease / Rent Terms
                      </option>
                      <option value="Corporate / Business Leasing">
                        Corporate / Business Leasing
                      </option>
                      <option value="Availability Confirmation">
                        Availability Confirmation
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="enq-date"
                      className="block text-xs font-semibold text-[#222222] mb-1.5"
                    >
                      Preferred Move-in / Visit Date
                    </label>
                    <input
                      id="enq-date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enq-message"
                    className="block text-xs font-semibold text-[#222222] mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="enq-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
                >
                  Submit Enquiry
                </button>
              </form>
            )}

            {/* Privacy-First WhatsApp Option */}
            <div className="mt-5 pt-5 border-t border-neutral-100 space-y-3">
              <button
                type="button"
                onClick={() =>
                  onOpenWhatsApp({
                    subject: `Enquiry for ${property.title}`,
                    propertyTitle: property.title,
                    referenceCode: property.referenceCode,
                    location: property.location,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-[#7C3AED] bg-[#EDE9FE]/65 hover:bg-[#EDE9FE] rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Enquire via WhatsApp</span>
              </button>
              <p className="flex items-start gap-2 text-[11px] text-[#71717A] leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
                <span>
                  Your details are handled confidentially. Spacupied never publishes
                  personal phone numbers publicly.
                </span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
