import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const offers = [
  {
    title: "Weekend Special",
    details: ["Free fuel for first 100 km", "Complimentary car cleaning"],
    code: "WEEKEND20",
    tag: "LIMITED TIME OFFER",
    tagColor: "bg-slate-800",
    badge: "Expires in 2 days",
    badgeColor: "bg-slate-600",
    buttonColor: "bg-slate-900 hover:bg-slate-800",
    glowColor: "shadow-slate-200/50",
  },
  {
    title: "Diwali Package",
    details: [
      "30% off on luxury cars",
      "Free driver for 24 hours",
      "Insurance included",
    ],
    code: "DIWALI30",
    tag: "FESTIVAL SPECIAL",
    tagColor: "bg-sky-900",
    badge: "New Offer",
    badgeColor: "bg-sky-700",
    buttonColor: "bg-sky-900 hover:bg-sky-800",
    glowColor: "shadow-sky-100/50",
  },
  {
    title: "Monthly Package",
    details: [
      "25% off on monthly bookings",
      "Free maintenance",
      "24/7 roadside assistance",
    ],
    code: "MONTHLY25",
    tag: "LONG TERM DEAL",
    tagColor: "bg-blue-950",
    badge: "Popular",
    badgeColor: "bg-blue-800",
    buttonColor: "bg-blue-950 hover:bg-blue-900",
    glowColor: "shadow-blue-100/50",
  },
];

export default function SpecialOffers() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 text-center bg-white text-slate-900">
      {/* Title Section */}
      <motion.h2
        className="text-4xl font-extrabold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🎉 Exclusive Special Offers 🎉
      </motion.h2>
      <motion.p
        className="text-slate-500 font-medium mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Grab the best deals on car rentals and tour packages before they expire!
      </motion.p>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.code}
            className={`relative bg-white bg-opacity-90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl ${offer.glowColor}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            {/* Tag & Badge */}
            <div
              className={`text-white text-sm font-semibold px-4 py-2 rounded-t-lg flex justify-between items-center ${offer.tagColor}`}
            >
              <span>{offer.tag}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs ${offer.badgeColor} text-white`}
              >
                {offer.badge}
              </span>
            </div>

            {/* Offer Title */}
            <h3 className="font-semibold mt-4 text-2xl">{offer.title}</h3>

            {/* Offer Details */}
            <ul className="text-slate-600 text-sm mt-4 space-y-2">
              {offer.details.map((detail, idx) => (
                <li key={idx} className="flex items-center">
                  ✅ {detail}
                </li>
              ))}
            </ul>

            {/* Promo Code */}
            <motion.div
              className="mt-6 bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-slate-500 font-medium">Use Code</p>
              <p className="font-extrabold text-lg text-slate-900 tracking-wider">
                {offer.code}
              </p>
            </motion.div>

            {/* Book Now Button */}
            <motion.button
              className={`w-full mt-6 py-3 rounded-lg text-white transition ${offer.buttonColor} shadow-md hover:shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cars")}
            >
              🚗 Book Now
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
