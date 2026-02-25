import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Package, FileText, Zap, Search } from "lucide-react";

export default function LandingPage() {
  const [shopId, setShopId] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = shopId.trim();
    if (trimmed) navigate(`/shop/${trimmed}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500/30">
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
                The all-in-one workspace for modern businesses. Invoicing, inventory, and analytics in one <span className="text-gray-900 dark:text-white font-medium">beautiful interface</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="group relative w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start for free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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

      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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

      <section className="py-32 bg-gray-50/50 dark:bg-gray-900/30 relative">
        <div className="container mx-auto px-4">
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

      <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} JusBill. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay, color, bg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "backOut" }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-300 group"
    >
      <div className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-heading">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
        {description}
      </p>
    </motion.div>
  );
}
