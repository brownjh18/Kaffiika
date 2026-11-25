import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  MessageCircle,
  Menu,
  X,
  Building2,
  Shield,
} from 'lucide-react';
import {
  PRODUCTS,
  BRANCHES,
  TEAM_MEMBERS,
  BLOG_POSTS,
  INITIAL_ORDERS,
  COMPANY_INFO,
  KAFFIIKA_ASSETS,
  FeedCategory,
  Product,
  Branch,
  BlogPost,
  CustomerOrder,
  PageRoute,
} from './data/kaffiikaData';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuoteDrawer, QuoteItem } from './components/QuoteDrawer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { FarmingGuidesPage } from './pages/FarmingGuidesPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { BranchesPage } from './pages/BranchesPage';
import { MediaBlogPage } from './pages/MediaBlogPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DeliveryPolicyPage } from './pages/DeliveryPolicyPage';

const NAV_PAGES: { route: PageRoute; label: string; badge?: string }[] = [
  { route: 'index.html', label: 'Home' },
  { route: 'about.html', label: 'About Us' },
  { route: 'products.html', label: 'Our Products', badge: '46' },
  { route: 'farming-guides.html', label: 'Farming Guides' },
  { route: 'calculator.html', label: 'Ration Calculator' },
  { route: 'branches.html', label: 'Head Office', badge: 'HQ' },
  { route: 'media-gallery.html', label: 'Blogs & Media' },
  { route: 'contact.html', label: 'Contact Us' },
];

