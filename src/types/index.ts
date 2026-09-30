export interface ConvertedFile {
  id: string;
  originalFile: File;
  name: string;
  originalSize: number;
  originalFormat: string;
  width: number;
  height: number;
  status: 'idle' | 'converting' | 'success' | 'error';
  progress: number;
  errorMessage?: string;
  pngBlob?: Blob;
  pngUrl?: string;
  pngSize?: number;
  convertedAt?: Date;
}

export interface FormatBenchmark {
  metric: string;
  sourceValue: string;
  pngValue: string;
  advantage: string;
}

export interface DeveloperSnippet {
  language: string;
  title: string;
  code: string;
}

export interface FormatData {
  slug: string;
  sourceFormat: string;
  targetFormat: 'PNG';
  extension: string;
  mimeTypes: string[];
  magicBytes: string;
  badge: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  geoDefinition: string;
  whatIsFormat: string;
  whyConvert: string[];
  advantages: string[];
  limitations: string[];
  transparencySupport: string;
  qualityNotes: string;
  fileSizeNotes: string;
  benchmarks: FormatBenchmark[];
  developerSnippets: DeveloperSnippet[];
  aiEcosystemNotes: string;
  useCases: { title: string; description: string }[];
  conversionSteps: { step: number; title: string; description: string }[];
  troubleshooting: { issue: string; solution: string }[];
  faq: { question: string; answer: string }[];
  relatedFormats: string[];
}

export interface GuideArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  readingTime: string;
  lastUpdated: string;
  category: 'Formats' | 'Comparison' | 'Optimization' | 'Tutorial';
  summary: string;
  content: {
    sectionHeading: string;
    paragraphs: string[];
    listItems?: string[];
    callout?: { title: string; text: string };
  }[];
  relatedGuides: string[];
}
