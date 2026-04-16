import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { showToast } from '../components/ui/toaster.jsx';
import { getWishlistIds, toggleWishlistItem } from '../pages/account/Wishlist.jsx';

export function ProductCard({ product, variant = 'default', onQuickView }) {
  const [isHovered, setIsHovered]         = useState(false);
  const [isWished, setIsWished]           = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart]     = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Sync wishlist state using the user-scoped key
  useEffect(() => {
    if (!user) return;
    setIsWished(getWishlistIds(user.id).includes(product.id));
  }, [product.id, user]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast.info('Please sign in to add items to cart');
      navigate('/login', { state: { from: { pathname: `/product/${product.id}` } } });
      return;
    }

    setIsAddingToCart(true);
    try {
      const colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;
      await api.addToCart({
        productId: product.id,
        quantity: 1,
        size: product.sizes?.[0] || 'One Size',
        color: colors?.[0]?.name || 'Default',
      });
      setAddedToCart(true);
      showToast.success('Added to cart', `${product.name} added to your cart`);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      showToast.error('Failed to add to cart', err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    const updated = toggleWishlistItem(user.id, product.id);
    const nowWished = updated.includes(product.id);
    setIsWished(nowWished);
    showToast[nowWished ? 'success' : 'info'](
      nowWished ? 'Added to wishlist' : 'Removed from wishlist'
    );
  };

  const discount = product.originalPrice
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  const badgeConfig = {
    Sale:        { text: `Sale -${discount}%`, className: 'bg-destructive' },
    New:         { text: 'New',                className: 'bg-[#8B5CF6]' },
    'Best Seller': { text: 'Best Seller',      className: 'bg-[#F59E0B]' },
    'Low Stock': { text: 'Low Stock',          className: 'bg-[#F97316]' },
  };

  const Badge = ({ children, className }) => (
    <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-sm text-white font-medium text-[10px] uppercase tracking-wider z-10 ${className}`}>
      {children}
    </div>
  );

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
        <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <Link to={`/product/${product.id}`} className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-primary">${Number(product.price).toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">${Number(product.originalPrice).toFixed(2)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] text-gray-500">{product.rating}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="group bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        {product.badge && badgeConfig[product.badge] && (
          <Badge className={badgeConfig[product.badge].className}>
            {badgeConfig[product.badge].text}
          </Badge>
        )}

        <motion.button
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-red-500 transition-colors"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isWished ? 'filled' : 'empty'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <Link to={`/product/${product.id}`}>
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        </Link>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-x-0 bottom-0 p-4 bg-white/80 backdrop-blur-sm z-20 flex flex-col gap-2"
            >
              <Button
                size="sm" variant="primary" className="w-full h-9"
                leftIcon={addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                onClick={handleAddToCart}
                disabled={isAddingToCart || addedToCart || !product.inStock}
              >
                {!product.inStock ? 'Out of Stock' : isAddingToCart ? 'Adding…' : addedToCart ? 'Added!' : 'Add to Cart'}
              </Button>
              <Button
                size="sm" variant="secondary" className="w-full h-9"
                leftIcon={<Eye className="w-4 h-4" />}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(product); }}
              >
                Quick View
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {product.category?.name || product.category}
        </p>
        <Link to={`/product/${product.id}`} className="text-base font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(Number(product.rating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">${Number(product.originalPrice).toFixed(2)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
