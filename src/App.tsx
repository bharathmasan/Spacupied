/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import {
  PageRoute,
  PropertyCategory,
  PropertyEnquiryRecord,
  PropertyFilters,
  PropertyListing,
  WhatsAppContext,
} from './types/property';
import { DEFAULT_FILTERS, SAMPLE_PROPERTIES } from './data/properties';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppModal from './components/WhatsAppModal';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ListPropertyPage from './pages/ListPropertyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

const STORAGE_LISTINGS_KEY = 'spacupied_user_listings_v1';
const STORAGE_ENQUIRIES_KEY = 'spacupied_enquiries_v1';

function loadStoredListings(): PropertyListing[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_LISTINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [userListings, setUserListings] = useState<PropertyListing[]>(() =>
    loadStoredListings()
  );
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [whatsAppContext, setWhatsAppContext] = useState<WhatsAppContext | null>(null);

  const allProperties = useMemo(
    () => [...userListings, ...SAMPLE_PROPERTIES],
    [userListings]
  );

  const selectedProperty = useMemo(
    () => allProperties.find((p) => p.id === selectedPropertyId) ?? allProperties[0],
    [allProperties, selectedPropertyId]
  );

  // Sync URL hash for clean browser navigation
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash || hash === 'home') {
        setCurrentPage('home');
      } else if (hash === 'properties') {
        setCurrentPage('listings');
      } else if (hash.startsWith('property/')) {
        const id = hash.slice('property/'.length);
        setSelectedPropertyId(id);
        setCurrentPage('detail');
      } else if (hash === 'list-property') {
        setCurrentPage('list-property');
      } else if (hash === 'about') {
        setCurrentPage('about');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else if (hash === 'faqs') {
        setCurrentPage('faqs');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const navigateTo = (page: PageRoute, propertyId?: string) => {
    if (page === 'detail' && propertyId) {
      setSelectedPropertyId(propertyId);
      window.location.hash = `property/${propertyId}`;
    } else {
      window.location.hash = page === 'listings' ? 'properties' : page;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: PropertyListing) => {
    navigateTo('detail', property.id);
  };

  const handleSearchSubmit = (partialFilters: Partial<PropertyFilters>) => {
    setFilters({ ...DEFAULT_FILTERS, ...partialFilters });
    navigateTo('listings');
  };

  const handleSelectCategory = (category: PropertyCategory) => {
    setFilters({ ...DEFAULT_FILTERS, category });
    navigateTo('listings');
  };

  const handlePublishProperty = (newProperty: PropertyListing) => {
    setUserListings((prev) => {
      const updated = [newProperty, ...prev];
      try {
        window.localStorage.setItem(STORAGE_LISTINGS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage quota errors gracefully
      }
      return updated;
    });
  };

  const handleSubmitEnquiry = (record: PropertyEnquiryRecord) => {
    try {
      const raw = window.localStorage.getItem(STORAGE_ENQUIRIES_KEY);
      const existing: PropertyEnquiryRecord[] = raw ? JSON.parse(raw) : [];
      window.localStorage.setItem(
        STORAGE_ENQUIRIES_KEY,
        JSON.stringify([record, ...existing])
      );
    } catch {
      // Ignore storage quota errors gracefully
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#222222]">
      <Navbar currentPage={currentPage} onNavigate={(page) => navigateTo(page)} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            properties={allProperties}
            onNavigate={(page) => navigateTo(page)}
            onSearchSubmit={handleSearchSubmit}
            onSelectProperty={handleSelectProperty}
            onOpenWhatsApp={setWhatsAppContext}
          />
        )}

        {currentPage === 'listings' && (
          <ListingsPage
            properties={allProperties}
            filters={filters}
            onChangeFilters={setFilters}
            onSelectProperty={handleSelectProperty}
            onNavigateListProperty={() => navigateTo('list-property')}
          />
        )}

        {currentPage === 'detail' && selectedProperty && (
          <PropertyDetailPage
            key={selectedProperty.id}
            property={selectedProperty}
            onBack={() => navigateTo('listings')}
            onOpenWhatsApp={setWhatsAppContext}
            onSubmitEnquiry={handleSubmitEnquiry}
          />
        )}

        {currentPage === 'list-property' && (
          <ListPropertyPage
            onPublishProperty={handlePublishProperty}
            onViewProperty={handleSelectProperty}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={(page) => navigateTo(page)}
            onOpenWhatsApp={setWhatsAppContext}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onOpenWhatsApp={setWhatsAppContext} />
        )}

        {currentPage === 'faqs' && (
          <FaqPage
            onNavigate={(page) => navigateTo(page)}
            onOpenWhatsApp={setWhatsAppContext}
          />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicyPage onNavigate={(page) => navigateTo(page)} />
        )}
      </main>

      <Footer
        onNavigate={(page) => navigateTo(page)}
        onSelectCategory={handleSelectCategory}
        onOpenWhatsApp={setWhatsAppContext}
      />

      <WhatsAppModal
        context={whatsAppContext}
        onClose={() => setWhatsAppContext(null)}
      />
    </div>
  );
}
