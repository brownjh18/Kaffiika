import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
  MapPin,
  Scale,
  Send,
} from 'lucide-react';
import {
  Product,
  Branch,
  COMPANY_INFO,
  CustomerOrder,
} from '../data/kaffiikaData';

export interface QuoteItem {
  product: Product;
  quantity: number;
}

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  branches: Branch[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearItems: () => void;
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  onCreateOrder: (order: CustomerOrder) => void;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  items,
  branches,
  onUpdateQuantity,
  onRemoveItem,
  onClearItems,
  selectedBranchId,
  onSelectBranch,
  onCreateOrder,
}) => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'Branch Pickup' | 'Farm Delivery'>(
    'Branch Pickup'
  );
  const [submittedOrderRef, setSubmittedOrderRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedBranch =
    branches.find((b) => b.id === selectedBranchId) || branches[0];

  const totalBags = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeightKg = items.reduce(
    (sum, item) => sum + item.quantity * item.product.weightKg,
    0
  );
  const totalAmountUgx = items.reduce(
    (sum, item) => sum + item.quantity * item.product.priceUgx,
    0
  );

  const buildWhatsAppUrl = () => {
    const rawBranchPhone = selectedBranch.phones[0].replace(/\D/g, '');
    const targetPhone = rawBranchPhone.startsWith('0')
      ? '256' + rawBranchPhone.slice(1)
      : rawBranchPhone.length >= 10
      ? rawBranchPhone
      : COMPANY_INFO.primaryPhoneClean;

    const lines = [
      `*KAFFIIKA ANIMAL FEEDS — FARM ORDER / QUOTE*`,
      `Branch: ${selectedBranch.name} (${selectedBranch.manager})`,
      `Fulfillment: ${deliveryMode}`,
      farmerName ? `Farmer/Farm: ${farmerName}` : '',
      farmerPhone ? `Contact: ${farmerPhone}` : '',
      ``,
      `*Ordered Feed Bags:*`,
      ...items.map(
        (item, idx) =>
          `${idx + 1}. ${item.quantity}× ${item.product.name} (${item.product.code}, ${
            item.product.units
          }) — UGX ${(item.quantity * item.product.priceUgx).toLocaleString()}`
      ),
      ``,
      `*Total Bags:* ${totalBags} bags (${totalWeightKg.toLocaleString()} kg)`,
      `*Estimated Total:* UGX ${totalAmountUgx.toLocaleString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(lines)}`;
  };

  const handleProformaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `KAF-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      reference: ref,
      customerName: farmerName.trim() || 'Walk-in / Online Farmer',
      customerPhone: farmerPhone.trim() || '+256 782 478 743',
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      deliveryMode,
      createdAt: dateStr,
      status: 'Pending',
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productCode: i.product.code,
        units: i.product.units,
        quantity: i.quantity,
        unitPriceUgx: i.product.priceUgx,
      })),
      totalBags,
      totalWeightKg,
      totalAmountUgx,
    };

    onCreateOrder(newOrder);
    setSubmittedOrderRef(ref);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#061A36]/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#F4F7FB] text-[#0A1E3C] h-full flex flex-col shadow-2xl border-l border-sky-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#061A36] text-white flex items-center justify-between border-b border-sky-400/20">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#F59E0B]" />
            <div>
              <h3 className="font-bold text-base">
                Farm Feed Order & Wholesale Quote
              </h3>
              <p className="text-xs text-sky-200 font-mono-tech">
                {totalBags} {totalBags === 1 ? 'bag' : 'bags'} •{' '}
                {totalWeightKg.toLocaleString()} kg total
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submittedOrderRef ? (
            <div className="bg-white rounded-2xl p-6 border border-[#065AA7]/30 text-center space-y-4 my-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-sky-100 text-[#065AA7] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="font-mono-tech text-xs font-bold px-3 py-1 rounded-full bg-[#E6EFF8] text-[#065AA7]">
                PROFORMA REF: {submittedOrderRef}
              </span>
              <h4 className="text-2xl font-bold text-[#0A1E3C]">
                Order Logged for {selectedBranch.name}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Thank you{farmerName ? `, ${farmerName}` : ''}! Your feed order of{' '}
                <strong>
                  {totalBags} bags ({totalWeightKg.toLocaleString()} kg)
                </strong>{' '}
                totaling{' '}
                <strong className="font-mono-tech text-[#065AA7]">
                  UGX {totalAmountUgx.toLocaleString()}
                </strong>{' '}
                has been recorded in the Kaffiika Admin System and assigned to{' '}
                <strong>
                  {selectedBranch.name} ({selectedBranch.manager})
                </strong>
                .
              </p>
              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Instant Copy via WhatsApp to Branch
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedOrderRef(null);
                    onClearItems();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#E6EFF8] text-[#0A1E3C] text-xs font-bold cursor-pointer"
                >
                  Start a New Quote
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E6EFF8] text-[#065AA7] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#0A1E3C] mb-2">
                Your Feed Quote List is Empty
              </h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto mb-6">
                Browse our 46 Kaffiika & Koudijs feed products or use the On-Farm Ration
                Calculator to add bags to your order.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#065AA7] text-white text-sm font-bold cursor-pointer"
              >
                Explore Feed Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Selected Products ({items.length})</span>
                  <button
                    type="button"
                    onClick={onClearItems}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-sky-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-tech text-[11px] font-bold px-2 py-0.5 rounded bg-[#E6EFF8] text-[#065AA7]">
                            {product.code}
                          </span>
                          <span className="text-xs font-mono-tech text-slate-500">
                            {product.units}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-[#0A1E3C] truncate mt-0.5">
                          {product.name}
                        </h5>
                        <div className="font-mono-tech text-xs font-semibold text-[#065AA7]">
                          UGX {product.priceUgx.toLocaleString()} / bag
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center rounded-lg bg-[#E6EFF8] border border-sky-200">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(product.id, Math.max(1, quantity - 1))
                          }
                          className="p-1.5 text-[#0A1E3C] hover:bg-white rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono-tech text-xs font-bold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="p-1.5 text-[#0A1E3C] hover:bg-white rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Branch Selection */}
              <div className="bg-[#E6EFF8] p-4 rounded-xl border border-sky-200 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1E3C]">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#065AA7]" />
                  Select Nearest Kaffiika Branch for Dispatch
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => onSelectBranch(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-sky-300 text-sm font-medium text-[#0A1E3C]"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.manager} ({b.phones[0]})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('Branch Pickup')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer ${
                      deliveryMode === 'Branch Pickup'
                        ? 'bg-[#065AA7] text-white border-[#065AA7]'
                        : 'bg-white text-[#0A1E3C] border-sky-200'
                    }`}
                  >
                    Branch Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('Farm Delivery')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer ${
                      deliveryMode === 'Farm Delivery'
                        ? 'bg-[#065AA7] text-white border-[#065AA7]'
                        : 'bg-white text-[#0A1E3C] border-sky-200'
                    }`}
                  >
                    Farm Delivery
                  </button>
                </div>
              </div>

              {/* Farmer Details Form */}
              <form onSubmit={handleProformaSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Farmer or Farm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Kintu Isaac / GreenAcres Poultry Farm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sky-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="e.g. +256 772 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sky-300 text-sm font-mono-tech"
                  />
                </div>

                {/* Totals Card */}
                <div className="p-4 rounded-xl bg-[#061A36] text-white space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-sky-200">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Total Tonnage / Weight:
                    </span>
                    <span className="font-mono-tech font-bold text-white">
                      {totalWeightKg.toLocaleString()} kg ({totalBags} bags)
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/15">
                    <span className="text-xs uppercase tracking-wider text-sky-200 font-bold">
                      Estimated Total:
                    </span>
                    <span className="font-mono-tech text-xl font-bold text-[#F59E0B]">
                      UGX {totalAmountUgx.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Order & Generate Proforma Quote
                  </button>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#061A36] font-bold text-sm shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Order to {selectedBranch.name} on WhatsApp
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
