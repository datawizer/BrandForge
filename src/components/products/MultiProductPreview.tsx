import React from 'react';
import { MockupConfig, ProductType } from '../../types/mockup';
import { PRODUCTS } from '../../data/mockupData';
import { MugRenderer } from './MugRenderer';
import { TShirtRenderer } from './TShirtRenderer';
import { HoodieRenderer } from './HoodieRenderer';
import { ToteBagRenderer } from './ToteBagRenderer';
import { CapRenderer } from './CapRenderer';
import { PhoneCaseRenderer } from './PhoneCaseRenderer';
import { ArrowUpRight, Check } from 'lucide-react';
import { recommendBlendMode } from '../../utils/mockupMath';

interface MultiProductPreviewProps {
  config: MockupConfig;
  onSelectProduct: (type: ProductType) => void;
}

export const MultiProductPreview: React.FC<MultiProductPreviewProps> = ({
  config,
  onSelectProduct,
}) => {
  const renderItemMockup = (prodType: ProductType, defaultColor: string) => {
    const itemConfig: MockupConfig = {
      ...config,
      productType: prodType,
      productColor: config.productType === prodType ? config.productColor : defaultColor,
      blendMode: config.productType === prodType ? config.blendMode : recommendBlendMode(defaultColor),
    };

    switch (prodType) {
      case 'mug':
        return <MugRenderer config={itemConfig} isInteractive={false} />;
      case 'tshirt':
        return <TShirtRenderer config={itemConfig} isInteractive={false} />;
      case 'hoodie':
        return <HoodieRenderer config={itemConfig} isInteractive={false} />;
      case 'totebag':
        return <ToteBagRenderer config={itemConfig} isInteractive={false} />;
      case 'cap':
        return <CapRenderer config={itemConfig} isInteractive={false} />;
      case 'phonecase':
        return <PhoneCaseRenderer config={itemConfig} isInteractive={false} />;
      default:
        return <MugRenderer config={itemConfig} isInteractive={false} />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-100">Merchandise Collection Preview</h2>
          <p className="text-xs text-neutral-400">
            See your logo across all 6 products simultaneously. Click any product to customize in the studio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map((prod) => {
          const isActive = config.productType === prod.id;
          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod.id)}
              className={`group relative flex flex-col bg-neutral-900/90 border rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl ${
                isActive
                  ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-sky-500/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-neutral-800/80 bg-neutral-950/40">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-200 group-hover:text-sky-400 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-[10px] text-neutral-500 capitalize">{prod.category}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 group-hover:text-sky-400">
                  <span className="text-[10px] hidden group-hover:inline">Customize</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Mockup Canvas Visual */}
              <div className="relative aspect-square p-6 flex items-center justify-center bg-gradient-to-b from-neutral-900/80 via-neutral-950 to-black">
                <div className="w-full h-full flex items-center justify-center">
                  {renderItemMockup(prod.id, prod.defaultColor)}
                </div>
              </div>

              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-3 right-3 bg-sky-500 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  Active
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
