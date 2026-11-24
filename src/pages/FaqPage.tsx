import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { PageRoute, WhatsAppContext } from '../types/property';

interface FaqPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenWhatsApp: (context: WhatsAppContext) => void;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  section: string;
  items: FaqItem[];
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    section: '01. For Tenants & Businesses',
    items: [
      {
        question: 'What types of properties can I find on Spacupied in Chennai?',
        answer:
          'Spacupied covers six dedicated categories across Chennai and its outskirts: houses and apartments for rent, residential land and plots for lease, commercial properties, shops and office spaces, agricultural land, and long-term residential and commercial leasing.',
      },
      {
        question: 'How do monthly rental listings differ from long-term lease listings?',
        answer:
          'Monthly rental listings typically follow standard 11-month residential or commercial rental structures with a refundable deposit. Lease listings represent structured multi-year arrangements (often 2 to 10 years) for residential homes, plots, commercial floors, or agricultural parcels.',
      },
      {
        question: 'Why are some listings labeled as Sample Listings?',
        answer:
          'Spacupied never invents fake real-world property inventory or fabricated customer reviews. Illustrative sample listings are clearly labeled to show how property specifications, Chennai corridor maps, and pricing formats appear on the platform alongside owner-submitted listings.',
      },
    ],
  },
  {
    section: '02. For Property Owners, Landlords & Landowners',
    items: [
      {
        question: 'How can I list my house, plot, shop, office, or agricultural land?',
        answer:
          'Visit the List Your Property page from the navigation bar, select your property category and Chennai locality, specify monthly rental or lease pricing, area dimensions, availability, and amenities, and publish directly to the directory.',
      },
      {
        question: 'Can I list land measured in Grounds or Acres instead of square feet?',
        answer:
          'Yes. Our List Your Property form supports square feet (sq.ft.), Grounds (standard in Chennai residential plots at 2,400 sq.ft. per ground), and Acres for agricultural and large commercial parcels, automatically normalizing area so search filters work accurately.',
      },
    ],
  },
  {
    section: '03. Privacy & Communication',
    items: [
      {
        question: 'Why are there no phone numbers displayed on Spacupied?',
        answer:
          'Publishing phone numbers publicly often leads to spam calls and privacy concerns for both property owners and prospective tenants. Spacupied routes all enquiries through structured property forms and our privacy-first WhatsApp integration so every conversation stays intentional and secure.',
      },
      {
        question: 'How does the WhatsApp enquiry integration work?',
        answer:
          'Clicking any WhatsApp button opens the Spacupied WhatsApp Desk modal, where your property reference and message are pre-formatted. You can launch WhatsApp directly or copy the structured enquiry without exposing personal phone numbers on the public website.',
      },
    ],
  },
];

export default function FaqPage({ onNavigate, onOpenWhatsApp }: FaqPageProps) {
  const [openKey, setOpenKey] = useState<string>('0-0');

  const toggleItem = (key: string) => {
    setOpenKey((prev) => (prev === key ? '' : key));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-12">
        <p className="text-xs font-semibold text-[#7C3AED] mb-2">
          Help &amp; Guidance · Chennai Rental &amp; Leasing
        </p>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl sm:text-4xl font-semibold text-[#222222] tracking-tight mb-3"
        >
          Frequently Asked Questions
        </h1>
        <p className="text-base text-[#52525B] max-w-2xl leading-relaxed">
          Clear answers about searching Chennai spaces, structuring rentals and leases,
          submitting your property, and how Spacupied safeguards your privacy.
        </p>
      </div>

      <div className="space-y-10">
        {FAQ_GROUPS.map((group, gIdx) => (
          <section key={group.section} className="space-y-3">
            <h2 className="text-sm font-semibold text-[#7C3AED] mb-3">
              {group.section}
            </h2>
            <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl bg-white overflow-hidden">
              {group.items.map((item, iIdx) => {
                const key = `${gIdx}-${iIdx}`;
                const isOpen = openKey === key;
                return (
                  <div key={item.question}>
                    <button
                      type="button"
                      onClick={() => toggleItem(key)}
                      aria-expanded={isOpen}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[#EDE9FE]/25 transition-colors"
                    >
                      <span className="text-sm sm:text-base font-semibold text-[#222222]">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#7C3AED] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-sm text-[#52525B] leading-[1.75]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom Help Strip */}
      <div className="mt-12 rounded-2xl bg-[#EDE9FE]/45 border border-[#7C3AED]/15 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-base font-semibold text-[#222222]">
            Still have a specific question?
          </h2>
          <p className="text-sm text-[#52525B] mt-1">
            Reach out via our Contact page or start a WhatsApp message with our Chennai desk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors whitespace-nowrap"
          >
            Contact Us
          </button>
          <button
            type="button"
            onClick={() =>
              onOpenWhatsApp({ subject: 'FAQ Question — Spacupied Chennai' })
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#7C3AED] bg-white border border-[#7C3AED]/30 hover:bg-white/80 rounded-xl transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
