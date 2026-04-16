import React, { useEffect, useState } from 'react';
import { User, ShoppingBag, Heart, MapPin, CreditCard, LogOut, ChevronRight, Package, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link, useLocation, useNavigate, Routes, Route } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { motion } from 'motion/react';
import { staggerContainer, fadeInUp } from '../utils/animations.js';
import Orders from './account/Orders.jsx';
import Wishlist, { getWishlistIds } from './account/Wishlist.jsx';
import Addresses from './account/Addresses.jsx';
import PaymentMethods from './account/PaymentMethods.jsx';
import AccountDetails from './account/AccountDetails.jsx';

const STATUS_COLORS = {
  PENDING:    'bg-gray-100 text-gray-600',
  PAID:       'bg-blue-100 text-blue-600',
  PROCESSING: 'bg-amber-100 text-amber-600',
  SHIPPED:    'bg-purple-100 text-purple-600',
  DELIVERED:  'bg-emerald-100 text-emerald-600',
  CANCELLED:  'bg-red-100 text-red-600',
};

export default function Account() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const currentPath = location.pathname;

  const [recentOrders,     setRecentOrders]     = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dashLoading,      setDashLoading]      = useState(true);
  const [wishlistCount,    setWishlistCount]    = useState(0);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    setWishlistCount(getWishlistIds(user.id).length);
    Promise.all([api.getOrders(), api.getProducts()])
      .then(([orders, products]) => {
        setRecentOrders(orders.slice(0, 3));
        setFeaturedProducts(
          products.slice(0, 4).map(p => ({
            ...p,
            price: Number(p.price),
            colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setDashLoading(false));
  }, [user]);

  const sidebarItems = [
    { name: 'Dashboard',       icon: <User className="w-5 h-5" />,        path: '/account' },
    { name: 'My Orders',       icon: <ShoppingBag className="w-5 h-5" />, path: '/account/orders' },
    { name: 'Wishlist',        icon: <Heart className="w-5 h-5" />,        path: '/account/wishlist' },
    { name: 'Addresses',       icon: <MapPin className="w-5 h-5" />,       path: '/account/addresses' },
    { name: 'Payment Methods', icon: <CreditCard className="w-5 h-5" />,   path: '/account/payment' },
    { name: 'Account Details', icon: <User className="w-5 h-5" />,         path: '/account/details' },
  ];

  const Dashboard = () => (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">Account Dashboard</h2>
          <p className="text-gray-500">View your recent orders and manage your account.</p>
        </div>
        <Button variant="secondary" className="border-gray-200 hover:border-primary px-8"
          onClick={() => navigate('/account/details')}>
          Edit Profile
        </Button>
      </div>

      {dashLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <motion.div variants={staggerContainer} initial="initial" animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Orders',  value: recentOrders.length, icon: <Package className="w-6 h-6 text-primary" />,     color: 'bg-primary/10',     path: '/account/orders' },
              { label: 'Wishlist',      value: wishlistCount,        icon: <Heart className="w-6 h-6 text-destructive" />,   color: 'bg-destructive/10', path: '/account/wishlist' },
              { label: 'Addresses',     value: '—',                  icon: <MapPin className="w-6 h-6 text-success" />,      color: 'bg-success/10',     path: '/account/addresses' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Link to={stat.path}
                  className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-lg shadow-gray-200/20 flex items-center gap-6 hover:border-primary/30 transition-colors block">
                  <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Orders */}
          <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/20">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Orders</h3>
              <Link to="/account/orders" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No orders yet.</p>
                <Link to="/shop" className="text-primary font-bold hover:underline mt-2 inline-block">Start shopping</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      {['Order ID', 'Date', 'Status', 'Total', 'Actions'].map(h => (
                        <th key={h} className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                        <td className="px-8 py-6 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-900">${Number(order.total).toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <Button variant="secondary" size="sm" className="h-9 px-4 text-xs border-gray-100 hover:border-primary">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recommended */}
          {featuredProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Recommended For You</h3>
                <Link to="/shop" className="text-sm font-bold text-primary hover:underline">See more</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <Link key={product.id} to={`/product/${product.id}`} className="group">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                      <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                    <p className="text-sm font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-24">
      {/* Mobile Tab Bar */}
      <div className="lg:hidden overflow-x-auto mb-8 -mx-4 px-4">
        <div className="flex gap-2 min-w-max pb-2">
          {sidebarItems.map(item => (
            <Link key={item.name} to={item.path}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                currentPath === item.path ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {item.icon}{item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/50">
            <div className="p-8 border-b border-gray-50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-md">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Welcome</p>
                <p className="text-lg font-bold text-gray-900 leading-none mt-1">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <nav className="p-4">
              <motion.ul variants={staggerContainer} initial="initial" animate="animate" className="space-y-1">
                {sidebarItems.map(item => (
                  <motion.li key={item.name} variants={fadeInUp}>
                    <Link to={item.path}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                        currentPath === item.path
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                      }`}>
                      {item.icon}{item.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <button onClick={logout}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/5 w-full transition-all">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-grow min-w-0">
          <Routes>
            <Route index          element={<Dashboard />} />
            <Route path="orders"    element={<Orders />} />
            <Route path="wishlist"  element={<Wishlist />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="payment"   element={<PaymentMethods />} />
            <Route path="details"   element={<AccountDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
