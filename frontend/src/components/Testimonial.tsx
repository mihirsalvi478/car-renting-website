import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Rahul Sharma",
    location: "Manali Trip",
    review:
      "Amazing experience with CarRent! The SUV was perfect for our Manali trip, and their service was exceptional. Will definitely book again!",
    rating: 5,
    time: "2 weeks ago",
  },
  {
    name: "Priya Patel",
    location: "Punjab Tour",
    review:
      "The car was clean and well-maintained. Customer support was available 24/7. Made our Punjab trip memorable!",
    rating: 5,
    time: "1 month ago",
  },
  {
    name: "Anand Kumar",
    location: "Tamil Nadu Package",
    review:
      "Best car rental service! The booking process was smooth, and the package deal for Tamil Nadu was worth every penny.",
    rating: 5,
    time: "3 weeks ago",
  },
];

const stats = [
  { value: "4.8/5", label: "Average Rating" },
  { value: "10K+", label: "Happy Customers" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "5K+", label: "Reviews" },
];

export default function Testimonial() {
  return (
    <section className="py-16 px-6 text-center bg-slate-50">
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">What Our Customers Say</h2>
      <p className="text-slate-500 font-medium text-lg mt-3">
        Real experiences from our satisfied customers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/50 p-6 bg-white text-left transition-all hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{review.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{review.location}</p>
              </div>
            </div>
            <div className="flex mt-4 text-yellow-400 text-lg mb-3">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="text-slate-600 italic leading-relaxed">
              "{review.review}"
            </p>
            <p className="text-slate-400 font-medium text-xs mt-4 uppercase tracking-wider">{review.time}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 bg-white border border-slate-100 shadow-md p-8 rounded-2xl">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-slate-900 text-4xl font-extrabold">{stat.value}</p>
            <p className="text-slate-500 font-medium text-sm mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-500 font-medium mt-10 text-lg">
        Join thousands of satisfied customers who trust our service
      </p>
      <button className="mt-6 px-8 py-3 bg-slate-900 text-white font-bold rounded-full shadow-md hover:bg-slate-800 transition-all hover:shadow-lg">
        Book Your Journey Now →
      </button>
    </section>
  );
}
