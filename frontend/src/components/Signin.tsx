import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../lib/config";

export function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/signin`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Error during signin");
    }
  };

  return (
    <div className="flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden bg-white min-h-[600px]">
      {/* Left side - Cover Image */}
      <div className="hidden md:block w-1/2 relative bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Car"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white pr-10">
          <h2 className="text-3xl font-bold mb-3">Welcome Back.</h2>
          <p className="text-slate-200">
            Sign in to access your bookings, track your rentals, and discover our premium fleet.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 relative">
        {/* Navigation */}
        <div className="absolute top-8 w-full left-0 px-8 sm:px-12 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            CarRent
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            &larr; Back to Home
          </button>
        </div>

        <div className="mt-16 sm:mt-12 max-w-sm mx-auto w-full">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Sign In</h2>
          <p className="text-slate-500 mb-8 font-medium">
            Enter your email and password to access your account.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-md"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-slate-900 font-bold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
