import React from 'react';
import { MockupConfig } from '../../types/mockup';

interface CapRendererProps {
  config: MockupConfig;
  isInteractive?: boolean;
  onLogoDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const CapRenderer: React.FC<CapRendererProps> = ({ config, isInteractive = true, onLogoDragStart }) => {
  const { productColor, logoUrl, logoScale, logoX, logoY, logoRotation, logoOpacity, blendMode, invertLogo } = config;

  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="capShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="capCrownLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        <clipPath id="capFrontCrownClip">
          <path d="M165,330 C155,200 220,120 300,120 C380,120 445,200 435,330 C390,360 210,360 165,330 Z" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="300" cy="485" rx="190" ry="22" fill="url(#capShadow)" />

      {/* Crown Base */}
      <path
        d="M165,330 C155,200 220,120 300,120 C380,120 445,200 435,330 C390,360 210,360 165,330 Z"
        fill={productColor}
      />
      <path
        d="M165,330 C155,200 220,120 300,120 C380,120 445,200 435,330 C390,360 210,360 165,330 Z"
        fill="url(#capCrownLight)"
      />

      {/* Panel Seam Lines */}
      {/* Center Seam */}
      <path d="M300,120 Q300,230 300,345" stroke="#000000" strokeWidth="2" opacity="0.25" fill="none" />
      {/* Left Seam */}
      <path d="M300,120 Q240,210 215,340" stroke="#000000" strokeWidth="1.5" opacity="0.2" fill="none" />
      {/* Right Seam */}
      <path d="M300,120 Q360,210 385,340" stroke="#000000" strokeWidth="1.5" opacity="0.2" fill="none" />

      {/* Top Squatchee Button */}
      <ellipse cx="300" cy="120" rx="16" ry="10" fill={productColor} stroke="#000000" strokeWidth="1.5" strokeOpacity="0.3" />
      <ellipse cx="300" cy="119" rx="10" ry="6" fill="#ffffff" opacity="0.25" />

      {/* Embroidered Eyelets */}
      <circle cx="250" cy="210" r="4.5" fill="#000000" opacity="0.4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.3" />
      <circle cx="350" cy="210" r="4.5" fill="#000000" opacity="0.4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.3" />

      {/* Logo in Front Crown */}
      <g clipPath="url(#capFrontCrownClip)">
        {logoUrl && (
          <g
            transform={`translate(${300 + (logoX * 1.5)}, ${240 + (logoY * 1.2)}) rotate(${logoRotation})`}
            style={{
              cursor: isInteractive ? 'move' : 'default',
            }}
            onMouseDown={onLogoDragStart}
            onTouchStart={onLogoDragStart}
          >
            <g
              transform={`scale(${logoScale * 0.75})`}
              style={{
                mixBlendMode: blendMode,
                opacity: logoOpacity / 100,
                filter: invertLogo ? 'invert(1) hue-rotate(180deg)' : 'none',
              }}
            >
              <image
                href={logoUrl}
                x="-80"
                y="-80"
                width="160"
                height="160"
                preserveAspectRatio="xMidYMid meet"
                className="pointer-events-auto"
              />
            </g>
          </g>
        )}
      </g>

      {/* Curved Brim / Visor */}
      <g id="capBrim">
        <path
          d="M140,345 C150,470 450,470 460,345 C410,325 190,325 140,345 Z"
          fill={productColor}
        />
        {/* Brim Bottom Shadow */}
        <path
          d="M140,345 C150,470 450,470 460,345 C410,325 190,325 140,345 Z"
          fill="#000000"
          opacity="0.18"
        />
        {/* Brim Stitch Lines */}
        <path d="M165,360 C180,445 420,445 435,360" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.3" />
        <path d="M185,375 C200,430 400,430 415,375" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.3" />
        {/* Brim Edge Highlight */}
        <path d="M145,348 C160,465 440,465 455,348" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.35" />
      </g>
    </svg>
  );
};
