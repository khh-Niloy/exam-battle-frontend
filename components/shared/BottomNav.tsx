"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, History, User, Bot } from "lucide-react";
import { motion } from "framer-motion";
import {
  useLogoutMutation,
  useGetMeQuery,
} from "@/redux/features/auth/auth.api";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      router.push("/login"); // Assuming login route is /login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const { data: user } = useGetMeQuery(undefined);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const navItems = [
    { name: "Lobby", href: "/", icon: Home },
    { name: "History", href: "/history", icon: History },
    ...(isAdmin ? [{ name: "Creation", href: "/creation", icon: Bot }] : []),
    { name: "AI", href: "/ai", icon: Bot },
    { name: "Profile", href: "/profile", icon: User },
  ];

  // Navigation configuration
  if (!pathname) return null;
  if (["/login", "/register", "/landing"].includes(pathname)) return null;
  if (pathname.startsWith("/battle/")) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-zinc-800 shadow-2xl rounded-3xl px-6 py-3 flex items-center gap-2"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative px-4 py-2 rounded-full flex flex-col items-center justify-center transition-all ${
                isActive
                  ? "text-blue-600"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <item.icon
                className={`w-6 h-6 mb-0.5 ${isActive ? "fill-current" : ""}`}
              />
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
