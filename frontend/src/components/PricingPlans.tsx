import { useState } from "react";

const plans = [
  {
    name: "Economy",
    price: "₹1,500",
    features: [
      "Hatchback Cars",
      "150km/day limit",
      "Basic Insurance",
      "24/7 Roadside Assistance",
    ],
    color: "bg-slate-700",
    buttonColor:
      "border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white",
  },
  {
    name: "Premium",
    price: "₹3,000",
    features: [
      "SUV/Sedan Cars",
      "Unlimited kilometers",
      "Comprehensive Insurance",
      "Free Driver",
    ],
    color: "bg-slate-900",
    buttonColor:
      "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
    badge: "Popular",
  },
  {
    name: "Luxury",
    price: "₹5,000",
    features: [
      "Luxury Cars",
      "Unlimited kilometers",
      "Premium Insurance",
      "Professional Chauffeur",
    ],
    color: "bg-black",
    buttonColor:
      "border-black text-black hover:bg-black hover:text-white",
  },
];

const benefits = [
  { title: "Full Insurance", description: "Comprehensive coverage included" },
  { title: "Free Cancellation", description: "Up to 24 hours before pickup" },
  { title: "24/7 Support", description: "Always there to help" },
];

export default function PricingPlans() {
  const [isDailyRental, setIsDailyRental] = useState(true);

  return (
    <section className="py-16 px-6 text-center bg-white">
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Transparent Pricing Plans</h2>
      <p className="text-slate-500 font-medium text-lg mt-3">
        Choose the perfect rental plan that suits your needs
      </p>

      <div className="flex justify-center items-center gap-4 my-6">
        <span>Daily Rental</span>
        <div
          className="relative w-12 h-6 bg-slate-300 rounded-full flex items-center px-1 cursor-pointer"
          onClick={() => setIsDailyRental(!isDailyRental)}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isDailyRental ? "translate-x-6" : "translate-x-0"
              }`}
          ></div>
        </div>
        <span>Package Tours</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-lg shadow-lg p-6 bg-white"
          >
            <div
              className={`${plan.color} text-white py-4 rounded-t-lg font-semibold text-lg`}
            >
              {plan.name}
              {plan.badge && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="text-4xl font-extrabold mt-6 text-slate-900">
              {plan.price}
              <span className="text-slate-500 text-sm font-medium">/day</span>
            </p>
            <ul className="text-slate-600 text-sm mt-6 mb-4 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index}>✅ {feature}</li>
              ))}
            </ul>
            <button
              className={`mt-4 py-2.5 w-full rounded-lg border-2 font-bold transition-all ${plan.buttonColor}`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-bold mt-16 text-slate-900">Additional Benefits</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="text-center bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="font-bold text-lg text-slate-900">{benefit.title}</p>
            <p className="text-slate-500 text-sm mt-2">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
