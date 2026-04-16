import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Star, Heart, Share2, Truck, ShieldCheck, RefreshCcw, Check, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProductCard } from '../components/ProductCard';
import { QuantitySelector } from '../components/QuantitySelector';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ProductDetailSkeleton } from '../components/ui/skeleton.jsx';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { showToast } from '../components/ui/toaster.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { getWishlistIds, toggleWishlistItem } from './account/Wishlist.jsx';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct]               = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [addingToCart, setAddingToCart]     = useState(false);
  const [selectedSize, setSelectedSize]     = useState('');
  const [selectedColor, setSelectedColor]   = useState('');
  const [quantity, setQuantity]             = useState(1);
  const [activeTab, setActiveTab]           = useState('Description');
  const [isWished, setIsWished]             = useState(false);
  const [mainImage, setMainImage]           = useState('');

  // Review form
  const [reviewForm, setReviewForm]         = useState({ rating: 5, title: '', body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews]               = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProduct(id);
      setProduct(data);
      setMainImage(data.image);
      setReviews(data.reviews || []);

      const colors = typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors;
      if (data.sizes?.length)  setSelectedSize(data.sizes[0]);
      if (colors?.length)      setSelectedColor(colors[0].name);

      if (user) setIsWished(getWishlistIds(user.id).includes(data.id));

      // Related products — same category, exclude current
      const related = await api.getProducts({ category: data.category?.name, exclude: data.id, limit: 4 });
      // api.getProducts with limit returns plain array
      const arr = Array.isArray(related) ? related : related.products || [];
      setRelatedProducts(arr.filter(p => p.id !== data.id).slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedSize || !selectedColor) {
      showToast.warning('Please select a size and colour');
      return;
    }
    setAddingToCart(true);
    try {
      await api.addToCart({ productId: product.id, quantity, size: selectedSize, color: selectedColor });
      showToast.success('Added to cart', product.name);
      navigate('/cart');
    } catch (err) {
      showToast.error('Failed to add to cart', err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    if (!user) { navigate('/login'); return; }
    const updated = toggleWishlistItem(user.id, product.id);
    const now = updated.includes(product.id);
    setIsWished(now);
    showToast[now ? 'success' : 'info'](now ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!reviewForm.title.trim() || !reviewForm.body.trim()) {
      showToast.warning('Please fill in all review fields');
      return;
    }
    setSubmittingReview(true);
    try {
      const newReview = await api.createReview({ productId: product.id, ...reviewForm });
      setReviews(prev => [newReview, ...prev]);
      setReviewForm({ rating: 5, title: '', body: '' });
      showToast.success('Review submitted!');
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-red-500 mb-4">Error: {error || 'Product not found'}</p>
        <Link to="/shop" className="text-primary font-bold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;
  const sizes  = product.sizes || [];

  // Build gallery: product.images array first, then fallback to main image only
  const gallery = product.images?.length > 0
    ? [product.image, ...product.images.filter(img => img !== product.image)]
    : [product.image];

  const discount = product.originalPrice
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : Number(product.rating).toFixed(1);

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-24">
      <Breadcrumb items={[
        { name: 'Shop', path: '/shop' },
        { name: product.category?.name || 'Category', path: '/shop' },
        { name: product.name, path: `/product/${product.id}` },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
        {/* Gallery */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-square rounded-[32px] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl group">
            <motion.div key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full h-full">
              <ImageWithFallback src={mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-zoom-in" />
            </motion.div>
            {product.badge && (
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest">
                {product.badge}
              </div>
            )}
            <button onClick={handleWishlist}
              className="absolute top-6 right-6 p-4 bg-white rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95">
              <Heart className={`w-6 h-6 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all hover:shadow-md ${
                    mainImage === img ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}>
                  <ImageWithFallback src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-primary font-bold uppercase tracking-widest text-sm">{product.category?.name}</span>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(Number(product.rating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{avgRating}</span>
                <span className="text-sm text-gray-400">({reviews.length || product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
              {product.originalPrice && (
                <div className="flex items-center gap-3">
                  <span className="text-xl text-gray-400 line-through">${Number(product.originalPrice).toFixed(2)}</span>
                  <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-bold">-{discount}% OFF</span>
                </div>
              )}
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-primary/20 pl-6 italic">
              {product.description}
            </p>
          </div>

          <div className="space-y-10">
            {/* Colour */}
            {colors?.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 flex justify-between">
                  Colour: <span className="text-primary">{selectedColor}</span>
                </h4>
                <div className="flex gap-4">
                  {colors.map(color => (
                    <button key={color.name} onClick={() => setSelectedColor(color.name)}
                      className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center p-1 ${
                        selectedColor === color.name ? 'border-primary shadow-lg scale-110' : 'border-transparent hover:border-gray-200'
                      }`}>
                      <div className="w-full h-full rounded-full border border-gray-100 shadow-inner flex items-center justify-center" style={{ backgroundColor: color.hex }}>
                        {selectedColor === color.name && (
                          <Check className={`w-5 h-5 ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Select Size</h4>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] h-12 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedSize === size ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button className="h-14 flex-grow text-lg shadow-xl shadow-primary/20"
                leftIcon={addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
                onClick={handleAddToCart}
                disabled={addingToCart || !product.inStock}>
                {addingToCart ? 'Adding…' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button variant="secondary" className="h-14 px-8 border-gray-200 group"
                onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }); }}>
                <Share2 className="w-6 h-6 group-hover:text-primary transition-colors" />
              </Button>
            </div>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            {[
              { icon: <Truck className="w-6 h-6" />, text: 'Free Shipping over $50' },
              { icon: <ShieldCheck className="w-6 h-6" />, text: '2 Year Warranty' },
              { icon: <RefreshCcw className="w-6 h-6" />, text: '30-Day Returns' },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">{t.icon}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <section className="mb-24">
        <div className="flex justify-center gap-8 lg:gap-16 border-b border-gray-100 mb-12 overflow-x-auto">
          {['Description', 'Reviews', 'Shipping'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-6 text-base font-bold uppercase tracking-widest relative whitespace-nowrap transition-all ${
                activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {tab}{tab === 'Reviews' ? ` (${reviews.length || product.reviewCount})` : ''}
              {activeTab === tab && <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Description' && (
              <motion.div key="desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </motion.div>
            )}

            {activeTab === 'Reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                {/* Rating summary */}
                <div className="flex flex-col md:flex-row items-center gap-12 p-10 bg-gray-50 rounded-[32px]">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-gray-900 mb-2">{avgRating}</p>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-6 h-6 ${i < Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                      {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex-grow w-full space-y-3">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = reviews.filter(r => r.rating === stars).length;
                      const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-4">
                          <span className="text-xs font-bold text-gray-500 w-4">{stars}</span>
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <div className="flex-grow h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-400 w-10">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review list */}
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No reviews yet. Be the first!</p>
                ) : (
                  <div className="space-y-8">
                    {reviews.map(review => (
                      <div key={review.id} className="pb-8 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
                              {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {review.user?.firstName} {review.user?.lastName}
                                {review.verified && (
                                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    <Check className="w-3 h-3" /> Verified
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h5 className="font-bold text-gray-900 mb-2">{review.title}</h5>
                        <p className="text-gray-600 leading-relaxed">{review.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write a review */}
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-2xl p-8 space-y-5">
                    <h4 className="text-lg font-bold text-gray-900">Write a Review</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: star }))}>
                            <Star className={`w-7 h-7 transition-colors ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                      <input type="text" value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="Summarise your experience"
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Review</label>
                      <textarea value={reviewForm.body} onChange={e => setReviewForm(p => ({ ...p, body: e.target.value }))}
                        rows={4} placeholder="Tell others what you think..."
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm bg-white resize-none" />
                    </div>
                    <Button type="submit" loading={submittingReview} rightIcon={<Send className="w-4 h-4" />}>
                      Submit Review
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500 mb-3">Sign in to leave a review</p>
                    <Link to="/login"><Button variant="secondary">Sign In</Button></Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Shipping' && (
              <motion.div key="shipping" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-6 text-gray-600">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Delivery Timeframes</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Standard Shipping: 5–7 business days</li>
                    <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Express Shipping: 2–3 business days</li>
                    <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Overnight: Next business day</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Return Policy</h4>
                  <p className="text-sm leading-relaxed">
                    30-day hassle-free returns. Items must be in original condition with tags attached. Refunds processed within 5–7 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Free Shipping</h4>
                  <p className="text-sm">Orders over $50 qualify for free standard shipping.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Suggestions</p>
              <h2>You May Also Like</h2>
            </div>
            <Link to="/shop"><Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>View All</Button></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {relatedProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={{
                  ...p,
                  price: Number(p.price),
                  originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
                  colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
                }} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
