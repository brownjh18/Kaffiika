import React, { useState } from 'react';
import {
  Calculator,
  Scale,
  ShoppingBag,
  CheckCircle2,
  Info,
  ArrowRight,
} from 'lucide-react';
import { RATION_PRESETS, Product } from '../data/kaffiikaData';

interface RationCalculatorProps {
  products: Product[];
  onAddMultipleToQuote: (items: { product: Product; quantity: number }[]) => void;
}

export const RationCalculator: React.FC<RationCalculatorProps> = ({
  products,
  onAddMultipleToQuote,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(RATION_PRESETS[0].id);
  const [batchWeightKg, setBatchWeightKg] = useState<number>(1000);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  const activePreset =
    RATION_PRESETS.find((r) => r.id === selectedPresetId) || RATION_PRESETS[0];

  const multiplier = batchWeightKg / 100;

  const kaffiikaItemsRequired = activePreset.ingredientsPer100Kg
    .filter((ing) => ing.isKaffiikaProduct && ing.productId)
    .map((ing) => {
      const product =
        products.find((p) => p.id === ing.productId) || products[0];
      const totalKgNeeded = ing.kg * multiplier;
      const bagsNeeded = Math.max(1, Math.ceil(totalKgNeeded / product.weightKg));
      const subtotalUgx = bagsNeeded * product.priceUgx;
      return {
        ingredientName: ing.name,
        product,
        totalKgNeeded,
        bagsNeeded,
        subtotalUgx,
      };
    });

  const totalKaffiikaCostUgx = kaffiikaItemsRequired.reduce(
    (sum, item) => sum + item.subtotalUgx,
    0
  );

  const handleAddCalculatedBags = () => {
    onAddMultipleToQuote(
      kaffiikaItemsRequired.map((item) => ({
        product: item.product,
        quantity: item.bagsNeeded,
      }))
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2600);
  };

  return (
    <section className="py-14 bg-[#F4F7FB]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Formula Selector & Batch Size */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-sky-200 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#065AA7]/10 text-[#065AA7] text-xs font-bold uppercase tracking-wider mb-4">
              <Calculator className="w-3.5 h-3.5" />
              Step 1: Select Livestock Formula
            </div>
            <div className="space-y-2.5 mb-7">
              {RATION_PRESETS.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#061A36] text-white border-[#065AA7] shadow-md'
                        : 'bg-[#F4F7FB] text-[#0A1E3C] border-sky-200 hover:border-[#065AA7]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-mono-tech font-bold px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#F59E0B] text-[#061A36]'
                              : 'bg-[#065AA7]/15 text-[#065AA7]'
                          }`}
                        >
                          {preset.species}
                        </span>
                        <span className="font-bold text-sm">{preset.title}</span>
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          isSelected ? 'text-sky-200' : 'text-slate-500'
                        }`}
                      >
                        {preset.stage}
                      </p>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-[#F59E0B] translate-x-0.5' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Batch Weight Selector */}
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Step 2: Target Feed Batch Weight (KG)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[250, 500, 1000, 2000].map((wt) => (
                <button
                  key={wt}
                  type="button"
                  onClick={() => setBatchWeightKg(wt)}
                  className={`py-2.5 px-3 rounded-lg font-mono-tech text-xs font-bold border transition-all cursor-pointer ${
                    batchWeightKg === wt
                      ? 'bg-[#065AA7] text-white border-[#065AA7]'
                      : 'bg-[#F4F7FB] text-[#0A1E3C] border-sky-200 hover:border-[#065AA7]'
                  }`}
                >
                  {wt >= 1000 ? `${wt / 1000} Ton (${wt}kg)` : `${wt} kg`}
                </button>
              ))}
            </div>

            <div className="bg-[#F4F7FB] p-4 rounded-xl border border-sky-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#065AA7]" />
                  Custom Batch Weight:
                </span>
                <span className="font-mono-tech font-bold text-lg text-[#065AA7]">
                  {batchWeightKg.toLocaleString()} kg
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={50}
                value={batchWeightKg}
                onChange={(e) => setBatchWeightKg(Number(e.target.value))}
                className="w-full accent-[#065AA7] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono-tech text-slate-500 mt-1">
                <span>100 kg</span>
                <span>1,000 kg (1 Ton)</span>
                <span>5,000 kg (5 Tons)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Formula Breakdown & Kaffiika Bag Cost */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-sky-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-sky-100">
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
                  {activePreset.concentrateCode} • {activePreset.concentrateRatioPct}% INCLUSION FORMULA
                </span>
                <h3 className="text-2xl font-bold text-[#0A1E3C] mt-0.5">
                  {activePreset.title}
                </h3>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#E6EFF8] border border-sky-200 text-right">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Target Benchmark
                </div>
                <div className="text-xs font-mono-tech font-bold text-[#065AA7]">
                  {activePreset.expectedFcrOrYield}
                </div>
              </div>
            </div>

            {/* Ingredient Mixing Table */}
            <div className="mb-7">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                <span>Raw Material / Kaffiika Concentrate</span>
                <span>Required for {batchWeightKg.toLocaleString()} kg Mix</span>
              </div>

              <div className="space-y-3">
                {activePreset.ingredientsPer100Kg.map((ing, idx) => {
                  const totalKg = Math.round(ing.kg * multiplier * 10) / 10;
                  const linkedProduct = ing.productId
                    ? products.find((p) => p.id === ing.productId)
                    : undefined;
                  const bagsCount = linkedProduct
                    ? Math.ceil(totalKg / linkedProduct.weightKg)
                    : null;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        ing.isKaffiikaProduct
                          ? 'bg-[#F4F7FB] border-[#065AA7]/40 shadow-2xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              ing.isKaffiikaProduct ? 'bg-[#065AA7]' : 'bg-[#F59E0B]'
                            }`}
                          />
                          <span className="font-bold text-sm text-[#0A1E3C]">
                            {ing.name}
                          </span>
                          {ing.isKaffiikaProduct && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#065AA7] text-white">
                              Kaffiika Stock
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono-tech text-slate-500">
                            ({ing.kg}%)
                          </span>
                          <span className="font-mono-tech font-bold text-base text-[#0A1E3C]">
                            {totalKg.toLocaleString()} kg
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-sky-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            ing.isKaffiikaProduct ? 'bg-[#065AA7]' : 'bg-[#F59E0B]'
                          }`}
                          style={{ width: `${ing.kg}%` }}
                        />
                      </div>

                      {linkedProduct && bagsCount && (
                        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-sky-200/70">
                          <span className="flex items-center gap-2">
                            <img
                              src={linkedProduct.imageUrl}
                              alt={linkedProduct.name}
                              className="w-6 h-6 rounded object-cover border border-sky-200"
                            />
                            <span>
                              Packaged in{' '}
                              <strong className="font-mono-tech text-[#0A1E3C]">
                                {linkedProduct.units}
                              </strong>{' '}
                              @ UGX {linkedProduct.priceUgx.toLocaleString()}/bag
                            </span>
                          </span>
                          <span className="font-mono-tech font-bold text-[#065AA7]">
                            = {bagsCount} {bagsCount === 1 ? 'bag' : 'bags'} (UGX{' '}
                            {(bagsCount * linkedProduct.priceUgx).toLocaleString()})
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200 text-[#061A36] text-xs leading-relaxed mb-6">
              <Info className="w-4 h-4 text-[#065AA7] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Kaffiika Nutritionist Tip:</strong>{' '}
                {activePreset.notes}
              </div>
            </div>

            {/* Bottom Summary Bar with Direct Add-to-Quote */}
            <div className="p-5 rounded-xl bg-[#061A36] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-sky-200 uppercase tracking-wider font-semibold">
                  Kaffiika Store Items for {batchWeightKg.toLocaleString()} kg Batch
                </div>
                <div className="text-2xl font-mono-tech font-bold text-[#F59E0B] mt-0.5">
                  UGX {totalKaffiikaCostUgx.toLocaleString()}
                </div>
                <div className="text-xs text-sky-100 mt-0.5">
                  Includes{' '}
                  {kaffiikaItemsRequired
                    .map((i) => `${i.bagsNeeded}× ${i.product.code}`)
                    .join(' + ')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCalculatedBags}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-[#065AA7] hover:bg-[#0284C7] text-white shadow-lg transition-all cursor-pointer shrink-0 border border-sky-400/30"
              >
                {addedFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
                    Added Bags to Quote!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                    Add Calculated Bags to Quote
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
