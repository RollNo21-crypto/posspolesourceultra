// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import posspoleLogo from "/assets/posspole-modified.png";
// import {
//   Facebook,
//   Twitter,
//   Instagram,
//   Mail,
//   Phone,
//   MapPin,
//   Package,
// } from 'lucide-react';

// export function Footer() {
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith('/admin');

//   if (isAdminRoute) return null;

//   return (
//     <footer className="bg-accent text-white">
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//             <Link 
//             to="/" 
//             className="flex items-center gap-2 text-primary-600"
//           >
//             <img 
//               src={posspoleLogo} 
//               alt="PossPole Logo" 
//               className="h-9 w-auto"
//             />
           
//           </Link>
//             </div>
//             <p className="text-secondary-200">
//               Your trusted marketplace for Electrical, Laboratory and Medical Equipment.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3">
//                 <Phone className="h-5 w-5 text-primary" />
//                 <span>+91 86181-45049</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Mail className="h-5 w-5 text-primary" />
//                 <span>letmein@posspole.com</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <MapPin className="h-5 w-5 text-primary" />
//                 <span>
//                 POSSPOLE PVT LTD, Krishi Bhavan, Before, Cubbon Park Rd,
//                   <br />
//                 Nunegundlapalli, Ambedkar Veedhi, Bengaluru, Karnataka 560001
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/" className="hover:text-primary transition-colors">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/buy" className="hover:text-primary transition-colors">
//                   Buy
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/donate" className="hover:text-primary transition-colors">
//                   Donate
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/sell" className="hover:text-primary transition-colors">
//                   Sell With Us
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
//             <div className="flex space-x-4 mb-6">
//               <a
//                 href="https://facebook.com"
//                 className="hover:text-primary transition-colors"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <Facebook className="h-6 w-6" />
//               </a>
//               <a
//                 href="https://twitter.com"
//                 className="hover:text-primary transition-colors"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <Twitter className="h-6 w-6" />
//               </a>
//               <a
//                 href="https://instagram.com"
//                 className="hover:text-primary transition-colors"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <Instagram className="h-6 w-6" />
//               </a>
//             </div>
//             <div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-white/10 mt-8 pt-8 text-center">
//           <p className="text-secondary-200">
//             &copy; {new Date().getFullYear()} POSSPOLE. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import posspoleLogo from "/assets/posspole-modified.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    contact: ''
  });

  const toggleForm = () => setIsFormOpen(!isFormOpen);

  if (isAdminRoute) return null;

  return (
    <>
      <footer className="bg-accent text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 text-primary-600">
                <img src={posspoleLogo} alt="PossPole Logo" className="h-9 w-auto" />
              </Link>
              <p className="text-secondary-200">
                Your trusted marketplace for Electrical, Laboratory, and Medical Equipment.
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
                  <span>POSSPOLE PVT LTD, Krishi Bhavan, Before Cubbon Park Rd, Bengaluru, Karnataka 560001</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/buy" className="hover:text-primary transition-colors">Buy</Link></li>
                <li><Link to="/donate" className="hover:text-primary transition-colors">Donate</Link></li>
                <li><Link to="/sell" className="hover:text-primary transition-colors">Sell With Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="https://facebook.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer"><Facebook className="h-6 w-6" /></a>
                <a href="https://twitter.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer"><Twitter className="h-6 w-6" /></a>
                <a href="https://instagram.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer"><Instagram className="h-6 w-6" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-secondary-200">&copy; {new Date().getFullYear()} POSSPOLE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Email Button */}
      <a onClick={toggleForm} className="fixed bottom-5 right-5 bg-gray-500 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 z-[9999]" style={{ cursor: 'pointer' }}>
        <img src="https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//1055049_global_globe_network_planet_icon.png" alt="Email" className="w-8 h-8" />
      </a>

      {/* Modal Form for Capturing Info */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[9998]" onClick={toggleForm}>
          <div className="bg-white p-8 rounded-lg shadow-lg w-80" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <form action="https://formsubmit.co/krishnamurthym@posspole.com" method="POST" className="flex flex-col space-y-4">
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-3 py-2 rounded-md w-full border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500" required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="px-3 py-2 rounded-md w-full border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500" required />
              <input type="tel" name="contact" placeholder="Your Contact Number" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="px-3 py-2 rounded-md w-full border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500" required />
              <button type="submit" className="bg-cyan-600 px-4 py-2 rounded-lg text-white hover:bg-cyan-700 transition-colors">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
