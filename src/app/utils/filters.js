/**
 * Pure filter/sort/pagination utility functions for the Shop page.
 * No side effects, no mutations.
 */

/**
 * Filters an array of products based on the provided filter criteria.
 * @param {Array} products - The full list of products
 * @param {Object} filters - Active filter values
 * @returns {Array} Filtered products
 */
export function filterProducts(products, filters) {
  return products.filter((product) => {
    // Price range
    if (filters.minPrice !== '' && filters.minPrice !== null) {
      if (product.price < Number(filters.minPrice)) return false;
    }
    if (filters.maxPrice !== '' && filters.maxPrice !== null) {
      if (product.price > Number(filters.maxPrice)) return false;
    }

    // Sizes
    if (filters.sizes && filters.sizes.length > 0) {
      const productSizes = product.sizes || [];
      const hasMatch = filters.sizes.some((size) => productSizes.includes(size));
      if (!hasMatch) return false;
    }

    // Colors — product.colors can be string[] or {name: string}[]
    if (filters.colors && filters.colors.length > 0) {
      const productColors = (product.colors || []).map((c) =>
        typeof c === 'object' && c !== null ? c.name : c
      );
      const hasMatch = filters.colors.some((color) => productColors.includes(color));
      if (!hasMatch) return false;
    }

    // Minimum rating
    if (filters.minRating !== null && filters.minRating !== undefined) {
      if (product.rating < filters.minRating) return false;
    }

    // In stock only
    if (filters.inStockOnly === true) {
      if (product.inStock !== true) return false;
    }

    // Categories
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(product.category)) return false;
    }

    // Badge
    if (filters.badge && filters.badge !== '') {
      if (product.badge !== filters.badge) return false;
    }

    return true;
  });
}

/**
 * Sorts a copy of the products array by the given sort option.
 * @param {Array} products
 * @param {string} sortOption
 * @returns {Array} New sorted array
 */
export function sortProducts(products, sortOption) {
  const sorted = [...products];

  switch (sortOption) {
    case 'Price: Low to High':
      return sorted.sort((a, b) => a.price - b.price);

    case 'Price: High to Low':
      return sorted.sort((a, b) => b.price - a.price);

    case 'Newest Arrivals':
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    case 'Highest Rated':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'Featured':
    default:
      return sorted;
  }
}

/**
 * Returns a slice of products for the given page.
 * @param {Array} products
 * @param {number} page - 1-based page number
 * @param {number} pageSize
 * @returns {Array}
 */
export function paginateProducts(products, page, pageSize) {
  return products.slice((page - 1) * pageSize, page * pageSize);
}

/**
 * Returns the total number of pages, minimum 1.
 * @param {number} totalItems
 * @param {number} pageSize
 * @returns {number}
 */
export function getPageCount(totalItems, pageSize) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/**
 * Returns a human-readable pagination label.
 * @param {number} page
 * @param {number} pageSize
 * @param {number} total
 * @returns {string}
 */
export function getPaginationLabel(page, pageSize, total) {
  if (total === 0) return 'No products found';
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Showing ${start}–${end} of ${total} products`;
}
