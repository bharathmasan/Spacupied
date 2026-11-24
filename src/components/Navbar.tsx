import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../types/property';
import Logo from './Logo';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

const NAV_ITEMS: { label: string; page: PageRoute }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Properties', page: 'listings' },
  { label: 'About', page: 'about' },
  { label: 'FAQs', page: 'faqs' },
  { label: 'Contact', page: 'contact' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageRoute) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Logo onClick={() => handleNav('home')} />

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52525B]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'listings' && currentPage === 'detail');
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleNav(item.page)}
                className={`relative py-2 transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#7C3AED] font-semibold'
                    : 'text-[#52525B] hover:text-[#222222]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#7C3AED] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleNav('list-property')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 shadow-xs"
          >
            List Your Property
          </button>
        </div>

        {/* Mobile Menu Trigger (>= 44px touch target) */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#222222] hover:bg-[#EDE9FE]/60 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-5 space-y-1 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'listings' && currentPage === 'detail');
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleNav(item.page)}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EDE9FE] text-[#7C3AED] font-semibold'
                    : 'text-[#222222] hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNav('privacy')}
            className={`w-full text-left px-3.5 py-3 rounded-xl text-base font-medium transition-colors ${
              currentPage === 'privacy'
                ? 'bg-[#EDE9FE] text-[#7C3AED] font-semibold'
                : 'text-[#52525B] hover:bg-neutral-50'
            }`}
          >
            Privacy Policy
          </button>
          <div className="pt-3">
            <button
              type="button"
              onClick={() => handleNav('list-property')}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
            >
              List Your Property
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
