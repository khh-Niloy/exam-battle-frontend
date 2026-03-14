"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/redux/features/auth/auth.api";
import { User, LogOut, LogIn, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";

const TopHeader = () => {
  const { data: user, isLoading } = useGetMeQuery(undefined);
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeTourIndex, setActiveTourIndex] = useState(0);

  const tourSlides = [
    {
      id: "battle",
      label: "1v1 Battle",
      title: "Challenge friends to live 1v1 battles.",
      body: "Pick a question paper, invite a friend, and see both scores update in real time as you answer.",
    },
    {
      id: "war",
      label: "Exam Wars",
      title: "Join scheduled group exams with a live leaderboard.",
      body: "Enter at the start time, finish under the timer, and watch your rank change as others submit.",
    },
    {
      id: "coaching",
      label: "Coaching & Papers",
      title: "Create papers and manage coaching exams.",
      body: "Coaches can create question papers, schedule wars, and review performance across their students.",
    },
  ];

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
    <header className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
      {/* Left: user summary */}
      <div className="flex items-center gap-3">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="h-4 w-28 rounded bg-neutral-200" />
              <span className="h-3 w-40 rounded bg-neutral-100" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3">
            <Link href="/profile" className="relative group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-orange-100 bg-white shadow-sm group-hover:border-orange-300 transition-colors flex items-center justify-center">
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
              <span className="text-lg font-semibold text-neutral-900 leading-tight">
                Hello, {user.name}!
              </span>
              {/* <span className="text-xs font-medium text-neutral-600 leading-tight">
                {user.studentInfo?.instituteName || "Exam Battle player"} ·
                Class {user.studentInfo?.class ?? "-"}
              </span> */}
              <div className="mt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full border border-orange-100 bg-orange-50/80 text-[10px] font-mono font-semibold tracking-wide text-orange-800">
                  {user.uniqueNameCode}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.uniqueNameCode);
                    toast.success("Code copied!");
                  }}
                  className="text-[10px] font-medium text-neutral-500 hover:text-orange-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900 leading-tight">
                Guest Player
              </span>
              <span className="text-[10px] font-medium text-neutral-600 leading-tight">
                Login to save progress
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-orange-200 bg-white px-3 text-xs font-semibold text-orange-700 hover:bg-orange-50"
              onClick={() => setIsTourOpen(true)}
            >
              Short tour
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button className="h-9 rounded-lg bg-orange-600 px-4 text-xs font-semibold text-white hover:bg-orange-600/90">
              <LogIn className="w-4 h-4 mr-1.5" />
              Login
            </Button>
          </Link>
        )}
      </div>

      {/* Short tour modal */}
      <AnimatePresence>
        {isTourOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTourOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-orange-100">
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-orange-50">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      Quick tour
                    </p>
                    <h2 className="text-sm font-semibold text-neutral-900">
                      See what you can do in Exam Battle
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTourOpen(false)}
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-800"
                  >
                    Close
                  </button>
                </div>

                <div className="px-5 pt-4 pb-5 space-y-4">
                  {/* Image / visual block */}
                  <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(circle_at_20%_20%,#fed7aa,transparent_55%),radial-gradient(circle_at_80%_80%,#ffedd5,transparent_55%),linear-gradient(135deg,#fff7ed,#ffffff)] border border-orange-100">
                    <div className="flex h-40 items-end justify-between p-4">
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-900">
                        {tourSlides[activeTourIndex].label}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {activeTourIndex + 1} / {tourSlides.length}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {tourSlides[activeTourIndex].title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {tourSlides[activeTourIndex].body}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg border-orange-200 bg-white px-3 text-[11px] text-orange-900 hover:bg-orange-50"
                        onClick={() =>
                          setActiveTourIndex((prev) =>
                            prev === 0 ? tourSlides.length - 1 : prev - 1,
                          )
                        }
                      >
                        Prev
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg border-orange-200 bg-white px-3 text-[11px] text-orange-900 hover:bg-orange-50"
                        onClick={() =>
                          setActiveTourIndex((prev) =>
                            prev === tourSlides.length - 1 ? 0 : prev + 1,
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {tourSlides.map((slide, index) => (
                        <button
                          key={slide.id}
                          type="button"
                          className={`h-1.5 rounded-full transition-all ${
                            index === activeTourIndex
                              ? "w-6 bg-orange-600"
                              : "w-2 bg-orange-200"
                          }`}
                          onClick={() => setActiveTourIndex(index)}
                          aria-label={`Go to ${slide.label} slide`}
                          aria-current={
                            index === activeTourIndex ? "true" : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopHeader;
