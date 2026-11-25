import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Send,
  Clock,
  Building2,
} from 'lucide-react';
import {
  COMPANY_INFO,
  KAFFIIKA_ASSETS,
  PageRoute,
} from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Wholesale Feed Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Website Inquiry] ${form.subject}`);
    const body = encodeURIComponent(
      `Name/Farm: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}\n\nSent from Kaffiika Animal Feeds website`
    );
    window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <PageHeaderBanner
        title="Contact Us — Kaffiika Animal Feeds"
        subtitle={`Reach our Headoffice at ${COMPANY_INFO.headquarters} or connect with our technical & wholesale sales desk.`}
        currentPage="contact.html"
        badgeText="HEADQUARTERS & FARMER SUPPORT DESK"
        onNavigate={onNavigate}
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Cards & Payment Methods (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-sky-200 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
                  MAIN OFFICES & DISPATCH
                </span>
                <h2 className="text-2xl font-bold text-[#0A1E3C] mt-1">
                  Headquarters Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F4F7FB] border border-sky-200">
                  <div className="w-10 h-10 rounded-xl bg-[#065AA7] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-500">
                      Main Offices Address
                    </div>
                    <div className="text-sm font-bold text-[#0A1E3C] mt-0.5">
                      Kaffiika Animal Feeds Main Offices.
                      <br />
                      {COMPANY_INFO.headquarters}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F4F7FB] border border-sky-200">
                  <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-500">
                      Phone / WhatsApp Hotline
                    </div>
                    <a
                      href={`tel:${COMPANY_INFO.primaryPhone}`}
                      className="text-base font-mono-tech font-bold text-[#065AA7] hover:underline mt-0.5 block"
                    >
                      {COMPANY_INFO.primaryPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F4F7FB] border border-sky-200">
                  <div className="w-10 h-10 rounded-xl bg-[#061A36] text-[#F59E0B] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-500">
                      Official Email
                    </div>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-sm font-mono-tech font-bold text-[#0A1E3C] hover:text-[#065AA7] mt-0.5 block"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F4F7FB] border border-sky-200">
                  <div className="w-10 h-10 rounded-xl bg-[#E6EFF8] text-[#065AA7] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-500">
                      Operating Hours
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#0A1E3C] mt-0.5">
                      Monday – Saturday: 7:30 AM – 6:30 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accepted Payment Methods from kaffiikafeeds.com */}
            <div className="bg-white rounded-2xl p-6 border border-sky-200 shadow-xs">
              <div className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold mb-3">
                ACCEPTED PAYMENT OPTIONS AT OUR HEAD OFFICE
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="px-4 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 flex items-center gap-2">
                  <img
                    src={KAFFIIKA_ASSETS.payments.mtn}
                    alt="MTN Mobile Money"
                    className="h-8 object-contain"
                  />
                  <span className="text-xs font-bold text-[#0A1E3C]">
                    MTN MoMo
                  </span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 flex items-center gap-2">
                  <img
                    src={KAFFIIKA_ASSETS.payments.airtel}
                    alt="Airtel Money"
                    className="h-8 object-contain"
                  />
                  <span className="text-xs font-bold text-[#0A1E3C]">
                    Airtel Money
                  </span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 flex items-center gap-2">
                  <img
                    src={KAFFIIKA_ASSETS.payments.visa}
                    alt="Visa"
                    className="h-8 object-contain"
                  />
                  <span className="text-xs font-bold text-[#0A1E3C]">
                    Visa / Bank
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-sky-100">
                <a
                  href="#/branches.html"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('branches.html');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#065AA7] hover:underline"
                >
                  <Building2 className="w-4 h-4" />
                  <span>View Head Office Details</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Inquiry & Technical Support Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-9 border border-sky-200 shadow-xs">
            <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
              SEND US A MESSAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C] mt-1">
              Request Wholesale Pricing, Distributorship or Farm Advisory
            </h2>
            <p className="text-sm text-slate-600 mt-2 mb-6">
              Fill out the form below and our Kampala Head Office or nearest regional
              sales manager will respond promptly.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#F4F7FB] border border-[#065AA7]/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#065AA7] mx-auto" />
                <h3 className="text-xl font-bold text-[#0A1E3C]">
                  Message Sent to Kaffiika Animal Feeds!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{form.name}</strong>. Our sales & technical support
                  team will reach out to you on{' '}
                  <strong className="font-mono-tech">{form.phone}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#065AA7] text-white text-xs font-bold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Your Name / Farm Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Kintu Isaac"
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm focus:outline-none focus:border-[#065AA7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +256 755 247149"
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech focus:outline-none focus:border-[#065AA7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. farmer@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm focus:outline-none focus:border-[#065AA7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-medium focus:outline-none focus:border-[#065AA7]"
                    >
                      <option>Wholesale Feed Inquiry</option>
                      <option>On-Farm Ration Formulation Support</option>
                      <option>Become a Kaffiika Agent / Distributor</option>
                      <option>Book Poultry & Piggery Farmer Training</option>
                      <option>General Customer Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Message / Feed Requirements *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your flock/herd size, feed products needed, and your district..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm focus:outline-none focus:border-[#065AA7]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Kaffiika Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
