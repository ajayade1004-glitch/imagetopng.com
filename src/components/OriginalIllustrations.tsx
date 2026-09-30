import React from 'react';

/**
 * 1. JPG to PNG Conversion Process Illustration
 */
export const JpgToPngIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Illustration showing JPG conversion into a transparent-capable PNG file">
    <rect width="500" height="240" rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
    
    {/* Source JPG Card */}
    <g transform="translate(40, 45)">
      <rect width="140" height="150" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="15" y="15" width="110" height="75" rx="6" fill="#e2e8f0" />
      {/* Mountain shape representing photo */}
      <path d="M25 80L55 45L75 65L95 38L115 80H25Z" fill="#94a3b8" />
      <circle cx="45" cy="35" r="7" fill="#fbbf24" />
      <rect x="15" y="102" width="60" height="8" rx="4" fill="#64748b" />
      <rect x="15" y="118" width="90" height="6" rx="3" fill="#cbd5e1" />
      <rect x="15" y="130" width="45" height="5" rx="2.5" fill="#e2e8f0" />
      <rect x="85" y="98" width="40" height="18" rx="4" fill="#fee2e2" />
      <text x="105" y="111" fill="#dc2626" fontSize="10" fontWeight="700" textAnchor="middle">JPG</text>
    </g>

    {/* Center Conversion Arrow & Shield */}
    <g transform="translate(205, 95)">
      <circle cx="45" cy="25" r="26" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M35 25H55M55 25L47 17M55 25L47 33" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="45" y="65" fill="#475569" fontSize="11" fontWeight="600" textAnchor="middle">Local Canvas</text>
    </g>

    {/* Output PNG Card with Checkerboard */}
    <g transform="translate(320, 45)">
      <rect width="140" height="150" rx="10" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
      {/* Checkerboard Pattern */}
      <defs>
        <pattern id="checker-ill" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#f1f5f9" />
          <rect x="5" width="5" height="5" fill="#e2e8f0" />
          <rect y="5" width="5" height="5" fill="#e2e8f0" />
          <rect x="5" y="5" width="5" height="5" fill="#f1f5f9" />
        </pattern>
      </defs>
      <rect x="15" y="15" width="110" height="75" rx="6" fill="url(#checker-ill)" />
      {/* Subject cutout with clean edge */}
      <path d="M35 75L60 45L80 62L98 38L110 75H35Z" fill="#3b82f6" />
      <circle cx="50" cy="35" r="7" fill="#60a5fa" />
      <rect x="15" y="102" width="60" height="8" rx="4" fill="#0f172a" />
      <rect x="15" y="118" width="90" height="6" rx="3" fill="#94a3b8" />
      <rect x="15" y="130" width="55" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="85" y="98" width="40" height="18" rx="4" fill="#dbeafe" />
      <text x="105" y="111" fill="#1d4ed8" fontSize="10" fontWeight="700" textAnchor="middle">PNG</text>
    </g>
  </svg>
);

/**
 * 2. Transparent PNG Alpha Channel Visualizer
 */
export const TransparentPngIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 460 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Illustration demonstrating transparent PNG alpha channel with checkerboard background">
    <rect width="460" height="220" rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
    
    {/* Left Opaque Image Box */}
    <g transform="translate(35, 35)">
      <rect width="180" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="15" y="15" width="150" height="100" rx="6" fill="#ffffff" stroke="#e2e8f0" />
      <circle cx="90" cy="65" r="32" fill="#ef4444" />
      <text x="90" y="133" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">Solid Background (JPG)</text>
    </g>

    {/* Right Transparent PNG Box */}
    <g transform="translate(245, 35)">
      <rect width="180" height="150" rx="8" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
      <defs>
        <pattern id="alpha-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#e2e8f0" />
          <rect x="6" width="6" height="6" fill="#cbd5e1" />
          <rect y="6" width="6" height="6" fill="#cbd5e1" />
          <rect x="6" y="6" width="6" height="6" fill="#e2e8f0" />
        </pattern>
      </defs>
      <rect x="15" y="15" width="150" height="100" rx="6" fill="url(#alpha-pattern)" />
      <circle cx="90" cy="65" r="32" fill="#2563eb" />
      <text x="90" y="133" fill="#1d4ed8" fontSize="11" fontWeight="600" textAnchor="middle">Alpha Transparency (PNG)</text>
    </g>
  </svg>
);

/**
 * 3. Client-Side Browser Privacy Shield Illustration
 */
export const PrivacyShieldIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 460 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Illustration showing that files remain in your device browser with zero cloud uploads">
    <rect width="460" height="200" rx="16" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
    
    {/* Computer / Device Frame */}
    <g transform="translate(45, 30)">
      <rect width="160" height="110" rx="8" fill="#ffffff" stroke="#86efac" strokeWidth="2" />
      <rect x="10" y="10" width="140" height="75" rx="4" fill="#f8fafc" />
      <circle cx="20" cy="20" r="3" fill="#ef4444" />
      <circle cx="30" cy="20" r="3" fill="#f59e0b" />
      <circle cx="40" cy="20" r="3" fill="#10b981" />
      {/* File in browser */}
      <rect x="45" y="32" width="70" height="42" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
      <text x="80" y="58" fill="#15803d" fontSize="11" fontWeight="700" textAnchor="middle">100% Local</text>
      <path d="M60 120H100M80 110V120" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
      <rect x="50" y="125" width="60" height="4" rx="2" fill="#86efac" />
    </g>

    {/* Big Shield and Checkmark */}
    <g transform="translate(250, 40)">
      <path d="M75 10L30 30V75C30 105 75 125 75 125C75 125 120 105 120 75V30L75 10Z" fill="#16a34a" />
      <path d="M58 68L70 80L94 56" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="75" y="145" fill="#14532d" fontSize="12" fontWeight="700" textAnchor="middle">Zero Server Uploads</text>
    </g>
  </svg>
);
