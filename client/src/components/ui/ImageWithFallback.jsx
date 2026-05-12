import { useState } from 'react';

export default function ImageWithFallback({ src, alt, className = '', fallbackText = '' }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] ${className}`}>
        <span className="text-4xl font-display text-green leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NCFC</span>
        {fallbackText && <span className="text-xs text-gray-500 mt-1 font-body">{fallbackText}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
