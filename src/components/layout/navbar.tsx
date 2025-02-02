import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Gift, X, Menu, Home, Phone, Store } from 'lucide-react';
import { useIsAdmin } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CartModal } from '@/components/ui/cart-modal';
import { ConfirmationCard } from '@/components/ui/confirmation-card';
import posspoleLogo from "/assets/posspole.png";

export function Navbar() {
  const isAdmin = useIsAdmin();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { buyCart, donateCart } = useStore();

  const [activeCart, setActiveCart] = React.useState<'buy' | 'donate' | null>(null);
  const [confirmationData, setConfirmationData] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isAdminRoute) return null;

  const navigationItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/donate', label: 'Donate', icon: Gift },
    { to: '/buy', label: 'Buy', icon: ShoppingCart },
    { to: '/sell', label: 'Sell With Us', icon: Store },
    { to: '/contact', label: 'Contact Us', icon: Phone },
  ];

  return (
    <nav className="sticky top-0 w-full z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary-600"
          >
            <img 
              src={posspoleLogo} 
              alt="PossPole Logo" 
              className="h-9 w-auto"
            />
           
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'relative text-sm font-medium transition-all duration-200',
                  'text-gray-800 hover:text-primary-600',
                  location.pathname === item.to && 'text-primary-600'
                )}
              >
                {item.label}
                {location.pathname === item.to && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600" />
                )}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveCart('buy')}
                className="relative text-gray-800 hover:text-primary-600 transition-colors duration-200"
              >
                <ShoppingCart className="h-6 w-6" />
                {buyCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {buyCart.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveCart('donate')}
                className="relative text-gray-800 hover:text-secondary-600 transition-colors duration-200"
              >
                <Gift className="h-6 w-6" />
                {donateCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-secondary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {donateCart.length}
                  </span>
                )}
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg',
                  'bg-primary-600 text-white hover:bg-primary-700',
                  'transition-colors duration-200'
                )}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setActiveCart('buy')}
                className="p-2 rounded-lg text-gray-800 hover:text-primary-600 transition-colors duration-200 relative"
              >
                <ShoppingCart className="h-6 w-6" />
                {buyCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {buyCart.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveCart('donate')}
                className="p-2 rounded-lg text-gray-800 hover:text-secondary-600 transition-colors duration-200 relative"
              >
                <Gift className="h-6 w-6" />
                {donateCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-secondary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {donateCart.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-800 hover:text-primary-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'fixed inset-0 top-16 bg-white z-40 md:hidden',
            'transition-all duration-300 ease-in-out',
            isMobileMenuOpen 
              ? 'opacity-100 visible'
              : 'opacity-0 invisible pointer-events-none'
          )}
        >
          <div className="p-4 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg',
                  'text-lg font-medium',
                  location.pathname === item.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-800 hover:bg-gray-50'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg"
              >
                <Package className="h-5 w-5" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {activeCart && (
        <CartModal
          type={activeCart}
          onClose={() => setActiveCart(null)}
          onSubmitSuccess={(data) => {
            setActiveCart(null);
            setConfirmationData(data);
          }}
        />
      )}

      {/* Confirmation Modal */}
      {confirmationData && (
        <ConfirmationCard
          type={confirmationData.type}
          data={confirmationData}
          onClose={() => setConfirmationData(null)}
        />
      )}
    </nav>
  );
}