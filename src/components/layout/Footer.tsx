
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";
import AnimatedLogo from "../ui/AnimatedLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="app-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <AnimatedLogo size="md" />
            <p className="text-gray-600 text-sm">
              JAMCart brings convenience to your doorstep. Order groceries, food, pharmaceuticals, and more with just a click.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-jamcart-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-jamcart-red transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-jamcart-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/category/mini-mart"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  Mini Mart
                </Link>
              </li>
              <li>
                <Link
                  to="/category/supermarket"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  Supermarket
                </Link>
              </li>
              <li>
                <Link
                  to="/category/pharmacy"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  Pharmacy
                </Link>
              </li>
              <li>
                <Link
                  to="/category/restaurant"
                  className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
                >
                  Restaurant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-jamcart-red mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">support@jamcart.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-jamcart-red mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-jamcart-red mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600 text-sm">
                  123 Delivery Street, Kingston, Jamaica
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} JAMCart. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/terms"
              className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-jamcart-red transition-colors text-sm"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
