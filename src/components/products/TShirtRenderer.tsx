import React from 'react';
import { MockupConfig } from '../../types/mockup';

interface TShirtRendererProps {
  config: MockupConfig;
  isInteractive?: boolean;
  onLogoDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const TShirtRenderer: React.FC<TShirtRendererProps> = ({ config, isInteractive = true, onLogoDragStart }) => {
  const { productColor, logoUrl, logoScale, logoX, logoY, logoRotation, logoOpacity, blendMode, invertLogo } = config;

  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft floor shadow */}
        <radialGradient id="shirtFloorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Subtle fabric depth gradient */}
        <linearGradient id="shirtLighting" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>

        {/* Clip path for T-shirt torso to constrain logo */}
        <clipPath id="shirtTorsoClip">
          <path d="M190,140 L130,225 L70,200 L115,115 L220,95 C250,118 350,118 380,95 L485,115 L530,200 L470,225 L410,140 L425,520 C425,525 415,530 300,530 C185,530 175,525 175,520 Z" />
        </clipPath>
      </defs>

      {/* Studio Floor Shadow */}
      <ellipse cx="300" cy="535" rx="190" ry="25" fill="url(#shirtFloorShadow)" />

      {/* Shirt Base Silhouette */}
      <path
        d="M220,95 C250,118 350,118 380,95 L485,115 L530,200 L470,225 L410,140 L425,520 C425,525 415,530 300,530 C185,530 175,525 175,520 L190,140 L130,225 L70,200 L115,115 Z"
        fill={productColor}
      />

      {/* Base Lighting Overlay */}
      <path
        d="M220,95 C250,118 350,118 380,95 L485,115 L530,200 L470,225 L410,140 L425,520 C425,525 415,530 300,530 C185,530 175,525 175,520 L190,140 L130,225 L70,200 L115,115 Z"
        fill="url(#shirtLighting)"
      />

      {/* Collar Inner Back Opening */}
      <path
        d="M220,95 C245,82 355,82 380,95 C350,108 250,108 220,95 Z"
        fill="#000000"
        opacity="0.3"
      />

      {/* Collar Ribbing Ring */}
      <path
        d="M220,95 C248,124 352,124 380,95 C388,103 382,112 370,122 C335,138 265,138 230,122 C218,112 212,103 220,95 Z"
        fill="#000000"
        opacity="0.12"
      />
      <path
        d="M225,98 C250,122 350,122 375,98"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* Sleeve Seams and Hemlines */}
      <path d="M190,140 Q180,180 175,220" fill="none" stroke="#000000" strokeWidth="2" opacity="0.18" />
      <path d="M410,140 Q420,180 425,220" fill="none" stroke="#000000" strokeWidth="2" opacity="0.18" />
      <path d="M72,198 L128,223" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.2" />
      <path d="M528,198 L472,223" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.2" />

      {/* Logo Placement Container inside T-Shirt Clip */}
      <g clipPath="url(#shirtTorsoClip)">
        {logoUrl && (
          <g
            transform={`translate(${300 + (logoX * 1.5)}, ${270 + (logoY * 1.5)}) rotate(${logoRotation})`}
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
                x="-95"
                y="-95"
                width="190"
                height="190"
                preserveAspectRatio="xMidYMid meet"
                className="pointer-events-auto"
              />
            </g>
          </g>
        )}
      </g>

      {/* Realistic Fabric Wrinkle Shadows Layer (Rendered OVER the Logo for photorealism) */}
      <g className="pointer-events-none" style={{ mixBlendMode: 'multiply' }}>
        {/* Chest and armpit drape wrinkles */}
        <path
          d="M175,190 Q220,230 260,260 Q210,240 175,210 Z"
          fill="#000000"
          opacity="0.14"
        />
        <path
          d="M425,190 Q380,230 340,260 Q390,240 425,210 Z"
          fill="#000000"
          opacity="0.14"
        />
        {/* Mid-torso wave ripples */}
        <path
          d="M190,320 Q240,340 300,325 Q360,340 410,320 Q350,335 300,320 Q250,335 190,320 Z"
          fill="#000000"
          opacity="0.12"
        />
        <path
          d="M185,410 Q250,430 300,415 Q350,430 415,410 Q350,425 300,410 Q250,425 185,410 Z"
          fill="#000000"
          opacity="0.1"
        />
        {/* Side flank shadows */}
        <path d="M175,220 Q195,360 175,520 Q188,360 178,220 Z" fill="#000000" opacity="0.18" />
        <path d="M425,220 Q405,360 425,520 Q412,360 422,220 Z" fill="#000000" opacity="0.18" />
      </g>

      {/* Fabric Sheen / Subtle Highlights */}
      <g className="pointer-events-none" style={{ mixBlendMode: 'screen' }}>
        <path
          d="M260,160 Q300,180 340,160 Q300,170 260,160 Z"
          fill="#ffffff"
          opacity="0.22"
        />
        <path
          d="M240,280 Q300,300 360,280 Q300,290 240,280 Z"
          fill="#ffffff"
          opacity="0.18"
        />
      </g>

      {/* Bottom Hem Stitch Line */}
      <path
        d="M178,510 C210,515 390,515 422,510"
        fill="none"
        stroke="#000000"
        strokeWidth="1.5"
        opacity="0.15"
        className="pointer-events-none"
      />
    </svg>
  );
};
