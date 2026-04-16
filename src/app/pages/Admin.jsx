import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Layers, ShoppingBag, Users,
  TrendingUp, DollarSign, Search, Plus, MoreVertical,
  ChevronRight, ChevronDown, Menu, X, Loader2, RefreshCw,
  Trash2, Edit, Check
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link, useNavigate } from 'react-router';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { showToast } from '../components/ui/toaster.jsx';

const STATUS_COLORS = {
  PENDING:    'bg-gray-100 text-gray-600',
  PAID:       'bg-blue-100 text-blue-600',
  PROCESSING: 'bg-amber-100 text-amber-600',
  SHIPPED:    'bg-purple-100 text-purple-600',
  DELIVERED:  'bg-emerald-100 text-emerald-600',
  CANCELLED:  'bg-red-100 text-red-600',
};

const ORDER_STATUSES = ['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED'];

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab]         = useState('Dashboard');
  const [isMobileMenuOpen, setMobileMenu] = useState(false);

  // Dashboard
  const [stats, setStats]         = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Products
  const [products, setProducts]   = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodSearch, setProdSearch]   = useState('');

  // Orders
  const [orders, setOrders]       = useState([]);
  const [ordLoading, setOrdLoading]   = useState(false);

  // Users
  const [users, setUsers]         = useState([]);
  const [usrLoading, setUsrLoading]   = useState(false);

  // Categories
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading]  = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (user && !isAdmin) navigate('/account');
  }, [user, isAdmin, navigate]);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'Dashboard') loadStats();
    if (activeTab === 'Products')  loadProducts();
    if (activeTab === 'Orders')    loadOrders();
    if (activeTab === 'Users')     loadUsers();
    if (activeTab === 'Categories') loadCategories();
  }, [activeTab]);

  const loadStats = async () => {
    setStatsLoading(true);
    try { setStats(await api.getAdminStats()); }
    catch (e) { showToast.error('Failed to load stats'); }
    finally { setStatsLoading(false); }
  };

  const loadProducts = async () => {
    setProdLoading(true);
    try { setProducts(await api.getProducts()); }
    catch (e) { showToast.error('Failed to load products'); }
    finally { setProdLoading(false); }
  };

  const loadOrders = async () => {
    setOrdLoading(true);
    try { setOrders(await api.getAllOrders()); }
    catch (e) { showToast.error('Failed to load orders'); }
    finally { setOrdLoading(false); }
  };

  const loadUsers = async () => {
    setUsrLoading(true);
    try { setUsers(await api.getUsers()); }
    catch (e) { showToast.error('Failed to load users'); }
    finally { setUsrLoading(false); }
  };

  const loadCategories = async () => {
    setCatLoading(true);
    try { setCategories(await api.getCategories()); }
    catch (e) { showToast.error('Failed to load categories'); }
    finally { setCatLoading(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(p => p.filter(x => x.id !== id));
      showToast.success('Product deleted');
    } catch (e) { showToast.error(e.message); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.deleteUser(id);
      setUsers(u => u.filter(x => x.id !== id));
      showToast.success('User deleted');
    } catch (e) { showToast.error(e.message); }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders(o => o.map(x => x.id === orderId ? { ...x, status: updated.status } : x));
      showToast.success('Order status updated');
    } catch (e) { showToast.error(e.message); }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const NAV_ITEMS = [
    { name: 'Dashboard',  icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Products',   icon: <Package className="w-5 h-5" /> },
    { name: 'Categories', icon: <Layers className="w-5 h-5" /> },
    { name: 'Orders',     icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Users',      icon: <Users className="w-5 h-5" /> },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-gray-100">
        <Link to="/">
          <span className="text-2xl font-black tracking-tighter text-primary">CHILALO<span className="text-gray-900">ADMIN</span></span>
        </Link>
      </div>
      <nav className="p-6 flex-grow overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Main Menu</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(item => (
            <li key={item.name}>
              <button
                onClick={() => { setActiveTab(item.name); setMobileMenu(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.name
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {item.icon}{item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user?.firstName?.[0] ?? 'A'}
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 hidden lg:flex flex-col sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-grow max-w-2xl">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenu(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <span className="lg:hidden text-xl font-black text-primary">CHILALO</span>
            <div className="hidden sm:block relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={prodSearch}
                onChange={e => setProdSearch(e.target.value)}
                className="h-11 pl-12 bg-gray-50 border-transparent focus:bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl" onClick={() => {
              if (activeTab === 'Dashboard') loadStats();
              if (activeTab === 'Products')  loadProducts();
              if (activeTab === 'Orders')    loadOrders();
              if (activeTab === 'Users')     loadUsers();
            }}>
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8">

          {/* ── Dashboard ─────────────────────────────────────────── */}
          {activeTab === 'Dashboard' && (
            <>
              <div>
                <h2 className="text-3xl font-black text-gray-900">Store Overview</h2>
                <p className="text-gray-500 mt-1">Real-time store performance.</p>
              </div>

              {statsLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : stats ? (
                <>
                  {/* Stat cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Revenue',    value: `$${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: <DollarSign className="w-6 h-6 text-emerald-500" />, bg: 'bg-emerald-50' },
                      { label: 'Total Orders',     value: stats.totalOrders.toLocaleString(),   icon: <ShoppingBag className="w-6 h-6 text-primary" />,       bg: 'bg-primary-50' },
                      { label: 'Total Users',      value: stats.totalUsers.toLocaleString(),    icon: <Users className="w-6 h-6 text-amber-500" />,            bg: 'bg-amber-50' },
                      { label: 'Total Products',   value: stats.totalProducts.toLocaleString(), icon: <Package className="w-6 h-6 text-purple-500" />,         bg: 'bg-purple-50' },
                    ].map(s => (
                      <div key={s.label} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/20">
                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <p className="text-4xl font-black text-gray-900 mt-2">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="xl:col-span-2 bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden">
                      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>
                        <Button variant="secondary" size="sm" className="border-gray-100 rounded-xl"
                          onClick={() => setActiveTab('Orders')}>View All</Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50/50">
                            <tr>
                              {['ID','Customer','Date','Status','Total'].map(h => (
                                <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {(stats.recentOrders || []).slice(0, 5).map(order => (
                              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-bold text-gray-900">{order.user?.firstName} {order.user?.lastName}</p>
                                  <p className="text-xs text-gray-400">{order.user?.email}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-black text-gray-900">${Number(order.total).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden">
                      <div className="p-8 border-b border-gray-50">
                        <h3 className="text-xl font-black text-gray-900">Top Products</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        {(stats.topProducts || []).map((tp, i) => (
                          <div key={tp.productId} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                              {tp.product?.image && (
                                <img src={tp.product.image} alt={tp.product.name} className="w-full h-full object-cover" />
                              )}
                              <div className="absolute top-1 left-1 w-5 h-5 bg-white shadow rounded-lg flex items-center justify-center text-[10px] font-black text-primary">
                                {i + 1}
                              </div>
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{tp.product?.name}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">{tp.totalSold} sold</span>
                                <span className="text-sm font-black text-emerald-500">${Number(tp.product?.price || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!stats.topProducts || stats.topProducts.length === 0) && (
                          <p className="text-gray-400 text-sm text-center py-4">No sales data yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </>
          )}

          {/* ── Products ──────────────────────────────────────────── */}
          {activeTab === 'Products' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-900">Products</h2>
                <p className="text-gray-500">{products.length} total</p>
              </div>
              {prodLoading ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          {['Product','Category','Price','Stock','Actions'].map(h => (
                            <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                  {p.badge && <span className="text-xs text-primary font-semibold">{p.badge}</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{p.category?.name}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">${Number(p.price).toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.inStock ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                {p.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link to={`/product/${p.id}`}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50"
                                  onClick={() => handleDeleteProduct(p.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Categories ────────────────────────────────────────── */}
          {activeTab === 'Categories' && (
            <>
              <h2 className="text-3xl font-black text-gray-900">Categories</h2>
              {catLoading ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="aspect-video overflow-hidden">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-gray-900">{cat.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{cat._count?.products ?? cat.count ?? 0} products</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Orders ────────────────────────────────────────────── */}
          {activeTab === 'Orders' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-900">Orders</h2>
                <p className="text-gray-500">{orders.length} total</p>
              </div>
              {ordLoading ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          {['Order ID','Customer','Date','Items','Total','Status','Actions'].map(h => (
                            <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">{order.user?.firstName} {order.user?.lastName}</p>
                              <p className="text-xs text-gray-400">{order.user?.email}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{order.items?.length ?? 0}</td>
                            <td className="px-6 py-4 text-sm font-black text-gray-900">${Number(order.total).toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={order.status}
                                onChange={e => handleOrderStatus(order.id, e.target.value)}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-primary"
                              >
                                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Users ─────────────────────────────────────────────── */}
          {activeTab === 'Users' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-900">Users</h2>
                <p className="text-gray-500">{users.length} total</p>
              </div>
              {usrLoading ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          {['Name','Email','Role','Joined','Actions'].map(h => (
                            <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                  {u.firstName?.[0]}{u.lastName?.[0]}
                                </div>
                                <p className="text-sm font-bold text-gray-900">{u.firstName} {u.lastName}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={u.id === user?.id}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setMobileMenu(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-[70] shadow-2xl flex flex-col lg:hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="text-xl font-black text-primary">CHILALOADMIN</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenu(false)}><X className="w-6 h-6" /></Button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
