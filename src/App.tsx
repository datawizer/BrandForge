/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MockupConfig, ProductType } from './types/mockup';
import { PRODUCTS, SAMPLE_LOGOS } from './data/mockupData';
import { ProductCanvas } from './components/products/ProductCanvas';
import { MultiProductPreview } from './components/products/MultiProductPreview';
import { LogoUploader } from './components/controls/LogoUploader';
import { MockupControls } from './components/controls/MockupControls';
import { AIStudioModal } from './components/ai/AIStudioModal';
import {
  Sparkles,
  Layers,
  LayoutGrid,
  Maximize2,
  Download,
  Info,
  Check,
  Coffee,
  Shirt,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'studio' | 'collection'>('studio');
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  // Core Mockup State
  const [config, setConfig] = useState<MockupConfig>({
    productType: 'mug',
    productColor: '#f8fafc',
    logoUrl: SAMPLE_LOGOS[0].svgDataUri,
    logoScale: 1.0,
    logoX: 0,
    logoY: 2,
    logoRotation: 0,
    logoOpacity: 100,
    blendMode: 'multiply',
    displacementDepth: 50,
    lightingHighlight: 70,
    shadowIntensity: 60,
    invertLogo: false,
    monochromeColor: null,
  });

  const handleUpdateConfig = (updates: Partial<MockupConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectProduct = (type: ProductType) => {
    const targetProduct = PRODUCTS.find((p) => p.id === type) || PRODUCTS[0];
    handleUpdateConfig({
      productType: type,
      productColor: targetProduct.defaultColor,
    });
    setViewMode('studio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                BrandForge
              </h1>
              <span className="hidden xs:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Mockup Studio
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Photorealistic product branding on mugs, apparel & merch
            </p>
          </div>
        </div>

        {/* View Switcher: Studio vs Collection */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 sm:p-1 rounded-xl text-xs shrink-0">
          <button
            onClick={() => setViewMode('studio')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'studio'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio View</span>
            <span className="sm:hidden text-[11px]">Studio</span>
          </button>
          <button
            onClick={() => setViewMode('collection')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'collection'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collection Grid</span>
            <span className="sm:hidden text-[11px]">Grid</span>
          </button>
        </div>

        {/* Right Action: AI Studio Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            aria-label="Open Gemini AI Generation Studio"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-neutral-950" />
            <span className="hidden sm:inline">AI Image Studio</span>
            <span className="sm:hidden text-[11px]">AI</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20 flex flex-col gap-6">
        {viewMode === 'studio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar Controls (4 columns on lg) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
              <LogoUploader
                config={config}
                onChangeConfig={handleUpdateConfig}
                onOpenAIStudio={() => setIsAIModalOpen(true)}
              />

              <MockupControls
                config={config}
                onChangeConfig={handleUpdateConfig}
              />
            </div>

            {/* Right Center Mockup Stage (7-8 columns on lg) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 order-1 lg:order-2 sticky lg:top-24">
              <ProductCanvas
                config={config}
                onChangeConfig={handleUpdateConfig}
                onOpenAIStudio={() => setIsAIModalOpen(true)}
              />
            </div>
          </div>
        ) : (
          /* Collection Grid View */
          <div className="flex flex-col gap-6">
            <MultiProductPreview
              config={config}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        )}
      </main>

      {/* AI Image Generation & Editing Modal */}
      <AIStudioModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentLogoUrl={config.logoUrl}
        onApplyLogo={(newLogo) => {
          handleUpdateConfig({ logoUrl: newLogo });
        }}
      />
    </div>
  );
}
