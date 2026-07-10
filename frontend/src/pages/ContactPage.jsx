import { motion } from "framer-motion";
import { Mail, Clock, MessageSquare, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 font-sans selection:bg-indigo-500/30 pb-20 pt-8">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
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
            Have a question about our GST compliance templates, inventory notifications, or need help importing products?
          </motion.p>
        </div>

        {/* ── Contact Info ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-150 dark:border-gray-800 p-10 rounded-3xl shadow-lg space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading text-center mb-6">
              Contact Details
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-light text-center mb-8">
              We're committed to helping small businesses succeed. Our dedicated helpdesk is ready to resolve technical issues or listen to product feature suggestions.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Email channel */}
              <div className="flex gap-4 items-start bg-gray-50 dark:bg-gray-850 p-6 rounded-2xl">
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
              <div className="flex gap-4 items-start bg-gray-50 dark:bg-gray-850 p-6 rounded-2xl">
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
            </div>

            {/* Secure banner */}
            <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
              <span>We value your privacy and security.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
