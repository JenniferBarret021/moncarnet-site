type StackIconProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function StackIcon({ size = 64, className, title }: StackIconProps) {
  const uid = `stack-${size}`;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
      style={{ display: 'block', borderRadius: size * 0.22 }}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D1F6E" />
          <stop offset="55%" stopColor="#1F0F3D" />
          <stop offset="100%" stopColor="#0B0518" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0" r="0.7">
          <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#3D1F6E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`hi-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#bg-${uid})`} />
      <rect width="100" height="100" rx="22" fill={`url(#glow-${uid})`} />
      <g transform="translate(50 50)">
        <rect x="-28" y="6" width="56" height="12" rx="3" fill="#5B3FA8" />
        <rect x="-28" y="-8" width="56" height="12" rx="3" fill="#9272E0" />
        <rect x="-28" y="-22" width="56" height="18" rx="3.5" fill="#E9D5FF" />
        <rect x="-28" y="-22" width="56" height="18" rx="3.5" fill={`url(#hi-${uid})`} />
        <line
          x1="-22"
          y1="-15.5"
          x2="6"
          y2="-15.5"
          stroke="#1B1530"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.55"
        />
        <line
          x1="-22"
          y1="-10.5"
          x2="-4"
          y2="-10.5"
          stroke="#1B1530"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}
