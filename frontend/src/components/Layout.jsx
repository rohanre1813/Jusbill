import Navbar from "./navbar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme}`}>
      <Navbar />
      <main className={`container mx-auto px-4 py-8 max-w-7xl ${user ? "pb-24 md:pb-8" : ""}`}>
        {children}
      </main>
    </div>
  );
}
