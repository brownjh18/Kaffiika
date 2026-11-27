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
  ChevronDown,
  Building2,
  Shield,
  LogIn,
  LogOut,
  User,
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
import { AuthModal, AuthUser } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { api, getToken, setToken } from './lib/api';
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

type NavItem = { route: PageRoute; label: string; badge?: string };
type NavGroup = { id: string; label: string; route?: PageRoute; items?: NavItem[] };
const NAV_GROUPS: NavGroup[] = [
  { id: 'home', label: 'Home', route: '/' },
  { id: 'company', label: 'Company', items: [
    { route: '/about', label: 'About Us' },
    { route: '/branches', label: 'Branches' },
  ]},
  { id: 'products', label: 'Products', items: [
    { route: '/products', label: 'Our Products', badge: '46' },
    { route: '/calculator', label: 'Ration Calculator' },
  ]},
  { id: 'resources', label: 'Resources', items: [
    { route: '/farming-guides', label: 'Farming Guides' },
    { route: '/media-gallery', label: 'Blogs & Media' },
  ]},
  { id: 'contact', label: 'Contact', route: '/contact' },
];
const NAV_PAGES: NavItem[] = NAV_GROUPS.flatMap((g) => g.items ? g.items : g.route ? [{ route: g.route, label: g.label }] : []);

