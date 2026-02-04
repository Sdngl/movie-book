import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Short Description */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">CineLoop</h1>
          <p className="text-gray-400 text-sm">
            Watch movies, shows, and the latest releases anytime, anywhere. Stream your favorite content with ease.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaYoutube /></a>
          </div>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-semibold mb-2">Company</h2>
          <Link to="/about" className="hover:text-white transition">About Us</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/careers" className="hover:text-white transition">Careers</Link>
        </div>

        {/* Support Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-semibold mb-2">Support</h2>
          <Link to="/faq" className="hover:text-white transition">FAQ</Link>
          <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-3">
          <h2 className="text-white font-semibold mb-2">Newsletter</h2>
          <p className="text-gray-400 text-sm">
            Subscribe to get the latest updates and exclusive offers.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 rounded-l-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button className="bg-red-600 text-white px-4 py-2 rounded-r-md font-medium hover:bg-red-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CineLoop. All rights reserved.
      </div>
    </footer>
  );
}
