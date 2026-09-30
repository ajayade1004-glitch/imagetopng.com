import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  Maximize2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MainConverter } from '../components/MainConverter';
import {
  JpgToPngIllustration,
  TransparentPngIllustration,
  PrivacyShieldIllustration,
} from '../components/OriginalIllustrations';
import { FreePngSamples } from '../components/FreePngSamples';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { ProFeatureShowcase } from '../components/ProFeatureShowcase';
import { SUPPORTED_FORMATS } from '../data/formats';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is an Image to PNG converter?',
      a: 'An Image to PNG converter is a specialized software utility that transforms graphic and photographic files (such as JPG, WEBP, GIF, SVG, BMP, or AVIF) into the Portable Network Graphics (PNG) format. PNG is the international standard for raster graphics that demand lossless pixel preservation, sharp vector-rendered lines, and full 8-bit alpha channel transparency.',
    },
    {
      q: 'How do I convert an image to PNG on ImageToPNG?',
      a: 'Simply drag your image into the conversion zone or click "Choose Image" to select one or multiple files from your computer, phone, or tablet. Your browser instantly decodes the file using the HTML5 Canvas API and encodes it as a high-fidelity PNG. Once completed, click "Download PNG" or "Download All (.zip)".',
    },
    {
      q: 'Are my images uploaded to an external server or cloud service?',
      a: 'No. ImageToPNG operates completely client-side in your web browser. Your images are processed strictly in your local device memory using native web APIs. No image is ever transmitted, uploaded, copied, or stored on any remote cloud server.',
    },
    {
      q: 'Can I convert JPG to PNG?',
      a: 'Yes. JPG is one of the most common formats converted to PNG. Converting JPG to PNG prevents any further compression loss when you need to make repetitive edits, and prepares the image for transparent background masking in graphic design programs.',
    },
    {
      q: 'Does converting a JPG to PNG improve its image quality?',
      a: 'No. Converting an existing JPG to PNG cannot restore fine detail or eliminate compression artifacts that were already discarded during the original JPEG lossy compression pass. However, saving as PNG prevents generational quality loss during further editing.',
    },
    {
      q: 'Why is my converted PNG file larger than my original JPG?',
      a: 'JPG uses aggressive lossy compression engineered specifically for photographs, discarding subtle color variations. PNG uses the lossless DEFLATE compression algorithm, which mathematically stores every single pixel without approximations. For continuous-tone photos, lossless storage naturally requires more bytes.',
    },
    {
      q: 'Can I convert WEBP images to PNG?',
      a: 'Yes. While modern web browsers support WebP, many desktop applications, older graphic editors, and office tools do not. Converting WebP to PNG provides broad compatibility across older operating systems, graphic suites, and legacy desktop software.',
    },
    {
      q: 'Will PNG preserve transparency if my original file has it?',
      a: 'Yes. Formats that support transparency—such as WebP, GIF, SVG, AVIF, and ICO—will have their transparent alpha channels preserved completely in the converted PNG. If your original file is a JPG, which does not support transparency, the converted PNG will be opaque.',
    },
    {
      q: 'Can I convert animated GIFs to PNG?',
      a: 'Animated GIFs are converted using the first frame. When an animated GIF is processed, our canvas converter renders the first frame of the animation as a high-resolution, full 24-bit truecolor static PNG image.',
    },
    {
      q: 'Can I convert SVG vector files to PNG?',
      a: 'Yes. Converting SVG to PNG rasterizes the mathematical vector geometry into a crisp, transparent bitmap image at native dimensions, making it easy to share on platforms or email clients that do not support vector SVG files.',
    },
    {
      q: 'Can I convert images to PNG on an iPhone or Android phone?',
      a: 'Yes. ImageToPNG is fully responsive and optimized for mobile browsers including Mobile Safari, Chrome, and Firefox on iOS and Android. You can choose photos directly from your device photo library or camera roll.',
    },
    {
      q: 'What is the maximum file size supported?',
      a: 'Because conversion runs inside your browser memory, we recommend individual files up to 50MB. Files larger than this may encounter device memory limitations depending on your hardware.',
    },
    {
      q: 'Can I convert multiple images at once?',
      a: 'Yes. You can select multiple images or drag an entire batch of files into the converter. You can then download each PNG individually or bundle all converted files into a single ZIP archive with one click.',
    },
    {
      q: 'Can I convert Apple HEIC photos and Camera RAW to PNG?',
      a: 'Yes! ImageToPNG natively decodes iPhone HEIC/HEIF photos, Tagged Image File Format (TIFF/TIF), and digital camera RAW formats (Canon CR2/CR3, Nikon NEF, Sony ARW, Adobe DNG) directly in your browser without requiring paid extensions.',
    },
    {
      q: 'Can I crop or edit my image before downloading PNG?',
      a: 'Yes! After uploading, click the "Edit" button on any image to use our interactive drag-to-select Crop tool, image resizer, 90° rotation, color filter adjustments, and background transparency controls before saving.',
    },
    {
      q: 'Can I batch convert hundreds of images and download as ZIP?',
      a: 'Yes. You can select or drag multiple images at once. All images are processed concurrently in your browser. With one click on "Download All (.zip)", all converted PNG files are packaged into a single ZIP archive.',
    },
    {
      q: 'Is ImageToPNG free to use?',
      a: 'Yes. ImageToPNG is 100% free with no registration, no watermarks, no account creation, no subscription fees, and no artificial daily conversion limits.',
    },
  ];

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="pt-6 pb-8 sm:pt-8 sm:pb-10 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Title & Subtitle */}
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 mb-2.5 shadow-2xs">
              <Zap className="w-3 h-3 text-blue-600" />
              <span>Free • Fast • In-Browser • No Account Required</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Image to PNG Converter
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              Convert any image format—JPG, JPEG, WEBP, GIF, BMP, TIFF, HEIC, HEIF, AVIF, SVG, ICO, PSD, RAW, and more—to lossless PNG directly in your web browser. Universal in-browser processing with zero server uploads.
            </p>
          </div>

          {/* Main Converter Tool (Immediate Visual Priority) */}
          <div className="mt-5">
            <MainConverter />
          </div>

          {/* Trust Guarantees */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Lossless PNG Output
            </span>
            <span className="flex items-center gap-1 text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Alpha Transparency Preserved
            </span>
            <span className="flex items-center gap-1 text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Batch Download as ZIP
            </span>
            <span className="flex items-center gap-1 text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Windows, Mac, iOS & Android
            </span>
          </div>
        </div>
      </section>

      {/* Ad slot placeholder 1 */}
      <AdPlaceholder format="horizontal" />

      {/* Pro Features Showcased (Paid Elsewhere • 100% Free Here) */}
      <ProFeatureShowcase />

      {/* Section: Trust & Local Privacy */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security & Privacy Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Your Images Never Leave Your Device
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                Most online image converters require uploading your personal photos, business graphics, or confidential documents to an unknown cloud server for processing. This introduces bandwidth delays, queue times, and serious privacy risks.
              </p>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                ImageToPNG works entirely inside your web browser. Utilizing modern HTML5 Canvas, File, and Web APIs, the decoding and encoding happen on your device’s hardware. Your images are never transmitted over the internet, stored on a server, or shared with third parties.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block">Instant Speed</span>
                  <span className="text-slate-500">No upload queues or network latency</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block">Complete Privacy</span>
                  <span className="text-slate-500">Confidential files stay in browser memory</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
              <PrivacyShieldIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Supported Formats Grid */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Supported Image Formats for PNG Conversion
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Convert between all major raster and vector image formats. Click any converter below for format-specific technical guides, compatibility charts, and tips.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SUPPORTED_FORMATS.map((format) => (
              <a
                key={format.slug}
                href={`/${format.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/${format.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      {format.sourceFormat} to PNG
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {format.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    Convert {format.extension} files to high-quality PNG.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Start conversion</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section: How It Works */}
      <section id="how-it-works" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How to Convert an Image to PNG
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Follow these simple steps to convert any supported image file to PNG in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-base mb-1">Choose an Image</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click "Choose Image" or drag one or multiple files directly from your computer, smartphone, or cloud drive into the drop area.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-base mb-1">Instant Browser Decode</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your browser reads the binary image stream into an off-screen HTML5 canvas buffer, preserving resolution and alpha transparency.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-base mb-1">Lossless PNG Encoding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The canvas generates an uncompressed, mathematically exact PNG blob using standard DEFLATE compression.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-base mb-1">Download PNG File</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save the converted PNG file immediately, or click "Download All (.zip)" if converting multiple images in batch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Original Interactive PNG Demonstrations */}
      <FreePngSamples />

      {/* Section: Why Convert to PNG? (Comprehensive Editorial Content) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Convert an Image to PNG?
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Portable Network Graphics (PNG) was created to establish an open, unpatented, and technically superior standard for computer raster graphics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Alpha Transparency</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PNG supports 8-bit alpha channels (RGBA), giving you 256 individual levels of opacity. Unlike formats that only allow fully visible or invisible pixels, PNG renders smooth drop shadows, translucent glassmorphism effects, and feathered cutout borders seamlessly across any background.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Maximize2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Lossless DEFLATE Encoding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PNG uses non-destructive DEFLATE compression. When you save an image as a PNG, every single pixel is preserved without the blurring, blockiness, or chroma ringing associated with JPEG compression. It is the premier format for screenshots, UI icons, diagrams, and digital typography.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Universal Compatibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                While modern formats like WebP and AVIF offer high compression for websites, they frequently fail when imported into legacy presentation software, desktop word processors, older versions of Photoshop, or printing presses. PNG is recognized universally by every operating system and graphic application.
              </p>
            </div>
          </div>

          {/* Detailed Editorial Explanation with Illustration */}
          <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Lossless Compression vs. Generational Loss
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Every time a lossy file format like JPEG is opened, edited, and saved, the discrete cosine transform algorithm executes another compression pass. This introduces compounding degradation known as generational loss—sharp boundaries become muddy, colors smear, and JPEG blocking becomes noticeable.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Converting your working files to PNG stops this cycle of decay. Once an image is stored in PNG format, you can open, crop, adjust, and re-save it an infinite number of times without losing even a fraction of a pixel.
                </p>
              </div>
              <div>
                <JpgToPngIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad slot placeholder 2 */}
      <AdPlaceholder format="horizontal" />

      {/* Section: Comprehensive Comparison Tables */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              PNG vs Other Image Formats: Detailed Comparison
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              A factual breakdown of how PNG compares to JPG, WebP, GIF, TIFF, and AVIF across compression, transparency, color fidelity, and ideal use cases.
            </p>
          </div>

          {/* Master Comparison Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Feature</th>
                    <th className="py-3.5 px-4 text-blue-700 bg-blue-50/60">PNG</th>
                    <th className="py-3.5 px-4">JPG / JPEG</th>
                    <th className="py-3.5 px-4">WEBP</th>
                    <th className="py-3.5 px-4">GIF</th>
                    <th className="py-3.5 px-4">AVIF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Compression Type</td>
                    <td className="py-3 px-4 text-blue-700 bg-blue-50/30 font-medium">Lossless (DEFLATE)</td>
                    <td className="py-3 px-4 text-slate-600">Lossy (DCT)</td>
                    <td className="py-3 px-4 text-slate-600">Lossy & Lossless</td>
                    <td className="py-3 px-4 text-slate-600">Lossless (LZW)</td>
                    <td className="py-3 px-4 text-slate-600">Lossy & Lossless (AV1)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Alpha Transparency</td>
                    <td className="py-3 px-4 text-blue-700 bg-blue-50/30 font-medium">Full 8-bit (256 levels)</td>
                    <td className="py-3 px-4 text-red-600">None (Opaque only)</td>
                    <td className="py-3 px-4 text-slate-600">Full 8-bit (256 levels)</td>
                    <td className="py-3 px-4 text-slate-600">1-bit Binary (On/Off)</td>
                    <td className="py-3 px-4 text-slate-600">Full 8-bit or higher</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Color Palette</td>
                    <td className="py-3 px-4 text-blue-700 bg-blue-50/30 font-medium">Up to 48-bit Truecolor</td>
                    <td className="py-3 px-4 text-slate-600">24-bit Truecolor</td>
                    <td className="py-3 px-4 text-slate-600">24-bit Truecolor</td>
                    <td className="py-3 px-4 text-amber-600">Max 256 colors (8-bit)</td>
                    <td className="py-3 px-4 text-slate-600">10-bit / 12-bit HDR</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Best For Photographs</td>
                    <td className="py-3 px-4 text-blue-700 bg-blue-50/30 font-medium">Large file sizes</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Excellent (Small size)</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Outstanding for Web</td>
                    <td className="py-3 px-4 text-red-600">Poor (Color banding)</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Highest compression</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Best For Logos & UI</td>
                    <td className="py-3 px-4 text-blue-700 bg-blue-50/30 font-semibold">Industry Gold Standard</td>
                    <td className="py-3 px-4 text-red-600">Poor (Ringing noise)</td>
                    <td className="py-3 px-4 text-slate-600">Great for web assets</td>
                    <td className="py-3 px-4 text-slate-600">Legacy only</td>
                    <td className="py-3 px-4 text-slate-600">Good for web delivery</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Software Support</td>
                    <td className="py-3 px-4 text-blue-700 bg-blue-50/30 font-semibold">Broad / Universal</td>
                    <td className="py-3 px-4 text-emerald-600">Broad / Universal</td>
                    <td className="py-3 px-4 text-amber-600">Modern Web & Browsers</td>
                    <td className="py-3 px-4 text-emerald-600">Broad / Universal</td>
                    <td className="py-3 px-4 text-amber-600">Limited desktop tools</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep Dives into Specific Comparisons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg mb-2">When Should You Use PNG?</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Logos, Icons & Badges:</strong> Sharp vector-rendered graphics that require clean, anti-aliased edges without blur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Transparent Backgrounds:</strong> Cutout product photos, sticker designs, and UI assets that sit on diverse colored surfaces.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Software Screenshots & Code Snips:</strong> High-contrast text and fine user-interface lines that blur under JPEG compression.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Master Archival Copies:</strong> Digital artwork you intend to edit multiple times in graphic software.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg mb-2">When Should You NOT Use PNG?</h3>
              <p className="text-xs text-slate-500 mb-3">
                For complete technical honesty, PNG is not ideal for every scenario:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Continuous-Tone Photographs for Web:</strong> A full-bleed hero photograph on a homepage in PNG might weigh 8MB, whereas a high-quality JPG or WebP will weigh under 400KB, drastically improving page load times.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>High-Frame-Rate Animations:</strong> While APNG (Animated PNG) exists, standard animated video formats (MP4, WebM) are exponentially more bandwidth-efficient.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Print Archival CMYK:</strong> Standard PNG does not officially support CMYK color space; TIFF or PDF is preferable for offset commercial printing presses.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Technical Truths (Does JPG to PNG increase quality? Why is PNG bigger?) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Important Technical Facts About PNG Conversion
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Separating technical reality from digital myths.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Does converting a JPG to PNG improve image quality?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The short and honest answer is: <strong>No, converting an existing JPG to a PNG will not restore detail that has already been discarded.</strong>
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                When a photograph is saved in JPG format, the JPEG encoder discards subtle high-frequency chroma and luminance values. When you convert that JPG to a PNG, our converter decodes the existing pixels accurately and writes them into a lossless PNG container. The image will look identical to the JPG. It will not become sharper or clearer, but it will not undergo any further degradation.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Why can a converted PNG file be larger than the original image?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lossy formats (like JPEG or lossy WebP) throw away image data to reach ultra-compact file sizes. PNG, on the other hand, is committed to zero data loss. It must mathematically describe every individual pixel using its DEFLATE compression algorithm.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                Because natural photographs contain lens noise, optical grain, and millions of slightly varied pixel hues, lossless compression cannot reduce the data as aggressively as a lossy format. A 1MB JPG photograph can easily expand to 3MB–5MB when converted to PNG. Conversely, flat graphics with solid colors (like logos or screenshots) often compress smaller in PNG than in JPG!
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base mb-2">
                How does PNG transparency work?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                PNG uses a dedicated 8-bit alpha channel in addition to the standard Red, Green, and Blue channels. This provides 256 gradations of transparency per pixel (from 0 = fully transparent to 255 = completely opaque). This allows graphic designers to produce realistic semi-transparent shadows, glowing halos, and subtle frosted-glass overlays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Frequently Asked Questions */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Everything you need to know about converting images to PNG online.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base cursor-pointer hover:bg-slate-50/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action Box */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Convert Your Images to PNG?
          </h2>
          <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Fast, browser-based, and free to use. No registration required. Your images are processed locally on your device.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('image-file-input')?.click();
              }}
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm sm:text-base hover:bg-blue-50 shadow-lg shadow-blue-900/20 transition-all active:scale-95 cursor-pointer"
            >
              Choose Image to Convert
            </button>
            <button
              onClick={() => {
                onNavigate('/guides');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-blue-700/60 text-white font-medium text-sm sm:text-base hover:bg-blue-700 border border-blue-400/40 transition-all cursor-pointer"
            >
              Explore PNG Guides
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
