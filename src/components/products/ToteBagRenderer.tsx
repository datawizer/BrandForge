import React from 'react';
import { MockupConfig } from '../../types/mockup';

interface ToteBagRendererProps {
  config: MockupConfig;
  isInteractive?: boolean;
  onLogoDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const ToteBagRenderer: React.FC<ToteBagRendererProps> = ({ config, isInteractive = true, onLogoDragStart }) => {
  const { productColor, logoUrl, logoScale, logoX, logoY, logoRotation, logoOpacity, blendMode, invertLogo } = config;

  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="toteFloorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.38" />
          <stop offset="65%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="toteTexture" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>

        <clipPath id="toteBodyClip">
          <path d="M185,210 L415,210 L430,510 C430,520 420,530 405,530 L195,530 C180,530 170,520 170,510 Z" />
        </clipPath>
      </defs>

      {/* Floor Shadow */}
      <ellipse cx="300" cy="535" rx="165" ry="22" fill="url(#toteFloorShadow)" />

      {/* Shoulder Straps */}
      {/* Left Strap */}
      <path
        d="M235,210 C235,50 255,40 290,40 C305,40 310,50 310,80"
        fill="none"
        stroke={productColor}
        strokeWidth="24"
        strokeLinecap="round"
      />
      <path
        d="M235,210 C235,50 255,40 290,40 C305,40 310,50 310,80"
        fill="none"
        stroke="#000000"
        strokeWidth="24"
        opacity="0.15"
      />
      {/* Right Strap */}
      <path
        d="M365,210 C365,50 345,40 310,40 C295,40 290,50 290,80"
        fill="none"
        stroke={productColor}
        strokeWidth="24"
        strokeLinecap="round"
      />
      <path
        d="M365,210 C365,50 345,40 310,40 C295,40 290,50 290,80"
        fill="none"
        stroke="#000000"
        strokeWidth="24"
        opacity="0.22"
      />

      {/* Tote Bag Main Body */}
      <path
        d="M185,210 L415,210 L430,510 C430,520 420,530 405,530 L195,530 C180,530 170,520 170,510 Z"
        fill={productColor}
      />
      <path
        d="M185,210 L415,210 L430,510 C430,520 420,530 405,530 L195,530 C180,530 170,520 170,510 Z"
        fill="url(#toteTexture)"
      />

      {/* Top Hem & Fold */}
      <rect x="185" y="210" width="230" height="24" fill="#000000" opacity="0.08" />
      <line x1="185" y1="234" x2="415" y2="234" stroke="#000000" strokeWidth="1.5" opacity="0.2" />

      {/* Strap Reinforcement Box Stitches */}
      <rect x="224" y="215" width="22" height="22" fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.25" strokeDasharray="3 2" />
      <line x1="224" y1="215" x2="246" y2="237" stroke="#000000" strokeWidth="1.5" opacity="0.2" />
      <rect x="354" y="215" width="22" height="22" fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.25" strokeDasharray="3 2" />
      <line x1="354" y1="215" x2="376" y2="237" stroke="#000000" strokeWidth="1.5" opacity="0.2" />

      {/* Logo Container inside Tote Clip */}
      <g clipPath="url(#toteBodyClip)">
        {logoUrl && (
          <g
            transform={`translate(${300 + (logoX * 1.5)}, ${365 + (logoY * 1.5)}) rotate(${logoRotation})`}
            style={{
              cursor: isInteractive ? 'move' : 'default',
            }}
            onMouseDown={onLogoDragStart}
            onTouchStart={onLogoDragStart}
          >
            <g
              transform={`scale(${logoScale})`}
              style={{
                mixBlendMode: blendMode,
                opacity: logoOpacity / 100,
                filter: invertLogo ? 'invert(1) hue-rotate(180deg)' : 'none',
              }}
            >
              <image
                href={logoUrl}
                x="-90"
                y="-90"
                width="180"
                height="180"
                preserveAspectRatio="xMidYMid meet"
                className="pointer-events-auto"
              />
            </g>
          </g>
        )}
      </g>

      {/* Canvas Natural Vertical Creases Layer (Over Logo) */}
      <g className="pointer-events-none" style={{ mixBlendMode: 'multiply' }}>
        <path d="M225,234 Q230,380 220,530 Q226,380 225,234 Z" fill="#000000" opacity="0.14" />
        <path d="M375,234 Q370,380 380,530 Q374,380 375,234 Z" fill="#000000" opacity="0.14" />
        <path d="M295,250 Q305,400 300,520 Q302,400 295,250 Z" fill="#000000" opacity="0.08" />
      </g>
    </svg>
  );
};
