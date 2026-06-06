import { useState } from "react";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !email || !message) {
      return;
    }

    setSuccessMsg("Message sent successfully!");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");

    // Auto-hide the success message after 4 seconds
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="py-20 bg-white px-6 w-full flex flex-col items-center">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
        <p className="text-slate-500 font-medium text-lg mt-4">
          Have questions? We're here to help you plan your perfect journey
        </p>
      </div>
      <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden border border-slate-100">
        {/* Left Section */}
        <div className="p-10 md:w-1/3 bg-slate-50 md:border-r border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>

          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-900">Our Location</h3>
            <p className="text-slate-600 font-medium mt-1">
              Nd Road, Andheri [E], Mumbai - 400069
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-900">Phone Number</h3>
            <p className="text-slate-600 font-medium mt-1">+91 98765 43210</p>
            <p className="text-slate-600 font-medium">+91 12345 67890</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-900">Email Address</h3>
            <p className="text-slate-600 font-medium mt-1">info@carrent.com</p>
            <p className="text-slate-600 font-medium">support@carrent.com</p>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg text-slate-900">Working Hours</h3>
            <p className="text-slate-600 font-medium mt-1">Monday - Saturday: 9AM - 8PM</p>
            <p className="text-slate-600 font-medium">Sunday: 10AM - 6PM</p>
          </div>

          <div className="flex space-x-6 mt-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-xl">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-10 md:w-2/3">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Send us a Message</h2>

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-semibold">{successMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white transition-all"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white transition-all"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white transition-all"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white transition-all"
                placeholder="Write your message here..."
                rows={4}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-6 w-full md:w-auto bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;




