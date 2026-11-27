import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MapPin,
  FileText,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Lock,
  LogOut,
  Search,
  TrendingUp,
  Building2,
  AlertTriangle,
  ExternalLink,
  Save,
  X,
  Settings,
  Upload,
  User,
  Users,
  Mail,
  Phone,
  Eye,
  Menu,
  ChevronDown,
} from 'lucide-react';
import {
  Product,
  Branch,
  BlogPost,
  CustomerOrder,
  FeedCategory,
  PageRoute,
  TeamMember,
  COMPANY_INFO,
  KAFFIIKA_ASSETS,
} from '../data/kaffiikaData';
import { api, setAdminToken, getAdminToken } from '../lib/api';

interface AdminPageProps {
  products: Product[];
  branches: Branch[];
  blogs: BlogPost[];
  orders: CustomerOrder[];
  team: TeamMember[];
  onUpdateProduct: (updated: Product) => void;
  onAddProduct: (newProd: Product) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateOrderStatus: (
    orderId: string,
    status: CustomerOrder['status']
  ) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateBranch: (updated: Branch) => void;
  onAddBranch: (newBranch: Branch) => void;
  onDeleteBranch: (branchId: string) => void;
  onAddBlog: (newBlog: BlogPost) => void;
  onDeleteBlog: (blogId: string) => void;
  onUpdateTeamMember: (updated: TeamMember) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (id: string) => void;
  onResetAllData: () => void;
  onNavigate: (page: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  branches,
  blogs,
  orders,
  team,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateBranch,
  onAddBranch,
  onDeleteBranch,
  onAddBlog,
  onDeleteBlog,
  onUpdateTeamMember,
  onAddTeamMember,
  onDeleteTeamMember,
  onResetAllData,
  onNavigate,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAdminToken());
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  type AdminModule = 'dashboard' | 'products' | 'orders' | 'branches' | 'blogs' | 'team' | 'users' | 'logs' | 'settings';
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['overview', 'catalog', 'operations', 'people', 'system']);

  const [users, setUsers] = useState<any[]>([]);
  const [adminOrders, setAdminOrders] = useState<CustomerOrder[]>(orders);

  useEffect(() => { setAdminOrders(orders); }, [orders]);

  const refreshAdminData = async () => {
    try {
      const [u, o, l] = await Promise.all([api.adminUsers().catch(() => []), api.adminOrders().catch(() => []), api.adminLogs().catch(() => [])]);
      if (Array.isArray(u)) setUsers(u);
      if (Array.isArray(l)) setLogs(l);
      if (Array.isArray(o)) setAdminOrders(o);
      return { users: u, orders: o, logs: l };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated) { refreshAdminData(); }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeModule === 'users' || activeModule === 'logs' || activeModule === 'orders') {
      refreshAdminData();
    }
  }, [activeModule]);

  // Product Management State
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<FeedCategory>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<{
    name: string;
    code: string;
    category: Exclude<FeedCategory, 'All'>;
    weightKg: number;
    priceUgx: number;
    brand: 'Koudijs' | 'Kaffiika';
    feedType: Product['feedType'];
    summary: string;
    keySpec: string;
    imageUrl: string;
  }>({
    name: '',
    code: '',
    category: 'Layers',
    weightKg: 50,
    priceUgx: 200000,
    brand: 'Koudijs',
    feedType: 'Concentrate',
    summary: 'Customized high-performance feed ration for Ugandan livestock farmers.',
    keySpec: '50kg Commercial Bag • Official Formula',
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
  });

  // Branch Management State
  const [branchSearch, setBranchSearch] = useState('');
  const [newBranchForm, setNewBranchForm] = useState<{
    name: string;
    manager: string;
    phone: string;
    region: Branch['region'];
    districtOrArea: string;
  }>({
    name: '',
    manager: '',
    phone: '+256 ',
    region: 'Wakiso & Central',
    districtOrArea: '',
  });

  // Blog Management State
  const [newBlogForm, setNewBlogForm] = useState({
    title: '',
    category: 'Farmer Training',
    summary: '',
    location: '',
    imageUrl: '/kaffiika-media/public/uploads/news/post_20220418163035235.jpg',
    videoUrl: '',
    content: '',
  });

  const [newTeamForm, setNewTeamForm] = useState({
    name: '', role: '', email: '', phone: '+256 ', department: 'Regional Sales Management' as TeamMember['department'], bio: '', photoUrl: '',
  });

  const [adminToast, setAdminToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 2600);
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  const uploadFile = async (file: File, folder: string) => {
    const dataUrl = await fileToDataUrl(file);
    const r = await api.upload(dataUrl, folder, file.name, true);
    return r.url as string;
  };

  // KPIs
  const totalRevenueUgx = adminOrders.reduce((s, o) => s + o.totalAmountUgx, 0);
  const pendingOrdersCount = adminOrders.filter((o) => o.status === 'Pending').length;
  const totalInventoryBags = products.reduce(
    (s, p) => s + (p.stockBags ?? 200),
    0
  );
  const lowStockCount = products.filter(
    (p) => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock'
  ).length;

  const filteredAdminProducts = products.filter((p) => {
    const matchesCat =
      productCatFilter === 'All' || p.category === productCatFilter;
    const q = productSearch.trim().toLowerCase();
    const matchesQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = Math.max(...products.map((p) => p.id), 60) + 1;
    const created: Product = {
      id: nextId,
      name: newProductForm.name,
      code: newProductForm.code || newProductForm.name.slice(0, 8).toUpperCase(),
      category: newProductForm.category,
      units: `${newProductForm.weightKg}kg bag`,
      weightKg: Number(newProductForm.weightKg),
      priceUgx: Number(newProductForm.priceUgx),
      brand: newProductForm.brand,
      feedType: newProductForm.feedType,
      summary: newProductForm.summary,
      targetStage: `${newProductForm.category} Production Stage`,
      keySpec: newProductForm.keySpec,
      inclusionOrDosage: 'Follow Kaffiika technical mixing chart',
      benefits: [
        'High digestibility and feed conversion efficiency',
        'Formulated for Ugandan farm conditions',
        'Backed by Kaffiika technical support',
      ],
      imageUrl: newProductForm.imageUrl,
      stockStatus: 'In Stock',
      stockBags: 250,
    };
    onAddProduct(created);
    setIsAddingProduct(false);
    notify(`Created new product: ${created.name} (UGX ${created.priceUgx.toLocaleString()})`);
  };

  const handleCreateBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchForm.name.trim()) return;
    const created: Branch = {
      id: `branch-${Date.now()}`,
      name: newBranchForm.name,
      manager: newBranchForm.manager || 'Branch Manager',
      phones: [newBranchForm.phone || '+256 782 478 743'],
      region: newBranchForm.region,
      districtOrArea: newBranchForm.districtOrArea || newBranchForm.name,
      mapCoords: { x: 52, y: 62 },
    };
    onAddBranch(created);
    setNewBranchForm({
      name: '',
      manager: '',
      phone: '+256 ',
      region: 'Wakiso & Central',
      districtOrArea: '',
    });
    notify(`Added new branch: ${created.name}`);
  };

  const handleCreateBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogForm.title.trim()) return;
    const created: BlogPost = {
      id: `blog-${Date.now()}`,
      title: newBlogForm.title,
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        year: 'numeric',
      }),
      author: 'Admin',
      category: newBlogForm.category,
      summary: newBlogForm.summary,
      location: newBlogForm.location || undefined,
      imageUrl: newBlogForm.imageUrl,
      videoUrl: newBlogForm.videoUrl || undefined,
      content: newBlogForm.content
        .split('\n')
        .filter((l) => l.trim().length > 0),
    };
    onAddBlog(created);
    setNewBlogForm({
      title: '',
      category: 'Farmer Training',
      summary: '',
      location: '',
      imageUrl:
        '/kaffiika-media/public/uploads/news/post_20220418163035235.jpg',
      videoUrl: '',
      content: '',
    });
    notify(`Published blog post: ${created.title}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[82vh] bg-blue-mesh flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-sky-200 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={KAFFIIKA_ASSETS.logo}
              alt="Kaffiika Animal Feeds"
              className="h-12 object-contain"
            />
            <div>
              <span className="text-xs font-mono-tech uppercase text-[#065AA7] font-bold block">
                ADMINISTRATION PORTAL
              </span>
              <h1 className="text-xl font-bold text-[#0A1E3C]">
                Kaffiika ERP Sign In
              </h1>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoginError(null);
              try {
                const r = await api.adminLogin({ password: loginPassword });
                setAdminToken(r.token);
                setIsAuthenticated(true);
                setLoginPassword('');
                notify('Admin signed in.');
              } catch (err: any) {
                setLoginError(err.message || 'Incorrect password.');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                placeholder="Enter admin password"
              />
            </div>
            {loginError && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{loginError}</div>}
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Admin Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navGroups: { id: string; label: string; icon: React.ElementType; items: { id: AdminModule; label: string; icon: React.ElementType; badge?: string }[] }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]},
    { id: 'catalog', label: 'Catalog', icon: Package, items: [
      { id: 'products', label: `Products (${products.length})`, icon: Package },
      { id: 'blogs', label: `Blogs & Trainings (${blogs.length})`, icon: FileText },
    ]},
    { id: 'operations', label: 'Operations', icon: ShoppingBag, items: [
      { id: 'orders', label: `Orders (${adminOrders.length})`, icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined },
      { id: 'branches', label: `Branches (${branches.length})`, icon: MapPin },
    ]},
    { id: 'people', label: 'People', icon: Users, items: [
      { id: 'team', label: `Team (${team.length})`, icon: User },
      { id: 'users', label: `Users (${users.length})`, icon: Users },
    ]},
    { id: 'system', label: 'System', icon: Settings, items: [
      { id: 'logs', label: `Logs (${logs.length})`, icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]},
  ];

  const activeGroup = navGroups.find((g) => g.items.some((i) => i.id === activeModule))?.id || 'overview';
  const toggleGroup = (id: string) => setExpandedGroups((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);
  const goTo = (id: AdminModule) => { setActiveModule(id); setMobileNavOpen(false); };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4 border-b border-sky-200/70 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono-tech font-bold text-[#065AA7] uppercase tracking-wider">Admin</div>
          <div className="text-sm font-bold text-[#0A1E3C]">Dashboard Menu</div>
        </div>
        {mobile && <button type="button" onClick={() => setMobileNavOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const expanded = expandedGroups.includes(group.id);
          const groupActive = activeGroup === group.id;
          return (
            <div key={group.id} className="rounded-xl border border-sky-100 overflow-hidden">
              <button type="button" onClick={() => toggleGroup(group.id)} className={`w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer ${groupActive ? 'bg-[#E6EFF8] text-[#065AA7]' : 'bg-white text-[#0A1E3C] hover:bg-slate-50'}`}>
                <span className="flex items-center gap-2 text-sm font-bold"><GroupIcon className="w-4 h-4" />{group.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
                <div className="p-1.5 bg-white border-t border-sky-100 space-y-1">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const active = activeModule === item.id;
                    return (
                      <button key={item.id} type="button" onClick={() => goTo(item.id)} className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left text-xs font-semibold cursor-pointer ${active ? 'bg-[#065AA7] text-white' : 'text-slate-700 hover:bg-[#F4F7FB]'}`}>
                        <span className="flex items-center gap-2"><ItemIcon className="w-4 h-4" />{item.label}</span>
                        {item.badge && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold ${active ? 'bg-white/20 text-white' : 'bg-[#F59E0B] text-[#061A36]'}`}>{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-20 md:pb-0">
      {/* Admin Top Header Bar */}
      <div className="bg-[#061A36] text-white border-b border-sky-400/20 py-6">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#065AA7] border border-sky-400/40 flex items-center justify-center">
              <img
                src={KAFFIIKA_ASSETS.accountIcon}
                alt="Admin"
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-tech uppercase tracking-wider px-2 py-0.5 rounded bg-[#F59E0B] text-[#061A36] font-bold">
                  ERP ADMIN PORTAL
                </span>
                <span className="text-xs text-sky-300 font-mono-tech">
                  {COMPANY_INFO.email}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Kaffiika Animal Feeds — Management Console
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/products"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/products');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-sky-200 border border-white/15"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </a>

            <button
              type="button"
              onClick={() => setActiveModule('logs')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold cursor-pointer"
              title="View system activity logs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Logs</span>
            </button>

            <button
              type="button"
              onClick={() => { setAdminToken(''); setIsAuthenticated(false); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Toast Notification */}
      {adminToast && (
        <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 bg-[#061A36] text-white px-5 py-3.5 rounded-xl shadow-2xl border-2 border-[#F59E0B] flex items-center gap-2.5 text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
          <span>{adminToast}</span>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:hidden mb-4 flex items-center justify-between bg-white border border-sky-200 rounded-xl p-3">
          <button type="button" onClick={() => setMobileNavOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E6EFF8] text-[#065AA7] text-xs font-bold cursor-pointer"><Menu className="w-4 h-4" /> Menu</button>
          <div className="text-xs font-bold text-slate-600 truncate ml-3">{navGroups.flatMap(g => g.items).find(i => i.id === activeModule)?.label}</div>
        </div>
        <div className="flex gap-6 items-start">
          <aside className="hidden md:block w-72 shrink-0 sticky top-4">
            <div className="bg-white border border-sky-200 rounded-2xl shadow-sm overflow-hidden max-h-[calc(100vh-2rem)]">
              <SidebarContent />
            </div>
          </aside>
          <main className="flex-1 min-w-0">

        {/* ==================== MODULE 1: EXECUTIVE DASHBOARD ==================== */}
        {activeModule === 'dashboard' && (
          <div className="space-y-8">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                  <span>Order Pipeline Value</span>
                  <TrendingUp className="w-4 h-4 text-[#065AA7]" />
                </div>
                <div className="font-mono-tech text-2xl font-bold text-[#065AA7]">
                  UGX {totalRevenueUgx.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Across {adminOrders.length} active proforma & branch orders
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                  <span>Active Feed Products</span>
                  <Package className="w-4 h-4 text-[#0284C7]" />
                </div>
                <div className="font-mono-tech text-2xl font-bold text-[#0A1E3C]">
                  {products.length} Products
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {totalInventoryBags.toLocaleString()} total bags in branch stock
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                  <span>Ugandan Branch Network</span>
                  <Building2 className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="font-mono-tech text-2xl font-bold text-[#0A1E3C]">
                  {branches.length} Branches
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Kampala HQ + Central, Eastern & Western
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                  <span>Pending Dispatch / Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="font-mono-tech text-2xl font-bold text-[#0A1E3C]">
                  {pendingOrdersCount} Pending Orders
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {lowStockCount} products marked low/out of stock
                </div>
              </div>
            </div>

            {/* Category Breakdown & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-sky-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0A1E3C]">
                    Catalog Breakdown by Species Category
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveModule('products')}
                    className="text-xs font-bold text-[#065AA7] hover:underline cursor-pointer"
                  >
                    Manage Prices →
                  </button>
                </div>

                <div className="space-y-3">
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
                  ).map((cat) => {
                    const catProds = products.filter((p) => p.category === cat);
                    const avgPrice =
                      catProds.length > 0
                        ? Math.round(
                            catProds.reduce((s, p) => s + p.priceUgx, 0) /
                              catProds.length
                          )
                        : 0;
                    const pct = Math.round((catProds.length / products.length) * 100);

                    return (
                      <div
                        key={cat}
                        className="p-3.5 rounded-xl bg-[#F4F7FB] border border-sky-100"
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-[#0A1E3C]">
                            {cat} ({catProds.length} products)
                          </span>
                          <span className="font-mono-tech text-[#065AA7]">
                            Avg: UGX {avgPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-sky-100 overflow-hidden">
                          <div
                            className="h-full bg-[#065AA7] rounded-full"
                            style={{ width: `${Math.max(8, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Customer Orders */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-sky-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0A1E3C]">
                    Recent Customer Feed Orders
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveModule('orders')}
                    className="text-xs font-bold text-[#065AA7] hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="space-y-3">
                  {adminOrders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl bg-[#F4F7FB] border border-sky-200 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-tech text-xs font-bold text-[#065AA7]">
                            {ord.reference}
                          </span>
                          <span className="text-xs font-bold text-[#0A1E3C]">
                            {ord.customerName}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {ord.branchName} • {ord.totalBags} bags ({ord.totalWeightKg} kg)
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono-tech text-sm font-bold text-[#065AA7]">
                          UGX {ord.totalAmountUgx.toLocaleString()}
                        </div>
                        <select
                          value={ord.status}
                          onChange={async (e) => {
                            const status = e.target.value as CustomerOrder['status'];
                            try { await api.adminUpdateOrderStatus(ord.id, status); } catch {}
                            onUpdateOrderStatus(ord.id, status);
                            setAdminOrders((prev) => prev.map((o) => o.id === ord.id ? { ...o, status } : o));
                            notify(`Updated order ${ord.reference} to ${status}`);
                          }}
                          className="mt-1 px-2 py-0.5 rounded bg-white border border-sky-300 text-[11px] font-bold text-[#0A1E3C]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODULE 2: PRODUCTS & PRICING CRUD ==================== */}
        {activeModule === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-sky-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Filter products by name or code..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>
                <select
                  value={productCatFilter}
                  onChange={(e) =>
                    setProductCatFilter(e.target.value as FeedCategory)
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-xs font-bold text-[#0A1E3C]"
                >
                  <option value="All">All Categories ({products.length})</option>
                  <option value="Chicks">Chicks</option>
                  <option value="Broilers">Broilers</option>
                  <option value="Layers">Layers</option>
                  <option value="Piggery">Piggery</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Speciality Products">Speciality Products</option>
                  <option value="Fish">Fish</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingProduct(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Feed Product</span>
              </button>
            </div>

            {/* Add New Product Form Modal */}
            {isAddingProduct && (
              <div className="bg-white rounded-2xl p-6 border-2 border-[#065AA7] shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0A1E3C]">
                    Add New Feed Product to Kaffiika Catalog
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={handleCreateProductSubmit}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductForm.name}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. Koudijs Super Grower"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Product Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductForm.code}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          code: e.target.value,
                        })
                      }
                      placeholder="e.g. KSG 25"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Category *
                    </label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          category: e.target.value as Exclude<FeedCategory, 'All'>,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                    >
                      <option value="Chicks">Chicks</option>
                      <option value="Broilers">Broilers</option>
                      <option value="Layers">Layers</option>
                      <option value="Piggery">Piggery</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Speciality Products">Speciality Products</option>
                      <option value="Fish">Fish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Bag Weight (KG) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProductForm.weightKg}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          weightKg: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Unit Price (UGX) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={newProductForm.priceUgx}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          priceUgx: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Official Kaffiika Product Image
                    </label>
                    <select
                      value={newProductForm.imageUrl}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          imageUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                    >
                      <option value={KAFFIIKA_ASSETS.productUploads.layers}>
                        layers.jpg (Chicks / Layers)
                      </option>
                      <option value={KAFFIIKA_ASSETS.productUploads.broilers}>
                        broilers.jpg (Broilers)
                      </option>
                      <option value={KAFFIIKA_ASSETS.productUploads.default}>
                        default.jpg (Piggery Concentrates)
                      </option>
                      <option value={KAFFIIKA_ASSETS.productUploads.knursemeal}>
                        pdt20230325105340773.jpg (Knursemeal)
                      </option>
                      <option value={KAFFIIKA_ASSETS.productUploads.cows}>
                        cows.jpg (Dairy & Calves)
                      </option>
                      <option value={KAFFIIKA_ASSETS.productUploads.tilapia}>
                        tilapia.jpg (Fish / Aqua)
                      </option>
                    </select>
                    <div className="flex items-center gap-2 mt-2"><input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { setNewProductForm({ ...newProductForm, imageUrl: await uploadFile(f, 'products') }); } catch (err: any) { notify(err.message || 'Upload failed'); } } }} className="w-full text-xs" /><button type="button" onClick={() => setNewProductForm({ ...newProductForm, imageUrl: '' })} className="px-2 py-1 rounded bg-red-50 text-red-600 text-[11px] font-bold cursor-pointer">Clear</button></div>
                    <p className="text-[11px] text-slate-500 mt-1">Upload an image or choose a preset above.</p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Technical Summary
                    </label>
                    <input
                      type="text"
                      value={newProductForm.summary}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          summary: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#065AA7] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Product to Storefront
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="bg-white rounded-2xl p-6 border-2 border-[#F59E0B] shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0A1E3C]">Edit Product: {editingProduct.name}</h3>
                  <button type="button" onClick={() => setEditingProduct(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-slate-600 mb-1">Product Name</label><input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1">Product Code</label><input type="text" value={editingProduct.code} onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech" /></div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1">Unit Price (UGX)</label><input type="number" value={editingProduct.priceUgx} onChange={(e) => setEditingProduct({ ...editingProduct, priceUgx: Number(e.target.value) })} className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech font-bold text-[#065AA7]" /></div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1">Units</label><input type="text" value={editingProduct.units} onChange={(e) => setEditingProduct({ ...editingProduct, units: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1">Stock (Bags)</label><input type="number" value={editingProduct.stockBags ?? 0} onChange={(e) => setEditingProduct({ ...editingProduct, stockBags: Number(e.target.value) })} className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" /></div>
                  <div className="sm:col-span-3"><label className="block text-xs font-bold text-slate-600 mb-1">Summary</label><input type="text" value={editingProduct.summary} onChange={(e) => setEditingProduct({ ...editingProduct, summary: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" /></div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Product Image</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-4 h-4" /> Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { setEditingProduct({ ...editingProduct, imageUrl: await uploadFile(f, 'products') }); } catch (err: any) { notify(err.message || 'Upload failed'); } } e.target.value=''; }} />
                      </label>
                      {editingProduct.imageUrl && <button type="button" onClick={() => setEditingProduct({ ...editingProduct, imageUrl: '' })} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold cursor-pointer">Remove Image</button>}
                    </div>
                    {editingProduct.imageUrl ? <img src={editingProduct.imageUrl} alt="" className="mt-3 w-24 h-24 rounded-xl object-cover border border-sky-200" /> : <div className="mt-3 w-24 h-24 rounded-xl border-2 border-dashed border-sky-200 bg-[#F4F7FB] flex items-center justify-center text-[11px] text-slate-400">No image</div>}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold cursor-pointer">Cancel</button>
                  <button type="button" onClick={() => { onUpdateProduct(editingProduct); notify(`Saved changes to ${editingProduct.name}`); setEditingProduct(null); }} className="px-5 py-2 rounded-xl bg-[#065AA7] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Update Product</button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#061A36] text-white text-xs font-mono-tech uppercase">
                      <th className="py-3.5 px-4">Image</th>
                      <th className="py-3.5 px-4">Name & Code</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Units</th>
                      <th className="py-3.5 px-4">Unit Price (UGX)</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100 text-sm">
                    {filteredAdminProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#F4F7FB]">
                        <td className="py-3 px-4">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover border border-sky-200"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#0A1E3C]">
                            {prod.name}
                          </div>
                          <div className="font-mono-tech text-xs text-[#065AA7]">
                            Code: {prod.code}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#E6EFF8] text-[#065AA7] text-xs font-bold">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono-tech text-xs font-bold">
                          {prod.units}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step={500}
                            value={prod.priceUgx}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              onUpdateProduct({ ...prod, priceUgx: val });
                            }}
                            className="w-32 px-2.5 py-1.5 rounded-lg bg-[#F4F7FB] border border-sky-300 font-mono-tech text-xs font-bold text-[#065AA7]"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={prod.stockStatus || 'In Stock'}
                            onChange={(e) => {
                              onUpdateProduct({
                                ...prod,
                                stockStatus: e.target.value as Product['stockStatus'],
                              });
                              notify(
                                `${prod.code} marked as ${e.target.value}`
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              prod.stockStatus === 'Out of Stock'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : prod.stockStatus === 'Low Stock'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prod)}
                            className="p-2 rounded-lg bg-[#E6EFF8] hover:bg-[#065AA7] hover:text-white text-[#065AA7] cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteProduct(prod.id);
                              notify(`Deleted ${prod.name}`);
                            }}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODULE 3: CUSTOMER ORDERS & DISPATCH ==================== */}
        {activeModule === 'orders' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-sky-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0A1E3C]">
                  Customer Feed Orders & Proforma Quotes ({adminOrders.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Any quote submitted by a farmer in the storefront Quote Drawer appears
                  here automatically.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {adminOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-sky-200 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono-tech text-xs font-bold px-2.5 py-1 rounded bg-[#065AA7] text-white">
                          {order.reference}
                        </span>
                        <h4 className="font-bold text-lg text-[#0A1E3C]">
                          {order.customerName}
                        </h4>
                        <span className="font-mono-tech text-xs text-slate-500">
                          ({order.customerPhone})
                        </span>
                        {order.customerEmail && (
                          <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> {order.customerEmail}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Assigned Branch: <strong>{order.branchName}</strong> •{' '}
                        <strong>{order.deliveryMode}</strong> • Created:{' '}
                        <span className="font-mono-tech">{order.createdAt}</span>
                        {order.userId && <span className="ml-2 font-mono-tech text-slate-400">User: {order.userId}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const status = e.target.value as CustomerOrder['status'];
                          try { await api.adminUpdateOrderStatus(order.id, status); } catch {}
                          onUpdateOrderStatus(order.id, status);
                          setAdminOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status } : o));
                          notify(`Order ${order.reference} status updated!`);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#F4F7FB] border border-sky-300 text-xs font-bold text-[#065AA7]"
                      >
                        <option value="Pending">Status: Pending</option>
                        <option value="Processing">Status: Processing</option>
                        <option value="Dispatched">Status: Dispatched</option>
                        <option value="Completed">Status: Completed</option>
                      </select>

                      <button
                        type="button"
                        onClick={async () => {
                          try { await api.adminDeleteOrder(order.id); } catch {}
                          onDeleteOrder(order.id);
                          setAdminOrders((prev) => prev.filter((o) => o.id !== order.id));
                          notify(`Removed order ${order.reference}`);
                        }}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 cursor-pointer"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#F4F7FB] border border-sky-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#0A1E3C] block">
                            {item.quantity}× {item.productName} ({item.productCode})
                          </span>
                          <span className="text-slate-500 font-mono-tech">
                            {item.units} @ UGX {item.unitPriceUgx.toLocaleString()}
                          </span>
                        </div>
                        <span className="font-mono-tech font-bold text-[#065AA7]">
                          UGX {(item.quantity * item.unitPriceUgx).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs">
                    <span className="font-mono-tech text-slate-600">
                      Total Tonnage: <strong>{order.totalWeightKg} kg</strong> (
                      {order.totalBags} bags)
                    </span>
                    <span className="font-mono-tech text-base font-bold text-[#065AA7]">
                      Order Total: UGX {order.totalAmountUgx.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== MODULE 4: BRANCHES & MANAGERS CRUD ==================== */}
        {activeModule === 'branches' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Add New Branch Form (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-sky-200 shadow-2xs">
              <h3 className="text-lg font-bold text-[#0A1E3C] mb-4">
                Add New Regional Branch
              </h3>
              <form onSubmit={handleCreateBranchSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchForm.name}
                    onChange={(e) =>
                      setNewBranchForm({ ...newBranchForm, name: e.target.value })
                    }
                    placeholder="e.g. Lira Branch"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Branch Manager Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchForm.manager}
                    onChange={(e) =>
                      setNewBranchForm({
                        ...newBranchForm,
                        manager: e.target.value,
                      })
                    }
                    placeholder="e.g. Okello Daniel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Manager Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchForm.phone}
                    onChange={(e) =>
                      setNewBranchForm({
                        ...newBranchForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+256 772 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Region Corridor
                  </label>
                  <select
                    value={newBranchForm.region}
                    onChange={(e) =>
                      setNewBranchForm({
                        ...newBranchForm,
                        region: e.target.value as Branch['region'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  >
                    <option value="Kampala Metro">Kampala Metro</option>
                    <option value="Wakiso & Central">Wakiso & Central</option>
                    <option value="Mukono & Eastern">Mukono & Eastern</option>
                    <option value="Masaka & Western">Masaka & Western</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    District / Street Area
                  </label>
                  <input
                    type="text"
                    value={newBranchForm.districtOrArea}
                    onChange={(e) =>
                      setNewBranchForm({
                        ...newBranchForm,
                        districtOrArea: e.target.value,
                      })
                    }
                    placeholder="e.g. Main Street, Town Center"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Branch to Network</span>
                </button>
              </form>
            </div>

            {/* Branch List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-sky-200">
                <input
                  type="text"
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  placeholder="Search branches or managers..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches
                  .filter(
                    (b) =>
                      !branchSearch ||
                      b.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
                      b.manager.toLowerCase().includes(branchSearch.toLowerCase())
                  )
                  .map((branch) => (
                    <div
                      key={branch.id}
                      className="bg-white p-4 rounded-2xl border border-sky-200 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 rounded bg-[#E6EFF8] text-[#065AA7]">
                            {branch.region}
                          </span>
                          {!branch.isHeadquarters && (
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteBranch(branch.id);
                                notify(`Removed ${branch.name}`);
                              }}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <h4 className="font-bold text-base text-[#0A1E3C] mt-1">
                          {branch.name}
                        </h4>
                        <div className="mt-2 space-y-1.5">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block">
                              Manager Name
                            </label>
                            <input
                              type="text"
                              value={branch.manager}
                              onChange={(e) =>
                                onUpdateBranch({
                                  ...branch,
                                  manager: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1 rounded bg-[#F4F7FB] border border-sky-200 text-xs font-bold text-[#0A1E3C]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block">
                              Primary Phone
                            </label>
                            <input
                              type="text"
                              value={branch.phones[0] || ''}
                              onChange={(e) =>
                                onUpdateBranch({
                                  ...branch,
                                  phones: [
                                    e.target.value,
                                    ...branch.phones.slice(1),
                                  ],
                                })
                              }
                              className="w-full px-2.5 py-1 rounded bg-[#F4F7FB] border border-sky-200 text-xs font-mono-tech font-bold text-[#065AA7]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODULE 5: BLOGS & TRAININGS PUBLISHER ==================== */}
        {activeModule === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-sky-200 shadow-2xs">
              <h3 className="text-lg font-bold text-[#0A1E3C] mb-4">
                Publish New Farmer Training or Blog Post
              </h3>
              <form onSubmit={handleCreateBlogSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Post / Training Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlogForm.title}
                    onChange={(e) =>
                      setNewBlogForm({ ...newBlogForm, title: e.target.value })
                    }
                    placeholder="e.g. Poultry & Piggery Training in Masaka"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newBlogForm.category}
                    onChange={(e) =>
                      setNewBlogForm({
                        ...newBlogForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Venue / Date Info (Optional)
                  </label>
                  <input
                    type="text"
                    value={newBlogForm.location}
                    onChange={(e) =>
                      setNewBlogForm({
                        ...newBlogForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g. Masaka Town Hall • 9:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Cover Image</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4" /> Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { setNewBlogForm({ ...newBlogForm, imageUrl: await uploadFile(f, 'blogs') }); } catch (err: any) { notify(err.message || 'Upload failed'); } } e.target.value=''; }} />
                    </label>
                    {newBlogForm.imageUrl && <button type="button" onClick={() => setNewBlogForm({ ...newBlogForm, imageUrl: '' })} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold cursor-pointer">Remove</button>}
                  </div>
                  {newBlogForm.imageUrl ? <img src={newBlogForm.imageUrl} alt="" className="mt-3 w-full max-w-[220px] h-28 rounded-xl object-cover border border-sky-200" /> : <div className="mt-3 w-full max-w-[220px] h-28 rounded-xl border-2 border-dashed border-sky-200 bg-[#F4F7FB] flex items-center justify-center text-[11px] text-slate-400">No image uploaded</div>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Video (upload or URL, optional)</label>
                  <input type="file" accept="video/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { setNewBlogForm({ ...newBlogForm, videoUrl: await uploadFile(f, 'blogs/videos') }); } catch (err: any) { notify(err.message || 'Upload failed'); } } }} className="w-full text-xs mb-2" />
                  <div className="flex gap-2"><input type="text" value={newBlogForm.videoUrl} onChange={(e) => setNewBlogForm({ ...newBlogForm, videoUrl: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" placeholder="Video URL (mp4/webm)" /><button type="button" onClick={() => setNewBlogForm({ ...newBlogForm, videoUrl: '' })} className="px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold cursor-pointer">Clear</button></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Short Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlogForm.summary}
                    onChange={(e) =>
                      setNewBlogForm({
                        ...newBlogForm,
                        summary: e.target.value,
                      })
                    }
                    placeholder="Brief announcement summary..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Full Article Content *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newBlogForm.content}
                    onChange={(e) =>
                      setNewBlogForm({
                        ...newBlogForm,
                        content: e.target.value,
                      })
                    }
                    placeholder="Write details about the training or promotion..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer"
                >
                  Publish Post to Website
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-2xl border border-sky-200 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-20 h-20 rounded-xl object-cover border border-sky-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 rounded bg-[#E6EFF8] text-[#065AA7]">
                        {post.category} • {post.date}
                      </span>
                      <h4 className="font-bold text-base text-[#0A1E3C] mt-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteBlog(post.id);
                      notify(`Deleted blog post: ${post.title}`);
                    }}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeModule === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-sky-200 shadow-sm">
              <h3 className="text-lg font-bold text-[#0A1E3C] mb-4">Add Team Member / Manager</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newTeamForm.name.trim()) return;
                onAddTeamMember({
                  id: `team-${Date.now()}`, name: newTeamForm.name.trim(), role: newTeamForm.role.trim() || 'Manager',
                  email: newTeamForm.email.trim(), phones: [newTeamForm.phone.trim()].filter(Boolean),
                  department: newTeamForm.department, bio: newTeamForm.bio.trim(), photoUrl: newTeamForm.photoUrl.trim() || KAFFIIKA_ASSETS.accountIcon,
                });
                setNewTeamForm({ name: '', role: '', email: '', phone: '+256 ', department: 'Regional Sales Management', bio: '', photoUrl: '' });
                notify('Team member added.');
              }} className="space-y-3">
                <input value={newTeamForm.name} onChange={(e)=>setNewTeamForm({...newTeamForm,name:e.target.value})} placeholder="Full name *" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" />
                <input value={newTeamForm.role} onChange={(e)=>setNewTeamForm({...newTeamForm,role:e.target.value})} placeholder="Role / Title" className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" />
                <input value={newTeamForm.email} onChange={(e)=>setNewTeamForm({...newTeamForm,email:e.target.value})} placeholder="Email" className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" />
                <input value={newTeamForm.phone} onChange={(e)=>setNewTeamForm({...newTeamForm,phone:e.target.value})} placeholder="Phone" className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm font-mono-tech" />
                <select value={newTeamForm.department} onChange={(e)=>setNewTeamForm({...newTeamForm,department:e.target.value as TeamMember['department']})} className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm">
                  <option>Executive Leadership</option><option>Commercial & Operations</option><option>Regional Sales Management</option>
                </select>
                <textarea value={newTeamForm.bio} onChange={(e)=>setNewTeamForm({...newTeamForm,bio:e.target.value})} placeholder="Bio" rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" />
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Photo</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4" /> Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={async (e)=>{const f=e.target.files?.[0]; if(f) { try { setNewTeamForm({...newTeamForm, photoUrl: await uploadFile(f, 'team')}); } catch (err: any) { notify(err.message || 'Upload failed'); } } e.target.value=''; }} />
                    </label>
                    {newTeamForm.photoUrl && <button type="button" onClick={()=>setNewTeamForm({...newTeamForm,photoUrl:''})} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold cursor-pointer">Remove</button>}
                  </div>
                  {newTeamForm.photoUrl ? <img src={newTeamForm.photoUrl} alt="" className="mt-3 w-20 h-20 rounded-xl object-cover border border-sky-200" /> : <div className="mt-3 w-20 h-20 rounded-xl border-2 border-dashed border-sky-200 bg-[#F4F7FB] flex items-center justify-center text-[10px] text-slate-400">No photo</div>}
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer">Add Team Member</button>
              </form>
            </div>
            <div className="lg:col-span-8 space-y-4">
              {team.map((m) => (
                <div key={m.id} className="bg-white p-5 rounded-2xl border border-sky-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img src={m.photoUrl} alt={m.name} className="w-16 h-16 rounded-xl object-cover border border-sky-200 bg-slate-100" />
                    <div>
                      <div className="font-bold text-[#0A1E3C]">{m.name}</div>
                      <div className="text-xs text-[#065AA7] font-semibold">{m.role} • {m.department}</div>
                      <div className="text-xs text-slate-500 mt-1">{m.email} {m.phones?.[0] ? `• ${m.phones[0]}` : ''}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => { onDeleteTeamMember(m.id); notify(`Deleted ${m.name}`); }} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeModule === 'users' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-sky-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-[#0A1E3C]">Registered Users ({users.length})</h3>
                <p className="text-xs text-slate-500">Accounts that signed up/sign in on the website. Passwords are never shown.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('kaffiika_users_v1');
                    setUsers(raw ? JSON.parse(raw) : []);
                    notify('User list refreshed.');
                  } catch { setUsers([]); }
                }}
                className="px-4 py-2 rounded-xl bg-[#E6EFF8] hover:bg-sky-100 text-[#065AA7] text-xs font-bold cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {users.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-sky-200 text-center text-slate-500 text-sm">No registered users yet.</div>
            ) : (
              <div className="space-y-4">
                {users.map((u: any) => {
                  const userOrders = adminOrders.filter((o) => o.userId === u.id || (o.customerEmail && u.email && o.customerEmail.toLowerCase() === String(u.email).toLowerCase()));
                  return (
                    <div key={u.id || u.email} className="bg-white rounded-2xl border border-sky-200 p-5 shadow-2xs">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          {u.photoUrl ? (
                            <img src={u.photoUrl} alt={u.name || 'User'} className="w-14 h-14 rounded-xl object-cover border border-sky-200 bg-slate-100" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-[#E6EFF8] border border-sky-200 flex items-center justify-center text-[#065AA7]">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-[#0A1E3C]">{u.name || 'Unnamed User'}</h4>
                              <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full ${u.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {u.verified ? 'VERIFIED' : 'UNVERIFIED'}
                              </span>
                              <span className="text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#065AA7]">
                                {String(u.provider || 'email').toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                              <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{u.email}</span>
                              {u.id && <span className="font-mono-tech text-slate-400">ID: {u.id}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Orders</div>
                          <div className="font-mono-tech text-lg font-bold text-[#065AA7]">{userOrders.length}</div>
                          <div className="text-[11px] text-slate-500">UGX {userOrders.reduce((s, o) => s + o.totalAmountUgx, 0).toLocaleString()}</div>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
                              try { await api.adminDelete('users', u.id); notify('User deleted.'); await refreshAdminData(); }
                              catch (e: any) { notify(e.message || 'Failed to delete user'); }
                            }}
                            className="mt-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-[11px] font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-sky-100">
                        <div className="text-xs font-bold text-slate-600 mb-2">Order History</div>
                        {userOrders.length === 0 ? (
                          <div className="text-xs text-slate-400">No orders placed by this user yet.</div>
                        ) : (
                          <div className="space-y-2">
                            {userOrders.map((o) => (
                              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#F4F7FB] border border-sky-100 text-xs">
                                <div>
                                  <span className="font-mono-tech font-bold text-[#065AA7]">{o.reference}</span>
                                  <span className="text-slate-500 ml-2">{o.createdAt}</span>
                                  <div className="text-slate-600 mt-0.5">{o.totalBags} bags • {o.branchName} • {o.deliveryMode}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                    o.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                    o.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' :
                                    o.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>{o.status}</span>
                                  <span className="font-mono-tech font-bold text-[#0A1E3C]">UGX {o.totalAmountUgx.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeModule === 'logs' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-sky-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-[#0A1E3C]">System Activity Logs ({logs.length})</h3>
                <p className="text-xs text-slate-500">Tracks sign-ins, orders, admin actions, and profile changes.</p>
              </div>
              <button type="button" onClick={refreshAdminData} className="px-4 py-2 rounded-xl bg-[#E6EFF8] hover:bg-sky-100 text-[#065AA7] text-xs font-bold cursor-pointer">Refresh</button>
            </div>
            <div className="bg-white rounded-2xl border border-sky-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F4F7FB] text-slate-600 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-3">Time</th>
                      <th className="text-left px-4 py-3">Actor</th>
                      <th className="text-left px-4 py-3">Action</th>
                      <th className="text-left px-4 py-3">Entity</th>
                      <th className="text-left px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l: any) => (
                      <tr key={l.id} className="border-t border-sky-100 align-top">
                        <td className="px-4 py-3 font-mono-tech text-xs text-slate-500 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs"><div className="font-semibold text-[#0A1E3C]">{l.actor_email || 'system'}</div><div className="text-slate-400">{l.actor_role || '-'}</div></td>
                        <td className="px-4 py-3 text-xs font-semibold text-[#065AA7]">{l.action}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{l.entity_type || '-'}{l.entity_id ? ` #${l.entity_id}` : ''}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 font-mono-tech max-w-[320px] break-words">{l.details ? JSON.stringify(l.details) : '-'}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No logs yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'settings' && (
          <div className="max-w-xl bg-white rounded-2xl border border-sky-200 shadow-sm p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#0A1E3C]">Admin Settings</h3>
              <p className="text-sm text-slate-500">Change the admin password used to access this dashboard.</p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await api.adminChangePassword({ currentPassword: currentAdminPassword, newPassword: newAdminPassword });
                  setCurrentAdminPassword('');
                  setNewAdminPassword('');
                  notify('Admin password updated.');
                } catch (err: any) {
                  notify(err.message || 'Failed to update password');
                }
              }}
              className="space-y-3"
            >
              <label className="block">
                <span className="text-xs font-bold text-slate-600">Current Password</span>
                <input type="password" value={currentAdminPassword} onChange={(e) => setCurrentAdminPassword(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" required />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-600">New Password</span>
                <input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-[#F4F7FB] border border-sky-200 text-sm" placeholder="At least 6 characters" required />
              </label>
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer">
                <Save className="w-4 h-4" /> Save Password
              </button>
            </form>
          </div>
        )}
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl border-r border-sky-200">
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-sky-200 px-2 py-1.5">
        <div className="grid grid-cols-5 gap-1">
          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            const active = activeGroup === group.id;
            const target = group.items[0].id;
            return (
              <button key={group.id} type="button" onClick={() => goTo(target)} className={`flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-bold cursor-pointer ${active ? 'text-[#065AA7] bg-[#E6EFF8]' : 'text-slate-500'}`}>
                <GroupIcon className="w-5 h-5" />
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
