import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InvoicePage from "./pages/InvoicePage";
import ProductPage from "./pages/ProductPage";
import CustomerPage from "./pages/CustomerPage";
import BillsPage from "./pages/BillsPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";
import PublicInventoryPage from "./pages/PublicInventoryPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import DisclaimerPage from "./pages/DisclaimerPage";
import EditorialPolicyPage from "./pages/EditorialPolicyPage";
import AuthorPage from "./pages/AuthorPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";

// Wrapper that keeps Layout mounted and only animates page content
function LayoutWithAnimatedOutlet() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </Layout>
  );
}

function AnimatedRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* Public Routes - no shared layout */}
      <Route path="/" element={!user ? <Layout><LandingPage /></Layout> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      <Route path="/shop/:shopId" element={<PublicInventoryPage />} />
      
      {/* Public Informational Routes - with Layout */}
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
      <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
      <Route path="/disclaimer" element={<Layout><DisclaimerPage /></Layout>} />
      <Route path="/editorial-policy" element={<Layout><EditorialPolicyPage /></Layout>} />
      <Route path="/author/rohan-verma" element={<Layout><AuthorPage /></Layout>} />

      {/* Protected Routes - Layout stays mounted, only page content animates */}
      <Route element={<ProtectedRoute><LayoutWithAnimatedOutlet /></ProtectedRoute>}>
        <Route path="/dashboard" element={<InvoicePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster position="top-center" />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
