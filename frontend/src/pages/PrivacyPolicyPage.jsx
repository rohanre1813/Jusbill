import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: May 17, 2026
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert prose-gray max-w-none space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                1. Introduction
              </h2>
              <p>
                Welcome to JusBill ("we," "our," or "us"). We are committed to
                protecting and respecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our website and services at{" "}
                <strong>jusbill.online</strong>.
              </p>
              <p>
                By using JusBill, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                2. Information We Collect
              </h2>
              <p>We collect information that you provide directly to us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> When you register, we
                  collect your email address and password (stored in encrypted
                  form).
                </li>
                <li>
                  <strong>Business Profile:</strong> Company name, address,
                  mobile number, GSTIN, bank details, profile image, and payment
                  QR code that you choose to provide.
                </li>
                <li>
                  <strong>Business Data:</strong> Products, customers, invoices,
                  and purchase records that you create within the platform.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may collect analytics data
                  such as pages visited, time spent, and browser type through
                  Google Analytics.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, maintain, and improve our services.</li>
                <li>
                  To generate invoices, track inventory, and manage your
                  business data.
                </li>
                <li>
                  To send transactional emails such as invoices, estimates, payment
                  reminders, and sales/purchase reports.
                </li>
                <li>
                  To provide AI-powered business insights through our chat
                  assistant.
                </li>
                <li>
                  To display your public product catalog when you share your
                  shop link.
                </li>
                <li>To respond to your inquiries and support requests.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                4. Data Storage and Security
              </h2>
              <p>
                Your data is stored securely in our database. We implement
                industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encrypted password storage using bcrypt hashing.</li>
                <li>JWT-based authentication for secure session management.</li>
                <li>HTTPS encryption for all data in transit.</li>
                <li>
                  Cloud-based image storage (Cloudinary) for profile images and
                  QR codes.
                </li>
              </ul>
              <p>
                While we strive to protect your data, no method of electronic
                transmission or storage is 100% secure. We cannot guarantee
                absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                5. Third-Party Services
              </h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> For website usage analytics
                  and traffic insights.
                </li>
                <li>
                  <strong>Google AdSense:</strong> For displaying advertisements.
                  Google may use cookies to serve ads based on your prior visits.
                </li>
                <li>
                  <strong>Cloudinary:</strong> For secure image storage and
                  delivery.
                </li>
                <li>
                  <strong>Mailjet / Resend:</strong> For sending transactional
                  emails (invoices, reports).
                </li>
                <li>
                  <strong>Groq:</strong> For AI-powered chat assistant
                  functionality.
                </li>
              </ul>
              <p>
                Each third-party service has its own privacy policy governing
                how it handles your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                6. Cookies and Advertising
              </h2>
              <p>
                We and our advertising partners (including Google AdSense) may
                use cookies, web beacons, and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your login session and preferences.</li>
                <li>Analyze website traffic and usage patterns.</li>
                <li>
                  Serve personalized advertisements based on your interests.
                </li>
              </ul>
              <p>
                You can control cookies through your browser settings. For more
                information about how Google uses data, visit{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 underline"
                >
                  Google's Partner Sites policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                7. Data Sharing
              </h2>
              <p>
                We do <strong>not</strong> sell, rent, or trade your personal
                data to third parties. We may share information only in the
                following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Public Shop Page:</strong> If you share your shop
                  link, your product catalog (names, prices, stock status) is
                  publicly visible.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required by law or to
                  protect our rights and safety.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                8. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and update your personal information at any time via your Profile page.</li>
                <li>Request deletion of your account and associated data by contacting us.</li>
                <li>Opt out of marketing communications.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                9. Children's Privacy
              </h2>
              <p>
                JusBill is not intended for use by individuals under the age of
                18. We do not knowingly collect personal information from
                children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated "Last updated" date.
                Continued use of JusBill after changes constitutes acceptance of
                the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                11. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
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
