import React from 'react';
import { COMPANY_INFO, PageRoute } from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface Props { onNavigate: (page: PageRoute) => void; }

export const DeliveryPolicyPage: React.FC<Props> = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#F4F7FB]">
    <PageHeaderBanner title="Delivery & Pickup Policy" subtitle="Information about order confirmation, head office pickup, delivery, and returns." currentPage="delivery-policy.html" badgeText="LEGAL & TRUST" onNavigate={onNavigate} />
    <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="bg-white rounded-2xl border border-sky-200 shadow-xs p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <p><strong>Last updated:</strong> November 25, 2026</p>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Order Confirmation</h2><p>Quote requests submitted online are reviewed by our team. We confirm product availability, pricing, pickup/delivery timing, and payment details before dispatch.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Pickup</h2><p>Head office pickup is available at {COMPANY_INFO.headquarters}. Please confirm pickup time with our team before travel.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Delivery</h2><p>Delivery availability, cost, and timelines depend on location, order size, and logistics scheduling. Delivery terms are confirmed during order processing.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Returns & Issues</h2><p>Inspect products at pickup/delivery. Report damaged, incorrect, or quality concerns immediately with your order reference and photos where possible. Returns or replacements are handled case-by-case according to product condition and confirmation records.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Contact</h2><p>For delivery or order support: {COMPANY_INFO.primaryPhone} | {COMPANY_INFO.email}</p></section>
      </div>
    </div>
  </div>
);
