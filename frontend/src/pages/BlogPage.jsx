import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts } from "../utils/blogData";
import { Search, Calendar, Clock, ArrowRight, BookOpen, Filter } from "lucide-react";

const categories = ["All", "GST & Tax", "Inventory", "Payments", "Tech & AI", "Kirana Tips", "Retail Tips"];

const cardStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 }
  }
};

const cardFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 font-sans selection:bg-indigo-500/30 pb-20 pt-8">
      {/* ── Background Blobs ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-1/4 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* ── Page Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 shadow-sm cursor-default"
          >
            <BookOpen size={16} />
            <span>JusBill Knowledge Hub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white font-heading tracking-tight leading-tight mb-6"
          >
            Guides & Insights for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Indian Merchants
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed"
          >
            Empower your shop with professional advice on GST taxation, inventory controls, digital payment systems, and business intelligence solutions.
          </motion.p>
        </div>

        {/* ── Search & Filter Controls ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 p-5 rounded-3xl shadow-xl shadow-indigo-500/5 mb-12 flex flex-col gap-6"
        >
          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search articles by keywords, tags, or titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          {/* Categories filters */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
              <Filter size={12} />
              <span>Filter by Topic</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Articles Grid ── */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              variants={cardStagger}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.slug}
                  variants={cardFade}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group bg-white dark:bg-gray-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-none transition-all duration-300 flex flex-col h-full"
                >
                  {/* Decorative Gradient Cover */}
                  <div className={`h-40 bg-gradient-to-br ${post.gradient} p-6 flex flex-col justify-between text-white relative overflow-hidden shrink-0`}>
                    {/* Abstract design elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-lg -translate-x-4 translate-y-4" />

                    <div className="z-10 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider self-start">
                      {post.category}
                    </div>

                    <div className="z-10 flex gap-2 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] bg-black/15 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-1.5 transition-all text-sm group-hover:translate-x-0.5"
                      >
                        <span>Read</span>
                        <ArrowRight size={14} className="stroke-[3]" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-16 max-w-md mx-auto shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Articles Found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                We couldn't find any articles matching your search query or selected category. Try adjusting your terms!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/10 hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
