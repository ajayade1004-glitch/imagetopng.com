import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-10 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Brand + 4 Exact Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info Column */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
              className="inline-block cursor-pointer"
            >
              <BrandLogo size="sm" theme="dark" showSubtitle={false} />
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browser-based image to PNG converter. Files are processed locally on your device with no account required.
            </p>
          </div>

          {/* 1. Tools Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleNav(e, '/')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Image to PNG (All Types)
                </a>
              </li>
              <li>
                <a
                  href="/jpg-to-png"
                  onClick={(e) => handleNav(e, '/jpg-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  JPG to PNG
                </a>
              </li>
              <li>
                <a
                  href="/jpeg-to-png"
                  onClick={(e) => handleNav(e, '/jpeg-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  JPEG to PNG
                </a>
              </li>
              <li>
                <a
                  href="/webp-to-png"
                  onClick={(e) => handleNav(e, '/webp-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  WEBP to PNG
                </a>
              </li>
              <li>
                <a
                  href="/heic-to-png"
                  onClick={(e) => handleNav(e, '/heic-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  HEIC to PNG (iPhone)
                </a>
              </li>
              <li>
                <a
                  href="/svg-to-png"
                  onClick={(e) => handleNav(e, '/svg-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  SVG to PNG
                </a>
              </li>
              <li>
                <a
                  href="/tiff-to-png"
                  onClick={(e) => handleNav(e, '/tiff-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  TIFF to PNG
                </a>
              </li>
              <li>
                <a
                  href="/gif-to-png"
                  onClick={(e) => handleNav(e, '/gif-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  GIF to PNG
                </a>
              </li>
              <li>
                <a
                  href="/bmp-to-png"
                  onClick={(e) => handleNav(e, '/bmp-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  BMP to PNG
                </a>
              </li>
              <li>
                <a
                  href="/psd-to-png"
                  onClick={(e) => handleNav(e, '/psd-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  PSD to PNG
                </a>
              </li>
              <li>
                <a
                  href="/raw-to-png"
                  onClick={(e) => handleNav(e, '/raw-to-png')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  RAW to PNG
                </a>
              </li>
            </ul>
          </div>

          {/* 2. Resources Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/guides"
                  onClick={(e) => handleNav(e, '/guides')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  onClick={(e) => handleNav(e, '/#how-it-works')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  onClick={(e) => handleNav(e, '/security')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Security Architecture
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  onClick={(e) => handleNav(e, '/status')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  System Status
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Company Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNav(e, '/about')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleNav(e, '/contact')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/report-bug"
                  onClick={(e) => handleNav(e, '/report-bug')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Report a Bug
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Legal Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleNav(e, '/privacy')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  onClick={(e) => handleNav(e, '/cookie-policy')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleNav(e, '/terms')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/imprint"
                  onClick={(e) => handleNav(e, '/imprint')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Imprint
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright Only */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 ImageToPNG. All rights reserved.</p>
          <p className="text-slate-500">
            Free online image conversion utility.
          </p>
        </div>
      </div>
    </footer>
  );
};
