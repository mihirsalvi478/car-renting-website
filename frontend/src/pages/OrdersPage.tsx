import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../lib/config";

interface CartItem {
  id: string;
  itemId: string;
  itemType: "car" | "package";
  price: number;
}

interface Car {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<{ cart: CartItem[] }>(
        `${BACKEND_URL}/user/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(response.data.cart);

      const carPromises = response.data.cart
        .filter((item) => item.itemType === "car")
        .map((item) => axios.get<Car>(`${BACKEND_URL}/cars/${item.itemId}`));

      const carResponses = await Promise.all(carPromises);
      setCars(carResponses.map((res) => res.data));
    } catch (err) {
      setError("Failed to fetch cart items.");
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = () => {
    navigate("/payment");
  };

  const totalAmount = cars.reduce((sum, car) => sum + car.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              Your Cart
            </h1>
            <p className="text-slate-500 font-medium">
              Review your selected vehicles before checkout
            </p>
          </motion.div>
          <button
            onClick={() => navigate("/cars")}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            &larr; Continue Browsing
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm border border-red-100">
            {error}
          </div>
        )}

        {cart.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center max-w-2xl mx-auto mt-10"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-slate-300">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't added any vehicles to your cart yet. Discover our premium fleet and find the perfect car for your next journey.
            </p>
            <button
              onClick={() => navigate("/cars")}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
            >
              Browse Premium Cars
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Cart Items */}
            <div className="flex-1 space-y-4">
              {cars.map((car, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={car.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-shadow"
                >
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={
                        car.image
                          ? car.image.startsWith("http")
                            ? car.image
                            : `/${car.image}`
                          : "/placeholder-image.jpg"
                      }
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-slate-900">{car.name}</h2>
                    <p className="text-sm text-slate-500 mt-1 whitespace-pre-wrap">1 Day Rental</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xl font-extrabold text-slate-900">
                      ₹{car.price.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-80"
            >
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({cars.length} items)</span>
                    <span className="font-semibold text-slate-700">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-semibold text-slate-700">₹0</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={proceedToPayment}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Proceed to Checkout &rarr;
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
