const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status})`);
    }

    return data;
  }

  // ── Auth ──────────────────────────────────────────────────────────────
  register(userData)      { return this.fetch('/auth/register', { method: 'POST', body: userData }); }
  login(credentials)      { return this.fetch('/auth/login',    { method: 'POST', body: credentials }); }
  getMe()                 { return this.fetch('/auth/me'); }
  forgotPassword(email)   { return this.fetch('/auth/forgot-password', { method: 'POST', body: { email } }); }

  // ── Products ──────────────────────────────────────────────────────────
  getProducts(params = {}) {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined))
    ).toString();
    return this.fetch(`/products${query ? `?${query}` : ''}`);
  }
  getProduct(id)          { return this.fetch(`/products/${id}`); }
  createProduct(data)     { return this.fetch('/products',     { method: 'POST',   body: data }); }
  updateProduct(id, data) { return this.fetch(`/products/${id}`, { method: 'PUT',  body: data }); }
  deleteProduct(id)       { return this.fetch(`/products/${id}`, { method: 'DELETE' }); }

  // ── Categories ────────────────────────────────────────────────────────
  getCategories()           { return this.fetch('/categories'); }
  getCategory(id)           { return this.fetch(`/categories/${id}`); }
  createCategory(data)      { return this.fetch('/categories',      { method: 'POST',   body: data }); }
  updateCategory(id, data)  { return this.fetch(`/categories/${id}`, { method: 'PUT',   body: data }); }
  deleteCategory(id)        { return this.fetch(`/categories/${id}`, { method: 'DELETE' }); }

  // ── Cart ──────────────────────────────────────────────────────────────
  getCart()                     { return this.fetch('/cart'); }
  addToCart(item)               { return this.fetch('/cart',      { method: 'POST',   body: item }); }
  updateCartItem(id, quantity)  { return this.fetch(`/cart/${id}`, { method: 'PUT',   body: { quantity } }); }
  removeFromCart(id)            { return this.fetch(`/cart/${id}`, { method: 'DELETE' }); }
  clearCart()                   { return this.fetch('/cart',       { method: 'DELETE' }); }

  // ── Orders ────────────────────────────────────────────────────────────
  getOrders()             { return this.fetch('/orders'); }
  getOrder(id)            { return this.fetch(`/orders/${id}`); }
  createOrder(data)       { return this.fetch('/orders',           { method: 'POST',  body: data }); }
  getAllOrders()           { return this.fetch('/orders/admin/all'); }
  updateOrderStatus(id, status) {
    return this.fetch(`/orders/${id}/status`, { method: 'PUT', body: { status } });
  }

  // ── Users ─────────────────────────────────────────────────────────────
  getUsers()                    { return this.fetch('/users'); }
  getUser(id)                   { return this.fetch(`/users/${id}`); }
  updateUser(id, data)          { return this.fetch(`/users/${id}`,          { method: 'PUT', body: data }); }
  updatePassword(id, data)      { return this.fetch(`/users/${id}/password`, { method: 'PUT', body: data }); }
  updateUserRole(id, role)      { return this.fetch(`/users/${id}/role`,     { method: 'PUT', body: { role } }); }
  deleteUser(id)                { return this.fetch(`/users/${id}`,          { method: 'DELETE' }); }

  // ── Reviews ───────────────────────────────────────────────────────────────
  getProductReviews(productId)  { return this.fetch(`/reviews/product/${productId}`); }
  createReview(data)            { return this.fetch('/reviews', { method: 'POST', body: data }); }
  deleteReview(id)              { return this.fetch(`/reviews/${id}`, { method: 'DELETE' }); }

  // ── Password reset ────────────────────────────────────────────────────────
  resetPassword(token, password) {
    return this.fetch('/auth/reset-password', { method: 'POST', body: { token, password } });
  }

  // ── Admin stats ───────────────────────────────────────────────────────
  getAdminStats() { return this.fetch('/admin/stats'); }
}

export const api = new ApiClient();
