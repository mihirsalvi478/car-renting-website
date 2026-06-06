import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../lib/config";

// Define categories
const categories = ["All Cars", "SUV", "Luxury", "Sedan", "Budget"];

interface Car {
  id: string;
  name: string;
  category: string;
  price: number;
  availability: boolean;
  image: string;
  seats: number;
  transmission: string;
  fuel: string;
}

export default function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All Cars");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<Car[]>(`${BACKEND_URL}/cars`);
        console.log("Fetched Cars:", response.data); // Debugging log
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  const filteredCars =
    activeCategory === "All Cars"
      ? cars.slice(0, 3)
      : cars.filter((car) => car.category === activeCategory).slice(0, 3);

  return (
    <section className="py-16 px-6 text-center bg-slate-50">
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">🚗 Featured Cars</h2>
      <p className="text-slate-500 font-medium text-lg mt-3 mb-8">
        Choose from our selection of premium vehicles for your next journey
      </p>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 my-6">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-all shadow-sm ${activeCategory === category
              ? "bg-white text-slate-900 ring-1 ring-slate-200 shadow-md"
              : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Cars Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredCars.map((car, index) => {
          console.log("Rendering Car:", car.id, car.name); // Debugging log
          return (
            <motion.div
              key={car.id || `car-${index}`} // Ensure unique keys
              className="bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 rounded-2xl p-5 hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/car/${car.id}`)}
            >
              {/* ✅ Fixed Image for Proper Fit */}
              <div className="w-full h-52 overflow-hidden rounded-md">
                <img
                  src={car.image || "https://via.placeholder.com/300"} // Default image fallback
                  alt={car.name}
                  className="w-full h-full object-cover" // ✅ Ensures complete and proper fit
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300"; // Handle broken image links
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <h3 className="text-xl font-bold text-slate-900">{car.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${car.availability ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                  {car.availability ? "Available" : "Booked"}
                </span>
              </div>
              <p className="text-slate-900 font-bold text-lg">
                ₹{car.price}/day
              </p>
              <p className="text-gray-600 text-sm">
                {car.seats} • {car.transmission} • {car.fuel}
              </p>

              <motion.button
                className={`w-full mt-5 py-3 rounded-lg font-semibold transition-all ${car.availability
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                disabled={!car.availability}
                whileHover={{ scale: car.availability ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (car.availability) navigate(`/car/${car.id}`);
                }}
              >
                {car.availability ? "Book Now" : "Unavailable"}
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Button */}
      <motion.button
        className="mt-12 px-8 py-3 bg-white text-slate-900 font-bold rounded-full shadow-md hover:bg-slate-100 ring-1 ring-slate-200 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/cars")}
      >
        View All Cars →
      </motion.button>
    </section>
  );
}
