import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaCar,
    FaMoneyBillWave,
    FaClipboardList,
    FaLock,
    FaEdit,
    FaSave,
    FaTimes,
} from "react-icons/fa";
import { BACKEND_URL } from "../lib/config";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface UserStats {
    totalBookings: number;
    totalSpent: number;
    favoriteCarType: string | null;
}

export default function ProfileDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [saving, setSaving] = useState(false);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to view your profile.");
            navigate("/signin");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const [profileRes, statsRes] = await Promise.all([
                axios.get<UserProfile>(`${BACKEND_URL}/user/profile`, { headers }),
                axios.get<UserStats>(`${BACKEND_URL}/user/profile/stats`, { headers }),
            ]);
            setProfile(profileRes.data);
            setStats(statsRes.data);
            setEditName(profileRes.data.name);
            setEditEmail(profileRes.data.email);
        } catch (err) {
            console.error("Error fetching profile:", err);
            toast.error("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `${BACKEND_URL}/user/profile`,
                { name: editName, email: editEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfile(res.data);
            localStorage.setItem(
                "user",
                JSON.stringify({ id: res.data.id, name: res.data.name, email: res.data.email })
            );
            setEditing(false);
            toast.success("Profile updated!");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        setChangingPassword(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${BACKEND_URL}/user/profile/password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password changed successfully!");
            setShowPasswordForm(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to change password.");
        } finally {
            setChangingPassword(false);
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Expired</h2>
                    <p className="text-slate-500 mb-6">We couldn't load your profile. Please sign in again.</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            navigate("/signin");
                        }}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition shadow-sm"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        My Profile
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Manage your account and view your stats
                    </p>
                </motion.div>

                {/* Stats Cards */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <FaClipboardList className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                    Total Bookings
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <FaMoneyBillWave className="text-emerald-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    ₹{stats.totalSpent.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                    Total Spent
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                <FaCar className="text-amber-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 capitalize">
                                    {stats.favoriteCarType || "—"}
                                </p>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                    Favorite Type
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Profile Info */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                <FaEdit className="text-xs" /> Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    <FaSave className="text-xs" /> {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setEditName(profile.name);
                                        setEditEmail(profile.email);
                                    }}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <FaTimes className="text-xs" /> Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaUser className="text-slate-400" />
                            <div className="flex-1">
                                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                    Name
                                </p>
                                {editing ? (
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                    />
                                ) : (
                                    <p className="text-sm font-semibold text-slate-700">{profile.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-slate-400" />
                            <div className="flex-1">
                                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                    Email
                                </p>
                                {editing ? (
                                    <input
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                    />
                                ) : (
                                    <p className="text-sm font-semibold text-slate-700">{profile.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-slate-400" />
                            <div>
                                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                    Member Since
                                </p>
                                <p className="text-sm font-semibold text-slate-700">
                                    {formatDate(profile.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Change Password */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Security</h2>
                        {!showPasswordForm && (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                <FaLock className="text-xs" /> Change Password
                            </button>
                        )}
                    </div>

                    {showPasswordForm ? (
                        <div className="space-y-3 max-w-md">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                            />
                            <input
                                type="password"
                                placeholder="New Password (min 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                            />
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={changingPassword}
                                    className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {changingPassword ? "Changing..." : "Update Password"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setOldPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2.5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            Keep your account secure by using a strong password.
                        </p>
                    )}
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3"
                >
                    <button
                        onClick={() => navigate("/my-bookings")}
                        className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                        View All Bookings →
                    </button>
                    <button
                        onClick={() => navigate("/cars")}
                        className="bg-slate-900 text-white rounded-xl shadow-sm px-5 py-3 text-sm font-semibold hover:bg-slate-800 transition-all"
                    >
                        Browse Cars
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
