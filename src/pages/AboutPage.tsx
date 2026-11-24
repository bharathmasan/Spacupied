import { ArrowRight, MessageCircle } from 'lucide-react';
import { PageRoute, WhatsAppContext } from '../types/property';
import { GENERATED_IMAGES } from '../data/properties';
import SafeImage from '../components/SafeImage';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenWhatsApp: (context: WhatsAppContext) => void;
}

const PRINCIPLES = [
  {
    index: '01.',
    title: 'Dedicated Exclusively to Chennai',
    body: 'Every category, corridor guide, and search filter is calibrated for Chennai — from residential enclaves in Adyar, Anna Nagar, and Besant Nagar to Grade-A commercial corridors on OMR and Guindy, retail belts in T. Nagar, coastal plots along ECR, and greenbelt agricultural land.',
  },
  {
    index: '02.',
    title: 'Built for Both Rent and Long-Term Leasing',
    body: 'Most portals treat monthly rentals and multi-year land or commercial leases identically. Spacupied structures rental pricing, total lease terms, area measurements (sq.ft., grounds, acres), and availability windows with clarity for both individuals and enterprises.',
  },
  {
    index: '03.',
    title: 'Privacy-First Communication',
    body: 'Property owners, landowners, and prospective tenants deserve spam-free conversations. Spacupied never displays personal phone numbers publicly, routing enquiries through structured digital forms and guided WhatsApp messaging.',
  },
  {
    index: '04.',
    title: 'Transparent Listings Without Clutter',
    body: 'We prioritize clear specifications, authentic property photography, and straightforward locality context. Illustrative sample entries are always marked transparently so visitors can distinguish platform previews from owner-submitted spaces.',
  },
];

export default function AboutPage({ onNavigate, onOpenWhatsApp }: AboutPageProps) {
  return (
    <div className="bg-white">
      {/* Editorial Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-semibold text-[#7C3AED] mb-3">
              About Spacupied · Chennai, Tamil Nadu
            </p>
            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#222222] leading-[1.15] tracking-tight mb-5"
            >
              A Calmer, Clearer Way to Rent and Lease Space in Chennai.
            </h1>
            <p className="text-base text-[#52525B] leading-[1.75] mb-5">
              Spacupied was conceived around a simple premise: finding or leasing space in
              Chennai should feel architectural, transparent, and respectful of everyone’s
              time. Whether you are a family searching for a sunlit apartment, a landowner
              leasing a coastal residential plot or irrigated agricultural parcel, or a
              business expanding into Guindy, T. Nagar, or OMR — clarity comes first.
            </p>
            <p className="text-base text-[#52525B] leading-[1.75]">
              We bring property owners, landlords, landowners, tenants, and commercial
              occupiers together on a single focused platform designed with minimal friction
              and strong privacy safeguards.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="w-full h-full min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden border border-neutral-200/80">
              <SafeImage
                src={GENERATED_IMAGES.omrOffice}
                alt="Modern daylight commercial workspace in Chennai"
                fallbackLabel="Spacupied Chennai"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Numbered Architectural Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-neutral-100">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold text-[#7C3AED] mb-2">How Spacupied Works</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight"
          >
            Four Principles Behind Every Listing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRINCIPLES.map((item) => (
            <div
              key={item.index}
              className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 space-y-3"
            >
              <span className="text-sm font-bold text-[#7C3AED] tabular-nums">
                {item.index}
              </span>
              <h3 className="text-lg font-semibold text-[#222222]">{item.title}</h3>
              <p className="text-sm text-[#52525B] leading-[1.75]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Serve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-neutral-100">
        <div className="rounded-3xl bg-[#EDE9FE]/50 border border-[#7C3AED]/15 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-semibold text-[#222222]"
            >
              Ready to Explore or List Your Chennai Space?
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
              Browse available categories across Chennai or submit your residential,
              commercial, plot, retail, or agricultural listing directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('listings')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors whitespace-nowrap"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp({ subject: 'About Spacupied — Chennai Services' })
              }
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#7C3AED] bg-white border border-[#7C3AED]/30 hover:bg-white/80 rounded-xl transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