export function App() {
  // Parse initial route from window.location.hash
  const parseHashRoute = (): PageRoute => {
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    const validRoutes: PageRoute[] = [
      'index.html',
      'about.html',
      'products.html',
      'farming-guides.html',
      'calculator.html',
      'branches.html',
      'media-gallery.html',
      'contact.html',
      'admin.html',
      'privacy-policy.html',
      'terms.html',
      'delivery-policy.html',
    ];
    if (validRoutes.includes(hash as PageRoute)) {
      return hash as PageRoute;
    }
    return 'index.html';
  };

  const [currentPage, setCurrentPage] = useState<PageRoute>(parseHashRoute);
  const [initialProductCategory, setInitialProductCategory] =
    useState<FeedCategory>('All');

  // Master Store & ERP State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kaffiika_products_v2');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    try {
      const saved = localStorage.getItem('kaffiika_branches_v2');
      return saved ? JSON.parse(saved) : BRANCHES;
    } catch {
      return BRANCHES;
    }
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('kaffiika_blogs_v2');
      return saved ? JSON.parse(saved) : BLOG_POSTS;
    } catch {
      return BLOG_POSTS;
    }
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kaffiika_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kaffiika_products_v2', JSON.stringify(products));
    } catch {
      // ignore storage quota errors
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('kaffiika_branches_v2', JSON.stringify(branches));
    } catch {
      // ignore
    }
  }, [branches]);

  useEffect(() => {
    try {
      localStorage.setItem('kaffiika_blogs_v2', JSON.stringify(blogs));
    } catch {
      // ignore
    }
  }, [blogs]);

  useEffect(() => {
    try {
      localStorage.setItem('kaffiika_orders_v2', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Listen to browser back/forward hash navigation
  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(parseHashRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (page: PageRoute, categoryFilter?: FeedCategory) => {
    if (categoryFilter) {
      setInitialProductCategory(categoryFilter);
    } else if (page === 'products.html') {
      setInitialProductCategory('All');
    }
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Modal & Quote Drawer State
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(
    null
  );
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState<boolean>(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { product: PRODUCTS.find((p) => p.id === 4)!, quantity: 2 },
    { product: PRODUCTS.find((p) => p.id === 1)!, quantity: 1 },
  ]);
  const [selectedBranchId, setSelectedBranchId] =
    useState<string>('hq-kampala');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleAddToQuote = (product: Product, quantity = 1) => {
    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    triggerToast(`Added ${quantity}× ${product.name} (${product.code}) to Quote`);
  };

  const handleAddMultipleToQuote = (
    newItems: { product: Product; quantity: number }[]
  ) => {
    setQuoteItems((prev) => {
      const updated = [...prev];
      newItems.forEach(({ product, quantity }) => {
        const idx = updated.findIndex((i) => i.product.id === product.id);
        if (idx > -1) {
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + quantity,
          };
        } else {
          updated.push({ product, quantity });
        }
      });
      return updated;
    });
    triggerToast(
      `Added ${newItems.length} calculated ration items to your Quote!`
    );
    setIsQuoteDrawerOpen(true);
  };

  const handleUpdateQuoteQty = (productId: number, quantity: number) => {
    setQuoteItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveQuoteItem = (productId: number) => {
    setQuoteItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  // Admin CRUD Handlers
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreateOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: CustomerOrder['status']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleUpdateBranch = (updated: Branch) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  };

  const handleAddBranch = (newBranch: Branch) => {
    setBranches((prev) => [newBranch, ...prev]);
  };

  const handleDeleteBranch = (branchId: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchId));
  };

  const handleAddBlog = (newBlog: BlogPost) => {
    setBlogs((prev) => [newBlog, ...prev]);
  };

  const handleDeleteBlog = (blogId: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));
  };

  const handleResetAllData = () => {
    setProducts(PRODUCTS);
    setBranches(BRANCHES);
    setBlogs(BLOG_POSTS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem('kaffiika_products_v2');
    localStorage.removeItem('kaffiika_branches_v2');
    localStorage.removeItem('kaffiika_blogs_v2');
    localStorage.removeItem('kaffiika_orders_v2');
  };

  const totalQuoteBags = quoteItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalQuoteUgx = quoteItems.reduce(
    (sum, i) => sum + i.quantity * i.product.priceUgx,
    0
  );

  const selectedBranch =
    branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-[#0A1E3C]">
      {/* ==================== TOP CORPORATE BLUE UTILITY BAR ==================== */}
      <div className="bg-[#061A36] text-sky-100 text-xs border-b border-sky-400/20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{COMPANY_INFO.headquarters}</span>
            </span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition-colors font-mono-tech"
            >
              <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#/branches.html"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('branches.html');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-sky-300 hover:text-white font-semibold"
            >
              <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Branch: {selectedBranch.name}</span>
            </a>

            <a
              href={`tel:${COMPANY_INFO.primaryPhone}`}
              className="inline-flex items-center gap-1.5 font-mono-tech font-bold text-white bg-[#065AA7] hover:bg-[#0284C7] px-2.5 py-1 rounded-md transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F59E0B]" />
              <span>{COMPANY_INFO.primaryPhone}</span>
            </a>

            <a
              href="#/admin.html"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('admin.html');
              }}
              className={`inline-flex items-center gap-1.5 font-mono-tech font-bold px-2.5 py-1 rounded-md border transition-colors ${
                currentPage === 'admin.html'
                  ? 'bg-[#F59E0B] text-[#061A36] border-[#F59E0B]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* ==================== STICKY MULTI-PAGE NAVIGATION HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-xs">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Official Kaffiika Logo from https://kaffiikafeeds.com/ */}
          <a
            href="#/index.html"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('index.html');
            }}
            className="flex items-center gap-3 shrink-0 group"
          >
            <img
              src={KAFFIIKA_ASSETS.logo}
              alt="Kaffiika Animal Feeds"
              className="h-12 sm:h-14 w-auto object-contain group-hover:scale-103 transition-transform"
            />
            <div className="hidden xl:block border-l border-sky-200 pl-3">
              <span className="font-serif-display font-bold text-lg text-[#0A1E3C] block leading-none">
                Kaffiika Feeds
              </span>
              <span className="text-[10px] font-mono-tech font-bold uppercase text-[#065AA7] tracking-wider">
                Est. 2006 • Uganda
              </span>
            </div>
          </a>

          {/* Desktop Multi-Page Links (.html pages) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_PAGES.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <a
                  key={item.route}
                  href={`#/${item.route}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(item.route);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#065AA7] text-white shadow-xs'
                      : 'text-[#0A1E3C] hover:bg-[#E6EFF8] hover:text-[#065AA7]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`font-mono-tech text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-[#F59E0B] text-[#061A36]'
                          : 'bg-[#E6EFF8] text-[#065AA7]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls: Quote Drawer & Mobile Menu */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsQuoteDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
              <span className="hidden sm:inline">Order Quote</span>
              <span className="font-mono-tech text-xs px-2 py-0.5 rounded-md bg-white/15 text-white">
                {totalQuoteBags}
              </span>
              <span className="hidden md:inline font-mono-tech text-xs text-[#F59E0B] border-l border-white/20 pl-2">
                UGX {totalQuoteUgx.toLocaleString()}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2.5 rounded-xl bg-[#E6EFF8] text-[#065AA7] cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Multi-Page Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-sky-200 px-4 py-4 space-y-1.5 shadow-xl">
            {NAV_PAGES.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <a
                  key={item.route}
                  href={`#/${item.route}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(item.route);
                  }}
                  className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl font-bold text-sm ${
                    isActive
                      ? 'bg-[#065AA7] text-white'
                      : 'text-[#0A1E3C] hover:bg-[#E6EFF8]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono-tech text-xs opacity-75">
                    {item.route}
                  </span>
                </a>
              );
            })}
            <a
              href="#/admin.html"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('admin.html');
              }}
              className="flex items-center justify-between py-2.5 px-3.5 rounded-xl font-bold text-sm bg-[#061A36] text-[#F59E0B]"
            >
              <span>Admin Management Portal</span>
              <span className="font-mono-tech text-xs">admin.html</span>
            </a>
          </div>
        )}
      </header>

      {/* ==================== MULTI-PAGE ROUTER VIEWPORT ==================== */}
      <main className="flex-1">
        {currentPage === 'index.html' && (
          <HomePage
            products={products}
            blogs={blogs}
            onNavigate={handleNavigate}
            onSelectProduct={(prod) => setActiveModalProduct(prod)}
            onAddToQuote={handleAddToQuote}
          />
        )}

        {currentPage === 'about.html' && (
          <AboutPage team={TEAM_MEMBERS} onNavigate={handleNavigate} />
        )}

        {currentPage === 'products.html' && (
          <ProductsPage
            products={products}
            initialCategory={initialProductCategory}
            onNavigate={handleNavigate}
            onSelectProduct={(prod) => setActiveModalProduct(prod)}
            onAddToQuote={handleAddToQuote}
          />
        )}

        {currentPage === 'farming-guides.html' && (
          <FarmingGuidesPage
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={(prod) => setActiveModalProduct(prod)}
          />
        )}

        {currentPage === 'calculator.html' && (
          <CalculatorPage
            products={products}
            onNavigate={handleNavigate}
            onAddMultipleToQuote={handleAddMultipleToQuote}
          />
        )}

        {currentPage === 'branches.html' && (
          <BranchesPage
            branches={branches}
            selectedBranchId={selectedBranchId}
            onSelectBranch={(id) => {
              setSelectedBranchId(id);
              const b = branches.find((br) => br.id === id);
              if (b)
                triggerToast(
                  `Selected ${b.name} (${b.manager}) as your pickup branch`
                );
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'media-gallery.html' && (
          <MediaBlogPage blogs={blogs} onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact.html' && (
          <ContactPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin.html' && (
          <AdminPage
            products={products}
            branches={branches}
            blogs={blogs}
            orders={orders}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onUpdateBranch={handleUpdateBranch}
            onAddBranch={handleAddBranch}
            onDeleteBranch={handleDeleteBranch}
            onAddBlog={handleAddBlog}
            onDeleteBlog={handleDeleteBlog}
            onResetAllData={handleResetAllData}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'privacy-policy.html' && (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'terms.html' && <TermsPage onNavigate={handleNavigate} />}
        {currentPage === 'delivery-policy.html' && (
          <DeliveryPolicyPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* ==================== CORPORATE BLUE FOOTER ==================== */}
      <footer className="bg-[#061A36] text-sky-100 border-t border-sky-400/20 pt-16 pb-12">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Logo & Mission (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={KAFFIIKA_ASSETS.logo}
                  alt="Kaffiika Animal Feeds"
                  className="h-12 bg-white p-1.5 rounded-xl object-contain"
                />
                <div>
                  <span className="font-serif-display font-bold text-xl text-white block">
                    Kaffiika Animal Feeds
                  </span>
                  <span className="text-[11px] font-mono-tech uppercase text-[#F59E0B]">
                    We Provide Customized Feeding Solutions
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-sky-200 leading-relaxed">
                {COMPANY_INFO.mission}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={KAFFIIKA_ASSETS.payments.mtn}
                  alt="MTN"
                  className="h-7 bg-white p-1 rounded"
                />
                <img
                  src={KAFFIIKA_ASSETS.payments.airtel}
                  alt="Airtel"
                  className="h-7 bg-white p-1 rounded"
                />
                <img
                  src={KAFFIIKA_ASSETS.payments.visa}
                  alt="Visa"
                  className="h-7 bg-white p-1 rounded"
                />
              </div>
            </div>

            {/* Col 2: Quick Links to .html Pages (3 cols) */}
            <div className="lg:col-span-3 space-y-2 text-xs sm:text-sm">
              <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#F59E0B] font-bold mb-3">
                Website Pages (.html)
              </h4>
              {NAV_PAGES.map((p) => (
                <a
                  key={p.route}
                  href={`#/${p.route}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(p.route);
                  }}
                  className="block text-sky-200 hover:text-white transition-colors"
                >
                  {p.label} ({p.route})
                </a>
              ))}
              <a
                href="#/admin.html"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('admin.html');
                }}
                className="block text-[#F59E0B] hover:underline font-bold pt-1"
              >
                Admin Management Portal (admin.html)
              </a>
              <div className="pt-2 space-y-1.5 border-t border-white/10 mt-2">
                <a href="#/privacy-policy.html" onClick={(e) => { e.preventDefault(); handleNavigate('privacy-policy.html'); }} className="block text-sky-200 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#/terms.html" onClick={(e) => { e.preventDefault(); handleNavigate('terms.html'); }} className="block text-sky-200 hover:text-white transition-colors">Terms & Conditions</a>
                <a href="#/delivery-policy.html" onClick={(e) => { e.preventDefault(); handleNavigate('delivery-policy.html'); }} className="block text-sky-200 hover:text-white transition-colors">Delivery & Pickup Policy</a>
              </div>
            </div>

            {/* Col 3: Feed Categories (2 cols) */}
            <div className="lg:col-span-2 space-y-2 text-xs sm:text-sm">
              <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#F59E0B] font-bold mb-3">
                Feed Solutions
              </h4>
              {(
                [
                  'Chicks',
                  'Broilers',
                  'Layers',
                  'Piggery',
                  'Dairy',
                  'Speciality Products',
                  'Fish',
                ] as const
              ).map((cat) => (
                <a
                  key={cat}
                  href={`#/products.html?category=${encodeURIComponent(cat)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate('products.html', cat);
                  }}
                  className="block text-sky-200 hover:text-white transition-colors"
                >
                  {cat} ({products.filter((p) => p.category === cat).length})
                </a>
              ))}
            </div>

            {/* Col 4: Main Office Contact (3 cols) */}
            <div className="lg:col-span-3 space-y-3 text-xs sm:text-sm">
              <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#F59E0B] font-bold mb-3">
                Headquarters & Dispatch
              </h4>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>
                  Kaffiika Animal Feeds Main Offices.
                  <br />
                  {COMPANY_INFO.headquarters}
                </span>
              </div>
              <div className="flex items-center gap-2.5 font-mono-tech">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a
                  href={`tel:${COMPANY_INFO.primaryPhone}`}
                  className="hover:text-white"
                >
                  Call us : {COMPANY_INFO.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 font-mono-tech">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-white"
                >
                  Email : {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-300/80">
            <p>
              © {new Date().getFullYear()}, Kaffiika Animal Feeds. All rights
              reserved.
            </p>
            <p className="font-mono-tech">
              {COMPANY_INFO.headquarters} • {COMPANY_INFO.primaryPhone}
            </p>
          </div>
        </div>
      </footer>

      {/* ==================== FLOATING WHATSAPP & TOAST NOTIFICATION ==================== */}
      {toastMessage && (
        <div className="fixed bottom-20 right-5 z-50 bg-[#061A36] text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-[#F59E0B] flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <a
        href={`https://wa.me/${COMPANY_INFO.primaryPhoneClean}?text=${encodeURIComponent(
          'Hello Kaffiika Animal Feeds, I would like to inquire about animal feeds and nearest branch stock.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#065AA7] hover:bg-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-xl border-2 border-white/25 transition-transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4 text-[#F59E0B]" />
        <span>WhatsApp Sales Desk</span>
      </a>

      {/* ==================== MODALS & DRAWERS ==================== */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        onAddToQuote={handleAddToQuote}
      />

      <QuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        items={quoteItems}
        branches={branches}
        onUpdateQuantity={handleUpdateQuoteQty}
        onRemoveItem={handleRemoveQuoteItem}
        onClearItems={() => setQuoteItems([])}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        onCreateOrder={handleCreateOrder}
      />
    </div>
  );
}

export default App;
