import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  theme = 'light',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* 3D App Icon matching uploaded brand logo */}
      <div className={`relative ${iconSizes[size]} shrink-0 group-hover:scale-105 transition-transform drop-shadow-md`}>
        <svg viewBox="0 0 512 512" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logoBgGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0055ff" />
              <stop offset="100%" stopColor="#0040dd" />
            </linearGradient>

            <linearGradient id="logoGlossGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="logoSunGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffc700" />
              <stop offset="100%" stopColor="#ff9000" />
            </linearGradient>

            <linearGradient id="logoMtnBack2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#308aff" />
              <stop offset="100%" stopColor="#1a6ee8" />
            </linearGradient>
            <linearGradient id="logoMtnFront2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0070f3" />
              <stop offset="100%" stopColor="#0050c8" />
            </linearGradient>

            <linearGradient id="logoFoldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9cc5ff" />
              <stop offset="100%" stopColor="#5d9cff" />
            </linearGradient>

            <linearGradient id="logoBadgeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e699" />
              <stop offset="50%" stopColor="#00c878" />
              <stop offset="100%" stopColor="#00a85d" />
            </linearGradient>

            <linearGradient id="logoArrowGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#bde0fe" />
            </linearGradient>

            <clipPath id="logoPaperClip2">
              <path d="M72 156C72 125.072 97.072 100 128 100H250L314 164V316C314 346.928 288.928 372 258 372H128C97.072 372 72 346.928 72 316V156Z" />
            </clipPath>
          </defs>

          {/* Squircle App Background */}
          <rect width="512" height="512" rx="118" fill="url(#logoBgGrad2)" />
          <rect x="2" y="2" width="508" height="240" rx="116" fill="url(#logoGlossGrad2)" />

          {/* Picture Document Card */}
          <g>
            <path d="M72 156C72 125.072 97.072 100 128 100H250L314 164V316C314 346.928 288.928 372 258 372H128C97.072 372 72 346.928 72 316V156Z" fill="#ffffff" />
            
            <g clipPath="url(#logoPaperClip2)">
              <circle cx="145" cy="180" r="32" fill="url(#logoSunGrad2)" />
              <path d="M175 372L246 220L314 286V372H175Z" fill="url(#logoMtnBack2)" />
              <path d="M72 372L168 254L252 372H72Z" fill="url(#logoMtnFront2)" />
            </g>

            <path d="M250 100V144C250 155.046 258.954 164 270 164H314L250 100Z" fill="url(#logoFoldGrad2)" />
          </g>

          {/* 3D Swoop Conversion Arrow */}
          <g>
            <path d="M312 142C358 142 418 168 440 228C448 249 446 270 442 284" stroke="url(#logoArrowGrad2)" strokeWidth="32" strokeLinecap="round" fill="none" />
            <path d="M394 284L442 346L490 284H454C454 284 454 284 454 284H394Z" fill="url(#logoArrowGrad2)" />
          </g>

          {/* Prominent Emerald Green PNG Pill Badge */}
          <g>
            <rect x="180" y="270" width="272" height="152" rx="46" fill="url(#logoBadgeGrad2)" />
            <path d="M226 270H406C431.405 270 452 290.595 452 316V322C436 308 392 294 316 294C240 294 196 308 180 322V316C180 290.595 200.595 270 226 270Z" fill="#ffffff" fillOpacity="0.25" />
            <text x="316" y="380" fill="#ffffff" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" fontSize="94" fontWeight="900" letterSpacing="-3" textAnchor="middle">PNG</text>
          </g>
        </svg>
      </div>

      {/* Typography: ImageToPNG */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span
            className={`font-['Plus_Jakarta_Sans',sans-serif] font-black tracking-tight ${textSizes[size]} ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Image<span className="text-blue-600 font-extrabold mx-[1px]">To</span><span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent font-black">PNG</span>
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold tracking-wide mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Browser-Based • Free Image Converter
          </span>
        )}
      </div>
    </div>
  );
};
