import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../lib/config";
import { Star } from "lucide-react";

interface Car {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  availability: boolean;
  avgRating: number;
  reviewCount: number;
}

export default function CarsPages() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<Car[]>(`${BACKEND_URL}/cars`);
        setCars(response.data);
      } catch (err) {
        setError("Failed to fetch car data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading premium fleet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-slate-900 text-white py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Our Premium Fleet
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of luxury and practical vehicles.
            Whether for business or leisure, find the perfect drive for your next journey.
          </p>
        </motion.div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {cars.map((car, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={car.id}
              className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={
                    car.image
                      ? car.image.startsWith("http")
                        ? car.image
                        : `/${car.image}`
                      : "/placeholder-image.jpg"
                  }
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${car.availability
                    ? "bg-white/90 text-green-700"
                    : "bg-white/90 text-red-600"
                    }`}>
                    {car.availability ? "Available Now" : "Currently Rented"}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide">
                    {car.type}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {car.name}
                    </h2>
                    {car.reviewCount > 0 ? (
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        {car.avgRating} ({car.reviewCount} reviews)
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 italic">No reviews yet</div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-slate-900">
                      ₹{car.price.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                      Per Day
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  {car.availability ? (
                    <button
                      className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md flex justify-center items-center gap-2 group-hover:gap-4"
                      onClick={() => navigate(`/car/${car.id}`)}
                    >
                      View Details <span>&rarr;</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-xl font-bold cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
