import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Layers,
  Award,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import { SPECIES_GUIDES, Product } from '../data/kaffiikaData';

interface SpeciesProgramsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  initialSpeciesId?: string;
}

export const SpeciesPrograms: React.FC<SpeciesProgramsProps> = ({
  products,
  onSelectProduct,
  initialSpeciesId,
}) => {
  const [activeGuideId, setActiveGuideId] = useState<string>(
    initialSpeciesId || SPECIES_GUIDES[0].id
  );

  const activeGuide =
    SPECIES_GUIDES.find((g) => g.id === activeGuideId) || SPECIES_GUIDES[0];

  const handleProductBadgeClick = (codeOrName: string) => {
    const match = products.find(
      (p) =>
        p.code.toLowerCase() === codeOrName.toLowerCase() ||
        p.name.toLowerCase() === codeOrName.toLowerCase()
    );
    if (match) {
      onSelectProduct(match);
    }
  };

  return (
    <section className="py-14 bg-blue-mesh text-white relative overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Species Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {SPECIES_GUIDES.map((guide) => {
            const isActive = guide.id === activeGuideId;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => setActiveGuideId(guide.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-white text-[#0A1E3C] border-[#F59E0B] shadow-xl scale-[1.01]'
                    : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-xs font-mono-tech font-bold uppercase px-2 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#065AA7] text-white'
                        : 'bg-white/15 text-sky-200'
                    }`}
                  >
                    {guide.navSlug}
                  </span>
                  <Layers
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#065AA7]' : 'text-sky-300'
                    }`}
                  />
                </div>
                <div className="font-bold text-lg">{guide.species}</div>
                <p
                  className={`text-xs mt-1 line-clamp-2 ${
                    isActive ? 'text-slate-600' : 'text-sky-100/80'
                  }`}
                >
                  {guide.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Species Banner */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-[#F59E0B] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                KAFFIIKA TECHNICAL FARMING GUIDE • {activeGuide.navSlug.toUpperCase()}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5">
                {activeGuide.species}: {activeGuide.tagline}
              </h3>
              <p className="text-sky-100 text-base leading-relaxed mt-3">
                {activeGuide.intro}
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="relative h-48 rounded-xl overflow-hidden border border-white/25 shadow-lg">
                <img
                  src={activeGuide.heroImage}
                  alt={activeGuide.species}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A36]/90 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[#F59E0B] font-bold">
                    <Award className="w-4 h-4" />
                    Official Koudijs × Kaffiika Standard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeGuide.stages.map((stage, idx) => (
            <div
              key={stage.title}
              className="bg-white text-[#0A1E3C] rounded-2xl p-6 sm:p-7 border border-sky-200 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono-tech text-xs font-bold px-2.5 py-1 rounded-md bg-[#065AA7] text-white">
                    STAGE 0{idx + 1}
                  </span>
                  <span className="font-mono-tech text-xs font-semibold text-slate-500">
                    {stage.period}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-[#0A1E3C] mb-2.5">
                  {stage.title}
                </h4>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-[#065AA7] font-mono-tech text-xs font-bold mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
                  {stage.targetBenchmark}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {stage.description}
                </p>

                {/* Key Benefits from Kaffiika */}
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0A1E3C] mb-2.5">
                    Benefits
                  </div>
                  <ul className="space-y-2">
                    {stage.benefits.map((benefit, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2 text-xs text-[#0A1E3C] font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#065AA7] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Kaffiika Products for this Stage */}
              <div className="pt-4 border-t border-sky-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Recommended Kaffiika Products (Click to Inspect):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stage.recommendedProducts.map((prodCode) => (
                    <button
                      key={prodCode}
                      type="button"
                      onClick={() => handleProductBadgeClick(prodCode)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E6EFF8] hover:bg-[#065AA7] hover:text-white text-[#065AA7] font-mono-tech text-xs font-bold border border-sky-200 transition-colors cursor-pointer"
                    >
                      <span>{prodCode}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Instructions Panel (e.g., 7-Step Koudalac/KMR Calf Milk Preparation from kaffiikafeeds.com/ruminants) */}
        {activeGuide.extraInstructionsSteps && (
          <div className="mt-8 bg-white text-[#0A1E3C] rounded-2xl p-6 sm:p-8 border border-sky-200 shadow-lg">
            <div className="flex items-center gap-2.5 text-[#065AA7] font-bold text-sm uppercase tracking-wider mb-3">
              <ClipboardList className="w-5 h-5 text-[#F59E0B]" />
              <span>Official On-Farm Protocol</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-[#0A1E3C] mb-4">
              {activeGuide.extraInstructionsTitle}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeGuide.extraInstructionsSteps.map((step, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-xs sm:text-sm font-medium text-[#0A1E3C] flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#065AA7] shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
