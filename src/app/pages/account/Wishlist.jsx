import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { Link } from 'react-router';
import { Heart, Loader2 } from 'lucide-react';
import { api } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const STORAGE_KEY = (userId) => `wishlist_${userId}`;

// Exported helper so ProductCard / other components can toggle wishlist
export function getWishlistIds(userId) {
  return JSON.parse(localStorage.getItem(STORAGE_KEY(userId)) || '[]');
}

export function toggleWishlistItem(userId, productId) {
  const ids = getWishlistIds(userId);
  const updated = ids.includes(productId)
    ? ids.filter(id => id !== productId)
    : [...ids, productId];
  localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(updated));
  return updated;
}

export default function Wishlist() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const ids = getWishlistIds(user.id);
    if (ids.length === 0) { setLoading(false); return; }

    // Fetch all products then filter to wishlist ids
    api.getProducts()
      .then(all => {
        const wished = all
          .filter(p => ids.includes(p.id))
          .map(p => ({
            ...p,
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
            colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
          }));
        setProducts(wished);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
        <Link to="/shop" className="text-primary font-bold hover:underline">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-6">My Wishlist ({products.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
