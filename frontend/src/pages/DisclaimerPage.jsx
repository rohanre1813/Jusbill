import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function DisclaimerPage() {
  useEffect(() => {
    document.title = "Disclaimer | JusBill Knowledge Hub";
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
            Financial & Tax Disclaimer
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading tracking-tight mb-8">
            Disclaimer
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500">
            <p className="lead text-xl text-gray-600 dark:text-gray-300">
              The information provided on the JusBill Knowledge Hub and Blog is for general educational and informational purposes only.
            </p>

            <h2>Not Professional Advice</h2>
            <p>
              The content published on this website regarding taxation (including GST, CGST, SGST, IGST), accounting principles, inventory management, and business operations is not intended to be a substitute for professional legal, financial, or tax advice. Always seek the advice of a qualified Chartered Accountant (CA), tax consultant, or legal professional with any questions you may have regarding your specific business structure or tax obligations.
            </p>

            <h2>Accuracy of Information</h2>
            <p>
              While we strive to keep the information up-to-date and accurate, laws, regulations, and tax rates in India frequently change. JusBill makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
            </p>

            <h2>Software Usage</h2>
            <p>
              Using JusBill's invoicing and inventory software does not automatically guarantee tax compliance. It is the responsibility of the business owner to ensure that the invoices generated and data recorded comply with local and national laws.
            </p>

            <h2>External Links</h2>
            <p>
              Through this website, you may be able to link to other websites which are not under the control of JusBill. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="mt-0 text-xl font-bold text-gray-900 dark:text-white">Contact Us</h3>
              <p className="mb-0 text-gray-600 dark:text-gray-400">
                If you have any questions regarding this disclaimer, please contact us at <a href="mailto:support@jusbill.in">support@jusbill.in</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
