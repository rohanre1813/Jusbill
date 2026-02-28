import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, Package, FileText, LogOut, User, Bell, AlertTriangle, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getProducts } from "../api/product.api";

import { logout as logoutApi } from "../api/auth.api";

function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }

    // Listen for stock changes from other pages
    const handleStockChange = () => loadNotifications();
    window.addEventListener("stock-changed", handleStockChange);
    return () => window.removeEventListener("stock-changed", handleStockChange);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getProducts();
      const lowStock = res.data.filter(p => p.stock < 5);
      setNotifications(lowStock);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[100]"
          >
            <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((product) => (
                  <div key={product._id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start gap-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                      <AlertTriangle size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Low Stock: Only <span className="font-bold text-amber-600 dark:text-amber-400">{product.stock}</span> remaining.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400 dark:text-gray-500 text-sm">
                  <Check size={24} className="mx-auto mb-2 opacity-50" />
                  <p>All stocks are healthy!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    }
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm shadow-indigo-500/5 transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold text-xl text-gray-900 dark:text-white group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-4 h-4 bg-white rounded-md opacity-90" />
          </div>
          <div className="flex items-center font-heading">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Jus</span>
            <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Bill</span>
          </div>
        </div>

        {user && (
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
            <Link
              to="/dashboard"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/dashboard") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <FileText size={18} />
              <span>Invoice</span>
              {isActive("/dashboard") && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>

            <Link
              to="/products"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/products") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <Package size={18} />
              <span>Products</span>
              {isActive("/products") && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>

            <Link
              to="/customers"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/customers") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <User size={18} />
              <span>Customers</span>
              {isActive("/customers") && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>

            <Link
              to="/bills"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/bills") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <FileText size={18} />
              <span>Bills</span>
              {isActive("/bills") && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>

            <Link
              to="/reports"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/reports") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <FileText size={18} />
              <span>Reports</span>
              {isActive("/reports") && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <NotificationBell />

            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <User size={16} />
              <span className="max-w-[150px] truncate">{user.email || "User"}</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
              title="Sign Out"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </button>

            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-50">
          <div className="flex items-center overflow-x-auto no-scrollbar h-16 w-full px-6 gap-1">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-shrink-0 ${isActive("/dashboard") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              <FileText size={20} />
              <span className="text-[10px] font-medium">Invoice</span>
            </Link>

            <Link
              to="/products"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-shrink-0 ${isActive("/products") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              <Package size={20} />
              <span className="text-[10px] font-medium">Products</span>
            </Link>

            <Link
              to="/customers"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-shrink-0 ${isActive("/customers") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              <User size={20} />
              <span className="text-[10px] font-medium">Cust.</span>
            </Link>

            <Link
              to="/bills"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-shrink-0 ${isActive("/bills") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              <FileText size={20} />
              <span className="text-[10px] font-medium">Bills</span>
            </Link>

            <Link
              to="/reports"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-shrink-0 ${isActive("/reports") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              <FileText size={20} />
              <span className="text-[10px] font-medium">Reports</span>
            </Link>

            <Link
              to="/profile"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-shrink-0 ${isActive("/profile") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              <User size={20} />
              <span className="text-[10px] font-medium max-w-[60px] truncate">{user.email?.split('@')[0]}</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              <span className="text-[10px] font-medium">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
            >
              <LogOut size={20} />
              <span className="text-[10px] font-medium">Logout</span>
            </button>

            {/* Spacer for right padding scroll */}
            <div className="w-2 flex-shrink-0" />
          </div>
        </div>
      )}
    </nav>
  );
}
