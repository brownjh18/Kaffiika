import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShoppingBag,
  MessageCircle,
  Scale,
  Tag,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';
import { Product, COMPANY_INFO } from '../data/kaffiikaData';
import { FeedBagVisual } from './FeedBagVisual';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToQuote,
}) => {
  const [quantity, setQuantity] = useState<number>(5);

  if (!product) return null;

  const pricePerKg = Math.round(product.priceUgx / product.weightKg);
  const lineTotalUgx = product.priceUgx * quantity;

  const handleAdd = () => {
    onAddToQuote(product, quantity);
    onClose();
  };

  const whatsappText = encodeURIComponent(
    `Hello Kaffiika Animal Feeds, I would like to order:\n• ${quantity} × ${product.name} (${product.code} - ${product.units}) @ UGX ${product.priceUgx.toLocaleString()} each\nEstimated Total: UGX ${lineTotalUgx.toLocaleString()}\nPlease advise on branch pickup or delivery.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A36]/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-[#F4F7FB] text-[#0A1E3C] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-sky-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#061A36] text-white sticky top-0 z-20 border-b border-sky-400/20">
          <div className="flex items-center gap-2.5">
            <span className="font-mono-tech text-xs font-bold px-2.5 py-0.5 rounded bg-[#065AA7] text-white border border-sky-400/30">
              CODE: {product.code}
            </span>
            <span className="text-xs text-sky-200 font-medium">
              {product.brand} Official Specification Sheet
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-7">
          {/* Left Column: Extracted Product Photo & Price Card (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="h-64 rounded-2xl overflow-hidden border border-sky-200 shadow-md">
              <FeedBagVisual product={product} size="lg" />
            </div>

            <div className="bg-[#E6EFF8] p-4 rounded-xl border border-sky-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Scale className="w-3.5 h-3.5 text-[#065AA7]" />
                  Unit Packaging:
                </span>
                <span className="font-mono-tech font-bold text-[#0A1E3C]">
                  {product.units} ({product.weightKg} kg)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Tag className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Official Unit Price:
                </span>
                <span className="font-mono-tech font-bold text-base text-[#065AA7]">
                  UGX {product.priceUgx.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-sky-200">
                <span>Cost per Kilogram:</span>
                <span className="font-mono-tech font-semibold text-[#0A1E3C]">
                  ~UGX {pricePerKg.toLocaleString()} / kg
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Details & Ordering (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#065AA7]/15 text-[#065AA7]">
                  {product.category}
                </span>
                <span className="text-xs font-mono-tech font-semibold px-2.5 py-0.5 rounded-full bg-[#E6EFF8] text-slate-700">
                  {product.feedType}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C]">
                {product.name}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mt-2.5">
                {product.summary}
              </p>

              {/* Spec Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
                <div className="p-3.5 rounded-xl bg-white border border-sky-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Target Growth Stage
                  </div>
                  <div className="text-xs font-bold text-[#0A1E3C] mt-1">
                    {product.targetStage}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-sky-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Inclusion / Dosage Rate
                  </div>
                  <div className="text-xs font-mono-tech font-bold text-[#065AA7] mt-1">
                    {product.inclusionOrDosage}
                  </div>
                </div>
              </div>

              {/* Mixing Tip if available */}
              {product.mixingTip && (
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-300 text-[#061A36] text-xs mb-5">
                  <div className="font-bold flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#065AA7]" />
                    Standard 100kg On-Farm Mixing Formula:
                  </div>
                  <p className="font-mono-tech">{product.mixingTip}</p>
                </div>
              )}

              {/* Benefits */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#0A1E3C] mb-2">
                  Nutritional & Economic Benefits
                </div>
                <ul className="space-y-1.5">
                  {product.benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-[#0A1E3C] font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#065AA7] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity & Add to Quote Box */}
            <div className="pt-4 border-t border-sky-200">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Quantity (Bags):
                  </span>
                  <div className="inline-flex items-center rounded-xl bg-white border border-sky-300">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-[#0A1E3C] hover:bg-[#E6EFF8] rounded-l-xl cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="w-14 text-center font-mono-tech text-sm font-bold text-[#0A1E3C] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 text-[#0A1E3C] hover:bg-[#E6EFF8] rounded-r-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">
                    Subtotal ({quantity * product.weightKg} kg total):
                  </span>
                  <span className="font-mono-tech text-lg font-bold text-[#065AA7]">
                    UGX {lineTotalUgx.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add {quantity} {quantity === 1 ? 'Bag' : 'Bags'} to Quote
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.primaryPhoneClean}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#061A36] font-bold text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order Direct via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
