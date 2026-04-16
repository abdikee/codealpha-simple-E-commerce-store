import React from 'react';
import { Minus, Plus } from 'lucide-react';

export function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center gap-4 bg-gray-50 border border-gray-100 p-2 rounded-xl">
      <button 
        onClick={decrement}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-bold text-lg">{value}</span>
      <button 
        onClick={increment}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
