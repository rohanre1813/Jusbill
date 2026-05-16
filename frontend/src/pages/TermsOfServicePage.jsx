import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                Terms of Service
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: May 17, 2026
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert prose-gray max-w-none space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using JusBill ("the Service"), available at{" "}
                <strong>jusbill.online</strong>, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                2. Description of Service
              </h2>
              <p>
                JusBill is a free, web-based business management platform that
                provides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>GST-compliant invoice generation and management.</li>
                <li>Product inventory tracking with stock management.</li>
                <li>Customer relationship management (CRM).</li>
                <li>Purchase recording and expense tracking.</li>
                <li>Sales and revenue analytics with interactive charts.</li>
                <li>AI-powered business assistant for insights.</li>
                <li>Public shop page for sharing product catalogs.</li>
                <li>PDF invoice generation, printing, and email delivery.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                3. User Accounts
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You must provide a valid email address and create a password to
                  register an account.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your login credentials.
                </li>
                <li>
                  You are responsible for all activities that occur under your
                  account.
                </li>
                <li>
                  You must notify us immediately of any unauthorized use of your
                  account.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                4. Acceptable Use
              </h2>
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use the Service for any unlawful purpose or in violation of
                  any applicable laws.
                </li>
                <li>
                  Upload malicious content, viruses, or harmful code.
                </li>
                <li>
                  Attempt to gain unauthorized access to other users' accounts
                  or our systems.
                </li>
                <li>
                  Use automated tools (bots, scrapers) to access the Service
                  without our permission.
                </li>
                <li>
                  Misrepresent your identity or impersonate any person or
                  entity.
                </li>
                <li>
                  Use the Service to send spam, phishing, or unsolicited
                  communications.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                5. User Content and Data
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You retain ownership of all business data (products,
                  customers, invoices, purchases) you create on JusBill.
                </li>
                <li>
                  By using the public shop feature, you grant us permission to
                  display your product catalog publicly via your unique shop
                  link.
                </li>
                <li>
                  You are solely responsible for the accuracy and legality of
                  the data you input, including GST numbers, invoices, and
                  business information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                6. Invoices and Financial Data
              </h2>
              <p>
                JusBill helps you generate invoices and track financial data, but:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  We are <strong>not</strong> a registered accounting or tax
                  advisory service.
                </li>
                <li>
                  Invoices generated through JusBill are for your convenience
                  and should be verified for compliance with local tax
                  regulations.
                </li>
                <li>
                  We are not responsible for any tax filing errors,
                  miscalculations, or legal issues arising from the use of our
                  invoicing features.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                7. Availability and Modifications
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  We strive to keep JusBill available 24/7, but we do not
                  guarantee uninterrupted access. The Service may be temporarily
                  unavailable due to maintenance, updates, or unforeseen issues.
                </li>
                <li>
                  We reserve the right to modify, suspend, or discontinue any
                  part of the Service at any time without prior notice.
                </li>
                <li>
                  We may update these Terms from time to time. Continued use
                  after changes constitutes acceptance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                8. Intellectual Property
              </h2>
              <p>
                The JusBill name, logo, design, and all original content on
                the platform are the property of JusBill and are protected by
                intellectual property laws. You may not copy, modify, or
                distribute our branding or code without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                9. Limitation of Liability
              </h2>
              <p>
                JusBill is provided on an "as is" and "as available" basis. To
                the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  We disclaim all warranties, express or implied, regarding the
                  Service.
                </li>
                <li>
                  We are not liable for any direct, indirect, incidental, or
                  consequential damages arising from your use of the Service.
                </li>
                <li>
                  We are not liable for any loss of data, revenue, or business
                  opportunities.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                10. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account at
                any time if you violate these Terms or engage in activities
                that harm the Service or other users. You may also delete your
                account at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                11. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of India. Any disputes arising from these Terms
                shall be subject to the exclusive jurisdiction of the courts in
                India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                12. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <p className="font-semibold">
                📧{" "}
                <a
                  href="mailto:jusbill.contact@gmail.com"
                  className="text-indigo-600 dark:text-indigo-400 underline"
                >
                  jusbill.contact@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
