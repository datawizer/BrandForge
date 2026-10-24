import React, { useRef, useState, useEffect } from 'react';
import { MockupConfig, ProductType } from '../../types/mockup';
import { MugRenderer } from './MugRenderer';
import { TShirtRenderer } from './TShirtRenderer';
import { HoodieRenderer } from './HoodieRenderer';
import { ToteBagRenderer } from './ToteBagRenderer';
import { CapRenderer } from './CapRenderer';
import { PhoneCaseRenderer } from './PhoneCaseRenderer';
import {
  Download,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Move,
  Eye,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { clamp } from '../../utils/mockupMath';

interface ProductCanvasProps {
  config: MockupConfig;
  onChangeConfig: (newConfig: Partial<MockupConfig>) => void;
  onOpenAIStudio: () => void;
}

export type StudioBackground = 'neutral-dark' | 'studio-white' | 'warm-oak' | 'slate-gradient';

export const ProductCanvas: React.FC<ProductCanvasProps> = ({
  config,
  onChangeConfig,
  onOpenAIStudio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [background, setBackground] = useState<StudioBackground>('neutral-dark');
  const [showHandles, setShowHandles] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; initialX: number; initialY: number } | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Mouse / Touch Dragging Logic
  const handleLogoDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({
      x: clientX,
      y: clientY,
      initialX: config.logoX,
      initialY: config.logoY,
    });
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragStart || !containerRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = (clientX - dragStart.x) / (1.5 * zoom);
      const deltaY = (clientY - dragStart.y) / (1.5 * zoom);

      onChangeConfig({
        logoX: Math.round(clamp(dragStart.initialX + deltaX, -70, 70)),
        logoY: Math.round(clamp(dragStart.initialY + deltaY, -70, 70)),
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragStart, zoom, onChangeConfig]);

  // Export high-resolution PNG
  const handleExportPNG = async () => {
    if (!svgWrapperRef.current) return;
    setIsExporting(true);

    try {
      const svgElement = svgWrapperRef.current.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const targetSize = 2000;
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Fill background matching studio backdrop
      if (background === 'studio-white') {
        ctx.fillStyle = '#ffffff';
      } else if (background === 'warm-oak') {
        ctx.fillStyle = '#1c1917';
      } else if (background === 'slate-gradient') {
        ctx.fillStyle = '#0f172a';
      } else {
        ctx.fillStyle = '#0a0a0a';
      }
      ctx.fillRect(0, 0, targetSize, targetSize);

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, targetSize, targetSize);
        URL.revokeObjectURL(blobURL);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${config.productType}-mockup-brandforge.png`;
        downloadLink.href = pngUrl;
        downloadLink.click();
        setIsExporting(false);
      };

      img.src = blobURL;
    } catch (err) {
      console.error('Failed to export mockup:', err);
      setIsExporting(false);
    }
  };

  // Render product specific SVG
  const renderProduct = () => {
    switch (config.productType) {
      case 'mug':
        return <MugRenderer config={config} onLogoDragStart={handleLogoDragStart} />;
      case 'tshirt':
        return <TShirtRenderer config={config} onLogoDragStart={handleLogoDragStart} />;
      case 'hoodie':
        return <HoodieRenderer config={config} onLogoDragStart={handleLogoDragStart} />;
      case 'totebag':
        return <ToteBagRenderer config={config} onLogoDragStart={handleLogoDragStart} />;
      case 'cap':
        return <CapRenderer config={config} onLogoDragStart={handleLogoDragStart} />;
      case 'phonecase':
        return <PhoneCaseRenderer config={config} onLogoDragStart={handleLogoDragStart} />;
      default:
        return <MugRenderer config={config} onLogoDragStart={handleLogoDragStart} />;
    }
  };

  // Background styling
  const getBgClass = () => {
    switch (background) {
      case 'studio-white':
        return 'bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300';
      case 'warm-oak':
        return 'bg-gradient-to-b from-stone-900 via-stone-950 to-neutral-950';
      case 'slate-gradient':
        return 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/60';
      case 'neutral-dark':
      default:
        return 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-black';
    }
  };

  return (
    <div className="relative flex flex-col flex-1 h-full min-h-[500px] overflow-hidden bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl">
      {/* Stage Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Studio Viewport
          </span>
          <span className="text-xs text-neutral-500">|</span>
          <span className="text-xs text-neutral-300 font-medium capitalize">
            {config.productType} Mockup
          </span>
        </div>

        {/* Backdrop presets & view controls */}
        <div className="flex items-center gap-2">
          {/* Backdrop switcher */}
          <div className="hidden sm:flex items-center bg-neutral-800/80 p-0.5 rounded-lg border border-neutral-700/60 text-xs">
            <button
              onClick={() => setBackground('neutral-dark')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                background === 'neutral-dark' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Dark Studio Backdrop"
            >
              Dark Studio
            </button>
            <button
              onClick={() => setBackground('studio-white')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                background === 'studio-white' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Bright Studio Backdrop"
            >
              Bright
            </button>
            <button
              onClick={() => setBackground('slate-gradient')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                background === 'slate-gradient' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Deep Slate Backdrop"
            >
              Slate
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-neutral-800/80 rounded-lg border border-neutral-700/60 p-0.5 text-xs text-neutral-300">
            <button
              onClick={() => setZoom((z) => clamp(z - 0.15, 0.6, 2.2))}
              className="p-1.5 hover:text-white transition-colors"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-mono min-w-[34px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => clamp(z + 0.15, 0.6, 2.2))}
              className="p-1.5 hover:text-white transition-colors"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* AI Studio Trigger Button */}
          <button
            onClick={onOpenAIStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-semibold text-xs rounded-lg transition-all shadow-md shadow-orange-500/20 active:scale-95"
            aria-label="Open AI Generation & Editing Studio"
          >
            <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
            <span>AI Studio</span>
          </button>

          {/* Export PNG */}
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:bg-neutral-800 text-white font-medium text-xs rounded-lg transition-all shadow-md shadow-sky-600/20 active:scale-95"
            aria-label="Download High-Res PNG Mockup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export 2K'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div
        ref={containerRef}
        className={`relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none transition-colors duration-500 ${getBgClass()}`}
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Center Mockup Container */}
        <div
          ref={svgWrapperRef}
          style={{
            transform: `scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            transformOrigin: 'center center',
          }}
          className="relative w-full max-w-[540px] aspect-square flex items-center justify-center transition-transform"
        >
          {renderProduct()}
        </div>

        {/* Floating Interactive Drag Helper Badge (hidden on mobile to prevent overlap) */}
        <div className="hidden md:flex absolute bottom-4 left-4 items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-700/50 text-[11px] text-neutral-400 pointer-events-none">
          <Move className="w-3 h-3 text-sky-400 animate-pulse" />
          <span>Click & drag logo directly on mockup to position</span>
        </div>

        {/* Quick Position Reset Floating Pill */}
        {(config.logoX !== 0 || config.logoY !== 0 || config.logoRotation !== 0) && (
          <button
            onClick={() => onChangeConfig({ logoX: 0, logoY: 0, logoRotation: 0 })}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-xs px-3 py-1.5 rounded-full border border-neutral-700 shadow-lg transition-all z-10"
            aria-label="Center logo on product"
          >
            <RotateCw className="w-3 h-3" />
            <span>Center Logo</span>
          </button>
        )}
      </div>
    </div>
  );
};
