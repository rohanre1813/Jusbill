import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { blogPosts } from "../utils/blogData";
import { ArrowLeft, Calendar, Clock, User, Share2, Copy, Check, ChevronRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);

  // Scroll Progress Setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const foundPost = blogPosts.find((p) => p.slug === slug);
    if (!foundPost) {
      navigate("/blog");
    } else {
      setPost(foundPost);
    }
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (!post) return null;

  // Get related posts (up to 3, excluding the current one, preferring the same category)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (b.category === post.category && a.category !== post.category) return 1;
      return 0;
    })
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Article link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500/30 pb-24 relative">
      {/* ── Reading Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[100] origin-[0%]"
        style={{ scaleX }}
      />

      {/* ── Decorative Cover Background ── */}
      <div className={`h-[350px] md:h-[450px] w-full bg-gradient-to-br ${post.gradient} relative flex items-end justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/35 z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl -translate-x-12 translate-y-12" />

        <div className="container mx-auto px-4 max-w-4xl pb-12 md:pb-16 z-20 text-white relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-6 font-semibold uppercase tracking-wider">
            <Link to="/blog" className="hover:text-white transition-colors">Guides</Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-white/60 truncate">{post.category}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-heading leading-tight max-w-3xl mb-8"
          >
            {post.title}
          </motion.h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs uppercase text-indigo-100">
                {post.author.split(" ").map(n => n[0]).join("")}
              </div>
              <span>{post.author}</span>
            </div>
            <div className="h-4 w-px bg-white/30" />
            <div className="flex items-center gap-2">
              <Calendar size={15} />
              <span>{post.date}</span>
            </div>
            <div className="h-4 w-px bg-white/30" />
            <div className="flex items-center gap-2">
              <Clock size={15} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="container mx-auto px-4 max-w-4xl mt-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Floating Bar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-3 items-center">
              <Link
                to="/blog"
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:-translate-x-0.5"
                title="Back to all guides"
              >
                <ArrowLeft size={18} />
              </Link>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                title="Copy Link"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Center Column - Prose Content */}
          <main className="lg:col-span-11 bg-white dark:bg-gray-950">
            {/* Mobile Header Nav */}
            <div className="flex items-center justify-between mb-8 lg:hidden pb-4 border-b border-gray-100 dark:border-gray-900">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold"
              >
                <ArrowLeft size={16} /> Back to Guides
              </Link>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-150 dark:border-gray-800"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Structured Article Body */}
            <article
              className="prose dark:prose-invert max-w-none 
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b dark:prose-h2:border-gray-900 prose-h2:pb-3
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ul:mb-6
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-ol:mb-6
                prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:underline hover:prose-a:text-indigo-800
                space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Profile Card */}
            <div className="mt-16 p-8 rounded-3xl border border-gray-100 dark:border-gray-950 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold font-heading shadow-lg shadow-indigo-500/25 shrink-0">
                RV
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white font-heading mb-1">{post.author}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Business Operations Lead at JusBill</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  Rohan is a retail operations veteran specializing in inventory efficiency, Indian GST billing policies, and micro-merchant digital integrations.
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* ── Related Articles Section ── */}
        <div className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-900">
          <div className="flex items-center gap-2 mb-10">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" size={20} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
              Related Articles
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.slug}
                to={`/blog/${rPost.slug}`}
                className="group flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className={`h-24 bg-gradient-to-br ${rPost.gradient} p-4 flex flex-col justify-between text-white relative overflow-hidden shrink-0`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-lg" />
                  <span className="z-10 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider self-start">
                    {rPost.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
                    {rPost.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mt-4">
                    <span>{rPost.date}</span>
                    <span>•</span>
                    <span>{rPost.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
