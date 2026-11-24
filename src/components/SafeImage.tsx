import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export default function SafeImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel = 'Spacupied Chennai Space',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center bg-[#EDE9FE]/55 text-[#7C3AED] p-6 text-center"
      >
        <Building2 className="w-8 h-8 mb-2 opacity-80" />
        <span className="text-xs font-medium text-[#52525B]">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}
