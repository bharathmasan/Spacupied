import { useState, FormEvent } from 'react';
import { CheckCircle2, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { WhatsAppContext } from '../types/property';
import { CHENNAI_LOCATIONS } from '../data/properties';

interface ContactPageProps {
  onOpenWhatsApp: (context: WhatsAppContext) => void;
}

export default function ContactPage({ onOpenWhatsApp }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Renting a Property');
  const [locality, setLocality] = useState('Adyar');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 12) {
      setError('Please share a brief description of how we can help (at least 12 characters).');
      return;
    }

    const generatedId = `MSG-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setTicketId(null);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Clean Digital Contact Overview (Zero Phone Numbers) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs font-semibold text-[#7C3AED] mb-2">
              Spacupied Chennai Desk
            </p>
            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-3xl sm:text-4xl font-semibold text-[#222222] tracking-tight mb-4"
            >
              Contact Us
            </h1>
            <p className="text-base text-[#52525B] leading-[1.7]">
              Have a question about renting, long-term residential or commercial leasing,
              listing your property, or agricultural land parcels in Chennai? Send us a
              message or initiate a WhatsApp conversation directly.
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#222222]">Service Region</h2>
                <p className="text-sm text-[#52525B] mt-0.5">
                  Chennai Metropolitan Area &amp; Outer Corridors, Tamil Nadu, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#222222]">
                  Privacy-First Communication
                </h2>
                <p className="text-sm text-[#52525B] mt-0.5 leading-relaxed">
                  To protect owners, landowners, and seekers from unsolicited outreach,
                  Spacupied operates through verified digital forms and WhatsApp without
                  displaying public phone numbers.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#EDE9FE]/50 border border-[#7C3AED]/15 p-6 space-y-3">
            <h2 className="text-base font-semibold text-[#222222]">
              Prefer Instant Messaging?
            </h2>
            <p className="text-sm text-[#52525B] leading-relaxed">
              Launch our guided WhatsApp enquiry desk to share your space requirement or
              listing request in Chennai.
            </p>
            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp({
                  subject: 'Direct Enquiry from Contact Page — Chennai',
                })
              }
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Open WhatsApp Desk</span>
            </button>
          </div>
        </div>

        {/* Right: Validated Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-[0_8px_28px_rgba(124,58,237,0.04)]">
            {ticketId ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-[#7C3AED] tabular-nums">
                  Enquiry Reference: {ticketId}
                </p>
                <h2 className="text-xl font-semibold text-[#222222]">
                  Message Received
                </h2>
                <p className="text-sm text-[#52525B] max-w-md mx-auto leading-relaxed">
                  Thank you for writing to Spacupied. Our Chennai coordination desk has
                  logged your enquiry regarding <span className="font-medium text-[#222222]">{topic}</span> and
                  will respond via email.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 text-sm font-semibold text-[#7C3AED] bg-[#EDE9FE]/65 hover:bg-[#EDE9FE] rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#222222]">
                    Send an Enquiry
                  </h2>
                  <p className="text-xs text-[#71717A] mt-1">
                    Share your requirement and we will respond to your email promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#222222] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="contact-name"
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
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#222222] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-semibold text-[#222222] mb-1.5"
                    >
                      Enquiry Topic
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                    >
                      <option value="Renting a Property">Renting a Property</option>
                      <option value="Long-Term Residential or Commercial Lease">
                        Long-Term Residential or Commercial Lease
                      </option>
                      <option value="Listing My Property or Land">
                        Listing My Property or Land
                      </option>
                      <option value="Agricultural Land Leasing">
                        Agricultural Land Leasing
                      </option>
                      <option value="Privacy or General Question">
                        Privacy or General Question
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-locality"
                      className="block text-xs font-semibold text-[#222222] mb-1.5"
                    >
                      Preferred Chennai Area
                    </label>
                    <select
                      id="contact-locality"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                    >
                      {CHENNAI_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                      <option value="Multiple Chennai Areas">Multiple Chennai Areas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#222222] mb-1.5"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your preferred category, budget, timeline, or property details..."
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
                  className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
                >
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
