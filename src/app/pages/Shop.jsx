import React, { useState, useEffect, useRef } from 'react';
import { Filter, Grid3X3, List, ChevronDown, ChevronLeft, ChevronRight, X, Star, Search, RotateCcw } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Input } from '../components/Input';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../utils/api.js';
import { useSearchParams, useNavigate } from 'react-router';
import { ShopPageSkeleton } from '../components/ui/skeleton.jsx';
import { QuickViewModal } from '../components/QuickViewModal.jsx';
import { filterProducts, sortProducts, paginateProducts, getPageCount, getPaginationLabel } from '../utils/filters.js';
import { staggerContainer, fadeInUp } from '../utils/animations.js';

const PAGE_SIZE = 12;

export function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef(null);

  // Read filters from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (categoryParam) setSelectedCategories(categoryParam.split(','));
    if (sortParam) setSelectedSort(sortParam);
    if (minPrice || maxPrice) setPriceRange([parseInt(minPrice) || 0, parseInt(maxPrice) || 500]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const searchQuery = searchParams.get('search');
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(searchQuery ? { search: searchQuery } : {}),
          api.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedSizes, selectedColors, minRating, inStockOnly, priceRange, selectedSort]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    else params.delete('category');
    if (selectedSort !== 'Featured') params.set('sort', selectedSort);
    else params.delete('sort');
    if (priceRange[0] !== 0) params.set('minPrice', priceRange[0].toString());
    else params.delete('minPrice');
    if (priceRange[1] !== 500) params.set('maxPrice', priceRange[1].toString());
    else params.delete('maxPrice');
    setSearchParams(params, { replace: true });
  }, [selectedCategories, selectedSort, priceRange]);

  // Lock body scroll when mobile filter open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFilterOpen]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const colors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Amber', hex: '#F59E0B' },
  ];

  const handleCategoryToggle = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const handleSizeToggle = (size) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const handleColorToggle = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleRatingToggle = (rating) => setMinRating(prev => prev === rating ? 0 : rating);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating(0);
    setPriceRange([0, 500]);
    setInStockOnly(false);
    setSelectedSort('Featured');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedSizes.length > 0 ||
    selectedColors.length > 0 || minRating > 0 || priceRange[0] !== 0 || priceRange[1] !== 500 || inStockOnly;

  // Apply filters, sort, paginate
  const filteredProducts = sortProducts(
    filterProducts(products, {
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      minRating: minRating || null,
      inStockOnly,
      minPrice: priceRange[0] !== 0 ? priceRange[0] : '',
      maxPrice: priceRange[1] !== 500 ? priceRange[1] : '',
    }),
    selectedSort
  );

  const totalPages = getPageCount(filteredProducts.length, PAGE_SIZE);
  const paginatedProducts = paginateProducts(filteredProducts, currentPage, PAGE_SIZE);
  const paginationLabel = getPaginationLabel(currentPage, PAGE_SIZE, filteredProducts.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  if (loading) {
    return <ShopPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-24 text-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  const FilterSidebar = ({ mobile = false }) => (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold uppercase tracking-wider">Filters</h4>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Categories</h5>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center gap-3">
              <input type="checkbox" id={`${mobile ? 'm-' : ''}${cat.id}`} checked={selectedCategories.includes(cat.name)}
                onChange={() => handleCategoryToggle(cat.name)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300" />
              <label htmlFor={`${mobile ? 'm-' : ''}${cat.id}`} className="text-sm font-medium text-gray-700 cursor-pointer flex-grow flex justify-between">
                {cat.name}
                <span className="text-gray-400 font-normal">({cat._count?.products || cat.count || 0})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Availability */}
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Availability</h5>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <label htmlFor={`${mobile ? 'm-' : ''}in-stock`} className="text-sm font-bold text-gray-700 cursor-pointer">In Stock Only</label>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id={`${mobile ? 'm-' : ''}in-stock`} className="sr-only peer"
              checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Price Range</h5>
        <div className="flex items-center gap-4">
          <Input placeholder="Min" type="number" value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
            className="h-10 text-sm" />
          <span className="text-gray-400">—</span>
          <Input placeholder="Max" type="number" value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500])}
            className="h-10 text-sm" />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Size</h5>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button key={size} onClick={() => handleSizeToggle(size)}
              className={`min-w-[40px] h-10 px-2 rounded-md text-sm font-bold border-2 transition-all duration-200 ${
                selectedSizes.includes(size) ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300'
              }`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Color</h5>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <motion.button key={color.name} title={color.name}
              onClick={() => handleColorToggle(color.name)}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColors.includes(color.name) ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}>
              {selectedColors.includes(color.name) && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Rating</h5>
        <ul className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <motion.li key={rating} onClick={() => handleRatingToggle(rating)}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${minRating === rating ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className={`text-sm ${minRating === rating ? 'text-primary font-semibold' : 'text-gray-500'}`}>
                & Up {minRating === rating && '✓'}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );


  return (
    <div className="container mx-auto px-4 lg:px-8 pb-24">
      <Breadcrumb items={[{ name: 'Shop', path: '/shop' }]} />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Product Grid Area */}
        <main className="flex-grow" ref={gridRef}>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-1">Explore Products</h2>
              <p className="text-sm text-gray-500">{filteredProducts.length} items found</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button variant="secondary" className="lg:hidden flex-grow" leftIcon={<Filter className="w-5 h-5" />}
                onClick={() => setIsFilterOpen(true)}>
                Filters
              </Button>

              {/* Sort Dropdown - click to open */}
              <div className="relative min-w-[200px]">
                <button
                  onClick={() => setIsSortOpen(prev => !prev)}
                  className="flex items-center justify-between w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:border-primary transition-colors"
                >
                  <span className="flex items-center gap-2">Sort: <span className="text-primary">{selectedSort}</span></span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl p-2 z-30"
                    >
                      {['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest Arrivals', 'Highest Rated'].map((option) => (
                        <button key={option} onClick={() => { setSelectedSort(option); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedSort === option ? 'bg-primary-50 text-primary' : 'hover:bg-gray-50 text-gray-600'
                          }`}>
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Grid/List Toggle */}
              <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'bg-white text-gray-400 hover:text-primary'}`}>
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2.5 border-l border-gray-200 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-primary' : 'bg-white text-gray-400 hover:text-primary'}`}>
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-2 mb-8">
                {selectedCategories.map(cat => (
                  <motion.div key={cat} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-2 bg-primary-50 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Category: {cat}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => handleCategoryToggle(cat)} />
                  </motion.div>
                ))}
                {selectedSizes.map(size => (
                  <motion.div key={size} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-2 bg-primary-50 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Size: {size}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => handleSizeToggle(size)} />
                  </motion.div>
                ))}
                {selectedColors.map(color => (
                  <motion.div key={color} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-2 bg-primary-50 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Color: {color}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => handleColorToggle(color)} />
                  </motion.div>
                ))}
                {minRating > 0 && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-2 bg-primary-50 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Rating: {minRating}+ Stars
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => setMinRating(0)} />
                  </motion.div>
                )}
                {(priceRange[0] !== 0 || priceRange[1] !== 500) && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-2 bg-primary-50 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Price: ${priceRange[0]}–${priceRange[1]}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => setPriceRange([0, 500])} />
                  </motion.div>
                )}
                {inStockOnly && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-2 bg-primary-50 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    In Stock Only
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => setInStockOnly(false)} />
                  </motion.div>
                )}
                <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary font-bold uppercase tracking-wider transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Clear All
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          {paginatedProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Try adjusting your filters.</p>
              {hasActiveFilters && (
                <Button onClick={clearAllFilters} variant="secondary">
                  <RotateCcw className="w-4 h-4 mr-2" /> Clear All Filters
                </Button>
              )}
            </motion.div>
          ) : viewMode === 'list' ? (
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-4">
              {paginatedProducts.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} variant="horizontal" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="animate"
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8">
              {paginatedProducts.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-8 py-8 border-t border-gray-100">
              <p className="text-sm text-gray-500">{paginationLabel}</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="w-10 h-10 p-0"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  return (
                    <Button key={page} variant={page === currentPage ? 'primary' : 'secondary'} size="sm"
                      className="w-10 h-10 p-0" onClick={() => handlePageChange(page)}>
                      {page}
                    </Button>
                  );
                })}
                <Button variant="secondary" size="sm" className="w-10 h-10 p-0"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setIsFilterOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 inset-x-0 bg-white z-[110] rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold uppercase tracking-wider">Filters</h4>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></Button>
              </div>
              <div className="pb-12">
                <FilterSidebar mobile />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="secondary" className="flex-1 h-14" onClick={clearAllFilters}>Clear All</Button>
                <Button className="flex-1 h-14" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Close sort dropdown on outside click */}
      {isSortOpen && <div className="fixed inset-0 z-20" onClick={() => setIsSortOpen(false)} />}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
