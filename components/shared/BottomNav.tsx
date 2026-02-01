"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, History, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";

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

    const navItems = [
        { name: "Lobby", href: "/", icon: Home },
        { name: "History", href: "/history", icon: History },
        { name: "Profile", href: "/profile", icon: User },
    ];

    // Don't show nav on login/register pages
    if (["/login", "/register", "/landing"].includes(pathname)) return null;
    // Also maybe hide on battle page? The user requested it 'floating on the bottom', so maybe keep it everywhere except specific auth pages.
    // But in Battle Page, we have fixed game UI. Let's hide it in battle page to prevent accidental exit?
    // User asked: "keep floating navigation button on the bottom, with home, profile, history, logout button"
    // I'll keep it visible generally, but maybe hide in active battle if needed.
    // For now, I'll hide it on battle page to avoid clutter/accidental clicks.
    if (pathname.startsWith("/battle/")) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-zinc-800 shadow-2xl rounded-full px-6 py-3 flex items-center gap-2"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative px-4 py-2 rounded-full flex flex-col items-center justify-center transition-all ${isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                }`}
                        >
                            <item.icon
                                className={`w-6 h-6 mb-0.5 ${isActive ? "fill-current" : ""}`}
                            />
                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                {item.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-full -z-10"
                                />
                            )}
                        </Link>
                    );
                })}

                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-2" />

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full flex flex-col items-center justify-center text-rose-400 hover:text-rose-600 transition-all"
                >
                    <LogOut className="w-6 h-6 mb-0.5" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                        Logout
                    </span>
                </button>
            </motion.nav>
        </div>
    );
}
