import React, { useRef, useState } from 'react';
import { MockupConfig, SampleLogo } from '../../types/mockup';
import { SAMPLE_LOGOS } from '../../data/mockupData';
import {
  Upload,
  Image as ImageIcon,
  RotateCw,
  SunMoon,
  Trash2,
  Check,
  Sparkles,
  Sliders
} from 'lucide-react';

interface LogoUploaderProps {
  config: MockupConfig;
  onChangeConfig: (updates: Partial<MockupConfig>) => void;
  onOpenAIStudio: () => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  config,
  onChangeConfig,
  onOpenAIStudio,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, SVG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChangeConfig({ logoUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
          Brand Logo
        </label>
        <button
          onClick={onOpenAIStudio}
          className="text-[11px] font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
        >
          <Sparkles className="w-3 h-3" />
          Generate with AI
        </button>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDraggingFile
            ? 'border-sky-500 bg-sky-500/10'
            : 'border-neutral-700/80 hover:border-neutral-600 bg-neutral-950/50 hover:bg-neutral-950/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 shadow-inner">
            <Upload className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-200">
              Click to upload or drag & drop
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              PNG (transparent recommended), SVG, JPG, WebP
            </p>
          </div>
        </div>
      </div>

      {/* Current Logo Preview & Quick Filters */}
      {config.logoUrl && (
        <div className="flex items-center gap-3 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
          <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1 overflow-hidden shrink-0">
            <img
              src={config.logoUrl}
              alt="Uploaded brand logo preview"
              referrerPolicy="no-referrer"
              className={`max-w-full max-h-full object-contain ${
                config.invertLogo ? 'filter invert' : ''
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-200 truncate">
              Active Brand Logo
            </p>
            <p className="text-[10px] text-neutral-500">
              Placed dynamically onto mockups
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeConfig({ invertLogo: !config.invertLogo })}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                config.invertLogo
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white border-neutral-700'
              }`}
              title="Invert logo colors (light/dark)"
              aria-label="Invert logo colors"
            >
              <SunMoon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeConfig({ logoScale: 1, logoRotation: 0, logoX: 0, logoY: 0 })}
              className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
              title="Reset position & scale"
              aria-label="Reset logo transform"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sample Logos Picker */}
      <div>
        <p className="text-[11px] font-medium text-neutral-400 mb-2">
          Or try sample curated brand marks:
        </p>
        <div className="grid grid-cols-5 gap-2">
          {SAMPLE_LOGOS.map((sample) => {
            const isSelected = config.logoUrl === sample.svgDataUri;
            return (
              <button
                key={sample.id}
                onClick={() => onChangeConfig({ logoUrl: sample.svgDataUri })}
                className={`relative group aspect-square rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'ring-2 ring-sky-500 bg-sky-950/50 border border-sky-500/80 shadow-md'
                    : 'bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700/60'
                }`}
                title={`${sample.name} (${sample.category})`}
                aria-label={`Select sample logo ${sample.name}`}
              >
                <div className="w-full h-full flex items-center justify-center rounded-lg bg-neutral-900/60 p-1">
                  <img
                    src={sample.svgDataUri}
                    alt={sample.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-neutral-950 flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
