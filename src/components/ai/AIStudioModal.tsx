import React, { useState } from 'react';
import { ResolutionOption } from '../../types/mockup';
import {
  Sparkles,
  Wand2,
  X,
  Loader2,
  Download,
  Check,
  AlertCircle,
  Maximize2,
  Copy,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';

interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl: string;
  onApplyLogo: (imageUrl: string) => void;
}

export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onApplyLogo,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');

  // Generation state (gemini-3-pro-image-preview)
  const [generatePrompt, setGeneratePrompt] = useState<string>(
    'A minimalist ceramic coffee mug standing on a sunlit oak table with delicate morning window shadows, ultra clean photorealistic product shot'
  );
  const [generateResolution, setGenerateResolution] = useState<ResolutionOption>('2K');
  const [generateAspectRatio, setGenerateAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '16:9'>('1:1');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateResult, setGenerateResult] = useState<{
    imageUrl: string;
    modelUsed: string;
    imageSize: string;
  } | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Edit state (gemini-nano-banana-2.1)
  const [editPrompt, setEditPrompt] = useState<string>(
    'Add realistic embroidered gold metallic thread stitch texture with subtle dimensional relief'
  );
  const [editResolution, setEditResolution] = useState<ResolutionOption>('1K');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editResult, setEditResult] = useState<{
    imageUrl: string;
    modelUsed: string;
    imageSize: string;
  } | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Execute Generation with gemini-3-pro-image-preview
  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: generatePrompt,
          imageSize: generateResolution,
          aspectRatio: generateAspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGenerateResult({
        imageUrl: data.imageUrl,
        modelUsed: data.modelUsed,
        imageSize: data.imageSize,
      });
    } catch (err: any) {
      console.error('AI generate error:', err);
      setGenerateError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Execute Edit with gemini-nano-banana-2.1
  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    setIsEditing(true);
    setEditError(null);

    try {
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt,
          imageBase64: currentLogoUrl,
          mimeType: currentLogoUrl.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png',
          imageSize: editResolution,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to edit image');
      }

      setEditResult({
        imageUrl: data.imageUrl,
        modelUsed: data.modelUsed,
        imageSize: data.imageSize,
      });
    } catch (err: any) {
      console.error('AI edit error:', err);
      setEditError(err.message || 'Image editing failed. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                AI Image & Mockup Studio
              </h2>
              <p className="text-xs text-neutral-400">
                Powered by Gemini models for high-fidelity product imagery & editing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'generate'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Images</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
              gemini-3-pro-image-preview
            </span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'edit'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Create & Edit Images</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono">
              gemini-nano-banana-2.1
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {activeTab === 'generate' ? (
            /* TAB 1: Generate Images with gemini-3-pro-image-preview */
            <div className="flex flex-col gap-4">
              {/* Image Size / Resolution Affordance (MANDATORY REQUIREMENT: 1K, 2K, 4K) */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    Resolution Affordance (Size)
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    High-Definition Render: <span className="text-amber-400 font-semibold">{generateResolution}</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ResolutionOption[]).map((res) => (
                    <button
                      key={res}
                      onClick={() => setGenerateResolution(res)}
                      className={`py-2 px-3 rounded-lg border font-mono text-xs font-bold transition-all ${
                        generateResolution === res
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/10'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                      }`}
                      aria-label={`Select ${res} resolution`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-neutral-300">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '1:1', label: '1:1 Square' },
                    { id: '3:4', label: '3:4 Portrait' },
                    { id: '4:3', label: '4:3 Standard' },
                    { id: '16:9', label: '16:9 Landscape' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setGenerateAspectRatio(ratio.id as any)}
                      className={`py-1.5 rounded-lg border text-xs transition-colors ${
                        generateAspectRatio === ratio.id
                          ? 'border-amber-500/80 bg-amber-500/15 text-amber-300 font-medium'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-neutral-300">Prompt</label>
                <textarea
                  value={generatePrompt}
                  onChange={(e) => setGeneratePrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe your desired product mockup, branding asset, or photoshoot scene..."
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500 self-center">Ideas:</span>
                  {[
                    'Minimal ceramic mug in aesthetic sunlit cafe',
                    'Oversized white cotton streetwear t-shirt mockup',
                    'Embroidered geometric logo insignia vector',
                    'Heavyweight hoodie draped on warm oak table',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setGeneratePrompt(preset)}
                      className="text-[10px] bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700/60 transition-colors truncate max-w-[280px]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {generateError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{generateError}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !generatePrompt.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating with gemini-3-pro-image-preview ({generateResolution})...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-neutral-950" />
                    <span>Generate Image ({generateResolution})</span>
                  </>
                )}
              </button>

              {/* Generated Result Preview */}
              {generateResult && (
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Generated Successfully ({generateResult.imageSize})
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {generateResult.modelUsed}
                    </span>
                  </div>

                  <div className="relative aspect-square max-h-[300px] w-full rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <img
                      src={generateResult.imageUrl}
                      alt="AI generated mockup result"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onApplyLogo(generateResult.imageUrl);
                        onClose();
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Use as Brand Logo</span>
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(
                          generateResult.imageUrl,
                          `brandforge-${generateResolution}.png`
                        )
                      }
                      className="py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Create & Edit Images with gemini-nano-banana-2.1 */
            <div className="flex flex-col gap-4">
              {/* Image Size Affordance for Editing */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                    Resolution Affordance (Size)
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    Target Resolution: <span className="text-sky-400 font-semibold">{editResolution}</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ResolutionOption[]).map((res) => (
                    <button
                      key={res}
                      onClick={() => setEditResolution(res)}
                      className={`py-2 px-3 rounded-lg border font-mono text-xs font-bold transition-all ${
                        editResolution === res
                          ? 'border-sky-500 bg-sky-500/20 text-sky-300 shadow-md shadow-sky-500/10'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Image Display */}
              <div className="flex items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div className="w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1 overflow-hidden shrink-0">
                  <img
                    src={currentLogoUrl}
                    alt="Source logo for editing"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-200">Current Logo Reference</p>
                  <p className="text-[10px] text-neutral-500">
                    gemini-nano-banana-2.1 will transform or edit this asset based on your prompt.
                  </p>
                </div>
              </div>

              {/* Edit Prompt */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Transform / Edit Instructions
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g. Add realistic embroidered golden thread, vintage distressed washed screen-print cracks..."
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                />

                {/* Ideas */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500 self-center">Ideas:</span>
                  {[
                    'Metallic gold thread embroidery stitches',
                    'Distressed vintage screen-print cracked ink',
                    '3D chrome metallic embossed bevel badge',
                    'Neon laser glow with futuristic reflections',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setEditPrompt(preset)}
                      className="text-[10px] bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700/60 transition-colors truncate max-w-[280px]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit Error */}
              {editError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{editError}</p>
                </div>
              )}

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                disabled={isEditing || !editPrompt.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all active:scale-[0.99]"
              >
                {isEditing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with gemini-nano-banana-2.1 ({editResolution})...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Create & Edit Image ({editResolution})</span>
                  </>
                )}
              </button>

              {/* Edit Result Preview */}
              {editResult && (
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Edited Successfully ({editResult.imageSize})
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {editResult.modelUsed}
                    </span>
                  </div>

                  <div className="relative aspect-square max-h-[300px] w-full rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <img
                      src={editResult.imageUrl}
                      alt="AI edited image result"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onApplyLogo(editResult.imageUrl);
                        onClose();
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Use as Brand Logo</span>
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(
                          editResult.imageUrl,
                          `brandforge-edit-${editResolution}.png`
                        )
                      }
                      className="py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
