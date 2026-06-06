import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
    FaCar,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaClock,
    FaTimesCircle,
    FaCheckCircle,
    FaHourglassHalf,
} from "react-icons/fa";
import { BACKEND_URL } from "../lib/config";

interface Booking {
    id: string;
    carId: string;
    car: {
        name: string;
        price: number;
        image: string | null;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
}

type TabFilter = "all" | "upcoming" | "completed" | "cancelled";

const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: FaHourglassHalf,
        iconColor: "text-amber-500",
    },
    confirmed: {
        label: "Confirmed",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: FaCheckCircle,
        iconColor: "text-emerald-500",
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: FaTimesCircle,
        iconColor: "text-red-400",
    },
};

const STEPS = ["Pending", "Confirmed", "Completed"];

function getStepIndex(status: string): number {
    if (status === "cancelled") return -1;
    if (status === "pending") return 0;
    if (status === "confirmed") return 1;
    return 2;
}

function getDaysBetween(start: string, end: string): number {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function BookingHistory() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabFilter>("all");
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to view your bookings.", {
                position: "top-right",
            });
            navigate("/signin");
            return;
        }
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get<Booking[]>(`${BACKEND_URL}/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(response.data);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            toast.error("Failed to load bookings.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (bookingId: string) => {
        setCancellingId(bookingId);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${BACKEND_URL}/bookings/${bookingId}`,
                { status: "cancelled" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === bookingId ? { ...b, status: "cancelled" } : b
                )
            );
            toast.success("Booking cancelled successfully.", {
                position: "top-right",
            });
        } catch (err) {
            toast.error("Failed to cancel booking.", { position: "top-right" });
        } finally {
            setCancellingId(null);
        }
    };

    const filteredBookings = bookings.filter((b) => {
        if (activeTab === "all") return true;
        if (activeTab === "upcoming")
            return b.status === "pending" || b.status === "confirmed";
        if (activeTab === "completed")
            return (
                b.status === "confirmed" && new Date(b.endDate) < new Date()
            );
        if (activeTab === "cancelled") return b.status === "cancelled";
        return true;
    });

    const tabs: { key: TabFilter; label: string; count: number }[] = [
        { key: "all", label: "All", count: bookings.length },
        {
            key: "upcoming",
            label: "Upcoming",
            count: bookings.filter(
                (b) => b.status === "pending" || b.status === "confirmed"
            ).length,
        },
        {
            key: "completed",
            label: "Completed",
            count: bookings.filter(
                (b) => b.status === "confirmed" && new Date(b.endDate) < new Date()
            ).length,
        },
        {
            key: "cancelled",
            label: "Cancelled",
            count: bookings.filter((b) => b.status === "cancelled").length,
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        My Bookings
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Track and manage all your car rental bookings
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-2"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.key
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                }`}
                        >
                            {tab.label}
                            <span
                                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-100 text-slate-500"
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </motion.div>

                {/* Bookings List */}
                <AnimatePresence mode="wait">
                    {filteredBookings.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
                        >
                            <FaCar className="text-5xl text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">
                                No bookings found
                            </h3>
                            <p className="text-slate-400 mb-6">
                                {activeTab === "all"
                                    ? "You haven't made any bookings yet. Browse our cars to get started!"
                                    : `No ${activeTab} bookings at the moment.`}
                            </p>
                            <button
                                onClick={() => navigate("/cars")}
                                className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-all shadow-md"
                            >
                                Browse Cars
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-5"
                        >
                            {filteredBookings.map((booking, index) => {
                                const cfg = STATUS_CONFIG[booking.status];
                                const StatusIcon = cfg.icon;
                                const stepIndex = getStepIndex(booking.status);
                                const days = getDaysBetween(
                                    booking.startDate,
                                    booking.endDate
                                );
                                const isCancelled = booking.status === "cancelled";

                                return (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${isCancelled
                                            ? "border-red-100 opacity-75"
                                            : "border-slate-100"
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Car Image */}
                                            <div className="md:w-56 h-44 md:h-auto bg-slate-100 flex-shrink-0">
                                                <img
                                                    src={
                                                        booking.car.image
                                                            ? booking.car.image.startsWith("http")
                                                                ? booking.car.image
                                                                : `/${booking.car.image}`
                                                            : "/placeholder-image.jpg"
                                                    }
                                                    alt={booking.car.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) =>
                                                        (e.currentTarget.src = "/placeholder-image.jpg")
                                                    }
                                                />
                                            </div>

                                            {/* Booking Details */}
                                            <div className="flex-1 p-5 sm:p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-900">
                                                            {booking.car.name}
                                                        </h3>
                                                        <p className="text-slate-400 text-sm mt-0.5">
                                                            Booked on {formatDate(booking.createdAt)}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}
                                                    >
                                                        <StatusIcon className="text-sm" />
                                                        {cfg.label}
                                                    </span>
                                                </div>

                                                {/* Info Row */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-slate-400 text-sm" />
                                                        <div>
                                                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                                                Pickup
                                                            </p>
                                                            <p className="text-sm font-semibold text-slate-700">
                                                                {formatDate(booking.startDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-slate-400 text-sm" />
                                                        <div>
                                                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                                                Return
                                                            </p>
                                                            <p className="text-sm font-semibold text-slate-700">
                                                                {formatDate(booking.endDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaClock className="text-slate-400 text-sm" />
                                                        <div>
                                                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                                                Duration
                                                            </p>
                                                            <p className="text-sm font-semibold text-slate-700">
                                                                {days} {days === 1 ? "Day" : "Days"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaMoneyBillWave className="text-emerald-500 text-sm" />
                                                        <div>
                                                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                                                Total
                                                            </p>
                                                            <p className="text-sm font-bold text-slate-900">
                                                                ₹{booking.totalPrice.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Progress Tracker */}
                                                {!isCancelled && (
                                                    <div className="mt-5 pt-4 border-t border-slate-100">
                                                        <div className="flex items-center justify-between">
                                                            {STEPS.map((step, i) => {
                                                                const isActive = i <= stepIndex;
                                                                const isCurrent = i === stepIndex;
                                                                return (
                                                                    <div
                                                                        key={step}
                                                                        className="flex items-center flex-1"
                                                                    >
                                                                        <div className="flex flex-col items-center">
                                                                            <div
                                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive
                                                                                    ? "bg-slate-900 text-white shadow-md"
                                                                                    : "bg-slate-200 text-slate-400"
                                                                                    } ${isCurrent
                                                                                        ? "ring-4 ring-slate-200"
                                                                                        : ""
                                                                                    }`}
                                                                            >
                                                                                {isActive && i < stepIndex ? (
                                                                                    <FaCheckCircle className="text-sm" />
                                                                                ) : (
                                                                                    i + 1
                                                                                )}
                                                                            </div>
                                                                            <span
                                                                                className={`text-[11px] mt-1.5 font-semibold ${isActive
                                                                                    ? "text-slate-700"
                                                                                    : "text-slate-400"
                                                                                    }`}
                                                                            >
                                                                                {step}
                                                                            </span>
                                                                        </div>
                                                                        {i < STEPS.length - 1 && (
                                                                            <div className="flex-1 mx-2">
                                                                                <div
                                                                                    className={`h-1 rounded-full transition-all ${i < stepIndex
                                                                                        ? "bg-slate-900"
                                                                                        : "bg-slate-200"
                                                                                        }`}
                                                                                ></div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Cancelled Banner */}
                                                {isCancelled && (
                                                    <div className="mt-4 pt-4 border-t border-red-100">
                                                        <div className="flex items-center gap-2 text-red-400">
                                                            <FaTimesCircle />
                                                            <span className="text-sm font-medium">
                                                                This booking has been cancelled
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Cancel Button */}
                                                {(booking.status === "pending" ||
                                                    booking.status === "confirmed") && (
                                                        <div className="mt-4 flex justify-end">
                                                            <button
                                                                onClick={() => cancelBooking(booking.id)}
                                                                disabled={cancellingId === booking.id}
                                                                className="text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {cancellingId === booking.id
                                                                    ? "Cancelling..."
                                                                    : "Cancel Booking"}
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
