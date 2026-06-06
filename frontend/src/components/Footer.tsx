import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 px-6 md:px-16 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h2 className="text-white text-3xl font-extrabold tracking-tight">CarRent</h2>
          <p className="mt-2 text-sm">
            Your trusted partner for car rentals and tour packages across India.
            Experience comfort and reliability on every journey.
          </p>
          <div className="flex space-x-5 mt-6 text-xl">
            <FaFacebookF className="cursor-pointer hover:text-white transition-colors" />
            <FaTwitter className="cursor-pointer hover:text-white transition-colors" />
            <FaInstagram className="cursor-pointer hover:text-white transition-colors" />
            <FaLinkedinIn className="cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="mt-2 space-y-3 text-sm font-medium">
            {[
              "About Us",
              "Our Cars",
              "Tour Packages",
              "Special Offers",
              "Blog",
              "Contact Us",
            ].map((link) => (
              <li key={link} className="hover:text-white cursor-pointer transition-colors">
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Destinations */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Popular Destinations</h3>
          <ul className="mt-2 space-y-3 text-sm font-medium">
            {[
              "Manali Tours",
              "Punjab Heritage",
              "Tamil Nadu Temples",
              "Kerala Backwaters",
              "Rajasthan Desert",
            ].map((destination) => (
              <li key={destination} className="hover:text-white cursor-pointer transition-colors">
                {destination}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
          <p className="mt-2 text-sm text-slate-400">
            Subscribe to our newsletter for latest updates and offers
          </p>
          <div className="mt-5 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="p-3 rounded-l-md bg-slate-800 text-white w-full focus:outline-none focus:ring-1 focus:ring-white transition-all"
            />
            <button className="bg-white text-slate-900 font-bold px-5 py-3 rounded-r-md hover:bg-slate-200 transition-colors">
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center text-slate-500 font-medium">
        <p>&copy; {new Date().getFullYear()} CarRent. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            Terms of Service
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
