import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Eye,
  Plus,
  LayoutGrid,
  Table,
  Filter,
} from 'lucide-react';
import {
  Product,
  FeedCategory,
  PageRoute,
} from '../data/kaffiikaData';
import { FeedBagVisual } from '../components/FeedBagVisual';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface ProductsPageProps {
  products: Product[];
  initialCategory?: FeedCategory;
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (product: Product) => void;
  onAddToQuote: (product: Product, quantity: number) => void;
}

const CATEGORIES: FeedCategory[] = [
  'All',
  'Chicks',
  'Broilers',
  'Layers',
  'Piggery',
  'Dairy',
  'Speciality Products',
  'Fish',
];

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  initialCategory = 'All',
  onNavigate,
  onSelectProduct,
  onAddToQuote,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<FeedCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [weightFilter, setWeightFilter] = useState<number | 'All'>('All');
  const [brandFilter, setBrandFilter] = useState<'All' | 'Koudijs' | 'Kaffiika'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>(
    'featured'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCat =
          selectedCategory === 'All' || product.category === selectedCategory;
        const matchesWeight =
          weightFilter === 'All' || product.weightKg === weightFilter;
        const matchesBrand =
          brandFilter === 'All' || product.brand === brandFilter;
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !q ||
          product.name.toLowerCase().includes(q) ||
          product.code.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.summary.toLowerCase().includes(q) ||
          product.keySpec.toLowerCase().includes(q);
        return matchesCat && matchesWeight && matchesBrand && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceUgx - b.priceUgx;
        if (sortBy === 'price-desc') return b.priceUgx - a.priceUgx;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.id - b.id;
      });
  }, [products, selectedCategory, weightFilter, brandFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <PageHeaderBanner
        title="Our Products — Complete Feed Catalog"
        subtitle="Browse all 46 Kaffiika Animal Feeds & Koudijs concentrates for Chicks, Broilers, Layers, Piggery, Dairy, Speciality Products, and Fish with official UGX unit prices."
        currentPage="/products"
        badgeText="OFFICIAL KAFFIIKA WHOLESALE & RETAIL PRICE LIST"
        onNavigate={onNavigate}
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Categories & Filters (3 cols) */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#065AA7] mb-3.5">
                <Filter className="w-4 h-4" />
                <span>Product Categories</span>
              </div>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === 'All'
                      ? products.length
                      : products.filter((p) => p.category === cat).length;
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#065AA7] text-white shadow-xs'
                          : 'bg-[#F4F7FB] text-[#0A1E3C] hover:bg-[#E6EFF8]'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`font-mono-tech text-xs px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-[#F59E0B] text-[#061A36]'
                            : 'bg-white text-[#065AA7]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bag Weight & Brand Filters */}
            <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-2xs space-y-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#065AA7]" />
                  <span>Bag Packaging Weight</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['All', 10, 20, 25, 50] as const).map((wt) => (
                    <button
                      key={String(wt)}
                      type="button"
                      onClick={() => setWeightFilter(wt)}
                      className={`py-2 px-2.5 rounded-lg font-mono-tech text-xs font-bold border transition-colors cursor-pointer ${
                        weightFilter === wt
                          ? 'bg-[#065AA7] text-white border-[#065AA7]'
                          : 'bg-[#F4F7FB] text-[#0A1E3C] border-sky-200 hover:border-[#065AA7]'
                      }`}
                    >
                      {wt === 'All' ? 'All' : `${wt}kg`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-sky-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Feed Brand Line
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['All', 'Koudijs', 'Kaffiika'] as const).map((br) => (
                    <button
                      key={br}
                      type="button"
                      onClick={() => setBrandFilter(br)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        brandFilter === br
                          ? 'bg-[#061A36] text-white border-[#061A36]'
                          : 'bg-[#F4F7FB] text-[#0A1E3C] border-sky-200 hover:border-[#065AA7]'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Catalog Area (9 cols) */}
          <div className="lg:col-span-9">
            {/* Search, Sort & View Toggle Bar */}
            <div className="bg-white p-4 rounded-2xl border border-sky-200 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name or code (e.g., KLC 20, Galdus, KPLC20, Knursemeal, KF6)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm text-[#0A1E3C] placeholder:text-slate-400 focus:outline-none focus:border-[#065AA7]"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-xs font-bold text-[#0A1E3C] focus:outline-none focus:border-[#065AA7]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High (UGX)</option>
                  <option value="price-desc">Price: High to Low (UGX)</option>
                  <option value="name">Alphabetical (A–Z)</option>
                </select>

                <div className="inline-flex rounded-xl bg-[#F4F7FB] p-1 border border-sky-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#065AA7] text-white'
                        : 'text-slate-600 hover:text-[#0A1E3C]'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-[#065AA7] text-white'
                        : 'text-slate-600 hover:text-[#0A1E3C]'
                    }`}
                    title="Price Sheet Table View"
                  >
                    <Table className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Count & Active Filter Reset */}
            <div className="flex items-center justify-between text-xs text-slate-600 mb-5">
              <span>
                Showing <strong className="text-[#0A1E3C]">{filteredProducts.length}</strong>{' '}
                of <strong className="text-[#0A1E3C]">{products.length}</strong> Kaffiika
                Animal Feeds products
              </span>
              {(selectedCategory !== 'All' ||
                weightFilter !== 'All' ||
                brandFilter !== 'All' ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setWeightFilter('All');
                    setBrandFilter('All');
                    setSearchQuery('');
                  }}
                  className="font-bold text-[#065AA7] hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-sky-200">
                <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">
                  No matching feed products found
                </h3>
                <p className="text-sm text-slate-600 mb-5">
                  Try clearing your search query or switching the category/weight filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setWeightFilter('All');
                    setBrandFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#065AA7] text-white text-xs font-bold cursor-pointer"
                >
                  Show All {products.length} Products
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="bg-white rounded-2xl border border-sky-200 hover:border-[#065AA7] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                  >
                    <div>
                      <div className="h-56 w-full">
                        <FeedBagVisual product={product} size="md" />
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono-tech text-xs font-bold text-[#065AA7]">
                            CODE: {product.code}
                          </span>
                          <span className="font-mono-tech text-[11px] text-slate-500">
                            UGX{' '}
                            {Math.round(
                              product.priceUgx / product.weightKg
                            ).toLocaleString()}
                            /kg
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
                          disabled={product.stockStatus === 'Out of Stock'}
                          className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-[#065AA7] hover:bg-[#044685] disabled:bg-slate-300 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Wholesale Price Sheet Table View */
              <div className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#061A36] text-white text-xs font-mono-tech uppercase">
                        <th className="py-3.5 px-4">Photo</th>
                        <th className="py-3.5 px-4">Product Name & Code</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Units</th>
                        <th className="py-3.5 px-4">Unit Price (UGX)</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100 text-sm">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          onClick={() => onSelectProduct(product)}
                          className="hover:bg-[#F4F7FB] cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border border-sky-200"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#0A1E3C]">
                              {product.name}
                            </div>
                            <div className="font-mono-tech text-xs text-[#065AA7] font-semibold">
                              Code: {product.code}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-[#E6EFF8] text-[#065AA7] text-xs font-bold">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono-tech text-xs font-bold text-slate-700">
                            {product.units}
                          </td>
                          <td className="py-3 px-4 font-mono-tech font-bold text-[#065AA7]">
                            UGX {product.priceUgx.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToQuote(product, 1);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#065AA7] hover:bg-[#044685] text-white text-xs font-bold cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
