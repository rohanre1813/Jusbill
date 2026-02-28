import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InvoicePage from "./pages/InvoicePage";
import ProductPage from "./pages/ProductPage";
import CustomerPage from "./pages/CustomerPage";
import BillsPage from "./pages/BillsPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import PublicInventoryPage from "./pages/PublicInventoryPage";
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

      {/* Protected Routes - Layout stays mounted, only page content animates */}
      <Route element={<ProtectedRoute><LayoutWithAnimatedOutlet /></ProtectedRoute>}>
        <Route path="/dashboard" element={<InvoicePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
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
