import { PageRoute } from '../types/property';

interface PrivacyPolicyPageProps {
  onNavigate: (page: PageRoute) => void;
}

const POLICY_SECTIONS = [
  {
    title: '1. Overview & Commitment to Privacy',
    paragraphs: [
      'Spacupied respects the privacy of property owners, landlords, landowners, prospective tenants, and business representatives using our real estate rental and leasing platform serving Chennai, Tamil Nadu, India.',
      'This Privacy Policy outlines what information you voluntarily provide when submitting property enquiries, listing properties, or contacting our desk, and how that information is safeguarded.',
    ],
  },
  {
    title: '2. No Public Phone Numbers Policy',
    paragraphs: [
      'Spacupied intentionally does not display personal phone numbers anywhere on the public website. This measure protects both property listers and space seekers from unsolicited calls, automated scraping, and unauthorized outreach.',
      'When you initiate a WhatsApp conversation through Spacupied’s WhatsApp Desk, the platform formats your property enquiry message without publishing personal numbers in the user interface.',
    ],
  },
  {
    title: '3. Information You Provide',
    paragraphs: [
      'Property Enquiries & Contact Messages: When you submit a property enquiry or contact form, you provide your name, email address, preferred timeline, and message details strictly for coordinating your rental or leasing request.',
      'Property Submissions: When listing a property on Spacupied, you provide property specifications (category, Chennai locality, pricing, area, amenities, photographs) alongside a private notification email that is not exposed publicly on the listing card.',
    ],
  },
  {
    title: '4. Local Browser Storage & Technical Data',
    paragraphs: [
      'To preserve newly submitted listings and enquiry confirmations during your browsing experience on this device, Spacupied uses standard browser local storage. You may clear your browser storage at any time via your browser settings.',
    ],
  },
  {
    title: '5. Data Usage & Third-Party Sharing',
    paragraphs: [
      'We do not sell, rent, or trade your personal information to third-party marketers or data brokers. Submitted enquiry details are used solely to facilitate the specific Chennai rental or leasing conversation you initiated.',
    ],
  },
  {
    title: '6. Illustrative Sample Content Transparency',
    paragraphs: [
      'Featured entries labeled as "Sample Listing" on Spacupied are illustrative examples created to demonstrate property formatting, search filtering, and Chennai locality mapping. Spacupied does not publish fabricated real-world listings or invented customer testimonials.',
    ],
  },
  {
    title: '7. Updates & Privacy Requests',
    paragraphs: [
      'You may request correction or removal of any submitted listing or enquiry details at any time by reaching out through our Contact Us page. Material changes to this policy will be reflected directly on this page with an updated effective date.',
    ],
  },
];

export default function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="pb-8 border-b border-neutral-200/80 mb-10">
        <p className="text-xs font-semibold text-[#7C3AED] mb-2">
          Spacupied · Chennai, Tamil Nadu, India
        </p>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl sm:text-4xl font-semibold text-[#222222] tracking-tight mb-3"
        >
          Privacy Policy
        </h1>
        <p className="text-sm text-[#71717A]">
          Effective Date: November 2026 · Applicable to all Spacupied rental and leasing
          services in Chennai.
        </p>
      </div>

      <div className="space-y-9">
        {POLICY_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold text-[#222222]">{section.title}</h2>
            {section.paragraphs.map((text, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-[0.95rem] text-[#52525B] leading-[1.8]"
              >
                {text}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-[#52525B]">
          Questions about how Spacupied protects your privacy?
        </p>
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 text-sm font-semibold text-[#7C3AED] bg-[#EDE9FE]/65 hover:bg-[#EDE9FE] rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Reach Our Privacy Desk
        </button>
      </div>
    </div>
  );
}
