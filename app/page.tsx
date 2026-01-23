"use client";
import PlayerInfo from "@/components/home/PlayerInfo";
import FriendsSidebar from "@/components/home/FriendsSidebar";
import { useState } from "react";

export default function Home() {
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black flex items-center justify-center p-6 sm:p-12">
      <main className="w-full max-w-4xl flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-sm font-black text-[#4088FD] uppercase tracking-[0.3em]">
            Battle Station
          </h1>
          <p className="text-gray-400 font-bold">Welcome to your dashboard</p>
        </div>

        <PlayerInfo />

        <div className="w-full max-w-md mx-auto">
          <button
            onClick={() => setIsFriendsOpen(true)}
            className="w-full bg-[#4088FD] text-white py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#3a7bd5] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            My Friends
          </button>
        </div>
      </main>

      <FriendsSidebar
        isOpen={isFriendsOpen}
        onClose={() => setIsFriendsOpen(false)}
      />
    </div>
  );
}
