import React from 'react';
import { COMPANY_INFO, PageRoute } from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface Props { onNavigate: (page: PageRoute) => void; }

export const TermsPage: React.FC<Props> = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#F4F7FB]">
    <PageHeaderBanner title="Terms & Conditions" subtitle="Terms governing use of the Kaffiika Animal Feeds website and quote requests." currentPage="/terms" badgeText="LEGAL & TRUST" onNavigate={onNavigate} />
    <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="bg-white rounded-2xl border border-sky-200 shadow-xs p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <p><strong>Last updated:</strong> November 25, 2026</p>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Website Use</h2><p>By using this website, you agree to use it lawfully and not to misuse forms, content, or systems. Content is provided for general information and product guidance.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Product & Pricing Information</h2><p>Product availability, specifications, and prices are subject to change without notice. A quote request submitted through this website is not a binding contract until confirmed by {COMPANY_INFO.name}.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Feeding Guidance</h2><p>Feeding guides and calculator outputs are informational tools. Actual rations should be adjusted based on animal condition, local raw material quality, veterinary advice, and on-farm performance.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Orders & Payments</h2><p>Orders, delivery arrangements, and payments are confirmed directly by our team. Accepted payment methods may vary by transaction and should be confirmed with our head office.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Contact</h2><p>For questions about these terms, contact {COMPANY_INFO.name} at {COMPANY_INFO.headquarters}, {COMPANY_INFO.primaryPhone}, or {COMPANY_INFO.email}.</p></section>
      </div>
    </div>
  </div>
);
