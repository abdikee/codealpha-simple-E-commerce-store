import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { CountdownTimer } from '../components/CountdownTimer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { staggerContainer, fadeInUp } from '../utils/animations.js';
import { Link } from 'react-router';
import { api } from '../utils/api.js';
import { Input } from '../components/Input';

const HERO_SLIDES = [
  {
    title: 'Summer Collection 2025',
    subtitle: 'Discover the latest trends in sustainable fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'New Accessories',
    subtitle: 'Elevate your style with our premium collection',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'Minimalist Essentials',
    subtitle: 'Clean lines and timeless designs for every occasion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80',
  },
];

const TABS = ['New Arrivals', 'Best Sellers', 'On Sale'];

export function Home() {
  const [activeTab, setActiveTab]       = useState('New Arrivals');
  const [currentHero, setCurrentHero]   = useState(0);
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [email, setEmail]               = useState('');
  const intervalRef = useRef(null);

  // Fetch products + categories from API
  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  // Hero auto-play
  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };
  useEffect(() => { startInterval(); return () => clearInterval(intervalRef.current); }, []);

  const goToHero = (i) => { setCurrentHero(i); startInterval(); };
  const prevHero = () => goToHero((currentHero - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextHero = () => goToHero((currentHero + 1) % HERO_SLIDES.length);

  // Tab filtering
  const tabProducts = products.filter(p => {
    const colors = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
    if (activeTab === 'New Arrivals') return p.badge === 'New' || !p.badge;
    if (activeTab === 'Best Sellers') return p.badge === 'Best Seller';
    if (activeTab === 'On Sale')      return p.badge === 'Sale';
    return true;
  }).slice(0, 8);

  // Normalise product shape (API returns colors as JSON string from DB)
  const normalise = (p) => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
  });

  // Promo countdown — 72 h from now (stable per session)
  const promoEnd = useRef(new Date(Date.now() + 72 * 60 * 60 * 1000)).current;

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-[600px] lg:h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={HERO_SLIDES[currentHero].image}
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center items-start relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-white"
            >
              <h1 className="mb-6">{HERO_SLIDES[currentHero].title}</h1>
              <p className="text-xl lg:text-2xl mb-10 opacity-90">{HERO_SLIDES[currentHero].subtitle}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button size="lg" className="h-14 px-8 text-lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Shop Now
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg bg-white/20 border-white text-white hover:bg-white/30">
                    Browse All
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToHero(i)}
              className={`h-3 rounded-full transition-all duration-300 ${i === currentHero ? 'bg-white w-8' : 'bg-white/50 w-3'}`}
            />
          ))}
        </div>

        <Button variant="ghost" size="icon" onClick={prevHero}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 h-11 w-11 rounded-full flex z-10">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={nextHero}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 h-11 w-11 rounded-full flex z-10">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Collections</p>
              <h2>Shop by Category</h2>
            </div>
            <Link to="/shop" className="text-primary font-bold hover:underline flex items-center gap-2">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {categories.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer} initial="initial" animate="animate"
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {categories.map(cat => (
                <motion.div key={cat.id} variants={fadeInUp}>
                  <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="group">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <ImageWithFallback
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                        <p className="text-white font-bold text-xl mb-1">{cat.name}</p>
                        <p className="text-white/70 text-sm">{cat._count?.products ?? cat.count ?? 0} Items</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Our Store</p>
          <h2 className="mb-12">Featured Products</h2>

          {/* Tabs */}
          <div className="flex justify-center gap-4 sm:gap-8 mb-16 border-b border-gray-100 pb-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : tabProducts.length === 0 ? (
            <div className="py-16 text-gray-400">
              <p className="text-lg">No products in this category yet.</p>
              <Link to="/shop" className="text-primary font-bold hover:underline mt-2 inline-block">Browse all products</Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer} initial="initial" animate="animate"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 text-left"
            >
              {tabProducts.map(product => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={normalise(product)} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-16">
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="px-12 border-gray-200 hover:border-primary">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────────────────── */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-primary/10">
            <div className="lg:w-1/2 relative min-h-[400px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
                alt="Promo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
            <div className="lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center items-start">
              <span className="bg-destructive text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                Limited Time Offer
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Get 20% off your first order
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Unlock exclusive access to our newest arrivals and members-only deals. Join our community of fashion enthusiasts today.
              </p>
              <div className="mb-10">
                <CountdownTimer targetDate={promoEnd} />
              </div>
              <div className="w-full flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-14 lg:flex-grow"
                />
                <Button size="lg" className="h-14 px-10" onClick={() => {
                  if (email) { setEmail(''); }
                }}>
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────────── */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '↩️', title: 'Easy Returns',  desc: '30-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
              { icon: '💬', title: '24/7 Support',   desc: 'We\'re here to help' },
            ].map(b => (
              <div key={b.title} className="flex flex-col items-center gap-3">
                <span className="text-4xl">{b.icon}</span>
                <p className="font-bold text-gray-900">{b.title}</p>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
