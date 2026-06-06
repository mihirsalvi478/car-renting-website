import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../lib/config";
import { useNavigate } from "react-router-dom";

interface Package {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const TourPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get<Package[]>(`${BACKEND_URL}/packages`);
        setPackages(response.data);
      } catch (err) {
        setError("Failed to fetch tour packages. Please try again later.");
        console.error("Error fetching tour packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-4">
          Explore India with Our Tour Packages
        </h2>
        <p className="text-center text-slate-500 font-medium mb-10 text-lg">
          Discover the best destinations across India with our carefully curated
          tour packages.
        </p>

        {/* Loading and Error Handling */}
        {loading && (
          <p className="text-center text-gray-600">Loading packages...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Infinite Scrolling Tour Packages */}
        {!loading && !error && packages.length > 0 && (
          <div className="relative overflow-hidden">
            <motion.div
              className="flex space-x-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 20, repeat: Infinity }}
            >
              {[...packages, ...packages].map((pkg, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-4 min-w-[250px] md:min-w-[300px]"
                >
                  <img
                    src={pkg.image} // ✅ Corrected from pkg.img
                    alt={pkg.name}
                    className="w-full h-48 object-cover rounded-md" // ✅ Ensures image fits properly
                    onError={(e) => (e.currentTarget.src = "/fallback.jpg")} // ✅ Fallback if image fails
                  />
                  <h3 className="text-xl font-bold mt-3 text-slate-900">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{pkg.description}</p>
                  <div className="flex justify-between items-center mt-5">
                    <span className="text-lg font-bold text-slate-900">
                      ₹{pkg.price}
                    </span>
                    <motion.button
                      className="bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-800 text-sm font-semibold shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/packages/${pkg.id}`)}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* View All Packages Button */}
        <div className="text-center mt-12">
          <motion.button
            onClick={() => navigate("/packages")}
            className="bg-white text-slate-900 border border-slate-200 shadow-sm px-8 py-3 rounded-full hover:bg-slate-50 font-bold inline-flex items-center transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Packages
            <i className="fas fa-arrow-right ml-2 text-slate-500"></i>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TourPackages;
