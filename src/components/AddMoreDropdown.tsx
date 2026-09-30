import React, { useState, useRef, useEffect } from 'react';
import {
  FilePlus,
  ChevronUp,
  ChevronDown,
  Folder,
  Link as LinkIcon,
} from 'lucide-react';
import { ImportSourceType } from './CloudImportModal';

interface AddMoreDropdownProps {
  onSelectSource: (source: 'device' | ImportSourceType) => void;
  className?: string;
  buttonLabel?: string;
  defaultOpen?: boolean;
}

export const AddMoreDropdown: React.FC<AddMoreDropdownProps> = ({
  onSelectSource,
  className = '',
  buttonLabel = 'Add More Files',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (source: 'device' | ImportSourceType) => {
    setIsOpen(false);
    onSelectSource(source);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Split / Dropdown Button matching user screenshot */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100/90 border border-indigo-200 transition-all cursor-pointer shadow-xs group"
        title="Add files from Device, Google Drive, Dropbox, OneDrive, or URL"
      >
        <FilePlus className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
        <span>{buttonLabel}</span>
        <span className="border-l border-indigo-200 pl-1.5 ml-0.5 text-indigo-500">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Vertical Dropdown matching the user's uploaded screenshot */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl shadow-2xl bg-[#5B6EF7] text-white z-50 overflow-hidden border border-indigo-400/30 animate-fade-in divide-y divide-white/10 font-sans">
          {/* 1. From Device */}
          <button
            type="button"
            onClick={() => handleSelect('device')}
            className="w-full px-4 py-3 text-left flex items-center gap-3.5 hover:bg-white/15 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <Folder className="w-5 h-5 fill-white/20 text-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              From Device
            </span>
          </button>

          {/* 2. From Dropbox */}
          <button
            type="button"
            onClick={() => handleSelect('dropbox')}
            className="w-full px-4 py-3 text-left flex items-center gap-3.5 hover:bg-white/15 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M6.02 1.83 0 5.75l6.02 3.92 6-4.04-6-3.8zM17.98 1.83l-6 3.8 6 4.04 6.02-3.92-6.02-3.92zM0 13.59l6.02 3.92 6-3.8-6.02-4.04L0 13.59zm17.98-3.92-6.02 4.04 6 3.8 6.02-3.92-6-3.92zM6 19.46l6.02 3.89 6.02-3.89-6.02-3.8-6.02 3.8z"/>
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              From Dropbox
            </span>
          </button>

          {/* 3. From Google Drive */}
          <button
            type="button"
            onClick={() => handleSelect('drive')}
            className="w-full px-4 py-3 text-left flex items-center gap-3.5 hover:bg-white/15 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform drop-shadow-xs" viewBox="0 0 87.3 78" fill="none">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
                <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00AC47"/>
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#EA4335"/>
                <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832D"/>
                <path d="M59.8 53.1H87.3c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25z" fill="#FFBA00"/>
                <path d="M73.55 76.8H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2z" fill="#2684FC"/>
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              From Google Drive
            </span>
          </button>

          {/* 4. From OneDrive */}
          <button
            type="button"
            onClick={() => handleSelect('onedrive')}
            className="w-full px-4 py-3 text-left flex items-center gap-3.5 hover:bg-white/15 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              From OneDrive
            </span>
          </button>

          {/* 5. From Url */}
          <button
            type="button"
            onClick={() => handleSelect('url')}
            className="w-full px-4 py-3 text-left flex items-center gap-3.5 hover:bg-white/15 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              From Url
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
