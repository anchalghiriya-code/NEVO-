import React, { useState, useEffect } from 'react';

interface NevoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'mark' | 'stacked';
  onClick?: () => void;
}

/**
 * Official Nevo Brand Logo Component
 * - Directly renders the exact official image asset (/logo.png)
 * - Clean presentation without upload buttons or dark containers
 */
export const NevoLogo: React.FC<NevoLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full',
  onClick,
}) => {
  const [logoSrc, setLogoSrc] = useState<string>('/logo.png?v=2');
  const [hasError, setHasError] = useState(false);
  const [errorStep, setErrorStep] = useState(0);

  // Height configurations for crystal clarity across viewports
  const heights = {
    sm: 'h-9',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28'
  }[size];

  // Fallback candidate chain
  const candidateExtensions = ['/logo.png?v=2', '/logo.svg?v=2', '/logo.jpg', '/logo.jpeg', '/logo.webp'];

  useEffect(() => {
    // Check local storage if previously saved
    const cached = localStorage.getItem('nevo_custom_logo');
    if (cached) {
      setLogoSrc(cached);
    } else {
      fetch('/api/brand/logo-info')
        .then(res => res.json())
        .then(data => {
          if (data && data.exists && data.url) {
            setLogoSrc(data.url);
          }
        })
        .catch(() => {});
    }

    const handleLogoUpdate = (e: CustomEvent<{ url: string }>) => {
      if (e.detail?.url) {
        setLogoSrc(e.detail.url);
        setHasError(false);
        setErrorStep(0);
      }
    };

    window.addEventListener('nevo-logo-updated' as any, handleLogoUpdate as any);
    return () => {
      window.removeEventListener('nevo-logo-updated' as any, handleLogoUpdate as any);
    };
  }, []);

  const handleImageError = () => {
    const nextStep = errorStep + 1;
    if (nextStep < candidateExtensions.length) {
      setErrorStep(nextStep);
      setLogoSrc(candidateExtensions[nextStep]);
    } else {
      setHasError(true);
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center ${heights} cursor-pointer select-none ${className}`}
      title="Nevo — New From Old"
    >
      {!hasError ? (
        <img
          src={logoSrc}
          alt="Nevo Logo"
          onError={handleImageError}
          className={`${heights} w-auto object-contain block`}
          style={{ maxWidth: variant === 'mark' ? '4rem' : '16rem' }}
        />
      ) : (
        <div className="flex items-center gap-2 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">
          <span className="font-serif font-black tracking-tight text-lg">NEVO</span>
          {showSubtitle && <span className="text-[10px] tracking-widest text-stone-500 uppercase">— New From Old —</span>}
        </div>
      )}
    </div>
  );
};

export default NevoLogo;
