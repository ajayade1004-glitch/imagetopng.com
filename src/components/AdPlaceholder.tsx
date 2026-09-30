import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

/**
 * AdSense placeholder is currently disabled per user preference.
 * Auto Ads will be configured after Google AdSense review approval.
 */
export const AdPlaceholder: React.FC<AdPlaceholderProps> = () => {
  return null;
};
