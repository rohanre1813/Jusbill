import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains a letter", test: (p) => /[a-zA-Z]/.test(p) },
  { label: "Contains a number", test: (p) => /\d/.test(p) },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "", companyName: "" });
  const [errors, setErrors] = useState({});
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required.";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email address.";
    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[a-zA-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one letter.";
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "Password must contain at least one number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form);
      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed");
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const passedRules = passwordRules.filter((r) => r.test(form.password));
  const strength = form.password.length === 0 ? 0 : passedRules.length;

  const strengthColor = ["", "bg-red-500", "bg-yellow-400", "bg-green-500"][strength] || "bg-green-500";
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength] || "Strong";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
      <Link
        to="/"
        className="absolute top-4 left-4 p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all"
        title="Back to Home"
      >
        <ArrowLeft size={24} />
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-20 dark:bg-gray-800 p-8 rounded-2xl shadow-xl shadow-gray-200/20 dark:shadow-none w-full max-w-md border border-gray-200 dark:border-gray-700 relative"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Get Started</h1>
          <p className="text-gray-500 dark:text-gray-400">Create your account in seconds</p>
        </div>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.companyName ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                placeholder="Shop/Company Name"
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>
            {errors.companyName && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.companyName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.mobile ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
              />
            </div>
            {errors.mobile && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.mobile}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </div>

            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-gray-200 dark:bg-gray-700"}`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength === 1 ? "text-red-500" : strength === 2 ? "text-yellow-500" : "text-green-500"}`}>
                  {strengthLabel}
                </p>
              </div>
            )}

            {(passwordFocused || form.password.length > 0) && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const passed = rule.test(form.password);
                  return (
                    <li key={rule.label} className={`text-xs flex items-center gap-1.5 ${passed ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`}>
                      <span>{passed ? "✓" : "○"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}

            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/30"
          >
            <UserPlus size={20} />
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
