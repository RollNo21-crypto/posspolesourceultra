import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import posspoleLogo from "/assets/posspole-modified.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Package,
} from 'lucide-react';

export function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <footer className="bg-accent text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
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
            </div>
            <p className="text-secondary-200">
              Your trusted marketplace for Electrical, Laboratory and Medical Equipment.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+91 86181-45049</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>letmein@posspole.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>
                POSSPOLE PVT LTD, Krishi Bhavan, Before, Cubbon Park Rd,
                  <br />
                Nunegundlapalli, Ambedkar Veedhi, Bengaluru, Karnataka 560001
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-primary transition-colors">
                  Buy
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-primary transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-primary transition-colors">
                  Sell With Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-secondary-200">
            &copy; {new Date().getFullYear()} POSSPOLE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}