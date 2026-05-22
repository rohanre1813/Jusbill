import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Package,
  FileText,
  Zap,
  Search,
  Users,
  Send,
  Bell,
  ShoppingCart,
  Sparkles,
  Shield,
  Globe,
  Download,
  Mail,
  CheckCircle,
  Star,
  TrendingUp,
  Smartphone,
  QrCode,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "backOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LandingPage() {
  const [shopId, setShopId] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = shopId.trim();
    if (trimmed) navigate(`/shop/${trimmed}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500/30">
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl opacity-40 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-0 w-[600px] h-[500px] bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl opacity-40 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <Zap size={14} className="fill-current" /> v2.0 Now Available
              </motion.span>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[0.9] font-heading">
                Manage your shop <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-text">
                  like a Pro.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                The all-in-one workspace for modern businesses. Invoicing,
                inventory, and analytics in one{" "}
                <span className="text-gray-900 dark:text-white font-medium">
                  beautiful interface
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="group relative w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start for free{" "}
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700/50 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 backdrop-blur-sm"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Shop Lookup ── */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Look up a Shop
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Enter a Shop ID to browse their inventory
            </p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Paste Shop ID here..."
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!shopId.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                View
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Features (3 cards) ── */}
      <section className="py-32 bg-gray-50/50 dark:bg-gray-900/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Core Features
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading mb-4">
              Everything you need to run your shop
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              From invoice creation to inventory analytics — JusBill replaces spreadsheets, paper bills, and expensive ERP software.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText size={32} />}
              title="Smart Invoicing"
              description="Create and send professional invoices in seconds. Track payments and manage clients effortlessly."
              delay={0.1}
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <FeatureCard
              icon={<Package size={32} />}
              title="Inventory Control"
              description="Real-time stock tracking with low inventory alerts. Never run out of your best-selling items."
              delay={0.2}
              color="text-purple-500"
              bg="bg-purple-500/10"
            />
            <FeatureCard
              icon={<BarChart3 size={32} />}
              title="Powerful Analytics"
              description="Gain insights into your business performance with beautiful, interactive charts and reports."
              delay={0.3}
              color="text-pink-500"
              bg="bg-pink-500/10"
            />
          </div>
        </div>
      </section>

      {/* ── Detailed Features Grid ── */}
      <section className="py-28 relative overflow-hidden" id="features">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Feature Deep Dive
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading mb-4">
              Built for Indian businesses
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Every feature is designed with Indian GST compliance, ₹ currency, and local business workflows in mind.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <DetailCard
              icon={<FileText size={24} />}
              title="GST-Compliant Invoices"
              description="Generate professional invoices with automatic CGST, SGST, and IGST calculation. Includes your company logo, GSTIN, bank details, and UPI QR code — ready to print or email."
              gradient="from-blue-500 to-indigo-600"
            />
            <DetailCard
              icon={<Send size={24} />}
              title="Email Invoices & Estimates"
              description="Send invoices and estimates directly to customers via email with attached PDF. Send payment reminders for unpaid invoices with a single click."
              gradient="from-green-500 to-emerald-600"
            />
            <DetailCard
              icon={<Package size={24} />}
              title="Real-Time Inventory"
              description="Add products with selling price and unit type. Stock levels auto-update when invoices are created or purchases are recorded. Search and filter your entire catalog instantly."
              gradient="from-purple-500 to-violet-600"
            />
            <DetailCard
              icon={<ShoppingCart size={24} />}
              title="Purchase Tracking"
              description="Record all purchase entries with supplier name, bought price, and quantities. Stock automatically adjusts after each purchase. Email purchase reports for any date range."
              gradient="from-orange-500 to-amber-600"
            />
            <DetailCard
              icon={<Users size={24} />}
              title="Customer Management (CRM)"
              description="Maintain a complete customer directory with name, mobile, email, address, and GSTIN. Auto-search customers while creating invoices for faster billing."
              gradient="from-pink-500 to-rose-600"
            />
            <DetailCard
              icon={<BarChart3 size={24} />}
              title="Sales & Revenue Analytics"
              description="Interactive bar charts and pie charts show top-selling products and revenue distribution. Filter analytics by custom date ranges. Track total sales, received, and pending amounts."
              gradient="from-cyan-500 to-teal-600"
            />
            <DetailCard
              icon={<Bell size={24} />}
              title="Low Stock Alerts"
              description="Automatic notifications when any product falls below 5 units. The notification bell in the navbar keeps you informed at all times so you can restock before running out."
              gradient="from-amber-500 to-yellow-600"
            />
            <DetailCard
              icon={<Sparkles size={24} />}
              title="AI Business Assistant"
              description="Chat with JusBill AI to get instant answers about your sales, inventory, profit estimates, and top products. Powered by Groq for lightning-fast responses based on your real business data."
              gradient="from-violet-500 to-purple-600"
            />
            <DetailCard
              icon={<Globe size={24} />}
              title="Public Shop Page"
              description="Share your product catalog with a unique public link. Customers can browse your inventory, check prices and stock levels — no login required. Great for WhatsApp sharing."
              gradient="from-indigo-500 to-blue-600"
            />
            <DetailCard
              icon={<Download size={24} />}
              title="PDF Download & Print"
              description="Download any invoice as a beautifully formatted PDF or print it directly from the browser. Includes company branding, itemized breakdown, GST details, and payment QR code."
              gradient="from-teal-500 to-cyan-600"
            />
            <DetailCard
              icon={<TrendingUp size={24} />}
              title="Sales Reports via Email"
              description="Generate comprehensive sales and purchase reports filtered by date range. Reports are emailed to your registered email so you can review them anytime, anywhere."
              gradient="from-rose-500 to-pink-600"
            />
            <DetailCard
              icon={<QrCode size={24} />}
              title="UPI QR Code on Invoices"
              description="Upload your UPI payment QR code in your profile. It automatically appears on every generated invoice, making it effortless for customers to pay you digitally."
              gradient="from-emerald-500 to-green-600"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Why JusBill Section ── */}
      <section className="py-28 bg-gray-50/50 dark:bg-gray-900/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Why Choose Us
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading mb-4">
              Why 100+ businesses trust JusBill
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            <WhyCard icon={<Zap size={28} />} title="Lightning Fast" description="Built with React and optimized caching. Pages load instantly with stale-while-revalidate data." />
            <WhyCard icon={<Shield size={28} />} title="Secure & Private" description="JWT authentication, encrypted passwords, and your data is never shared. Each account is fully isolated." />
            <WhyCard icon={<Smartphone size={28} />} title="Mobile Friendly" description="Fully responsive design with a dedicated mobile bottom nav. Manage your shop from any device." />
            <WhyCard icon={<Star size={28} />} title="100% Free" description="No hidden charges, no premium tier. All features are completely free for every user, forever." />
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-[0.03] dark:opacity-[0.08]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading mb-6">
              Ready to modernize your billing?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Join hundreds of Indian shop owners who switched from paper bills to professional digital invoicing.
              Set up your account in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group relative w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Create Free Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-10 py-4 text-gray-700 dark:text-gray-300 font-bold text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                I already have an account →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <div className="w-4 h-4 bg-white rounded-md opacity-90" />
                </div>
                <div className="flex items-center font-heading">
                  <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Jus</span>
                  <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Bill</span>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-6">
                JusBill is a free, modern business management platform built for Indian shops and businesses. Create GST invoices, track inventory, manage customers, and gain business insights — all from one dashboard.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield size={16} className="text-green-500" />
                <span>Your data is secure and never shared</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/register" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    Get Started Free
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    Knowledge Hub (Blog)
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Support & Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                    Terms of Service
                  </Link>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-900">
                  <Mail size={14} className="text-indigo-500 shrink-0" />
                  <a
                    href="mailto:jusbill.contact@gmail.com"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all text-xs font-semibold"
                  >
                    jusbill.contact@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} JusBill. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Made with ❤️ in India for Indian businesses
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-Components ── */

function FeatureCard({ icon, title, description, delay, color, bg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.5, delay, ease: "backOut" }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-300 group"
    >
      <div
        className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
        {description}
      </p>
    </motion.div>
  );
}

function DetailCard({ icon, title, description, gradient }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:shadow-gray-200/30 dark:hover:shadow-none transition-all duration-300 group"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 font-heading">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function WhyCard({ icon, title, description }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      className="text-center p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-heading">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
