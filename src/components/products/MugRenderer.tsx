import React from 'react';
import { MockupConfig } from '../../types/mockup';
import { computeCylindricalTransform } from '../../utils/mockupMath';

interface MugRendererProps {
  config: MockupConfig;
  isInteractive?: boolean;
  onLogoDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const MugRenderer: React.FC<MugRendererProps> = ({ config, isInteractive = true, onLogoDragStart }) => {
  const { productColor, logoUrl, logoScale, logoX, logoY, logoRotation, logoOpacity, blendMode, invertLogo } = config;

  // Calculate cylindrical curvature perspective
  const { scaleX, skewY, opacityMultiplier } = computeCylindricalTransform(logoX, logoScale);

  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft studio floor shadow */}
        <radialGradient id="mugFloorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Ceramic 3D cylindrical lighting gradient */}
        <linearGradient id="mugCylinderLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
          <stop offset="15%" stopColor="#000000" stopOpacity="0.08" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="90%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.42" />
        </linearGradient>

        {/* Glossy ceramic specular reflection strip */}
        <linearGradient id="mugSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Mug rim interior depth */}
        <linearGradient id="mugInteriorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1b18" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#451a03" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0.7" />
        </linearGradient>

        {/* Clip path for mug body to confine logos */}
        <clipPath id="mugBodyClip">
          <path d="M190,170 C190,162 205,155 300,155 C395,155 410,162 410,170 L395,470 C395,495 360,505 300,505 C240,505 205,495 205,470 Z" />
        </clipPath>
      </defs>

      {/* Studio Shadow */}
      <ellipse cx="300" cy="510" rx="160" ry="26" fill="url(#mugFloorShadow)" />
      <ellipse cx="290" cy="505" rx="110" ry="16" fill="#000000" opacity="0.3" />

      {/* Handle Behind Mug Base */}
      <g id="mugHandle">
        <path
          d="M400,210 C485,210 500,270 495,330 C490,385 450,420 388,430"
          fill="none"
          stroke={productColor}
          strokeWidth="36"
          strokeLinecap="round"
        />
        {/* Handle inner shadow and highlight */}
        <path
          d="M400,210 C485,210 500,270 495,330 C490,385 450,420 388,430"
          fill="none"
          stroke="#000000"
          strokeWidth="36"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path
          d="M402,216 C475,218 488,272 485,325 C480,375 446,410 395,420"
          fill="none"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>

      {/* Mug Body Base Fill */}
      <path
        d="M190,170 C190,162 205,155 300,155 C395,155 410,162 410,170 L395,470 C395,495 360,505 300,505 C240,505 205,495 205,470 Z"
        fill={productColor}
      />

      {/* Mug Interior Top Opening (Coffee Liquid & Rim) */}
      <ellipse cx="300" cy="170" rx="110" ry="24" fill={productColor} />
      <ellipse cx="300" cy="170" rx="104" ry="20" fill="url(#mugInteriorGradient)" />
      <ellipse cx="300" cy="172" rx="98" ry="16" fill="#2d1305" opacity="0.95" />
      <ellipse cx="295" cy="170" rx="70" ry="10" fill="#451a03" opacity="0.6" />

      {/* Ceramic Shading Layer */}
      <path
        d="M190,170 C190,162 205,155 300,155 C395,155 410,162 410,170 L395,470 C395,495 360,505 300,505 C240,505 205,495 205,470 Z"
        fill="url(#mugCylinderLight)"
      />

      {/* Logo Placement Container inside Mug Clip */}
      <g clipPath="url(#mugBodyClip)">
        {logoUrl && (
          <g
            transform={`translate(${300 + (logoX * 1.5)}, ${320 + (logoY * 1.5)}) rotate(${logoRotation})`}
            style={{
              cursor: isInteractive ? 'move' : 'default',
            }}
            onMouseDown={onLogoDragStart}
            onTouchStart={onLogoDragStart}
          >
            <g
              transform={`scale(${scaleX}, ${logoScale}) skewY(${skewY})`}
              style={{
                mixBlendMode: blendMode,
                opacity: (logoOpacity / 100) * opacityMultiplier,
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

      {/* Specular Highlight Sheen (Layered Over Logo) */}
      <path
        d="M190,170 C190,162 205,155 300,155 C395,155 410,162 410,170 L395,470 C395,495 360,505 300,505 C240,505 205,495 205,470 Z"
        fill="url(#mugSpecular)"
        className="pointer-events-none"
      />

      {/* Ceramic Rim Highlight Stroke */}
      <ellipse
        cx="300"
        cy="170"
        rx="110"
        ry="24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        opacity="0.4"
        className="pointer-events-none"
      />
      {/* Bottom Rim Highlight */}
      <path
        d="M210,470 C240,495 360,495 390,470"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.25"
        className="pointer-events-none"
      />
    </svg>
  );
};
