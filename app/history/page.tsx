"use client";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useGetBattleHistoryQuery } from "@/redux/features/battle/battle.api";
import { Loader2, Trophy, Swords, Calendar } from "lucide-react";
import Image from "next/image";

export default function HistoryPage() {
  const { data: history, isLoading: isHistoryLoading } =
    useGetBattleHistoryQuery(undefined);
  const { data: me, isLoading: isMeLoading } = useGetMeQuery(undefined);

  const isLoading = isHistoryLoading || isMeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-12 max-w-2xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-3 bg-blue-50 dark:bg-zinc-800 rounded-2xl">
          <Trophy className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Battle History
          </h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Your recent gladiator matches
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {history?.data?.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Swords className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              No battles recorded yet
            </p>
          </div>
        ) : (
          history?.data?.map((battle: any) => {
            const myParticipant = battle.participants.find(
              (p: any) => p.userId._id === me?._id,
            );
            const opponent = battle.participants.find(
              (p: any) => p.userId._id !== me?._id,
            );

            // Safety check if data is malformed
            if (!myParticipant || !opponent) return null;

            const isWin = myParticipant.result === "win";
            const isDraw = myParticipant.result === "draw";

            return (
              <div
                key={battle._id}
                className="bg-white dark:bg-zinc-900 p-5 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-blue-200 dark:hover:border-zinc-700 transition-colors"
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
                      <span className="text-[10px] font-bold text-gray-300 dark:text-zinc-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(battle.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-zinc-700 bg-gray-50 flex-shrink-0">
                        {opponent.userId.image ? (
                          <Image
                            src={opponent.userId.image}
                            alt={opponent.userId.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800">
                            <span className="text-xs font-bold text-gray-400">
                              ?
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-800 dark:text-zinc-200 text-sm truncate">
                          vs {opponent.userId.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
                          {battle.questionPaperId?.examName || "Unknown Exam"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end pl-2 border-l border-gray-50 dark:border-zinc-800/50">
                    <div className="text-2xl font-black text-gray-800 dark:text-white italic">
                      {myParticipant.score}
                    </div>
                    <div
                      className="text-[9px] font-bold text-gray-400 uppercase tracking-widest"
                      title={`Accuracy: ${myParticipant.accuracy}%`}
                    >
                      Score
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
