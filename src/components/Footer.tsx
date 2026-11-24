import { MessageCircle } from 'lucide-react';
import { PageRoute, PropertyCategory, WhatsAppContext } from '../types/property';
import { PROPERTY_CATEGORIES } from '../data/properties';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCategory: (category: PropertyCategory) => void;
  onOpenWhatsApp: (context: WhatsAppContext) => void;
}

export default function Footer({
  onNavigate,
  onSelectCategory,
  onOpenWhatsApp,
}: FooterProps) {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200/80">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Logo onClick={() => onNavigate('home')} />
            <p className="text-sm leading-relaxed text-[#52525B] max-w-sm">
              A dedicated real estate rental and leasing platform serving Chennai, Tamil Nadu.
              Connecting property owners, landlords, landowners, tenants, and businesses with
              clarity and privacy.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() =>
                  onOpenWhatsApp({
                    subject: 'General Rental or Leasing Enquiry — Chennai',
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#7C3AED] bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] rounded-xl transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Categories Column */}
          <div className="md:col-span-4 space-y-3.5">
            <h3 className="text-sm font-semibold text-[#222222]">Property Categories</h3>
            <ul className="space-y-2.5 text-sm text-[#52525B]">
              {PROPERTY_CATEGORIES.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className="text-left hover:text-[#7C3AED] transition-colors"
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links Column */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-sm font-semibold text-[#222222]">Platform</h3>
            <ul className="space-y-2.5 text-sm text-[#52525B]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('listings')}
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Explore Properties
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('list-property')}
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  List Your Property
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal Column */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-sm font-semibold text-[#222222]">Support</h3>
            <ul className="space-y-2.5 text-sm text-[#52525B]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#7C3AED] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>
            © {new Date().getFullYear()} Spacupied · Serving Chennai, Tamil Nadu, India.
          </p>
          <p className="max-w-lg sm:text-right">
            Featured catalog entries marked as Sample Listings are illustrative examples showcasing
            Chennai rental and leasing formats.
          </p>
        </div>
      </div>
    </footer>
  );
}
