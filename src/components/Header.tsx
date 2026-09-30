import React, { useState } from 'react';
import { Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [convertersDropdownOpen, setConvertersDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setConvertersDropdownOpen(false);
  };

  const converterLinks = [
    { label: 'JPG to PNG', path: '/jpg-to-png' },
    { label: 'JPEG to PNG', path: '/jpeg-to-png' },
    { label: 'WEBP to PNG', path: '/webp-to-png' },
    { label: 'GIF to PNG', path: '/gif-to-png' },
    { label: 'BMP to PNG', path: '/bmp-to-png' },
    { label: 'SVG to PNG', path: '/svg-to-png' },
    { label: 'AVIF to PNG', path: '/avif-to-png' },
    { label: 'ICO to PNG', path: '/ico-to-png' },
    { label: 'TIFF to PNG', path: '/tiff-to-png' },
    { label: 'HEIC to PNG', path: '/heic-to-png' },
    { label: 'PSD to PNG', path: '/psd-to-png' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Elite SaaS Logo */}
          <div className="flex items-center">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/');
              }}
              className="group cursor-pointer"
            >
              <BrandLogo size="md" showSubtitle={false} />
            </a>
          </div>

          {/* Desktop Navigation - Clean, No Distracting Connect Now */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('/')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentPath === '/'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Image to PNG
            </button>

            {/* Converters Dropdown */}
            <div className="relative">
              <button
                onClick={() => setConvertersDropdownOpen(!convertersDropdownOpen)}
                onBlur={() => setTimeout(() => setConvertersDropdownOpen(false), 200)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentPath.includes('-to-png')
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>All Converters</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {convertersDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fade-in grid grid-cols-2 gap-1 p-2">
                  {converterLinks.map((link) => (
                    <a
                      key={link.path}
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(link.path);
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        currentPath === link.path
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (currentPath === '/') {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNav('/#how-it-works');
                }
              }}
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              How It Works
            </button>

            <button
              onClick={() => handleNav('/guides')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentPath.startsWith('/guides')
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Guides & Tech
            </button>

            <button
              onClick={() => handleNav('/about')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentPath === '/about'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNav('/contact')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentPath === '/contact'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPath === '/' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Image to PNG Converter
            </button>

            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                All Converters
              </span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {converterLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className="text-left px-3 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
              <button
                onClick={() => handleNav('/guides')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Guides & Comparisons
              </button>
              <button
                onClick={() => handleNav('/about')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                About ImageToPNG
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Contact Us
              </button>
              <button
                onClick={() => handleNav('/report-bug')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Report a Bug
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
