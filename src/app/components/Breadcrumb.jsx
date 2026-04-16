import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router';

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 py-4">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <ChevronRight className="w-4 h-4" />
          <Link 
            to={item.path} 
            className={`hover:text-primary transition-colors ${index === items.length - 1 ? 'text-gray-900 font-semibold' : ''}`}
          >
            {item.name}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
