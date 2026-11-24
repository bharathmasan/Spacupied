interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export default function Logo({ onClick, className = '' }: LogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#7C3AED" />
        <path
          d="M9.5 14.8L16 9.5L22.5 14.8V22.5H18.2V17.4H13.8V22.5H9.5V14.8Z"
          fill="#FFFFFF"
        />
        <rect x="14.5" y="12.5" width="3" height="2.4" rx="0.6" fill="#EDE9FE" />
      </svg>
      <span className="text-[1.2rem] font-semibold tracking-[-0.025em] text-[#222222] whitespace-nowrap">
        Spacupied
      </span>
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-[#7C3AED] rounded-lg"
        aria-label="Spacupied Home"
      >
        {content}
      </button>
    );
  }

  return content;
}
