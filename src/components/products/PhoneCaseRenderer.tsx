import React from 'react';
import { MockupConfig } from '../../types/mockup';

interface PhoneCaseRendererProps {
  config: MockupConfig;
  isInteractive?: boolean;
  onLogoDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const PhoneCaseRenderer: React.FC<PhoneCaseRendererProps> = ({ config, isInteractive = true, onLogoDragStart }) => {
  const { productColor, logoUrl, logoScale, logoX, logoY, logoRotation, logoOpacity, blendMode, invertLogo } = config;

  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="caseShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="caseSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>

        <clipPath id="caseBackClip">
          <rect x="200" y="80" width="200" height="420" rx="38" />
        </clipPath>
      </defs>

      {/* Floor Shadow */}
      <ellipse cx="300" cy="515" rx="130" ry="20" fill="url(#caseShadow)" />

      {/* Bumper Outer Rim */}
      <rect x="196" y="76" width="208" height="428" rx="42" fill="#09090b" opacity="0.85" />

      {/* Phone Case Back Plate */}
      <rect x="200" y="80" width="200" height="420" rx="38" fill={productColor} />
      <rect x="200" y="80" width="200" height="420" rx="38" fill="url(#caseSheen)" />

      {/* Camera Bump Island */}
      <g id="cameraIsland">
        <rect x="220" y="100" width="70" height="74" rx="18" fill="#18181b" stroke="#27272a" strokeWidth="2" />
        {/* Triple Lens Module */}
        <circle cx="242" cy="120" r="11" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
        <circle cx="242" cy="120" r="6" fill="#1e1b4b" />
        <circle cx="240" cy="118" r="2.5" fill="#38bdf8" opacity="0.6" />

        <circle cx="242" cy="154" r="11" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
        <circle cx="242" cy="154" r="6" fill="#1e1b4b" />
        <circle cx="240" cy="152" r="2.5" fill="#38bdf8" opacity="0.6" />

        <circle cx="268" cy="137" r="11" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
        <circle cx="268" cy="137" r="6" fill="#1e1b4b" />
        <circle cx="266" cy="135" r="2.5" fill="#38bdf8" opacity="0.6" />

        {/* Flash & LiDAR sensor */}
        <circle cx="268" cy="114" r="4" fill="#fef08a" opacity="0.9" />
        <circle cx="268" cy="160" r="2.5" fill="#09090b" />
      </g>

      {/* Logo in Phone Case Back Clip */}
      <g clipPath="url(#caseBackClip)">
        {logoUrl && (
          <g
            transform={`translate(${300 + (logoX * 1.5)}, ${320 + (logoY * 1.8)}) rotate(${logoRotation})`}
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

      {/* Outer Case Bevel Highlight */}
      <rect
        x="201"
        y="81"
        width="198"
        height="418"
        rx="37"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.25"
        className="pointer-events-none"
      />
    </svg>
  );
};
