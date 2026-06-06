import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../lib/config";

interface Stats {
  totalUsers: number;
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { bookings: number; reviews: number };
}

interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  car: { name: string; price: number; image: string | null };
}

interface Car {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string | null;
  availability: boolean;
  image: string | null;
}

type Tab = "dashboard" | "users" | "bookings" | "cars";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({
    name: "",
    type: "economy",
    price: "",
    description: "",
    image: "",
  });
  const navigate = useNavigate();

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Check admin access
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/signin");
      return;
    }
    const parsed = JSON.parse(user);
    if (parsed.role !== "admin") {
      navigate("/signin");
    }
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/admin/stats`, getHeaders());
      setStats(res.data);
    } catch {
      console.error("Failed to fetch stats");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/admin/users`, getHeaders());
      setUsers(res.data);
    } catch {
      console.error("Failed to fetch users");
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/admin/bookings`,
        getHeaders()
      );
      setBookings(res.data);
    } catch {
      console.error("Failed to fetch bookings");
    }
  }, []);

  const fetchCars = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/cars`);
      setCars(res.data);
    } catch {
      console.error("Failed to fetch cars");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchBookings(), fetchCars()]);
      setLoading(false);
    };
    loadData();
  }, [fetchStats, fetchUsers, fetchBookings, fetchCars]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/admin/users/${id}`, getHeaders());
      setUsers((prev) => prev.filter((u) => u.id !== id));
      fetchStats();
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/admin/bookings/${id}`,
        { status },
        getHeaders()
      );
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch {
      alert("Failed to update booking status");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `${BACKEND_URL}/admin/bookings/${id}`,
        getHeaders()
      );
      setBookings((prev) => prev.filter((b) => b.id !== id));
      fetchStats();
    } catch {
      alert("Failed to delete booking");
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/admin/cars`, newCar, getHeaders());
      setShowAddCar(false);
      setNewCar({
        name: "",
        type: "economy",
        price: "",
        description: "",
        image: "",
      });
      fetchCars();
      fetchStats();
    } catch {
      alert("Failed to add car");
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/admin/cars/${id}`, getHeaders());
      setCars((prev) => prev.filter((c) => c.id !== id));
      fetchStats();
    } catch {
      alert("Failed to delete car");
    }
  };

  const handleToggleCarAvailability = async (id: string, current: boolean) => {
    try {
      await axios.put(
        `${BACKEND_URL}/admin/cars/${id}`,
        { availability: !current },
        getHeaders()
      );
      setCars((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, availability: !current } : c
        )
      );
    } catch {
      alert("Failed to update car");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "bookings", label: "Bookings", icon: "📋" },
    { id: "cars", label: "Cars", icon: "🚗" },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "cancelled":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-900">
          <svg
            className="animate-spin h-8 w-8 text-slate-900"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight">
            Loading Admin Dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen sticky top-0 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              C
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-slate-900">
                CarRent
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => navigate("/")}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-3 mb-1"
          >
            <span className="text-lg">🌐</span>
            View Website
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all flex items-center gap-3"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {tabs.find((t) => t.id === activeTab)?.icon}{" "}
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {activeTab === "dashboard" && "Overview of your platform metrics and recent activity"}
            {activeTab === "users" && "Manage registered users on the platform"}
            {activeTab === "bookings" && "View and manage all booking records"}
            {activeTab === "cars" && "Manage your fleet inventory"}
          </p>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && stats && (
          <div>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                {
                  label: "Total Users",
                  value: stats.totalUsers,
                  icon: "👥",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: "Total Cars",
                  value: stats.totalCars,
                  icon: "🚗",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  label: "Total Bookings",
                  value: stats.totalBookings,
                  icon: "📋",
                  color: "from-amber-500 to-amber-600",
                },
                {
                  label: "Total Revenue",
                  value: `₹${stats.totalRevenue.toLocaleString()}`,
                  icon: "💰",
                  color: "from-slate-700 to-slate-900",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{stat.icon}</span>
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                  <p className="text-2xl font-extrabold">{stat.value}</p>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="text-left py-3 px-4 font-semibold">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Car
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((b: any) => (
                      <tr
                        key={b.id}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{b.user?.name}</p>
                          <p className="text-slate-500 text-xs">
                            {b.user?.email}
                          </p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {b.car?.name}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          ₹{b.totalPrice?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusColor(
                              b.status
                            )}`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stats.recentBookings.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-slate-500"
                        >
                          No bookings yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="text-left py-3 px-4 font-bold tracking-tight">Name</th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">Role</th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Bookings
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Reviews
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-800">{user.name}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            user.role === "admin"
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{user._count.bookings}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{user._count.reviews}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-all"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">Car</th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Dates
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-bold tracking-tight">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800">{booking.user?.name}</p>
                        <p className="text-slate-500 text-xs">
                          {booking.user?.email}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {booking.car?.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium text-xs">
                        <p>
                          {new Date(booking.startDate).toLocaleDateString()} —
                        </p>
                        <p>
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleUpdateBookingStatus(
                              booking.id,
                              e.target.value
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${statusColor(
                            booking.status
                          )}`}
                        >
                          <option value="pending" className="bg-white">
                            pending
                          </option>
                          <option value="confirmed" className="bg-white">
                            confirmed
                          </option>
                          <option value="cancelled" className="bg-white">
                            cancelled
                          </option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-slate-500"
                      >
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CARS TAB */}
        {activeTab === "cars" && (
          <div>
            <div className="flex justify-end mb-5">
              <button
                onClick={() => setShowAddCar(!showAddCar)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                {showAddCar ? "Cancel" : "+ Add New Car"}
              </button>
            </div>

            {/* Add Car Form */}
            {showAddCar && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 text-slate-900">Add New Car</h3>
                <form
                  onSubmit={handleAddCar}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Car Name
                    </label>
                    <input
                      value={newCar.name}
                      onChange={(e) =>
                        setNewCar({ ...newCar, name: e.target.value })
                      }
                      required
                      placeholder="e.g. Tesla Model 3"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      value={newCar.type}
                      onChange={(e) =>
                        setNewCar({ ...newCar, type: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                    >
                      <option value="economy" className="bg-white">
                        Economy
                      </option>
                      <option value="premium" className="bg-white">
                        Premium
                      </option>
                      <option value="luxury" className="bg-white">
                        Luxury
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Price (₹/day)
                    </label>
                    <input
                      type="number"
                      value={newCar.price}
                      onChange={(e) =>
                        setNewCar({ ...newCar, price: e.target.value })
                      }
                      required
                      placeholder="e.g. 2500"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Image URL
                    </label>
                    <input
                      value={newCar.image}
                      onChange={(e) =>
                        setNewCar({ ...newCar, image: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newCar.description}
                      onChange={(e) =>
                        setNewCar({ ...newCar, description: e.target.value })
                      }
                      rows={3}
                      placeholder="Brief description of the car..."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                    >
                      Add Car to Fleet
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Cars Table */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="text-left py-3 px-4 font-bold tracking-tight">
                        Car
                      </th>
                      <th className="text-left py-3 px-4 font-bold tracking-tight">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-bold tracking-tight">
                        Price/Day
                      </th>
                      <th className="text-left py-3 px-4 font-bold tracking-tight">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-bold tracking-tight">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr
                        key={car.id}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {car.image && (
                              <img
                                src={car.image}
                                alt={car.name}
                                className="w-12 h-8 object-cover rounded-lg shadow-sm"
                              />
                            )}
                            <span className="font-bold text-slate-800">{car.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-slate-600 font-medium">
                            {car.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          ₹{car.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              handleToggleCarAvailability(
                                car.id,
                                car.availability
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                              car.availability
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {car.availability ? "Available" : "Unavailable"}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="text-red-600 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {cars.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-slate-500"
                        >
                          No cars in fleet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
