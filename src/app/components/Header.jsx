import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, LogOut, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../utils/api.js';
import { showToast } from '../components/ui/toaster.jsx';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);
  const megaMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  // Animate badge on count change
  const [badgePulse, setBadgePulse] = useState(false);
  useEffect(() => {
    if (cartCount !== prevCartCount && cartCount > 0) {
      setBadgePulse(true);
      setTimeout(() => setBadgePulse(false), 400);
    }
    setPrevCartCount(cartCount);
  }, [cartCount]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    setIsSearching(true);
    try {
      const products = await api.getProducts({ search: query, limit: 5 });
      setSearchResults(products);
      setShowSearchDropdown(true);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    showToast.success('Logged out successfully');
    navigate('/');
  };

  const handleShopKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsMegaMenuOpen(prev => !prev);
    } else if (e.key === 'Escape') {
      setIsMegaMenuOpen(false);
    }
  };

  const activeLink = (path) =>
    location.pathname === path ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary transition-colors';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/shop' },
    { name: 'New Arrivals', path: '/shop?badge=New' },
    { name: 'Sale', path: '/shop?badge=Sale' },
    { name: 'About', path: '/shop' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-center text-sm font-medium">
        Free shipping on orders over $50. Shop now and save!
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-heading font-bold tracking-tight text-gray-900 hidden sm:block">CHILALO<span className="text-primary">SHOP</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative" ref={link.name === 'Shop' ? megaMenuRef : null}>
                {link.name === 'Shop' ? (
                  <button
                    className={`flex items-center gap-1 text-sm uppercase tracking-wide font-medium ${activeLink(link.path)}`}
                    onClick={() => setIsMegaMenuOpen(prev => !prev)}
                    onKeyDown={handleShopKeyDown}
                    aria-expanded={isMegaMenuOpen}
                    aria-haspopup="true"
                  >
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`flex items-center gap-1 text-sm uppercase tracking-wide font-medium ${activeLink(link.path)}`}
                  >
                    {link.name}
                  </Link>
                )}

                {link.name === 'Shop' && (
                  <AnimatePresence>
                    {isMegaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] z-50"
                        onKeyDown={(e) => e.key === 'Escape' && setIsMegaMenuOpen(false)}
                      >
                        <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-8 grid grid-cols-3 gap-8">
                          <div>
                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-400">Categories</h4>
                            <ul className="space-y-3">
                              <li><Link to="/shop" onClick={() => setIsMegaMenuOpen(false)} className="text-gray-600 hover:text-primary">Men's Fashion</Link></li>
                              <li><Link to="/shop" onClick={() => setIsMegaMenuOpen(false)} className="text-gray-600 hover:text-primary">Women's Fashion</Link></li>
                              <li><Link to="/shop" onClick={() => setIsMegaMenuOpen(false)} className="text-gray-600 hover:text-primary">Accessories</Link></li>
                              <li><Link to="/shop" onClick={() => setIsMegaMenuOpen(false)} className="text-gray-600 hover:text-primary">Footwear</Link></li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-400">Trending</h4>
                            <ul className="space-y-3">
                              <li><Link to="/shop" onClick={() => setIsMegaMenuOpen(false)} className="text-gray-600 hover:text-primary">Best Sellers</Link></li>
                              <li><Link to="/shop?badge=New" onClick={() => setIsMegaMenuOpen(false)} className="text-gray-600 hover:text-primary">New Arrivals</Link></li>
                              <li><Link to="/shop" onClick={() => setIsMegaMenuOpen(false)} className="text-gray-600 hover:text-primary">Limited Edition</Link></li>
                            </ul>
                          </div>
                          <div className="bg-primary-50 rounded-lg p-4 flex flex-col justify-center">
                            <p className="text-primary font-bold text-lg mb-2">Summer Sale</p>
                            <p className="text-gray-600 text-sm mb-4">Up to 50% off on all items</p>
                            <Button size="sm" onClick={() => setIsMegaMenuOpen(false)}>Shop Sale</Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                leadingIcon={isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                className="bg-gray-100 border-transparent focus:bg-white"
              />
              <AnimatePresence>
                {showSearchDropdown && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm text-primary font-semibold">${product.price?.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                    <button
                      type="submit"
                      className="w-full p-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-gray-100"
                    >
                      See all results for "{searchQuery}"
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Icons/Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/account">
                  <Button variant="ghost" size="icon" className="relative">
                    {user?.firstName ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {user.firstName[0]}{user.lastName?.[0]}
                      </div>
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="font-semibold">Sign In</Button>
              </Link>
            )}

            <Link to={isAuthenticated ? '/account/wishlist' : '/login'}>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="w-6 h-6" />
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: badgePulse ? [1, 1.4, 1] : 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] shadow-2xl p-6 flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-heading font-bold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                <Input placeholder="Search..." leadingIcon={<Search className="w-5 h-5" />} />
                <nav className="flex flex-col gap-4 mt-4">
                  <Link to="/" className={`text-lg font-medium uppercase tracking-wide border-b border-gray-100 pb-2 ${activeLink('/')}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
                  <Link to="/shop" className={`text-lg font-medium uppercase tracking-wide border-b border-gray-100 pb-2 ${activeLink('/shop')}`} onClick={() => setIsMenuOpen(false)}>Shop</Link>
                  <Link to="/shop" className="text-lg font-medium uppercase tracking-wide border-b border-gray-100 pb-2 text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Categories</Link>
                  <Link to="/shop?badge=New" className="text-lg font-medium uppercase tracking-wide border-b border-gray-100 pb-2 text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
                  <Link to="/shop?badge=Sale" className="text-lg font-medium uppercase tracking-wide border-b border-gray-100 pb-2 text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Sale</Link>
                  <Link to="/shop" className="text-lg font-medium uppercase tracking-wide border-b border-gray-100 pb-2 text-gray-600 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
                </nav>
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-4">
                <Link to={isAuthenticated ? '/account' : '/login'} onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" className="w-full" leftIcon={<User className="w-5 h-5" />}>
                    {isAuthenticated ? 'My Account' : 'Sign In'}
                  </Button>
                </Link>
                <Link to={isAuthenticated ? '/account/wishlist' : '/login'} onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" className="w-full" leftIcon={<Heart className="w-5 h-5" />}>
                    Wishlist
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Close mega menu on outside click */}
      {isMegaMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMegaMenuOpen(false)} />
      )}
    </header>
  );
}
