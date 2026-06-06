import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function EditorialPolicyPage() {
  useEffect(() => {
    document.title = "Editorial Policy | JusBill Knowledge Hub";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
            Our Commitment to Quality
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading tracking-tight mb-8">
            Editorial Policy
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500">
            <p className="lead text-xl text-gray-600 dark:text-gray-300">
              The JusBill Knowledge Hub is dedicated to empowering Indian retailers, wholesalers, and small business owners with accurate, actionable, and transparent information regarding business operations and compliance.
            </p>

            <h2>Our Mission</h2>
            <p>
              We believe that financial literacy and technological adoption are the keys to scaling a modern retail business. Our content is designed to simplify complex topics like GST regulations, inventory management principles, and digital payments, making them accessible to everyday entrepreneurs.
            </p>

            <h2>Content Creation & Sourcing</h2>
            <p>
              Every article published on the JusBill blog undergoes a rigorous review process:
            </p>
            <ul>
              <li><strong>Expert Authorship:</strong> Content is written or reviewed by professionals with direct experience in retail operations, software development, and Indian tax compliance.</li>
              <li><strong>Authoritative Sources:</strong> When discussing legal or tax regulations, we cross-reference our information with official government portals (such as the CBIC GST Portal) and leading financial institutions.</li>
              <li><strong>Originality:</strong> We prioritize original insights, practical templates, and real-world case studies over generic advice.</li>
            </ul>

            <h2>Accuracy and Corrections</h2>
            <p>
              The landscape of Indian taxation and e-commerce changes rapidly. We regularly audit our "Pillar" guides to ensure they reflect the latest GST rates, compliance thresholds, and E-Way bill regulations. 
            </p>
            <p>
              If a reader or expert identifies an inaccuracy in our content, we are committed to investigating the claim promptly. If a correction is warranted, we will update the article and transparently note the correction at the bottom of the page.
            </p>

            <h2>Objectivity and Independence</h2>
            <p>
              While JusBill provides a software solution for billing and inventory, our editorial team operates independently to ensure our educational guides remain objective. If we recommend our software as a solution to a problem, we clearly disclose it. We do not accept payment from third parties to favorably review their products without clear "Sponsored" disclosures.
            </p>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="mt-0 text-xl font-bold text-gray-900 dark:text-white">Feedback</h3>
              <p className="mb-0 text-gray-600 dark:text-gray-400">
                Notice an error or have a suggestion for a topic? Reach out to our editorial team at <a href="mailto:editor@jusbill.in">editor@jusbill.in</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
