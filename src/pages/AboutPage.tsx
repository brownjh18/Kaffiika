import React from 'react';
import {
  Award,
  Target,
  Eye,
  HeartHandshake,
  Mail,
  Phone,
  Users,
  ArrowRight,
} from 'lucide-react';
import {
  COMPANY_INFO,
  KAFFIIKA_ASSETS,
  TeamMember,
  PageRoute,
} from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface AboutPageProps {
  team: TeamMember[];
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ team, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <PageHeaderBanner
        title="About Us — Kaffiika Animal Feeds"
        subtitle="Kaffiika Animal Feeds has been in the Poultry and Animal Feeds business in Uganda and active poultry keeping since the year 2006."
        currentPage="/about"
        badgeText="HERITAGE, MISSION, VISION & LEADERSHIP TEAM"
        onNavigate={onNavigate}
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Story + Mission/Vision/Values */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#065AA7]/10 border border-[#065AA7]/25 text-[#065AA7] text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Active in Uganda Since {COMPANY_INFO.foundedYear}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1E3C] leading-tight">
              Empowering Ugandan Farmers with Customized Feeding Solutions
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              {COMPANY_INFO.story}
            </p>

            {/* Strategic Partner Box */}
            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-xs flex flex-col sm:flex-row items-center gap-5">
              <img
                src={KAFFIIKA_ASSETS.koudijsLogo}
                alt="Koudijs Animal Nutrition"
                className="w-28 h-20 object-contain shrink-0 border border-sky-100 rounded-xl p-2 bg-white"
              />
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
                  OUR MAIN PARTNER
                </span>
                <h3 className="text-lg font-bold text-[#0A1E3C]">
                  Main Suppliers of Koudijs Products in Uganda
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Through our partnership with Koudijs Animal Nutrition, we supply
                  scientifically formulated concentrates, Galdus prestarter pellets, and
                  extruded fish feeds from our Kampala head office.
                </p>
              </div>
            </div>
          </div>

          {/* Mission, Vision, Values Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#065AA7] text-white flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
                  MISSION
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#0A1E3C] mt-1 leading-relaxed">
                  {COMPANY_INFO.mission}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-wider text-[#0284C7] font-bold">
                  VISION
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#0A1E3C] mt-1 leading-relaxed">
                  {COMPANY_INFO.vision}
                </p>
              </div>
            </div>

            <div className="bg-[#061A36] text-white p-6 rounded-2xl border border-sky-400/25 shadow-md flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F59E0B] text-[#061A36] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-wider text-[#F59E0B] font-bold">
                  VALUES
                </span>
                <p className="text-sm sm:text-base font-semibold text-white mt-1 leading-relaxed">
                  {COMPANY_INFO.values}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Team with Extracted Photos */}
        <div className="pt-10 border-t border-sky-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#065AA7] mb-2">
                <Users className="w-4 h-4" />
                Executive & Sales Leadership
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1E3C]">
                Meet Our Team
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Connect directly with our directors and sales managers for wholesale
              distribution, technical ration support, and farm consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden border border-sky-200 hover:border-[#065AA7] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Real Extracted Team Member Photo from https://kaffiikafeeds.com/about */}
                  <div className="h-64 bg-[#E6EFF8] relative overflow-hidden">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061A36]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 px-3 py-1 rounded-md bg-[#065AA7] text-white font-mono-tech text-xs font-bold border border-white/20">
                      {member.role}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0A1E3C]">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-sky-100 space-y-2 text-xs">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-[#0A1E3C] hover:text-[#065AA7] font-mono-tech truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#065AA7] shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </a>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {member.phones.map((phone, i) => (
                      <a
                        key={i}
                        href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E6EFF8] hover:bg-[#065AA7] hover:text-white text-[#065AA7] font-mono-tech font-semibold transition-colors"
                      >
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA to Branches & Products */}
        <div className="bg-[#061A36] text-white rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to Partner with Kaffiika Animal Feeds?
            </h3>
            <p className="text-sky-200 text-sm sm:text-base mt-1">
              Explore our 46 specialized livestock & fish feeds or visit any of our 33
              branches across Uganda.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="/products"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/products');
              }}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#065AA7] hover:bg-[#0284C7] text-white font-bold text-sm"
            >
              <span>View Products</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/branches"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/branches');
              }}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#061A36] font-bold text-sm"
            >
              <span>View Branches</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
