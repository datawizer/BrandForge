import React from 'react';
import { MockupConfig, ProductType, PlacementPreset, BlendMode } from '../../types/mockup';
import { PRODUCTS } from '../../data/mockupData';
import { getPlacementPreset, recommendBlendMode } from '../../utils/mockupMath';
import {
  Coffee,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sliders,
  Palette,
  Crosshair,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

interface MockupControlsProps {
  config: MockupConfig;
  onChangeConfig: (updates: Partial<MockupConfig>) => void;
}

export const MockupControls: React.FC<MockupControlsProps> = ({ config, onChangeConfig }) => {
  const currentProduct = PRODUCTS.find((p) => p.id === config.productType) || PRODUCTS[0];

  const handleProductChange = (type: ProductType) => {
    const targetProduct = PRODUCTS.find((p) => p.id === type) || PRODUCTS[0];
    const recommendedBlend = recommendBlendMode(targetProduct.defaultColor);
    const defaultCoords = getPlacementPreset('center', type);

    onChangeConfig({
      productType: type,
      productColor: targetProduct.defaultColor,
      blendMode: recommendedBlend,
      logoScale: defaultCoords.scale,
      logoX: defaultCoords.x,
      logoY: defaultCoords.y,
      logoRotation: 0,
    });
  };

  const handleColorChange = (hex: string) => {
    const recommendedBlend = recommendBlendMode(hex);
    onChangeConfig({
      productColor: hex,
      blendMode: recommendedBlend,
    });
  };

  const handlePresetSelect = (preset: PlacementPreset) => {
    const coords = getPlacementPreset(preset, config.productType);
    onChangeConfig({
      logoX: coords.x,
      logoY: coords.y,
      logoScale: coords.scale,
      logoRotation: 0,
    });
  };

  const getProductIcon = (id: ProductType) => {
    switch (id) {
      case 'mug':
        return <Coffee className="w-4 h-4" />;
      case 'tshirt':
        return <Shirt className="w-4 h-4" />;
      case 'hoodie':
        return <Shirt className="w-4 h-4" />;
      case 'totebag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'cap':
        return <Sliders className="w-4 h-4" />;
      case 'phonecase':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Shirt className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Product Selection Grid */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          Select Product
        </label>

        <div className="grid grid-cols-3 gap-2">
          {PRODUCTS.map((prod) => {
            const isSelected = config.productType === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => handleProductChange(prod.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500/80 text-white shadow-md shadow-sky-500/10'
                    : 'bg-neutral-950/70 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
                aria-label={`Select ${prod.name}`}
              >
                <div className={`mb-1.5 ${isSelected ? 'text-sky-400' : 'text-neutral-400'}`}>
                  {getProductIcon(prod.id)}
                </div>
                <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                  {prod.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-neutral-500 capitalize">
                  {prod.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Color Palette */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-sky-400" />
            Product Color
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 font-mono">
              {config.productColor.toUpperCase()}
            </span>
            <input
              type="color"
              value={config.productColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Custom Color Picker"
              aria-label="Pick custom product color"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentProduct.palette.map((color) => {
            const isSelected = config.productColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.hex)}
                className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-neutral-800 text-white font-medium shadow-sm'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/70 text-neutral-400'
                }`}
                title={color.name}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-neutral-600/60 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[11px]">{color.name}</span>
                {isSelected && <Check className="w-3 h-3 text-sky-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Placement Presets */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-sky-400" />
          Placement Presets
        </label>

        <div className="grid grid-cols-4 gap-1.5 text-xs">
          <button
            onClick={() => handlePresetSelect('center')}
            className="px-2 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-medium transition-colors text-center"
          >
            Center
          </button>
          <button
            onClick={() => handlePresetSelect('pocket')}
            className="px-2 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-medium transition-colors text-center"
          >
            Pocket
          </button>
          <button
            onClick={() => handlePresetSelect('large')}
            className="px-2 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-medium transition-colors text-center"
          >
            Large
          </button>
          <button
            onClick={() => handlePresetSelect('wrap')}
            className="px-2 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-medium transition-colors text-center"
          >
            Wrap
          </button>
        </div>
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          Transform & Print Settings
        </label>

        {/* Scale Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Scale</span>
            <span className="font-mono text-neutral-300">{Math.round(config.logoScale * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2.2"
            step="0.05"
            value={config.logoScale}
            onChange={(e) => onChangeConfig({ logoScale: parseFloat(e.target.value) })}
            className="accent-sky-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            aria-label="Logo scale"
          />
        </div>

        {/* Rotation Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Rotation</span>
            <span className="font-mono text-neutral-300">{config.logoRotation}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={config.logoRotation}
            onChange={(e) => onChangeConfig({ logoRotation: parseInt(e.target.value, 10) })}
            className="accent-sky-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            aria-label="Logo rotation"
          />
        </div>

        {/* Opacity Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Print Opacity</span>
            <span className="font-mono text-neutral-300">{config.logoOpacity}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={config.logoOpacity}
            onChange={(e) => onChangeConfig({ logoOpacity: parseInt(e.target.value, 10) })}
            className="accent-sky-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            aria-label="Logo opacity"
          />
        </div>

        {/* Blend Mode Selector */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Ink Blend Mode</span>
            <span className="text-[10px] text-sky-400 font-medium capitalize">{config.blendMode}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(['multiply', 'normal', 'screen', 'overlay'] as BlendMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeConfig({ blendMode: mode })}
                className={`py-1 rounded-md text-[11px] capitalize font-medium border transition-colors ${
                  config.blendMode === mode
                    ? 'bg-sky-500/20 border-sky-500/60 text-sky-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
