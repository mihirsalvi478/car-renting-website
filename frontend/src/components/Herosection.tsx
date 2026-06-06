import { motion, AnimatePresence } from "framer-motion";
import { FaHeadset, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/config";

interface Car {
  id: string;
  image: string;
}

export default function Herosection() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<Car[]>(`${BACKEND_URL}/cars`);
        const validCars = response.data.filter((c) => c.image).slice(0, 5); // Take up to 5 cars with images
        if (validCars.length > 0) {
          setCars(validCars);
        }
      } catch (error) {
        console.error("Error fetching cars for hero:", error);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (cars.length > 1) {
      const interval = setInterval(() => {
        setCurrentIdx((prevIdx) => (prevIdx + 1) % cars.length);
      }, 4000); // changes every 4 seconds
      return () => clearInterval(interval);
    }
  }, [cars]);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Left Section */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight"
          >
            Explore India With Our{" "}
            <span className="text-slate-600">Premium Cars</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-gray-600"
          >
            Rent the perfect car for your next adventure. Whether it's a weekend
            getaway or a week-long tour package to Manali, Punjab, or Tamil
            Nadu.
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white mt-8 p-6 shadow-xl shadow-slate-200/50 rounded-2xl flex flex-wrap lg:flex-nowrap gap-4 items-center justify-between border border-slate-100"
          >
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Location
              </label>
              <select className="border-slate-200 rounded-lg p-3 text-slate-600 w-full focus:ring-2 focus:ring-slate-900 outline-none">
                <option className="text-center p-4">Select Location</option>
                <option className="text-center">Delhi</option>
                <option className="text-center">Mumbai</option>
                <option className="text-center">Bangalore</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="border-slate-200 rounded-lg p-3 text-slate-600 w-full focus:ring-2 focus:ring-slate-900 outline-none"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="border-slate-200 rounded-lg p-3 text-slate-600 w-full focus:ring-2 focus:ring-slate-900 outline-none"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <button
              onClick={() => navigate("/cars")}
              className="bg-slate-900 text-white px-8 py-3 rounded-lg shadow-md w-full lg:w-auto hover:bg-slate-800 hover:shadow-lg transition-all mt-6 lg:mt-5 flex items-center justify-center font-semibold"
            >
              Search Cars
            </button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-8 text-center justify-center lg:justify-start"
          >
            <div>
              <h3 className="text-3xl font-bold text-slate-900">500+</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Cars Available</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900">1000+</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900">50+</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Tour Packages</p>
            </div>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 hidden lg:block relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 bg-slate-50 relative ring-1 ring-slate-100"
          >
            {/* Central Car Image Slider */}
            <div className="flex justify-center items-center w-full h-[300px] lg:h-[450px] relative overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={currentIdx}
                  src={cars.length > 0 ? (cars[currentIdx].image.startsWith("http") ? cars[currentIdx].image : `/${cars[currentIdx].image}`) : "image.png"}
                  alt="Car"
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="w-auto h-full object-contain drop-shadow-2xl absolute"
                />
              </AnimatePresence>
            </div>

            {/* Bottom Left Card - Safe & Secure */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-white/90 backdrop-blur-md shadow-xl ring-1 ring-slate-100 p-4 rounded-xl absolute bottom-6 left-6 flex items-center gap-4"
            >
              <FaShieldAlt className="text-slate-800 text-3xl" />
              <div>
                <h3 className="font-bold text-slate-900">Safe & Secure</h3>
                <p className="text-slate-500 text-sm">All cars sanitized</p>
              </div>
            </motion.div>

            {/* Top Right Card - 24/7 Support */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="bg-white/90 backdrop-blur-md shadow-xl ring-1 ring-slate-100 p-4 rounded-xl absolute top-6 right-6 flex items-center gap-4"
            >
              <FaHeadset className="text-slate-800 text-3xl" />
              <div>
                <h3 className="font-bold text-slate-900">24/7 Support</h3>
                <p className="text-slate-500 text-sm">Always available</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
