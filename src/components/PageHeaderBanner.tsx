import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageRoute } from '../data/kaffiikaData';

interface PageHeaderBannerProps {
  title: string;
  subtitle: string;
  currentPage: PageRoute;
  badgeText?: string;
  onNavigate: (page: PageRoute) => void;
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  title,
  subtitle,
  currentPage,
  badgeText,
  onNavigate,
}) => {
  return (
    <div className="bg-kaffiika-breadcrumb text-white py-12 sm:py-16 border-b border-sky-400/20 relative overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Bar */}
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#061A36]/75 backdrop-blur-md border border-white/15 text-xs font-mono-tech mb-4"
        >
          <a
            href="#/index.html"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('index.html');
            }}
            className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>index.html</span>
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#F59E0B] font-bold">{currentPage}</span>
        </nav>

        <div className="max-w-3xl">
          {badgeText && (
            <div className="text-xs font-mono-tech uppercase tracking-widest text-sky-300 font-bold mb-1.5">
              {badgeText}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-sky-100/90 mt-3 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
