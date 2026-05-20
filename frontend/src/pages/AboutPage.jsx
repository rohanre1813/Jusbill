import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Sparkles, Star, Users, Heart, Award, CheckCircle, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "backOut" }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500/30 pb-20 pt-8">
      {/* ── Hero Section ── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl opacity-50 animate-blob" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl opacity-40 animate-blob" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 shadow-sm cursor-default"
          >
            <Sparkles size={14} className="fill-current" />
            <span>Our Mission & Vision</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-tight mb-8 text-gray-900 dark:text-white"
          >
            Empowering Indian MSMEs with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Modern Billing
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed max-w-3xl mx-auto"
          >
            At JusBill, we believe professional business tools should be accessible to everyone. We're removing the complexity and subscription costs of billing and inventory software for small shop owners.
          </motion.p>
        </div>
      </section>

      {/* ── Key Statistics Section ── */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50/50 dark:bg-gray-900/40 backdrop-blur-md p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center"
          >
            <StatCard count="100+" label="Active Indian Shops" />
            <StatCard count="15,000+" label="Invoices Generated" />
            <StatCard count="₹0" label="Subscription Fees" />
            <StatCard count="99.9%" label="Cloud Uptime" />
          </motion.div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
              Why We Built JusBill
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-450 leading-relaxed text-lg font-light">
              Indian MSMEs and neighborhood retail kirana stores are the literal backbone of the national economy. Yet, when it comes to adopting digital-first bookkeeping, they are faced with two extreme choices: messy hand-written bills and complicated spreadsheets, or expensive, bloated software with monthly licensing fees.
            </motion.p>
            <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-450 leading-relaxed text-lg font-light">
              JusBill was created as a bridge—a premium, extremely modern, yet completely free invoicing, inventory, and analytics system. By providing a clean interface, local data management, instant cloud backups, and smart features like built-in payment UPI QR codes and generative AI insights, we enable shop owners to run their business with maximum speed and modern efficiency.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-16 bg-gray-50/30 dark:bg-gray-900/10 border-y border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading mb-4">
              Our Core Principles
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold">
              The values that drive our product development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Heart className="text-red-500" size={24} />}
              title="100% Free, Forever"
              description="No locked features, no trial periods, and no credit cards required. Our standard invoice, stock, and reporting tools will always be free."
            />
            <ValueCard
              icon={<Shield className="text-emerald-500" size={24} />}
              title="Absolute Data Privacy"
              description="Your business metrics, client catalogs, and financials are encrypted and securely hosted. We do not sell or trade your data to third parties."
            />
            <ValueCard
              icon={<Star className="text-indigo-500" size={24} />}
              title="User-Centered Design"
              description="Billing software shouldn't require an accounting degree. We build with premium, intuitive layouts that feel responsive and simple on any device."
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold">
              Get started and optimize your business in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold font-heading flex items-center justify-center mb-6 text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-3">
                Register Your Shop
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-450 leading-relaxed font-light">
                Create a free account in under a minute. Fill in your business details, upload your GSTIN and UPI QR code to complete your profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold font-heading flex items-center justify-center mb-6 text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-3">
                Manage Stock & Invoices
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-450 leading-relaxed font-light">
                Add products with rates and units. Generate GST-compliant invoices dynamically. Watch your stock levels auto-update as transactions happen.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 font-bold font-heading flex items-center justify-center mb-6 text-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-3">
                Review Insights
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-450 leading-relaxed font-light">
                Generate reports and view interactive analytics. Chat with our AI Business Assistant to fetch profit margins and ask sales queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call To Action ── */}
      <section className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl shadow-indigo-500/10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl -translate-x-20 translate-y-20" />

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading mb-4 relative z-10">
              Ready to Upgrade Your Invoicing?
            </h2>
            <p className="text-indigo-100 max-w-xl mx-auto mb-8 relative z-10 font-light text-lg">
              Join hundreds of shop owners across India who rely on JusBill for GST-compliant billing, real-time inventory tracking, and deep financial insights.
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Create Free Account</span>
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/blog"
                className="w-full sm:w-auto px-8 py-4 text-white hover:text-indigo-200 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl font-bold transition-colors"
              >
                Browse Business Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ count, label }) {
  return (
    <motion.div variants={fadeUp} className="p-4">
      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-heading mb-2">
        {count}
      </h3>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
        {label}
      </p>
    </motion.div>
  );
}

function ValueCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-900/30 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-3">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}
