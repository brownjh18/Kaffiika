import React, { useState, useMemo } from 'react';
import {
  Phone,
  Search,
  UserCheck,
  MessageCircle,
  CheckCircle2,
  Building2,
  Navigation,
} from 'lucide-react';
import { Branch } from '../data/kaffiikaData';

interface BranchLocatorProps {
  branches: Branch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
}

const REGIONS: ('All' | Branch['region'])[] = [
  'All',
  'Kampala Metro',
  'Wakiso & Central',
  'Mukono & Eastern',
  'Masaka & Western',
];

export const BranchLocator: React.FC<BranchLocatorProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<'All' | Branch['region']>('All');
  const [focusedBranchId, setFocusedBranchId] = useState<string>(
    selectedBranchId || 'hq-kampala'
  );

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchesRegion = activeRegion === 'All' || b.region === activeRegion;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesRegion;
      const matchesSearch =
        b.name.toLowerCase().includes(q) ||
        b.manager.toLowerCase().includes(q) ||
        b.districtOrArea.toLowerCase().includes(q) ||
        b.phones.some((p) => p.toLowerCase().includes(q));
      return matchesRegion && matchesSearch;
    });
  }, [branches, activeRegion, searchQuery]);

  const focusedBranch =
    branches.find((b) => b.id === focusedBranchId) || branches[0];

  const cleanPhoneForWhatsApp = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) return '256' + digits.slice(1);
    return digits;
  };

  return (
    <section className="py-12 bg-[#F4F7FB] relative">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Region Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-sky-200 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search town, branch (e.g. Jinja, Masaka, Kajjansi) or manager..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm text-[#0A1E3C] placeholder:text-slate-400 focus:outline-none focus:border-[#065AA7]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {REGIONS.map((region) => {
              const count =
                region === 'All'
                  ? branches.length
                  : branches.filter((b) => b.region === region).length;
              const isActive = activeRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#065AA7] text-white shadow-xs'
                      : 'bg-[#F4F7FB] text-[#0A1E3C] border border-sky-200 hover:border-[#065AA7]'
                  }`}
                >
                  <span>{region}</span>
                  <span
                    className={`font-mono-tech text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#065AA7]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Stylized Uganda Corridor Map (5 columns) */}
          <div className="lg:col-span-5 bg-[#061A36] text-white rounded-2xl p-6 border border-sky-400/20 shadow-xl lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#F59E0B] font-bold">
                  UGANDA FEED CORRIDOR MAP
                </span>
                <h3 className="text-lg font-bold text-white">
                  Interactive Branch Radar ({branches.length} Branches)
                </h3>
              </div>
              <span className="text-xs font-mono-tech bg-white/10 px-2.5 py-1 rounded-md text-sky-200">
                Click any pin
              </span>
            </div>

            {/* SVG Map Canvas */}
            <div className="relative w-full aspect-[4/3] rounded-xl bg-[#041226] border border-sky-400/20 overflow-hidden mb-5">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
                <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
                <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />

                {/* Uganda Landmass Contour */}
                <path
                  d="M15 88 L12 65 L24 38 L36 16 L65 14 L86 32 L88 64 L68 78 L42 90 Z"
                  fill="rgba(6, 90, 167, 0.32)"
                  stroke="rgba(56, 189, 248, 0.55)"
                  strokeWidth="0.8"
                />

                {/* Lake Victoria Water Body */}
                <path
                  d="M42 74 Q58 68 78 72 L82 96 L38 96 Z"
                  fill="rgba(2, 132, 199, 0.25)"
                  stroke="rgba(56, 189, 248, 0.45)"
                  strokeWidth="0.6"
                />
                <text
                  x="62"
                  y="88"
                  fill="rgba(125, 211, 252, 0.65)"
                  fontSize="3.2"
                  fontFamily="JetBrains Mono, monospace"
                >
                  LAKE VICTORIA
                </text>

                {/* Major Feed Transport Highways */}
                <path
                  d="M52 66 L37 77 L22 78"
                  stroke="rgba(245, 158, 11, 0.55)"
                  strokeWidth="0.9"
                  strokeDasharray="2 1.5"
                />
                <path
                  d="M52 66 L60 65 L68 64 L73 61 L82 50"
                  stroke="rgba(245, 158, 11, 0.55)"
                  strokeWidth="0.9"
                  strokeDasharray="2 1.5"
                />
                <path
                  d="M73 61 L81 64"
                  stroke="rgba(245, 158, 11, 0.55)"
                  strokeWidth="0.9"
                  strokeDasharray="2 1.5"
                />
                <path
                  d="M52 66 L50 52"
                  stroke="rgba(245, 158, 11, 0.55)"
                  strokeWidth="0.9"
                  strokeDasharray="2 1.5"
                />
                <path
                  d="M52 66 L40 63"
                  stroke="rgba(245, 158, 11, 0.55)"
                  strokeWidth="0.9"
                  strokeDasharray="2 1.5"
                />

                <text x="16" y="72" fill="rgba(255,255,255,0.45)" fontSize="3" fontWeight="600">
                  WESTERN
                </text>
                <text x="43" y="47" fill="rgba(255,255,255,0.45)" fontSize="3" fontWeight="600">
                  CENTRAL
                </text>
                <text x="72" y="45" fill="rgba(255,255,255,0.45)" fontSize="3" fontWeight="600">
                  EASTERN
                </text>
              </svg>

              {/* Interactive Pins for Branches */}
              {branches.map((branch) => {
                const isFocused = branch.id === focusedBranch.id;
                const isSelectedPickup = branch.id === selectedBranchId;
                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setFocusedBranchId(branch.id)}
                    title={`${branch.name} (${branch.manager})`}
                    style={{
                      left: `${branch.mapCoords.x}%`,
                      top: `${branch.mapCoords.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all cursor-pointer ${
                      isFocused
                        ? 'w-5 h-5 bg-[#F59E0B] ring-4 ring-[#F59E0B]/40 z-30 scale-125'
                        : isSelectedPickup
                        ? 'w-4 h-4 bg-sky-400 ring-2 ring-white z-20'
                        : branch.isHeadquarters
                        ? 'w-4 h-4 bg-amber-400 ring-2 ring-amber-400/30 z-20'
                        : 'w-2.5 h-2.5 bg-sky-400/85 hover:bg-[#F59E0B] hover:scale-125 z-10'
                    }`}
                  />
                );
              })}
            </div>

            {/* Active Branch Spotlight Card inside Map Panel */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider px-2 py-0.5 rounded bg-[#065AA7] text-white font-bold border border-sky-400/30">
                    {focusedBranch.region}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1.5">
                    {focusedBranch.name}
                  </h4>
                  <p className="text-xs text-sky-200">{focusedBranch.districtOrArea}</p>
                </div>
                {selectedBranchId === focusedBranch.id && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-200 bg-[#065AA7] border border-sky-400/40 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    My Branch
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-sky-100 mt-3 pt-3 border-t border-white/10">
                <UserCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>
                  Branch Contact:{' '}
                  <strong className="text-white">{focusedBranch.manager}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <a
                  href={`tel:${focusedBranch.phones[0].replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white text-[#0A1E3C] font-mono-tech text-xs font-bold hover:bg-sky-50 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#065AA7]" />
                  {focusedBranch.phones[0]}
                </a>
                <button
                  type="button"
                  onClick={() => onSelectBranch(focusedBranch.id)}
                  className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedBranchId === focusedBranch.id
                      ? 'bg-[#0284C7] text-white'
                      : 'bg-[#F59E0B] hover:bg-[#D97706] text-[#061A36]'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {selectedBranchId === focusedBranch.id
                    ? 'Selected for Order'
                    : 'Set as Pickup Branch'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Branch Directory Grid (7 columns) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
              <span>
                Showing <strong className="text-[#0A1E3C]">{filteredBranches.length}</strong>{' '}
                official Kaffiika Animal Feeds locations
              </span>
              <span>Click any branch card to view on map or call directly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBranches.map((branch) => {
                const isSelected = branch.id === selectedBranchId;
                const isFocused = branch.id === focusedBranch.id;

                return (
                  <div
                    key={branch.id}
                    onClick={() => setFocusedBranchId(branch.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isFocused
                        ? 'bg-white border-[#065AA7] ring-2 ring-[#065AA7]/20 shadow-md'
                        : 'bg-white border-sky-200/80 hover:border-[#065AA7]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 rounded ${
                            branch.isHeadquarters
                              ? 'bg-[#F59E0B] text-[#061A36]'
                              : 'bg-[#E6EFF8] text-[#065AA7]'
                          }`}
                        >
                          {branch.isHeadquarters ? 'HEAD OFFICE' : branch.region}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-bold text-[#065AA7] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Branch
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-[#0A1E3C] flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#065AA7] shrink-0" />
                        {branch.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {branch.districtOrArea}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-sky-100 flex items-center gap-2 text-xs text-[#0A1E3C]">
                        <UserCheck className="w-3.5 h-3.5 text-[#065AA7] shrink-0" />
                        <span className="truncate">
                          Manager: <strong>{branch.manager}</strong>
                        </span>
                      </div>

                      <div className="mt-1.5 space-y-1">
                        {branch.phones.map((phone, i) => (
                          <div
                            key={i}
                            className="font-mono-tech text-xs font-semibold text-[#065AA7] flex items-center gap-1.5"
                          >
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{phone}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-sky-100 flex items-center gap-2">
                      <a
                        href={`tel:${branch.phones[0].replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#E6EFF8] hover:bg-[#065AA7] hover:text-white text-[#0A1E3C] text-xs font-bold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(
                          branch.phones[0]
                        )}?text=${encodeURIComponent(
                          `Hello ${branch.manager} (${branch.name}), I would like to inquire about Kaffiika Animal Feeds stock and prices.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-sky-50 hover:bg-[#0284C7] hover:text-white text-[#065AA7] border border-sky-200 text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBranch(branch.id);
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#065AA7] text-white'
                            : 'bg-white border border-sky-200 text-[#0A1E3C] hover:border-[#065AA7]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
