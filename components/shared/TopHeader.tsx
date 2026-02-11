"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/redux/features/auth/auth.api";
import { User, LogOut, LogIn, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const TopHeader = () => {
  const { data: user, isLoading } = useGetMeQuery(undefined);
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-7 pt-7 pb-4 flex items-center justify-between">
      {/* Left Side: User Info */}
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </motion.div>
          ) : user ? (
            <motion.div
              key="user-info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link href="/profile" className="relative group">
                <div className="relative w-13 h-13 rounded-xl overflow-hidden border-2 border-white dark:border-zinc-800 shadow-sm group-hover:border-blue-500 transition-colors bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </Link>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  Hello, {user.name}!
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight">
                  {user.studentInfo?.instituteName || "Exam Battle Player"} -
                  class {user.studentInfo?.class}
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-[#4088FD] text-[10px] font-bold rounded-full border border-blue-100 dark:border-blue-800">
                    {user.uniqueNameCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.uniqueNameCode);
                      toast.success("Code copied!");
                    }}
                    className="text-[10px] font-bold text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="guest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  Guest Player
                </span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-tight">
                  Login to save progress
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: Logo or Title (Optional, keeping it clean for now) */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
        <Link
          href="/"
          className="text-lg font-black tracking-tighter text-[#4088FD]"
        >
          EXAM<span className="text-zinc-400 dark:text-zinc-600">BATTLE</span>
        </Link>
      </div>

      {/* Right Side: Auth Button */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </Button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
            >
              <Button className="bg-red-500/90 py-4" size="sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </motion.button>
          </div>
        ) : (
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopHeader;
