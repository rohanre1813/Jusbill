import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthorPage() {
  useEffect(() => {
    document.title = "Rohan Verma | JusBill Knowledge Hub";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="px-8 md:px-12 pb-12 relative">
            {/* Profile Picture Placeholder */}
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-xl absolute -top-16 border border-gray-100 dark:border-gray-700">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">RV</span>
              </div>
            </div>

            <div className="mt-20">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-heading tracking-tight mb-2">
                Rohan Verma
              </h1>
              <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-6">
                Business Operations Lead & Retail Tech Educator
              </p>

              <div className="flex gap-4 mb-8">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2>About Rohan</h2>
                <p>
                  Rohan Verma is a leading voice in Indian retail technology and business operations. With extensive experience in bridging the gap between traditional Kirana stores and modern digital solutions, Rohan specializes in translating complex GST regulations and inventory principles into actionable strategies for MSMEs.
                </p>
                <p>
                  As the Business Operations Lead for JusBill, Rohan oversees the educational content strategy, ensuring that every guide published on the Knowledge Hub meets strict standards for accuracy, relevance, and practical utility.
                </p>
                
                <h2>Areas of Expertise</h2>
                <ul>
                  <li>Goods and Services Tax (GST) Compliance</li>
                  <li>Retail Inventory Management & Optimization</li>
                  <li>Digital Payments Integration (UPI & POS)</li>
                  <li>B2B E-commerce Strategies</li>
                  <li>Small Business Accounting Principles</li>
                </ul>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="mt-0">Read Rohan's Latest Articles</h3>
                  <p>
                    Explore comprehensive guides on retail operations and taxation in the <Link to="/blog">JusBill Knowledge Hub</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
