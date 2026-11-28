import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, Loader2, RefreshCw, ShoppingBag, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import type { AuthUser } from '../components/AuthModal';
import type { CustomerOrder, PageRoute } from '../data/kaffiikaData';
import { api } from '../lib/api';

interface Props {
  currentUser: AuthUser | null;
  onNavigate: (page: PageRoute) => void;
  onOpenAuth: () => void;
}

const STEPS: CustomerOrder['status'][] = ['Pending', 'Processing', 'Dispatched', 'Completed'];

function statusIcon(status: CustomerOrder['status']) {
  if (status === 'Completed') return <CheckCircle2 className="w-4 h-4" />;
  if (status === 'Dispatched') return <Truck className="w-4 h-4" />;
  if (status === 'Processing') return <Loader2 className="w-4 h-4" />;
  return <Clock className="w-4 h-4" />;
}

function statusTone(status: CustomerOrder['status']) {
  if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
  if (status === 'Dispatched') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (status === 'Processing') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

export const TrackOrderPage: React.FC<Props> = ({ currentUser, onNavigate, onOpenAuth }) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<CustomerOrder | null>(null);

  const load = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.myOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [currentUser?.id]);

  const active = orders.filter((o) => o.status !== 'Completed');
  const completed = orders.filter((o) => o.status === 'Completed');
  const current = selected ? orders.find((o) => o.id === selected.id) || selected : null;

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-16">
      <PageHeaderBanner
        title="Track My Orders"
        subtitle="View your order history, current status, and full transaction details."
        currentPage="/track-order"
        badgeText="My Orders"
        onNavigate={onNavigate}
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!currentUser ? (
          <div className="bg-white rounded-2xl border border-sky-200 p-8 text-center max-w-xl mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#065AA7] mx-auto mb-3" />
            <h2 className="text-xl font-bold text-[#0A1E3C] mb-2">Sign in to track your orders</h2>
            <p className="text-sm text-slate-500 mb-5">Your order history and tracking details are available when you sign in.</p>
            <button type="button" onClick={onOpenAuth} className="px-5 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer">Sign In / Create Account</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-sky-200 p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0A1E3C]">Order History</h2>
                <p className="text-xs text-slate-500">{orders.length} total order{orders.length !== 1 ? 's' : ''} • {active.length} active • {completed.length} completed</p>
              </div>
              <button type="button" onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E6EFF8] hover:bg-sky-100 text-[#065AA7] text-xs font-bold cursor-pointer"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
            </div>

            {loading && orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sky-200 p-8 text-center text-slate-500 text-sm">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sky-200 p-8 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">You have no orders yet.</p>
                <button type="button" onClick={() => onNavigate('/products')} className="mt-4 px-5 py-2.5 rounded-xl bg-[#065AA7] text-white text-sm font-bold cursor-pointer">Browse Products</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4">
                  {[{ title: 'Current Orders', list: active }, { title: 'Completed Orders', list: completed }].filter((g) => g.list.length > 0).map((group) => (
                    <div key={group.title} className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">{group.title}</h3>
                      {group.list.map((order) => (
                        <button key={order.id} type="button" onClick={() => setSelected(order)} className={`w-full text-left bg-white rounded-2xl border p-4 cursor-pointer transition-all ${current?.id === order.id ? 'border-[#065AA7] shadow-sm' : 'border-sky-200 hover:border-sky-300'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-mono-tech text-[11px] font-bold px-2 py-0.5 rounded bg-[#065AA7] text-white">{order.reference}</span>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusTone(order.status)}`}>{statusIcon(order.status)} {order.status}</span>
                              </div>
                              <div className="text-xs text-slate-500">{order.createdAt}</div>
                              <div className="text-xs text-slate-600 mt-1">{order.totalBags} bags • {order.branchName}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-mono-tech font-bold text-[#065AA7] text-sm">UGX {order.totalAmountUgx.toLocaleString()}</div>
                              <div className="text-[11px] text-[#065AA7] font-bold mt-1 inline-flex items-center gap-0.5">Details <ChevronRight className="w-3.5 h-3.5" /></div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-7">
                  {current ? (
                    <div className="bg-white rounded-2xl border border-sky-200 p-6 lg:sticky lg:top-24">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-4 border-b border-sky-100">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono-tech text-xs font-bold px-2.5 py-1 rounded bg-[#065AA7] text-white">{current.reference}</span>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusTone(current.status)}`}>{statusIcon(current.status)} {current.status}</span>
                          </div>
                          <div className="text-xs text-slate-500">Placed: {current.createdAt}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400 uppercase font-bold">Order Total</div>
                          <div className="font-mono-tech text-xl font-bold text-[#065AA7]">UGX {current.totalAmountUgx.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="mb-5">
                        <div className="text-xs font-bold text-slate-600 mb-3">Order Progress</div>
                        <div className="grid grid-cols-4 gap-2">
                          {STEPS.map((step, i) => {
                            const idx = STEPS.indexOf(current.status);
                            const done = i <= idx;
                            return (
                              <div key={step} className="text-center">
                                <div className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center border-2 ${done ? 'bg-[#065AA7] border-[#065AA7] text-white' : 'bg-white border-sky-200 text-slate-300'}`}>{statusIcon(step)}</div>
                                <div className={`mt-1.5 text-[10px] font-bold ${done ? 'text-[#065AA7]' : 'text-slate-400'}`}>{step}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
                        <div className="p-3 rounded-xl bg-[#F4F7FB] border border-sky-100"><div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Branch</div><div className="font-semibold text-[#0A1E3C] flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#065AA7]" />{current.branchName}</div></div>
                        <div className="p-3 rounded-xl bg-[#F4F7FB] border border-sky-100"><div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Delivery</div><div className="font-semibold text-[#0A1E3C]">{current.deliveryMode}</div></div>
                        <div className="p-3 rounded-xl bg-[#F4F7FB] border border-sky-100"><div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Contact</div><div className="font-semibold text-[#0A1E3C] flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#065AA7]" />{current.customerPhone}</div>{current.customerEmail && <div className="text-slate-500 flex items-center gap-1 mt-1"><Mail className="w-3.5 h-3.5" />{current.customerEmail}</div>}</div>
                        <div className="p-3 rounded-xl bg-[#F4F7FB] border border-sky-100"><div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Weight / Bags</div><div className="font-semibold text-[#0A1E3C]">{current.totalWeightKg} kg • {current.totalBags} bags</div></div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-600 mb-2">Order Items</div>
                        <div className="space-y-2">
                          {current.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F4F7FB] border border-sky-100 text-xs">
                              <div><div className="font-bold text-[#0A1E3C]">{item.quantity}× {item.productName} ({item.productCode})</div><div className="text-slate-500 font-mono-tech">{item.units} @ UGX {item.unitPriceUgx.toLocaleString()}</div></div>
                              <div className="font-mono-tech font-bold text-[#065AA7] shrink-0">UGX {(item.quantity * item.unitPriceUgx).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-sky-200 p-8 text-center text-slate-500 text-sm">Select an order to view full details.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
