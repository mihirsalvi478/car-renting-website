import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <header className="flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50 px-5 transition-all">
      {/* Logo */}
      <div className="p-4">
        <h1 className="text-slate-900 font-extrabold text-2xl tracking-tight cursor-pointer" onClick={() => navigate("/")}>CarRent</h1>
      </div>

      {/* Navigation Links */}
      <div className="hidden sm:flex justify-between items-center gap-4 lg:gap-8 font-medium text-slate-600">
        <div
          onClick={() => navigate("/")}
          className="hover:cursor-pointer hover:text-slate-900 transition-colors"
        >
          Home
        </div>
        <div
          onClick={() => navigate("/cars")}
          className="hover:cursor-pointer hover:text-slate-900 transition-colors"
        >
          Cars
        </div>
        <div
          onClick={() => navigate("/packages")}
          className="hover:cursor-pointer hover:text-slate-900 transition-colors"
        >
          Tour Packages
        </div>
        <div
          onClick={() => navigate("/packages")}
          className="hover:cursor-pointer hover:text-slate-900 transition-colors"
        >
          Offer
        </div>
        <div
          onClick={() => navigate("/contact-us")}
          className="hover:cursor-pointer hover:text-slate-900 transition-colors"
        >
          Contact
        </div>
      </div>

      {/* Right Section */}
      <div className="flex justify-between items-center gap-5">
        {/* Search Icon (Hidden on Small Screens) */}
        <div className="hidden sm:block hover:cursor-pointer">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>

        {/* Authentication Buttons */}
        {token ? (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate("/profile")}
              className="text-slate-700 font-semibold hover:text-slate-900 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="text-slate-700 font-semibold hover:text-slate-900 transition-colors"
            >
              My Bookings
            </button>
            <button
              onClick={handleLogout}
              className="hover:cursor-pointer text-red-500 font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate("/signin")}
              className="text-slate-700 font-semibold hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-slate-900 text-white px-5 py-2 rounded-full font-semibold hover:bg-slate-800 transition shadow-sm"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Book Now Button (Hidden on Small Screens) */}
        <div className="hidden sm:block pr-3">
          <button
            onClick={() => navigate("/cars")}
            className="bg-transparent border-2 border-slate-900 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white px-5 py-1.5 rounded-full transition-colors"
          >
            Book Now
          </button>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <div className="sm:hidden flex items-center">
          <FontAwesomeIcon
            icon={faBars}
            className="text-xl hover:cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Dropdown Menu (Visible when Hamburger Menu is clicked) */}
      {menuOpen && (
        <div className="absolute top-16 right-5 bg-white shadow-lg rounded-lg p-4 z-50">
          <div
            onClick={() => navigate("/")}
            className="hover:cursor-pointer hover:underline mb-2"
          >
            Home
          </div>
          <div
            onClick={() => navigate("/cars")}
            className="hover:cursor-pointer hover:underline mb-2"
          >
            Cars
          </div>
          <div
            onClick={() => navigate("/packages")}
            className="hover:cursor-pointer hover:underline mb-2"
          >
            Tour Packages
          </div>
          <div className="hover:cursor-pointer hover:underline mb-2">Offer</div>
          <div className="hover:cursor-pointer hover:underline mb-2">
            Contact
          </div>
          {token ? (
            <div
              className="hover:cursor-pointer text-red-500 font-bold mt-2 pt-2 border-t"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </div>
          ) : (
            <div className="mt-2 pt-2 border-t flex flex-col gap-2">
              <div
                className="hover:cursor-pointer text-blue-500 font-bold"
                onClick={() => {
                  navigate("/signin");
                  setMenuOpen(false);
                }}
              >
                Sign In
              </div>
              <div
                className="hover:cursor-pointer text-blue-500 font-bold"
                onClick={() => {
                  navigate("/signup");
                  setMenuOpen(false);
                }}
              >
                Sign Up
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
