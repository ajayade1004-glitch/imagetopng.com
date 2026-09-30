import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface SocialShareBarProps {
  title?: string;
  url?: string;
  className?: string;
  compact?: boolean;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  title = 'Free Image to PNG Converter – Fast browser-based conversion with no account required!',
  url,
  className = '',
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://imagetopng.app');

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  // Social Share Handlers
  const handleXShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleWhatsAppShare = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handlePinterestShare = () => {
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing via desktop web, so copy link and open Instagram
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const handleAnyShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Image to PNG Converter',
          text: title,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed, fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Share2 className="w-4 h-4 text-blue-600" />
        <span>Share Converter:</span>
      </div>

      {/* Round Logo Social Buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* 1. X (Twitter) - Round Logo */}
        <button
          type="button"
          onClick={handleXShare}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black text-white hover:bg-zinc-800 transition-transform hover:scale-110 flex items-center justify-center shadow-md shadow-black/20 cursor-pointer"
          title="Share on X (Twitter)"
          aria-label="Share on X"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* 2. WhatsApp - Round Logo */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white transition-transform hover:scale-110 flex items-center justify-center shadow-md shadow-[#25D366]/30 cursor-pointer"
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.495 2 2 6.496 2 12.031a10.015 10.015 0 0 0 1.547 5.32L2.016 22l4.828-1.516a10.03 10.03 0 0 0 5.187 1.438h.004c5.535 0 10.031-4.496 10.031-10.031S17.566 2 12.031 2zm0 18.358a8.318 8.318 0 0 1-4.246-1.16l-.305-.18-2.863.898.9-2.793-.199-.316A8.328 8.328 0 1 1 12.031 20.358zm4.566-6.223c-.25-.125-1.477-.73-1.707-.812-.23-.082-.398-.125-.566.125s-.652.812-.8 1-.297.188-.547.062a6.903 6.903 0 0 1-2.031-1.254 7.618 7.618 0 0 1-1.406-1.75c-.148-.25-.016-.387.109-.512.113-.113.25-.293.375-.438.125-.148.168-.25.25-.418.086-.168.043-.316-.02-.441s-.566-1.363-.777-1.871c-.203-.492-.41-.426-.566-.434l-.48-.008c-.168 0-.441.062-.672.312s-.883.863-.883 2.105.902 2.445 1.027 2.613c.125.168 1.777 2.715 4.305 3.805.602.258 1.07.414 1.437.531.605.191 1.156.164 1.59.1.484-.07 1.477-.605 1.684-1.188.207-.586.207-1.09.145-1.188-.063-.102-.23-.164-.48-.289z" />
          </svg>
        </button>

        {/* 3. Facebook - Round Logo */}
        <button
          type="button"
          onClick={handleFacebookShare}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white transition-transform hover:scale-110 flex items-center justify-center shadow-md shadow-[#1877F2]/30 cursor-pointer"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* 4. Pinterest - Round Logo */}
        <button
          type="button"
          onClick={handlePinterestShare}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E60023] hover:bg-[#c9001f] text-white transition-transform hover:scale-110 flex items-center justify-center shadow-md shadow-[#E60023]/30 cursor-pointer"
          title="Share on Pinterest"
          aria-label="Share on Pinterest"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.379-.057.24-.19.29-.441.175-1.656-.772-2.69-3.2-2.69-5.152 0-4.195 3.047-8.053 8.791-8.053 4.618 0 8.207 3.291 8.207 7.689 0 4.588-2.893 8.281-6.908 8.281-1.35 0-2.619-.701-3.054-1.53l-.832 3.17c-.3 1.15-1.111 2.593-1.656 3.473 1.258.388 2.596.598 3.985.598 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638 0 12.017 0z" />
          </svg>
        </button>

        {/* 5. Instagram - Round Gradient Logo */}
        <button
          type="button"
          onClick={handleInstagramShare}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white transition-transform hover:scale-110 flex items-center justify-center shadow-md shadow-pink-500/30 cursor-pointer"
          title="Share to Instagram (Copies link & opens Instagram)"
          aria-label="Share on Instagram"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </button>

        {/* 6. Any Share (Native Web Share / Copy Link) - Round Indigo Button */}
        <button
          type="button"
          onClick={handleAnyShare}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-transform hover:scale-110 flex items-center justify-center shadow-md shadow-indigo-600/30 cursor-pointer relative"
          title="Share via any app or copy link"
          aria-label="Share via any app"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {copied && (
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-fade-in">
          Link Copied!
        </span>
      )}
    </div>
  );
};
