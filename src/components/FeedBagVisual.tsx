import React from 'react';
import { Product, KAFFIIKA_ASSETS } from '../data/kaffiikaData';

interface FeedBagVisualProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}

const CATEGORY_BLUE_THEME: Record<
  Product['category'],
  {
    badgeBg: string;
    badgeText: string;
    sealBg: string;
    label: string;
  }
> = {
  Chicks: {
    badgeBg: 'bg-[#065AA7] border-sky-300/40',
    badgeText: 'text-white',
    sealBg: '#0284C7',
    label: 'CHICK PRESTARTER',
  },
  Broilers: {
    badgeBg: 'bg-[#0A2E5C] border-blue-300/40',
    badgeText: 'text-white',
    sealBg: '#065AA7',
    label: 'BROILER CONCENTRATE',
  },
  Layers: {
    badgeBg: 'bg-[#065AA7] border-sky-300/40',
    badgeText: 'text-white',
    sealBg: '#1D4ED8',
    label: 'LAYER NUTRITION',
  },
  Piggery: {
    badgeBg: 'bg-[#0F3D7A] border-blue-300/40',
    badgeText: 'text-white',
    sealBg: '#0369A1',
    label: 'PIGGERY CONCENTRATE',
  },
  Dairy: {
    badgeBg: 'bg-[#1E3A8A] border-indigo-300/40',
    badgeText: 'text-white',
    sealBg: '#1D4ED8',
    label: 'DAIRY & RUMINANTS',
  },
  Fish: {
    badgeBg: 'bg-[#0369A1] border-cyan-300/40',
    badgeText: 'text-white',
    sealBg: '#0284C7',
    label: 'AQUACULTURE FEED',
  },
  'Speciality Products': {
    badgeBg: 'bg-[#1E293B] border-slate-400/40',
    badgeText: 'text-white',
    sealBg: '#065AA7',
    label: 'SPECIALITY / ADDITIVE',
  },
};

export const FeedBagVisual: React.FC<FeedBagVisualProps> = ({ product }) => {
  const theme = CATEGORY_BLUE_THEME[product.category];

  return (
    <div className="relative w-full h-full overflow-hidden select-none group bg-[#E6EFF8]">
      {/* Exact Extracted Product Image from https://kaffiikafeeds.com/ */}
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            KAFFIIKA_ASSETS.productUploads.default;
        }}
        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
      />

      {/* Subtle Bottom Blue Gradient so text & spec badges are always legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#061A36]/90 via-[#061A36]/20 to-black/15" />

      {/* Top Row: Category Pill & Bag Weight Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
        <span
          className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md border shadow-xs ${theme.badgeBg} ${theme.badgeText}`}
        >
          {product.category}
        </span>
        <span className="font-mono-tech text-xs font-bold px-2.5 py-1 rounded-md bg-[#F59E0B] text-[#071A33] shadow-sm">
          {product.units}
        </span>
      </div>

      {/* Bottom Row: Official Koudijs/Kaffiika Code Seal & Spec */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#065AA7]/95 text-white font-mono-tech text-[11px] font-bold border border-white/20 mb-1 shadow-xs">
            <span>{product.code}</span>
          </div>
          <p className="text-[11px] font-medium text-sky-100 truncate">
            {product.keySpec}
          </p>
        </div>

        {/* Brand / Stock Status Mini Seal */}
        <div className="shrink-0 text-right">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
              product.stockStatus === 'Out of Stock'
                ? 'bg-rose-600 text-white'
                : product.stockStatus === 'Low Stock'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500/90 text-white'
            }`}
          >
            {product.stockStatus || 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};
