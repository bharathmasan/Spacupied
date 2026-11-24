import { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, ShieldCheck, X } from 'lucide-react';
import { WhatsAppContext } from '../types/property';

interface WhatsAppModalProps {
  context: WhatsAppContext | null;
  onClose: () => void;
}

const INTENT_OPTIONS = [
  'Property Rental Enquiry',
  'Long-Term Lease Discussion',
  'Schedule Site Viewing',
  'List My Property on Spacupied',
];

export default function WhatsAppModal({ context, onClose }: WhatsAppModalProps) {
  const [selectedIntent, setSelectedIntent] = useState(INTENT_OPTIONS[0]);
  const [senderName, setSenderName] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (context) {
      setSelectedIntent(
        context.propertyTitle ? 'Property Rental Enquiry' : INTENT_OPTIONS[0]
      );
      setCustomNote(
        context.propertyTitle
          ? `Hello Spacupied team, I would like rental/leasing details for "${context.propertyTitle}" (${context.referenceCode ?? 'Chennai'}) located in ${context.location ?? 'Chennai'}.`
          : `Hello Spacupied team, I am reaching out regarding ${context.subject}.`
      );
      setCopied(false);
      setDispatched(false);
    }
  }, [context]);

  if (!context) return null;

  const composedMessage = [
    `Spacupied Chennai Enquiry — ${selectedIntent}`,
    senderName.trim() ? `Name: ${senderName.trim()}` : null,
    context.propertyTitle ? `Property: ${context.propertyTitle}` : null,
    context.referenceCode ? `Reference: ${context.referenceCode}` : null,
    `Message: ${customNote.trim() || 'Please share available options and next steps.'}`,
  ]
    .filter(Boolean)
    .join('\n');

  // Privacy-first WhatsApp share link with zero phone numbers exposed publicly
  const whatsAppLaunchUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    composedMessage
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(composedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
    >
      <div className="bg-white rounded-2xl border border-neutral-200 w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="whatsapp-modal-title"
                className="text-base font-semibold text-[#222222]"
              >
                Spacupied WhatsApp Desk
              </h2>
              <p className="text-xs text-[#71717A]">
                Privacy-first messaging · No public phone numbers displayed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close WhatsApp dialog"
            className="w-10 h-10 rounded-xl inline-flex items-center justify-center text-[#52525B] hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {dispatched ? (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#222222]">
                WhatsApp Enquiry Prepared
              </h3>
              <p className="text-sm text-[#52525B] max-w-sm mx-auto leading-relaxed">
                Your Spacupied enquiry has been logged and formatted. You can launch WhatsApp
                directly below or copy the message to send anytime.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsAppLaunchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
                >
                  <span>Open WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-[#222222] border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-2">
                  Enquiry Topic
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INTENT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedIntent(option)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-colors ${
                        selectedIntent === option
                          ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#7C3AED] font-semibold'
                          : 'bg-white border-neutral-200 text-[#52525B] hover:border-[#7C3AED]/40'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="wa-sender-name"
                  className="block text-xs font-semibold text-[#222222] mb-1.5"
                >
                  Your Name (optional)
                </label>
                <input
                  id="wa-sender-name"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="wa-message"
                  className="block text-xs font-semibold text-[#222222] mb-1.5"
                >
                  Enquiry Message
                </label>
                <textarea
                  id="wa-message"
                  rows={4}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-[#222222] bg-white border border-neutral-200 rounded-xl focus:border-[#7C3AED] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-start gap-2.5 text-xs text-[#52525B] bg-[#EDE9FE]/40 p-3.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                <span>
                  Spacupied protects user and owner privacy by initiating WhatsApp conversations
                  without publishing personal phone numbers on the platform.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <a
                  href={whatsAppLaunchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDispatched(true)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Continue to WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#222222] bg-white border border-neutral-200 hover:border-[#7C3AED]/50 rounded-xl transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#7C3AED]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#52525B]" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