export function App() {
  const VALID_ROUTES: PageRoute[] = [
    '/',
    '/about',
    '/products',
    '/farming-guides',
    '/calculator',
    '/branches',
    '/media-gallery',
    '/contact',
    '/admin',
    '/privacy-policy',
    '/terms',
    '/delivery-policy',
  ];

  const normalizeLegacyRoute = (raw: string): string => {
    const cleaned = raw
      .replace(/^#\/?/, '')
      .split('?')[0]
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');
    if (!cleaned || cleaned === 'index.html' || cleaned === 'index') return '/';
    return '/' + cleaned.replace(/\.html$/i, '');
  };

  const parseRoute = (): PageRoute => {
    const hash = window.location.hash;
    if (hash.startsWith('#')) {
      const mapped = normalizeLegacyRoute(hash);
      if (VALID_ROUTES.includes(mapped as PageRoute)) return mapped as PageRoute;
    }
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (VALID_ROUTES.includes(path as PageRoute)) return path as PageRoute;
    return '/';
  };

  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    const initial = parseRoute();
    if (window.location.hash.startsWith('#')) {
      window.history.replaceState({}, '', initial);
    } else if (window.location.pathname !== initial) {
      window.history.replaceState({}, '', initial);
    }
    return initial;
  });
  const [initialProductCategory, setInitialProductCategory] =
    useState<FeedCategory>('All');

  // Master Store & ERP State - backend is source of truth, static defaults as fallback
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [branches, setBranches] = useState<Branch[]>(BRANCHES);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [team, setTeam] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.bootstrap();
        if (Array.isArray(data.products) && data.products.length) setProducts(data.products);
        if (Array.isArray(data.branches) && data.branches.length) setBranches(data.branches);
        if (Array.isArray(data.blogs)) setBlogs(data.blogs);
        if (Array.isArray(data.team)) setTeam(data.team);
      } catch (e) {
        console.warn('Bootstrap API unavailable, using static defaults', e);
      }
    })();
  }, []);

  // Listen to browser back/forward navigation and legacy hash links
  useEffect(() => {
    const onRouteChange = () => {
      const next = parseRoute();
      if (window.location.hash.startsWith('#')) {
        window.history.replaceState({}, '', next);
      }
      setCurrentPage(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onRouteChange);
    window.addEventListener('hashchange', onRouteChange);
    return () => {
      window.removeEventListener('popstate', onRouteChange);
      window.removeEventListener('hashchange', onRouteChange);
    };
  }, []);

  const handleNavigate = (page: PageRoute, categoryFilter?: FeedCategory) => {
    if (categoryFilter) {
      setInitialProductCategory(categoryFilter);
    } else if (page === '/products') {
      setInitialProductCategory('All');
    }
    if (window.location.pathname !== page) {
      window.history.pushState({}, '', page);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setOpenDesktopNav(null);
  };

  // Auth, Modal & Quote Drawer State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(
    null
  );
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState<boolean>(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] =
    useState<string>('hq-kampala');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openDesktopNav, setOpenDesktopNav] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const r = await api.me();
        if (r?.user) setCurrentUser(r.user);
      } catch {
        setToken('');
      }
    })();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setQuoteItems([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`kaffiika_quote_${currentUser.id}`);
      const saved: { productId: number; quantity: number }[] = raw ? JSON.parse(raw) : [];
      const restored: QuoteItem[] = saved
        .map((s) => {
          const product = products.find((p) => p.id === s.productId);
          return product ? { product, quantity: Math.max(1, Number(s.quantity) || 1) } : null;
        })
        .filter(Boolean) as QuoteItem[];
      setQuoteItems(restored);
    } catch {
      setQuoteItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser) return;
    try {
      const payload = quoteItems.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
      localStorage.setItem(`kaffiika_quote_${currentUser.id}`, JSON.stringify(payload));
    } catch {}
  }, [quoteItems, currentUser]);

  const handleAuth = (user: AuthUser) => {
    setCurrentUser(user);
    triggerToast(`Signed in as ${user.name}`);
  };

  const handleLogout = () => {
    setToken('');
    setCurrentUser(null);
    setQuoteItems([]);
    setIsQuoteDrawerOpen(false);
    setIsProfileModalOpen(false);
    triggerToast('You have been signed out.');
  };

  const handleUpdateProfile = (user: AuthUser) => {
    setCurrentUser(user);
    triggerToast('Profile updated.');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleAddToQuote = (product: Product, quantity = 1) => {
    if (!currentUser) {
      triggerToast('Please sign in to save products to your quote.');
      setIsAuthModalOpen(true);
      return;
    }
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
    if (!currentUser) {
      triggerToast('Please sign in to save products to your quote.');
      setIsAuthModalOpen(true);
      return;
    }
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
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    void api.adminUpsert('products', updated).catch(console.error);
  };
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    void api.adminUpsert('products', newProd).catch(console.error);
  };
  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    void api.adminDelete('products', String(id)).catch(console.error);
  };

  const handleCreateOrder = async (newOrder: CustomerOrder) => {
    try {
      const saved = await api.createOrder(newOrder);
      setOrders((prev) => [saved, ...prev.filter((o) => o.id !== saved.id)]);
    } catch (e) {
      console.error(e);
      setOrders((prev) => [newOrder, ...prev]);
      triggerToast('Order saved locally; backend sync failed.');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    void api.adminUpdateOrderStatus(orderId, status).catch(console.error);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    void api.adminDeleteOrder(orderId).catch(console.error);
  };

  const handleUpdateBranch = (updated: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    void api.adminUpsert('branches', updated).catch(console.error);
  };
  const handleAddBranch = (newBranch: Branch) => {
    setBranches((prev) => [newBranch, ...prev]);
    void api.adminUpsert('branches', newBranch).catch(console.error);
  };
  const handleDeleteBranch = (branchId: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchId));
    void api.adminDelete('branches', branchId).catch(console.error);
  };

  const handleAddBlog = (newBlog: BlogPost) => {
    setBlogs((prev) => [newBlog, ...prev]);
    void api.adminUpsert('blogs', newBlog).catch(console.error);
  };
  const handleDeleteBlog = (blogId: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    void api.adminDelete('blogs', blogId).catch(console.error);
  };

  const handleUpdateTeamMember = (updated: TeamMember) => {
    setTeam((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    void api.adminUpsert('team', updated).catch(console.error);
  };
  const handleAddTeamMember = (member: TeamMember) => {
    setTeam((prev) => [member, ...prev]);
    void api.adminUpsert('team', member).catch(console.error);
  };
  const handleDeleteTeamMember = (id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
    void api.adminDelete('team', id).catch(console.error);
  };

  const handleResetAllData = () => {
    setProducts(PRODUCTS);
    setBranches(BRANCHES);
    setBlogs(BLOG_POSTS);
    setOrders(INITIAL_ORDERS);
    setTeam(TEAM_MEMBERS);
    localStorage.removeItem('kaffiika_products_v2');
    localStorage.removeItem('kaffiika_branches_v4');
    localStorage.removeItem('kaffiika_blogs_v2');
    localStorage.removeItem('kaffiika_orders_v2');
    localStorage.removeItem('kaffiika_team_v1');
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
              href="/branches"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/branches');
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
              href={`tel:${COMPANY_INFO.primaryPhone}`}
              className="hidden md:inline-flex items-center gap-1.5 font-semibold text-sky-100 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Call Sales Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* ==================== STICKY MULTI-PAGE NAVIGATION HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-xs">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Official Kaffiika Logo from https://kaffiikafeeds.com/ */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('/');
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_GROUPS.map((group) => {
              const items = group.items || [];
              const isDirect = !items.length && group.route;
              const isActive = isDirect ? currentPage === group.route : items.some((i) => i.route === currentPage);
              if (isDirect) {
                return (
                  <a key={group.id} href={group.route} onClick={(e) => { e.preventDefault(); setOpenDesktopNav(null); handleNavigate(group.route!); }}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all ${isActive ? 'bg-[#065AA7] text-white shadow-xs' : 'text-[#0A1E3C] hover:bg-[#E6EFF8] hover:text-[#065AA7]'}`}>
                    {group.label}
                  </a>
                );
              }
              const open = openDesktopNav === group.id;
              return (
                <div key={group.id} className="relative" onMouseEnter={() => setOpenDesktopNav(group.id)} onMouseLeave={() => setOpenDesktopNav(null)}>
                  <button type="button" onClick={() => setOpenDesktopNav(open ? null : group.id)}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${isActive ? 'bg-[#065AA7] text-white shadow-xs' : 'text-[#0A1E3C] hover:bg-[#E6EFF8] hover:text-[#065AA7]'}`}>
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-sky-200 rounded-xl shadow-xl p-1.5 z-50">
                      {items.map((item) => {
                        const active = currentPage === item.route;
                        return (
                          <a key={item.route} href={item.route} onClick={(e) => { e.preventDefault(); setOpenDesktopNav(null); handleNavigate(item.route); }}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${active ? 'bg-[#E6EFF8] text-[#065AA7]' : 'text-[#0A1E3C] hover:bg-[#F4F7FB]'}`}>
                            <span>{item.label}</span>
                            {item.badge && <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded-full bg-[#E6EFF8] text-[#065AA7]">{item.badge}</span>}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Controls: Auth, Quote Drawer & Mobile Menu */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#E6EFF8] hover:bg-sky-100 text-[#0A1E3C] text-xs font-bold cursor-pointer max-w-[220px]"
                title="My Profile"
              >
                {currentUser.photoUrl ? (
                  <img src={currentUser.photoUrl} alt={currentUser.name} className="w-8 h-8 rounded-lg object-cover border border-sky-200" />
                ) : (
                  <span className="w-8 h-8 rounded-lg bg-[#065AA7] text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </span>
                )}
                <span className="truncate pr-1">{currentUser.name}</span>
              </button>
            ) : (
              <button type="button" onClick={() => setIsAuthModalOpen(true)} className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#E6EFF8] hover:bg-sky-100 text-[#065AA7] text-xs sm:text-sm font-bold cursor-pointer">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

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
            {NAV_GROUPS.map((group) => {
              const items = group.items || [];
              if (!items.length && group.route) {
                const active = currentPage === group.route;
                return (
                  <a key={group.id} href={group.route} onClick={(e) => { e.preventDefault(); handleNavigate(group.route!); }}
                    className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl font-bold text-sm ${active ? 'bg-[#065AA7] text-white' : 'text-[#0A1E3C] hover:bg-[#E6EFF8]'}`}>
                    <span>{group.label}</span>
                  </a>
                );
              }
              return (
                <div key={group.id} className="pt-1">
                  <div className="px-3.5 py-1.5 text-[11px] font-mono-tech font-bold uppercase tracking-wider text-slate-400">{group.label}</div>
                  {items.map((item) => {
                    const active = currentPage === item.route;
                    return (
                      <a key={item.route} href={item.route} onClick={(e) => { e.preventDefault(); handleNavigate(item.route); }}
                        className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl font-bold text-sm ${active ? 'bg-[#065AA7] text-white' : 'text-[#0A1E3C] hover:bg-[#E6EFF8]'}`}>
                        <span>{item.label}</span>
                        {item.badge && <span className={`font-mono-tech text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-[#F59E0B] text-[#061A36]' : 'bg-[#E6EFF8] text-[#065AA7]'}`}>{item.badge}</span>}
                      </a>
                    );
                  })}
                </div>
              );
            })}
            <div className="pt-2 border-t border-sky-100 mt-2 space-y-2">
              {currentUser ? (
                <>
                  <button type="button" onClick={() => { setIsProfileModalOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl font-bold text-sm bg-[#E6EFF8] text-[#065AA7] cursor-pointer">
                    <span className="truncate">My Profile ({currentUser.name})</span>
                    <User className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 cursor-pointer">
                    <span>Sign Out</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl font-bold text-sm bg-[#065AA7] text-white cursor-pointer">
                  <span>Sign In / Create Account</span>
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ==================== MULTI-PAGE ROUTER VIEWPORT ==================== */}
      <main className="flex-1">
        {currentPage === '/' && (
          <HomePage
            products={products}
            blogs={blogs}
            onNavigate={handleNavigate}
            onSelectProduct={(prod) => setActiveModalProduct(prod)}
            onAddToQuote={handleAddToQuote}
          />
        )}

        {currentPage === '/about' && (
          <AboutPage team={team} onNavigate={handleNavigate} />
        )}

        {currentPage === '/products' && (
          <ProductsPage
            products={products}
            initialCategory={initialProductCategory}
            onNavigate={handleNavigate}
            onSelectProduct={(prod) => setActiveModalProduct(prod)}
            onAddToQuote={handleAddToQuote}
          />
        )}

        {currentPage === '/farming-guides' && (
          <FarmingGuidesPage
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={(prod) => setActiveModalProduct(prod)}
          />
        )}

        {currentPage === '/calculator' && (
          <CalculatorPage
            products={products}
            onNavigate={handleNavigate}
            onAddMultipleToQuote={handleAddMultipleToQuote}
          />
        )}

        {currentPage === '/branches' && (
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

        {currentPage === '/media-gallery' && (
          <MediaBlogPage blogs={blogs} onNavigate={handleNavigate} />
        )}

        {currentPage === '/contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}

        {currentPage === '/admin' && (
          <AdminPage
            products={products}
            branches={branches}
            blogs={blogs}
            orders={orders}
            team={team}
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
            onUpdateTeamMember={handleUpdateTeamMember}
            onAddTeamMember={handleAddTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
            onResetAllData={handleResetAllData}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === '/privacy-policy' && (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        )}
        {currentPage === '/terms' && <TermsPage onNavigate={handleNavigate} />}
        {currentPage === '/delivery-policy' && (
          <DeliveryPolicyPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* ==================== CORPORATE BLUE FOOTER ==================== */}
      {currentPage !== '/admin' && (
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

            {/* Col 2: Quick Links */}
            <div className="lg:col-span-3 space-y-2 text-xs sm:text-sm">
              <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#F59E0B] font-bold mb-3">
                Quick Links
              </h4>
              {NAV_PAGES.map((p) => (
                <a
                  key={p.route}
                  href={p.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(p.route);
                  }}
                  className="block text-sky-200 hover:text-white transition-colors"
                >
                  {p.label}
                </a>
              ))}
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/admin');
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-[#F59E0B] border border-white/15 transition-colors mt-2"
                aria-label="Admin"
                title="Admin"
              >
                <Shield className="w-4 h-4" />
              </a>
              <div className="pt-2 space-y-1.5 border-t border-white/10 mt-2">
                <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); handleNavigate('/privacy-policy'); }} className="block text-sky-200 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" onClick={(e) => { e.preventDefault(); handleNavigate('/terms'); }} className="block text-sky-200 hover:text-white transition-colors">Terms & Conditions</a>
                <a href="/delivery-policy" onClick={(e) => { e.preventDefault(); handleNavigate('/delivery-policy'); }} className="block text-sky-200 hover:text-white transition-colors">Delivery & Pickup Policy</a>
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
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate('/products', cat);
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
      )}

      {/* ==================== FLOATING WHATSAPP & TOAST NOTIFICATION ==================== */}
      {toastMessage && (
        <div className={`fixed ${currentPage === '/admin' ? 'bottom-40 md:bottom-20' : 'bottom-20'} right-5 z-50 bg-[#061A36] text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-[#F59E0B] flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-bounce`}>
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
        className={`fixed ${currentPage === '/admin' ? 'bottom-24 md:bottom-5' : 'bottom-5'} right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#065AA7] hover:bg-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-xl border-2 border-white/25 transition-transform hover:scale-105`}
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
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        user={currentUser}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdate={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
