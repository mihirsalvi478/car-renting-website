import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../lib/config";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

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

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Review Form State
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("Invalid car ID.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        // Fetch Car Details
        const carRes = await axios.get<Car>(`${BACKEND_URL}/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(carRes.data);

        // Fetch Reviews
        const reviewRes = await axios.get(`${BACKEND_URL}/reviews/${id}`);
        setReviews(reviewRes.data.reviews);
      } catch (err) {
        setError("Failed to fetch car details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addToCart = async () => {
    if (!car) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to add cars to cart.", { position: "top-right" });
      navigate("/signin");
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/user/cart/add`,
        { itemId: car.id, itemType: "car", price: car.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Car added to cart!", { position: "top-right" });
      navigate("/booking-page");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to add car to cart.";
      toast.error(msg, { position: "top-right" });
      console.error("Add to cart error:", err?.response?.data || err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error("Please select a star rating", { position: "top-right" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to leave a review.", { position: "top-right" });
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/reviews/${id}`,
        { rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted successfully!", { position: "top-right" });

      // Update local state with new review
      setReviews([res.data.review, ...reviews]);
      if (car) {
        // Recalculate average
        const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0) + newRating;
        const newCount = reviews.length + 1;
        setCar({
          ...car,
          avgRating: Number((totalStars / newCount).toFixed(1)),
          reviewCount: newCount
        });
      }

      setNewRating(0);
      setNewComment("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to submit review.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Helper to render stars
  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`w-5 h-5 ${idx < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        onClick={() => interactive && setNewRating(idx + 1)}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xl text-slate-800 font-medium mb-2">Oops!</p>
          <p className="text-slate-500">{error || "Car not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Top Section: Car Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:flex">
          {/* Image */}
          <div className="lg:w-1/2">
            <img
              src={car.image.startsWith("http") ? car.image : `/${car.image}`}
              alt={car.name}
              className="w-full h-80 lg:h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
            />
          </div>

          {/* Details */}
          <div className="p-8 lg:w-1/2 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {car.name}
                </h1>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider rounded-full">
                    {car.type}
                  </span>
                  {car.reviewCount > 0 && (
                    <div className="flex items-center text-sm font-medium text-slate-700">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {car.avgRating} ({car.reviewCount} reviews)
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900">₹{car.price.toLocaleString()}</p>
                <p className="text-sm text-slate-500">per day</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8">
              {car.description || "Experience the perfect blend of comfort and performance with this premium vehicle, meticulously maintained for your driving pleasure."}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2.5 h-2.5 rounded-full ${car.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-slate-700">
                  {car.availability ? "Available for rent" : "Currently booked"}
                </span>
              </div>
              <button
                onClick={addToCart}
                disabled={!car.availability}
                className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all shadow-sm ${car.availability
                    ? "bg-slate-900 hover:bg-slate-800 active:scale-[0.98]"
                    : "bg-slate-300 cursor-not-allowed"
                  }`}
              >
                {car.availability ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Review List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No reviews yet.</p>
                  <p className="text-sm text-slate-400 mt-1">Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-900">{review.user.name}</p>
                      <span className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex mb-3">{renderStars(review.rating)}</div>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a Review Form */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 h-fit">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {renderStars(newRating, true)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow resize-none text-sm placeholder-slate-400"
                    placeholder="How was your experience with this car?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 px-4 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors shadow-sm disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
