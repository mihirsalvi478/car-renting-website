import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    FaCreditCard,
    FaMobileAlt,
    FaLock,
    FaCheckCircle,
} from "react-icons/fa";
import { BACKEND_URL } from "../lib/config";

interface CartItem {
    id: string;
    itemId: string;
    itemType: string;
    price: number;
}

interface Car {
    id: string;
    name: string;
    price: number;
    image: string;
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
    const [processing, setProcessing] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);

    // Card fields
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardName, setCardName] = useState("");

    // UPI field
    const [upiId, setUpiId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to proceed.");
            navigate("/signin");
            return;
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get<{ cart: CartItem[] }>(
                `${BACKEND_URL}/user/cart`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCartItems(res.data.cart);

            if (res.data.cart.length === 0) {
                toast.info("Your cart is empty.");
                navigate("/cars");
                return;
            }

            const carPromises = res.data.cart
                .filter((item) => item.itemType === "car")
                .map((item) => axios.get<Car>(`${BACKEND_URL}/cars/${item.itemId}`));
            const carResponses = await Promise.all(carPromises);
            setCars(carResponses.map((r) => r.data));
        } catch (err) {
            toast.error("Failed to load cart.");
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
        return digits;
    };

    const validatePayment = (): boolean => {
        if (paymentMethod === "card") {
            const digits = cardNumber.replace(/\s/g, "");
            if (digits.length !== 16) {
                toast.error("Enter a valid 16-digit card number.");
                return false;
            }
            if (!cardExpiry || cardExpiry.length < 5) {
                toast.error("Enter a valid expiry date (MM/YY).");
                return false;
            }
            if (!cardCvv || cardCvv.length < 3) {
                toast.error("Enter a valid CVV.");
                return false;
            }
            if (!cardName.trim()) {
                toast.error("Enter the cardholder name.");
                return false;
            }
        } else {
            if (!upiId || !upiId.includes("@")) {
                toast.error("Enter a valid UPI ID (e.g. name@upi).");
                return false;
            }
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validatePayment()) return;
        setProcessing(true);

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2500));

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${BACKEND_URL}/user/cart/confirm`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPaymentDone(true);
            toast.success("Payment successful!");
        } catch (err) {
            toast.error("Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading payment...</p>
                </div>
            </div>
        );
    }

    // Payment Success Screen
    if (paymentDone) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <FaCheckCircle className="text-emerald-600 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                        Payment Successful!
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Your booking has been confirmed. Thank you for choosing CarRent!
                    </p>

                    {/* Receipt */}
                    <div className="bg-slate-50 rounded-xl p-5 mb-6 text-left">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                            Receipt
                        </h3>
                        {cars.map((car) => (
                            <div key={car.id} className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-600">{car.name}</span>
                                <span className="text-sm font-bold text-slate-900">
                                    ₹{car.price.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-slate-200 mt-3 pt-3 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">Total Paid</span>
                            <span className="text-lg font-extrabold text-emerald-600">
                                ₹{totalAmount.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">
                            Payment Method:{" "}
                            {paymentMethod === "card" ? `Card ending ${cardNumber.slice(-4)}` : upiId}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/my-bookings")}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all"
                    >
                        View My Bookings
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                        Checkout
                    </h1>
                    <p className="text-slate-500 font-medium mb-8">
                        Complete your payment to confirm booking
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1"
                    >
                        {/* Method Tabs */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">
                                Payment Method
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${paymentMethod === "card"
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <FaCreditCard /> Card
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("upi")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${paymentMethod === "upi"
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <FaMobileAlt /> UPI
                                </button>
                            </div>
                        </div>

                        {/* Card Form */}
                        {paymentMethod === "card" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
                            >
                                {/* Animated Card Preview */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-10 h-7 bg-amber-400 rounded-md" />
                                        <FaCreditCard className="text-2xl text-white/30" />
                                    </div>
                                    <p className="text-lg tracking-[0.3em] font-mono mb-4">
                                        {cardNumber || "•••• •••• •••• ••••"}
                                    </p>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p className="text-white/50 text-[10px] uppercase">
                                                Card Holder
                                            </p>
                                            <p className="font-medium">{cardName || "YOUR NAME"}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-[10px] uppercase">Expires</p>
                                            <p className="font-medium">{cardExpiry || "MM/YY"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        Card Number
                                    </label>
                                    <input
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        Cardholder Name
                                    </label>
                                    <input
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            Expiry Date
                                        </label>
                                        <input
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none font-mono"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            CVV
                                        </label>
                                        <input
                                            value={cardCvv}
                                            onChange={(e) =>
                                                setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                                            }
                                            placeholder="123"
                                            maxLength={4}
                                            type="password"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* UPI Form */}
                        {paymentMethod === "upi" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <FaMobileAlt className="text-purple-600 text-2xl" />
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Enter your UPI ID to pay instantly
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        UPI ID
                                    </label>
                                    <input
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Pay Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full mt-5 bg-slate-900 text-white py-4 rounded-xl font-bold text-base hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <FaLock className="text-sm" />
                                    Pay ₹{totalAmount.toLocaleString()}
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                            <FaLock className="text-[9px]" /> Payments are simulated for demo
                            purposes
                        </p>
                    </motion.div>

                    {/* Order Summary Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-80"
                    >
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">
                                Order Summary
                            </h2>
                            <div className="space-y-3">
                                {cars.map((car) => (
                                    <div
                                        key={car.id}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                                    >
                                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                                            <img
                                                src={
                                                    car.image
                                                        ? car.image.startsWith("http")
                                                            ? car.image
                                                            : `/${car.image}`
                                                        : "/placeholder-image.jpg"
                                                }
                                                alt={car.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) =>
                                                    (e.currentTarget.src = "/placeholder-image.jpg")
                                                }
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {car.name}
                                            </p>
                                            <p className="text-xs text-slate-400">1 Day Rental</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">
                                            ₹{car.price.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-semibold text-slate-700">
                                        ₹{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax (0%)</span>
                                    <span className="font-semibold text-slate-700">₹0</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Discount</span>
                                    <span className="font-semibold text-emerald-600">-₹0</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="text-xl font-extrabold text-slate-900">
                                    ₹{totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
