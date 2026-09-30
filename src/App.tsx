/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { HomePage } from './pages/HomePage';
import { SUPPORTED_FORMATS } from './data/formats';
import { GUIDES_DATA } from './data/guides';

// Code-split secondary routes to keep initial bundle size tiny (< 45KB) for 100/100 PageSpeed scores
const FormatPage = lazy(() => import('./pages/FormatPage').then((m) => ({ default: m.FormatPage })));
const GuidesHubPage = lazy(() => import('./pages/GuidesHubPage').then((m) => ({ default: m.GuidesHubPage })));
const GuideDetailPage = lazy(() => import('./pages/GuideDetailPage').then((m) => ({ default: m.GuideDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ReportBugPage = lazy(() => import('./pages/ReportBugPage').then((m) => ({ default: m.ReportBugPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage').then((m) => ({ default: m.CookiePolicyPage })));
const SecurityPage = lazy(() => import('./pages/SecurityPage').then((m) => ({ default: m.SecurityPage })));
const StatusPage = lazy(() => import('./pages/StatusPage').then((m) => ({ default: m.StatusPage })));
const ImprintPage = lazy(() => import('./pages/ImprintPage').then((m) => ({ default: m.ImprintPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center p-8">
    <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
  </div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update dynamic document title, description, and canonical link
  useEffect(() => {
    let title = 'Image to PNG Converter – Convert Images to PNG Free';
    let description =
      'Convert JPG, JPEG, WEBP, GIF, BMP and other supported image formats to PNG online for free. Fast, private browser-based image conversion with easy download.';

    if (currentPath === '/' || currentPath === '') {
      title = 'Image to PNG Converter – Convert Images to PNG Free';
      description =
        'Convert JPG, JPEG, WEBP, GIF, BMP and other supported image formats to PNG online for free. Fast, private browser-based image conversion with easy download.';
    } else if (currentPath === '/guides' || currentPath === '/blog') {
      title = 'Blog & Guides – ImageToPNG Knowledge Hub';
      description =
        'Explore technical guides, format comparisons (PNG vs JPG, PNG vs WebP), alpha transparency insights, and compression optimization.';
    } else if (currentPath.startsWith('/guides/') || currentPath.startsWith('/blog/')) {
      const guideSlug = currentPath.replace('/guides/', '').replace('/blog/', '').replace(/\/$/, '');
      const guide = GUIDES_DATA.find((g) => g.slug === guideSlug);
      if (guide) {
        title = `${guide.metaTitle} | ImageToPNG`;
        description = guide.metaDescription;
      } else {
        title = 'Guide Not Found | ImageToPNG';
      }
    } else if (currentPath === '/about') {
      title = 'About Us – ImageToPNG Online Conversion Utility';
      description =
        'Learn about ImageToPNG, our mission for private client-side image conversion, and our zero-server-upload architecture.';
    } else if (currentPath === '/security') {
      title = 'Security & Data Protection – ImageToPNG';
      description =
        'Read about our zero-server-upload security architecture. Images are processed 100% locally inside your browser.';
    } else if (currentPath === '/status') {
      title = 'System Status & Diagnostics – ImageToPNG';
      description =
        'Live diagnostics, client-side engine availability, and browser graphic pipeline health.';
    } else if (currentPath === '/imprint') {
      title = 'Imprint / Impressum – ImageToPNG';
      description =
        'Statutory legal information, service provider details, and publication notices for ImageToPNG.';
    } else if (currentPath === '/contact') {
      title = 'Contact Us – ImageToPNG Support & Feedback';
      description =
        'Get in touch with the ImageToPNG engineering team for questions, feedback, or support regarding browser image conversion.';
    } else if (currentPath === '/report-bug') {
      title = 'Report a Bug – ImageToPNG Quality Control';
      description =
        'Report conversion failures, unsupported codecs, or browser-specific rendering bugs to help us improve ImageToPNG.';
    } else if (currentPath === '/privacy') {
      title = 'Privacy Policy – ImageToPNG 100% In-Browser Privacy';
      description =
        'Read our comprehensive privacy policy. Your images are converted 100% locally in your browser and never uploaded to remote servers.';
    } else if (currentPath === '/terms') {
      title = 'Terms of Use – ImageToPNG';
      description =
        'Review the terms of service governing your use of the ImageToPNG online image conversion utility.';
    } else if (currentPath === '/cookie-policy') {
      title = 'Cookie Policy – ImageToPNG';
      description =
        'Details regarding our minimal strictly essential cookies, zero third-party tracking, and local preference storage.';
    } else {
      const formatSlug = currentPath.replace('/', '').replace(/\/$/, '');
      const format = SUPPORTED_FORMATS.find((f) => f.slug === formatSlug);
      if (format) {
        title = `${format.sourceFormat} to PNG Converter – Free Online Conversion`;
        description = format.metaDescription;
      } else {
        title = '404 – Page Not Found | ImageToPNG';
        description = 'The requested converter page does not exist.';
      }
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `https://imagetopng.com${currentPath === '/' ? '' : currentPath}`);
    }
  }, [currentPath]);

  // Navigate handler that updates URL via history API
  const handleNavigate = (path: string) => {
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      if (currentPath !== '/') {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
      }
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route matching with Suspense for secondary routes
  const renderCurrentPage = () => {
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    if (cleanPath === '/') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    if (cleanPath === '/guides' || cleanPath === '/blog') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <GuidesHubPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath.startsWith('/guides/') || cleanPath.startsWith('/blog/')) {
      const guideSlug = cleanPath.replace('/guides/', '').replace('/blog/', '');
      const guide = GUIDES_DATA.find((g) => g.slug === guideSlug);
      if (guide) {
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <GuideDetailPage guide={guide} onNavigate={handleNavigate} />
          </Suspense>
        );
      }
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <NotFoundPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/about') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AboutPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/security') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <SecurityPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/status') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <StatusPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/imprint') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <ImprintPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/contact') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <ContactPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/report-bug') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <ReportBugPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/privacy') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/terms') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <TermsPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    if (cleanPath === '/cookie-policy') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <CookiePolicyPage onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    const formatSlug = cleanPath.replace('/', '');
    const format = SUPPORTED_FORMATS.find((f) => f.slug === formatSlug);
    if (format) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <FormatPage format={format} onNavigate={handleNavigate} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <NotFoundPage onNavigate={handleNavigate} />
      </Suspense>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 text-sm">
      <Header currentPath={currentPath} onNavigate={handleNavigate} />
      <main className="flex-1">{renderCurrentPage()}</main>
      <Footer onNavigate={handleNavigate} />
      <CookieBanner />
    </div>
  );
}
