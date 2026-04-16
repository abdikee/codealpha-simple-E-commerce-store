import React, { useState } from 'react';
import { X, Star, ShoppingCart, Check } from 'lucide-react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { scaleIn } from '../utils/animations.js';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router';
import { showToast } from './ui/toaster.jsx';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;
  const sizes = product.sizes || [];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }

    if (!selectedSize || !selectedColor) {
      setValidationError('Please select a size and color');
      return;
    }

    setValidationError('');
    setAddingToCart(true);

    try {
      await api.addToCart({
        productId: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor
      });
      showToast.success('Added to cart!', `${product.name} has been added to your cart`);
      onClose();
    } catch (err) {
      showToast.error('Failed to add to cart', err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <motion.div
          initial={scaleIn.initial}
          animate={scaleIn.animate}
          className="grid md:grid-cols-2"
        >
          {/* Image */}
          <div className="aspect-square bg-gray-50">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <DialogTitle className="text-2xl font-bold mb-2">{product.name}</DialogTitle>
            <DialogDescription className="text-gray-500 mb-4">
              {product.category?.name || 'Product'}
            </DialogDescription>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">${product.price?.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>

            {/* Color Selection */}
            {colors && colors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Color: <span className="text-primary">{selectedColor}</span></h4>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => { setSelectedColor(color.name); setValidationError(''); }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.name ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className={`w-4 h-4 mx-auto ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Size: <span className="text-primary">{selectedSize}</span></h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setValidationError(''); }}
                      className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                        selectedSize === size
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Error */}
            <AnimatePresence>
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-500 mb-4"
                >
                  {validationError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                className="flex-1 h-12"
                leftIcon={<ShoppingCart className="w-5 h-5" />}
                onClick={handleAddToCart}
                disabled={addingToCart || !product.inStock}
              >
                {addingToCart ? 'Adding...' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="secondary"
                className="h-12 px-6"
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.id}`);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
