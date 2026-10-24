import React from 'react';
import { MockupConfig } from '../../types/mockup';

interface HoodieRendererProps {
  config: MockupConfig;
  isInteractive?: boolean;
  onLogoDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const HoodieRenderer: React.FC<HoodieRendererProps> = ({ config, isInteractive = true, onLogoDragStart }) => {
  const { productColor, logoUrl, logoScale, logoX, logoY, logoRotation, logoOpacity, blendMode, invertLogo } = config;

  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="hoodieFloorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="hoodieDepth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        <clipPath id="hoodieChestClip">
          <path d="M190,160 L140,240 L80,210 L120,130 L210,110 C240,140 360,140 390,110 L480,130 L520,210 L460,240 L410,160 L425,520 C425,525 415,530 300,530 C185,530 175,525 175,520 Z" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="300" cy="535" rx="195" ry="26" fill="url(#hoodieFloorShadow)" />

      {/* Main Body Silhouette */}
      <path
        d="M210,110 C240,140 360,140 390,110 L480,130 L520,210 L460,240 L410,160 L425,520 C425,525 415,530 300,530 C185,530 175,525 175,520 L190,160 L140,240 L80,210 L120,130 Z"
        fill={productColor}
      />
      <path
        d="M210,110 C240,140 360,140 390,110 L480,130 L520,210 L460,240 L410,160 L425,520 C425,525 415,530 300,530 C185,530 175,525 175,520 L190,160 L140,240 L80,210 L120,130 Z"
        fill="url(#hoodieDepth)"
      />

      {/* Hood Structure */}
      {/* Hood Back Interior */}
      <path
        d="M210,110 C200,40 250,25 300,25 C350,25 400,40 390,110 C360,140 240,140 210,110 Z"
        fill="#000000"
        opacity="0.35"
      />
      {/* Hood Left and Right Outer Folds */}
      <path
        d="M205,115 C190,50 245,30 295,30 C270,55 250,90 245,150 C230,140 215,130 205,115 Z"
        fill={productColor}
      />
      <path
        d="M395,115 C410,50 355,30 305,30 C330,55 350,90 355,150 C370,140 385,130 395,115 Z"
        fill={productColor}
      />
      <path
        d="M205,115 C190,50 245,30 295,30 C270,55 250,90 245,150 C230,140 215,130 205,115 Z"
        fill="#ffffff"
        opacity="0.1"
      />
      <path
        d="M395,115 C410,50 355,30 305,30 C330,55 350,90 355,150 C370,140 385,130 395,115 Z"
        fill="#000000"
        opacity="0.18"
      />

      {/* Hood Drawstrings */}
      {/* Metal eyelets */}
      <circle cx="265" cy="148" r="4.5" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
      <circle cx="335" cy="148" r="4.5" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
      {/* Left String */}
      <path
        d="M265,152 Q260,200 255,230"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="252" y="228" width="6" height="12" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
      {/* Right String */}
      <path
        d="M335,152 Q342,195 348,225"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="345" y="223" width="6" height="12" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />

      {/* Logo Placement Container inside Chest Clip */}
      <g clipPath="url(#hoodieChestClip)">
        {logoUrl && (
          <g
            transform={`translate(${300 + (logoX * 1.5)}, ${255 + (logoY * 1.5)}) rotate(${logoRotation})`}
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
                x="-85"
                y="-85"
                width="170"
                height="170"
                preserveAspectRatio="xMidYMid meet"
                className="pointer-events-auto"
              />
            </g>
          </g>
        )}
      </g>

      {/* Kangaroo Pocket */}
      <path
        d="M220,380 L380,380 L415,485 L185,485 Z"
        fill={productColor}
        stroke="#000000"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      <path
        d="M220,380 L380,380 L415,485 L185,485 Z"
        fill="#000000"
        opacity="0.08"
      />
      {/* Pocket slant entries */}
      <path d="M220,380 L185,485" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" />
      <path d="M380,380 L415,485" stroke="#000000" strokeWidth="2" opacity="0.3" />

      {/* Ribbed Bottom Waistband */}
      <rect x="175" y="505" width="250" height="25" rx="3" fill="#000000" opacity="0.12" />
      <path d="M175,505 L425,505" stroke="#000000" strokeWidth="2" opacity="0.2" />

      {/* Realistic Fleece Wrinkles Layer (Over Logo) */}
      <g className="pointer-events-none" style={{ mixBlendMode: 'multiply' }}>
        <path d="M190,195 Q235,230 270,245 Q230,230 190,215 Z" fill="#000000" opacity="0.16" />
        <path d="M410,195 Q365,230 330,245 Q370,230 410,215 Z" fill="#000000" opacity="0.16" />
        <path d="M225,320 Q300,345 375,320 Q300,335 225,320 Z" fill="#000000" opacity="0.12" />
      </g>
    </svg>
  );
};
