"use client";
import { useState } from "react";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useGetBattleHistoryQuery } from "@/redux/features/battle/battle.api";
import { Loader2, Trophy, Swords, Calendar } from "lucide-react";
import Image from "next/image";

export default function HistoryPage() {
  const { data: history, isLoading: isHistoryLoading } =
    useGetBattleHistoryQuery(undefined);
  const { data: me, isLoading: isMeLoading } = useGetMeQuery(undefined);
  const [search, setSearch] = useState("");

  const isLoading = isHistoryLoading || isMeLoading;

  const filteredBattles = history?.data?.filter((battle: any) => {
    const myParticipant = battle.participants.find(
      (p: any) => p.userId._id === me?._id,
    );
    const opponent = battle.participants.find(
      (p: any) => p.userId._id !== me?._id,
    );

    if (!myParticipant || !opponent) return false;

    const opponentName = opponent.userId.name || "";
    const examName = battle.questionPaperId?.examName || "";
    const term = search.trim().toLowerCase();

    if (!term) return true;

    return (
      opponentName.toLowerCase().includes(term) ||
      examName.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 pt-4 pb-32 sm:pb-40 max-w-5xl mx-auto">
        <header className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <Trophy className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              <div className="mt-1 h-3 w-40 bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <div className="w-full">
            <div className="h-9 w-full rounded-md bg-neutral-100 animate-pulse" />
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm animate-pulse"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-neutral-100 rounded" />
                    <div className="h-2.5 w-40 bg-neutral-50 rounded" />
                  </div>
                </div>
                <div className="h-6 w-10 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pt-4 pb-32 sm:pb-40 max-w-5xl mx-auto">
      <header className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-xl">
            <Trophy className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
              Battle History
            </h1>
            <p className="text-xs font-medium text-neutral-600">
              Your recent head-to-head battles
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by opponent or paper"
            className="w-full h-9 rounded-md border border-neutral-200 px-3 text-xs font-medium text-neutral-800 placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
          />
        </div>
        {filteredBattles?.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-neutral-50 rounded-lg flex items-center justify-center">
              <Swords className="w-8 h-8 text-neutral-300" />
            </div>
            <p className="text-sm font-medium text-neutral-600">
              No battles found
            </p>
          </div>
        ) : (
          filteredBattles?.map((battle: any) => {
            const myParticipant = battle.participants.find(
              (p: any) => p.userId._id === me?._id,
            );
            const opponent = battle.participants.find(
              (p: any) => p.userId._id !== me?._id,
            );

            if (!myParticipant || !opponent) return null;

            const isWin = myParticipant.result === "win";
            const isDraw = myParticipant.result === "draw";

            return (
              <div
                key={battle._id}
                className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm relative overflow-hidden group hover:border-neutral-200 transition-colors"
              >
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${isWin ? "bg-emerald-500" : isDraw ? "bg-gray-300" : "bg-rose-500"}`}
                />

                <div className="flex items-center justify-between pl-3 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                          isWin
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : isDraw
                              ? "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400"
                              : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}
                      >
                        {isWin ? "Victory" : isDraw ? "Draw" : "Defeat"}
                      </span>
                      <span className="text-[10px] font-medium text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(battle.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-100 bg-neutral-50 flex-shrink-0">
                        {opponent.userId.image ? (
                          <Image
                            src={opponent.userId.image}
                            alt={opponent.userId.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                            <span className="text-xs font-bold text-neutral-400">
                              ?
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-semibold text-neutral-900 text-sm truncate">
                          vs {opponent.userId.name}
                        </h3>
                        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider truncate">
                          {battle.questionPaperId?.examName || "Unknown Exam"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end pl-2 border-l border-neutral-50">
                    <div className="text-2xl font-black text-neutral-900 italic">
                      {myParticipant.score}
                    </div>
                    <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                      Score
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
