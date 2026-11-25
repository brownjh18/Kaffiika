import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Calculator,
  MapPin,
  ShieldCheck,
  Sparkles,
  Eye,
  Plus,
  Quote,
  Calendar,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  Product,
  FeedCategory,
  PageRoute,
  KAFFIIKA_ASSETS,
  TESTIMONIALS,
  BlogPost,
} from '../data/kaffiikaData';
import { FeedBagVisual } from '../components/FeedBagVisual';

interface HomePageProps {
  products: Product[];
  blogs: BlogPost[];
  onNavigate: (page: PageRoute, categoryFilter?: FeedCategory) => void;
  onSelectProduct: (product: Product) => void;
  onAddToQuote: (product: Product, quantity: number) => void;
}

const HOME_CATEGORIES: Exclude<FeedCategory, 'All'>[] = [
  'Chicks',
  'Broilers',
  'Layers',
  'Piggery',
  'Dairy',
  'Speciality Products',
  'Fish',
];

const BANNER_CAPTIONS = [
  {
    badge: 'EST. 2006 • UGANDA’S TRUSTED FEED LEADER',
    title: 'Specific Feed Solutions for Layers, Broilers, Pigs, Dairy & Fish',
    subtitle:
      'Main official suppliers of Koudijs Animal Nutrition concentrates and 2.2mm Galdus prestarter pellets, available from our Kampala head office.',
  },
  {
    badge: 'PEAK EGG PRODUCTION (>95%)',
    title: 'Over 310 Eggs per Hen Across a 76-Week Laying Cycle',
    subtitle:
      'Formulate high-yield layer rations with KLC 20, KLC 10, KLC 5, and Galdus Layer Prestarter.',
  },
  {
    badge: 'RAPID BROILER GROWTH (>55G / DAY)',
    title: 'Lower Feed Conversion Ratio & Superior Meat Quality',
    subtitle:
      'Start strong with KBPF Galdus micro-pellets and finish fast with KBC 35/30 and KBC10 concentrates.',
  },
  {
    badge: 'PROFITABLE PIGGERY & DAIRY NUTRITION',
    title: 'Healthy Litters, Productive Sows & High-Yield Dairy Herds',
    subtitle:
      'Trusted by Ugandan farmers for KPLC20, Knursemeal, Romelko, KPC 30/25, KMR & Koudijs Dairy Concentrate.',
  },
  {
    badge: 'EXTRUDED TILAPIA & CATFISH AQUAFEEDS',
    title: 'From 40% CP Fry Powders to 10mm Finisher Pellets',
    subtitle:
      'State-of-the-art floating and nursery feeds for ponds, tanks, and Lake Victoria cage operations.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  products,
  blogs,
  onNavigate,
  onSelectProduct,
  onAddToQuote,
}) => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeTabCategory, setActiveTabCategory] =
    useState<Exclude<FeedCategory, 'All'>>('Chicks');

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % KAFFIIKA_ASSETS.banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const tabProducts = products
    .filter((p) => p.category === activeTabCategory)
    .slice(0, 8);

  const activeCaption = BANNER_CAPTIONS[bannerIndex] || BANNER_CAPTIONS[0];

  return (
    <div>
      {/* ==================== HERO WITH SWITCHING BACKGROUND BANNERS ==================== */}
      <section className="relative bg-[#061A36] text-white overflow-hidden">
        <div className="absolute inset-0">
          {KAFFIIKA_ASSETS.banners.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                idx === bannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-[#061A36]/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A36]/72 via-[#061A36]/45 to-[#061A36]/25" />
        </div>

        <div className="relative max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-4xl space-y-5 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#065AA7]/80 border border-sky-400/40 text-sky-100 text-xs font-mono-tech font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{activeCaption.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-white">
              {activeCaption.title}
            </h1>

            <p className="text-base sm:text-lg text-sky-100/95 leading-relaxed max-w-3xl">
              {activeCaption.subtitle}
            </p>

            {/* Multi-Page Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#/products.html"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('products.html');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#065AA7] hover:bg-[#0284C7] text-white font-bold text-sm sm:text-base shadow-lg border border-sky-400/30 transition-all"
              >
                <span>Explore All {products.length} Products</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </a>

              <a
                href="#/calculator.html"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('calculator.html');
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#061A36] font-bold text-sm sm:text-base shadow-md transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Ration Calculator</span>
              </a>

              <a
                href="#/branches.html"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('branches.html');
                }}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all"
              >
                <MapPin className="w-4 h-4 text-sky-300" />
                <span>Visit Head Office</span>
              </a>
            </div>

            {/* Category Quick Jump Links to products.html */}
            <div className="pt-4 border-t border-white/15">
              <span className="block text-[11px] font-mono-tech uppercase tracking-wider text-sky-200 mb-2.5">
                Browse Feed Categories:
              </span>
              <div className="flex flex-wrap gap-2">
                {HOME_CATEGORIES.map((cat) => (
                  <a
                    key={cat}
                    href={`#/products.html?category=${encodeURIComponent(cat)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('products.html', cat);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#065AA7] text-white border border-sky-300/25 text-xs font-bold transition-all"
                  >
                    {cat} ({products.filter((p) => p.category === cat).length})
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2">
              {KAFFIIKA_ASSETS.banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBannerIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === bannerIndex ? 'w-8 bg-[#F59E0B]' : 'w-2.5 bg-white/45 hover:bg-white/80'
                  }`}
                  aria-label={`Show hero background ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4 SERVICE PILLARS BAR ==================== */}
      <section className="bg-white border-b border-sky-200 py-8">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: KAFFIIKA_ASSETS.services[0],
                title: 'Active Since 2006',
                desc: '20 years of proven Ugandan poultry & livestock nutrition expertise',
              },
              {
                icon: KAFFIIKA_ASSETS.services[1],
                title: 'Main Koudijs Supplier',
                desc: 'Authentic Dutch concentrates, Galdus prestarter & specialty premixes',
              },
              {
                icon: KAFFIIKA_ASSETS.services[2],
                title: 'Kampala Head Office',
                desc: 'Direct support and distribution from our Mengo, Sentema Road head office',
              },
              {
                icon: KAFFIIKA_ASSETS.services[3],
                title: 'Free Technical Support',
                desc: 'On-farm ration formulation, workshops & veterinary backstopping',
              },
            ].map((srv, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F4F7FB] border border-sky-200/80"
              >
                <div className="w-12 h-12 rounded-xl bg-[#065AA7] flex items-center justify-center shrink-0 p-2.5 shadow-xs">
                  <img
                    src={srv.icon}
                    alt={srv.title}
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0A1E3C]">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== OUR MAIN FEED SOLUTIONS (TABBED PREVIEW) ==================== */}
      <section className="py-16 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#065AA7]/10 border border-[#065AA7]/25 text-[#065AA7] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kaffiika × Koudijs Product Lineup
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1E3C]">
              Our Main Feed Solutions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Kaffiika Animal Feeds provides specific feed solutions for layers, broilers,
              pigs, dairy cattle, and fish.
            </p>
          </div>

          <a
            href="#/products.html"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('products.html');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors self-start lg:self-auto"
          >
            <span>Open Full Product Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Category Tabs matching original Kaffiika homepage */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8">
          {HOME_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const isActive = activeTabCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTabCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#065AA7] text-white shadow-md'
                    : 'bg-white text-[#0A1E3C] border border-sky-200 hover:border-[#065AA7]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`font-mono-tech text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#F59E0B] text-[#061A36]'
                      : 'bg-[#E6EFF8] text-[#065AA7]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid for Selected Tab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-2xl border border-sky-200 hover:border-[#065AA7] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              <div>
                <div className="h-52 w-full">
                  <FeedBagVisual product={product} size="md" />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono-tech text-xs font-bold text-[#065AA7]">
                      CODE: {product.code}
                    </span>
                    <span className="font-mono-tech text-[11px] text-slate-500">
                      UGX {Math.round(product.priceUgx / product.weightKg).toLocaleString()}/kg
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A1E3C] group-hover:text-[#065AA7] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {product.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-sky-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-500 block">
                    SALE PRICE ({product.units})
                  </span>
                  <span className="font-mono-tech font-bold text-base sm:text-lg text-[#065AA7]">
                    UGX {product.priceUgx.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="p-2.5 rounded-xl bg-[#E6EFF8] hover:bg-[#061A36] hover:text-white text-[#065AA7] transition-colors cursor-pointer"
                    title="View Technical Sheet"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToQuote(product, 1);
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={`#/products.html?category=${encodeURIComponent(activeTabCategory)}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('products.html', activeTabCategory);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E6EFF8] hover:bg-[#065AA7] hover:text-white text-[#065AA7] font-bold text-sm border border-sky-300 transition-colors"
          >
            <span>
              View All {products.filter((p) => p.category === activeTabCategory).length}{' '}
              View All {activeTabCategory} Products
            </span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ==================== KOUDIJS PARTNER PARALLAX BANNER ==================== */}
      <section className="bg-kaffiika-parallax text-white py-16 border-y border-sky-400/20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#F59E0B] font-mono-tech text-xs font-bold uppercase">
                <Award className="w-4 h-4" />
                Our Main Partner
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Koudijs Products — We Are the Main Suppliers of Koudijs Products in Uganda
              </h2>
              <p className="text-sky-100 text-base leading-relaxed max-w-2xl">
                Backed by Koudijs Animal Nutrition’s global scientific research and
                state-of-the-art manufacturing, we deliver proven concentrates, prestarter
                micro-pellets, and extruded fish feeds to every region of Uganda.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#/branches.html"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('branches.html');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#061A36] font-bold text-sm shadow-lg transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Visit Our Head Office</span>
                </a>
                <a
                  href="#/farming-guides.html"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('farming-guides.html');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-sm transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Species Feeding Guides</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-[#F59E0B] max-w-xs w-full text-center">
                <img
                  src={KAFFIIKA_ASSETS.koudijsLogo}
                  alt="Koudijs Animal Nutrition"
                  className="h-24 mx-auto object-contain mb-3"
                />
                <div className="text-xs font-mono-tech font-bold uppercase text-[#065AA7]">
                  Official Authorized Partner
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Feeding Performance Together Across Uganda Since 2006
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CUSTOMER TESTIMONIALS WITH REAL EXTRACTED PHOTOS ==================== */}
      <section className="py-16 bg-white border-b border-sky-200">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono-tech font-bold uppercase tracking-widest text-[#065AA7]">
              VERIFIED UGANDAN FARMERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1E3C] mt-1">
              Our Customer Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="bg-[#F4F7FB] rounded-2xl p-6 sm:p-7 border border-sky-200 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono-tech font-bold px-2.5 py-1 rounded-md bg-[#065AA7] text-white">
                      {item.highlightMetric}
                    </span>
                    <Quote className="w-7 h-7 text-[#065AA7]/25" />
                  </div>
                  <p className="text-sm sm:text-base text-[#0A1E3C] leading-relaxed italic font-serif-display">
                    “{item.quote}”
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sky-200 flex items-center gap-3.5">
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-[#065AA7] shrink-0"
                  />
                  <div>
                    <div className="font-bold text-base text-[#0A1E3C] capitalize">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#065AA7] font-semibold">
                      {item.role} • {item.farmType}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LATEST BLOG PREVIEW WITH EXTRACTED NEWS PHOTOS ==================== */}
      <section className="py-16 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono-tech font-bold uppercase tracking-widest text-[#065AA7]">
              FARMER TRAININGS & UPDATES
            </span>
            <h2 className="text-3xl font-bold text-[#0A1E3C] mt-1">
              Latest Blog & Farmer Workshops
            </h2>
          </div>
          <a
            href="#/media-gallery.html"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('media-gallery.html');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#065AA7] hover:underline"
          >
            <span>View Blogs, Gallery & Educational Videos</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate('media-gallery.html')}
              className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden relative bg-[#E6EFF8]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#065AA7] text-white font-mono-tech text-[11px] font-bold">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-tech mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#065AA7]" />
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>Posted By: {post.author}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1E3C] group-hover:text-[#065AA7] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-[#065AA7]">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
