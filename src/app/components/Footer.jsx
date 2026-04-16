import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Truck, ShieldCheck, RefreshCcw, Headphones } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Link } from 'react-router';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 lg:px-8 pb-16 border-b border-gray-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gray-800 p-8 rounded-2xl">
          <div className="flex-1">
            <h3 className="text-white text-2xl font-bold mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-400">Get 20% off your first order and stay updated with latest trends.</p>
          </div>
          <div className="flex-1 w-full max-w-md flex flex-col sm:flex-row gap-4">
            <Input 
              placeholder="Enter your email" 
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-900"
            />
            <Button className="w-full sm:w-auto h-12">Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* About Column */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-white uppercase">CHILALO<span className="text-primary">SHOP</span></span>
          </Link>
          <p className="text-sm leading-relaxed">
            Leading e-commerce destination for modern fashion. We bring you the latest styles from global brands at competitive prices.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-lg"><Facebook className="w-5 h-5" /></Link>
            <Link to="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-lg"><Instagram className="w-5 h-5" /></Link>
            <Link to="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-lg"><Twitter className="w-5 h-5" /></Link>
            <Link to="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-lg"><Youtube className="w-5 h-5" /></Link>
          </div>
        </div>

        {/* Shop Column */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white text-lg font-bold uppercase tracking-wider">Shop</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/shop" className="hover:text-white transition-colors">Men's Fashion</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Women's Fashion</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Accessories</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Footwear</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Sale</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white text-lg font-bold uppercase tracking-wider">Support</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Shipping Info</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Account Column */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white text-lg font-bold uppercase tracking-wider">Account</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="#" className="hover:text-white transition-colors">My Profile</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Order History</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Wishlist</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Settings</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white text-lg font-bold uppercase tracking-wider">Contact</h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <span>123 Fashion Ave, Design District, New York, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <span>+1 (234) 567-890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <span>support@chilaloshop.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-800/50 py-12">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-800 rounded-full group-hover:bg-primary transition-colors duration-300">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Free Shipping</p>
              <p className="text-xs">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-800 rounded-full group-hover:bg-primary transition-colors duration-300">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Secure Payment</p>
              <p className="text-xs">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-800 rounded-full group-hover:bg-primary transition-colors duration-300">
              <RefreshCcw className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">30-Day Returns</p>
              <p className="text-xs">Easy return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-800 rounded-full group-hover:bg-primary transition-colors duration-300">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">24/7 Support</p>
              <p className="text-xs">Dedicated help center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 lg:px-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© {currentYear} CHILALOSHOP. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <Link to="#" className="hover:text-white">Privacy Policy</Link>
          <Link to="#" className="hover:text-white">Terms of Service</Link>
          <Link to="#" className="hover:text-white">Cookie Settings</Link>
        </div>
        <div className="flex items-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 hover:opacity-100 transition-opacity" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </footer>
  );
}
