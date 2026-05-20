import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { sendContactMessage } from "../api/contact.api";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message content is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the validation errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactMessage(formData);
      setIsSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send contact message:", error);
      const errorMsg = error.response?.data?.msg || "Failed to send message. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      businessName: "",
      email: "",
      subject: "",
      message: ""
    });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 font-sans selection:bg-indigo-500/30 pb-20 pt-8">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 shadow-sm cursor-default"
          >
            <MessageSquare size={16} />
            <span>Customer Support & Inquiries</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading tracking-tight mb-4"
          >
            Get in Touch with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              JusBill
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 font-light"
          >
            Have a question about our GST compliance templates, inventory notifications, or need help importing products? Send us a message!
          </motion.p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* ── Contact Info (Left) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-5 space-y-6"
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-150 dark:border-gray-800 p-8 rounded-3xl shadow-lg space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                Contact Details
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-light">
                We're committed to helping small businesses succeed. Our dedicated helpdesk is ready to resolve technical issues or listen to product feature suggestions.
              </p>

              {/* Email channel */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-1">
                    Email Support
                  </h4>
                  <a
                    href="mailto:jusbill.contact@gmail.com"
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-base break-all"
                  >
                    jusbill.contact@gmail.com
                  </a>
                </div>
              </div>

              {/* Support Timings */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-1">
                    Response Window
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-base">
                    Typically within 24 hours
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 font-light">
                    Monday to Saturday, 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>

              {/* Secure banner */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                <span>Your contact details are safe & securely stored.</span>
              </div>
            </div>
          </motion.div>

          {/* ── Contact Form (Right) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-7 bg-white dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xl overflow-hidden p-8"
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="contact-form"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  variants={fadeUp}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                    Send a Message
                  </h2>

                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Rohan Verma"
                      className={`w-full bg-gray-50 dark:bg-gray-850 border rounded-2xl px-4 py-3 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium ${
                        errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-800"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-xs flex items-center gap-1 font-semibold px-1 mt-0.5">
                        <AlertCircle size={12} /> {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Business Name field (optional) */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="businessName" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                      Business/Shop Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g., Verma Kirana Store"
                      className="w-full bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., rohan@gmail.com"
                      className={`w-full bg-gray-50 dark:bg-gray-850 border rounded-2xl px-4 py-3 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium ${
                        errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-800"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs flex items-center gap-1 font-semibold px-1 mt-0.5">
                        <AlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Subject field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="subject" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g., Question about dynamic UPI QR setup"
                      className={`w-full bg-gray-50 dark:bg-gray-850 border rounded-2xl px-4 py-3 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium ${
                        errors.subject ? "border-red-500" : "border-gray-200 dark:border-gray-800"
                      }`}
                    />
                    {errors.subject && (
                      <span className="text-red-500 text-xs flex items-center gap-1 font-semibold px-1 mt-0.5">
                        <AlertCircle size={12} /> {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your issue or feedback in detail..."
                      className={`w-full bg-gray-50 dark:bg-gray-850 border rounded-2xl px-4 py-3 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-y ${
                        errors.message ? "border-red-500" : "border-gray-200 dark:border-gray-800"
                      }`}
                    />
                    {errors.message && (
                      <span className="text-red-500 text-xs flex items-center gap-1 font-semibold px-1 mt-0.5">
                        <AlertCircle size={12} /> {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12 px-4"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
                    <CheckCircle2 size={44} className="stroke-[2.5]" />
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading mb-4">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 font-light max-w-md mx-auto leading-relaxed mb-8">
                    Thank you for reaching out, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formData.name}</span>. Our merchant support team will review your message and get back to you at <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formData.email}</span> within 24 hours.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/10 transition-colors"
                    >
                      Send Another Message
                    </button>
                    <a
                      href="/"
                      className="w-full sm:w-auto px-6 py-3 bg-gray-150 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Back to Home
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
