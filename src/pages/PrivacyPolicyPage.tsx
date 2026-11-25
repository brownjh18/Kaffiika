import React from 'react';
import { COMPANY_INFO, PageRoute } from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface Props { onNavigate: (page: PageRoute) => void; }

export const PrivacyPolicyPage: React.FC<Props> = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#F4F7FB]">
    <PageHeaderBanner title="Privacy Policy" subtitle="How Kaffiika Animal Feeds collects, uses, and protects your information." currentPage="privacy-policy.html" badgeText="LEGAL & TRUST" onNavigate={onNavigate} />
    <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="bg-white rounded-2xl border border-sky-200 shadow-xs p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <p><strong>Last updated:</strong> November 25, 2026</p>
        <p>{COMPANY_INFO.name} ("we", "us") respects your privacy. This policy explains what information we collect when you use our website, request a quote, or contact us.</p>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Information We Collect</h2><ul className="list-disc pl-5 space-y-1"><li>Contact details you submit: name, phone/WhatsApp number, email, farm/location, and message.</li><li>Quote/order request details: selected products, quantities, pickup/delivery preference, and branch/head office selection.</li><li>Basic technical data: browser/device information and usage data collected by hosting/analytics tools if enabled.</li></ul></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">How We Use Information</h2><ul className="list-disc pl-5 space-y-1"><li>To respond to inquiries, prepare quotes, and coordinate orders or pickups.</li><li>To provide product, feeding, and technical support.</li><li>To improve website performance, services, and customer experience.</li></ul></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Sharing & Storage</h2><p>We do not sell personal information. Information may be shared only with service providers needed to operate the website or communications (e.g., hosting, email, analytics) or when required by law. Quote data stored in your browser local storage remains on your device until cleared.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Your Choices</h2><p>You may request access, correction, or deletion of personal information you have submitted by contacting us.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-bold text-[#0A1E3C]">Contact</h2><p>{COMPANY_INFO.name}<br/>{COMPANY_INFO.headquarters}<br/>Tel: {COMPANY_INFO.primaryPhone}<br/>Email: {COMPANY_INFO.email}</p></section>
      </div>
    </div>
  </div>
);
