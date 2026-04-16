import React from 'react';
import { Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { QuantitySelector } from './QuantitySelector';

export function CartItem({ product, quantity, size, color, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-8 border-b border-gray-100 last:border-0 group">
      <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm border border-gray-100">
        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
      </div>
      
      <div className="flex-grow flex flex-col sm:flex-row justify-between w-full gap-6">
        <div className="flex flex-col gap-1 max-w-sm">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">{product.category?.name || product.category}</p>
          <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors cursor-pointer">{product.name}</h4>
          <p className="text-sm text-gray-400 font-medium">Size: <span className="text-gray-900">{size || 'M'}</span> · Color: <span className="text-gray-900">{color || 'Black'}</span></p>
          <div className="flex items-center gap-4 mt-3">
             <button 
                onClick={onRemove}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-destructive transition-colors uppercase tracking-widest group/del"
             >
                <div className="p-2 bg-gray-50 rounded-lg group-hover/del:bg-destructive/10 transition-colors">
                   <Trash2 className="w-4 h-4" />
                </div>
                Remove Item
             </button>
             <div className="h-4 w-px bg-gray-200" />
             <button className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Move to Wishlist</button>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end justify-between gap-4">
           <div className="flex items-center gap-12 sm:gap-16">
              <div className="flex flex-col items-start sm:items-center">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</p>
                 <QuantitySelector value={quantity} onChange={onUpdateQuantity} />
              </div>
              <div className="flex flex-col items-start sm:items-end">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Price</p>
                 <p className="text-xl font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</p>
                 <p className="text-xs text-gray-400 font-medium">${product.price.toFixed(2)} each</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
