"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, History, Bot, Users, GraduationCap } from "lucide-react";
import { useLogoutMutation, useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useGetPendingRequestsQuery } from "@/redux/features/user/user.api";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { data: me } = useGetMeQuery(undefined);

  const isHidden =
    !pathname ||
    ["/login", "/register", "/landing"].includes(pathname) ||
    pathname.startsWith("/battle/") ||
    pathname.startsWith("/war/");

  const { data: pendingRequests } = useGetPendingRequestsQuery(undefined, {
    skip: isHidden,
  });

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Lobby", href: "/", icon: Home },
    { name: "History", href: "/history", icon: History },
    { name: "Coach", href: "/coaching", icon: GraduationCap },
    { name: "AI", href: "/ai", icon: Bot },
    { name: "Friends", href: "/friends", icon: Users },
  ] as const;

  // Hide bottom navigation entirely when unauthenticated or on excluded routes
  if (isHidden || !me?._id) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <nav className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-zinc-800 shadow-xl rounded-3xl px-6 py-3 flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => router.push(item.href)}
              className={`relative px-4 py-2 rounded-full flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <item.icon
                className={`w-6 h-6 mb-0.5 ${isActive ? "fill-current" : ""}`}
              />
              <span className="text-[10px] font-bold">{item.name}</span>
              {item.name === "Friends" && pendingRequests?.length ? (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-[10px] font-black">
                  {pendingRequests.length}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
