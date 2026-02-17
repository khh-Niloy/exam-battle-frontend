"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Trophy,
  Sword,
  Shield,
  Home,
  BookOpen,
} from "lucide-react";
import { socket } from "@/lib/socket";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useGetWarDetailsQuery } from "@/redux/features/war/war.api";
import { useGetSingleQuestionPaperQuery } from "@/redux/features/questionPaper/questionPaper.api";
import BattleResultModal from "@/components/battle/BattleResultModal";

function CompactStat({
  value,
  color,
  text,
  icon: Icon,
}: {
  value: number;
  color?: string;
  text?: string;
  icon?: any;
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-[32px]">
      {Icon ? (
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      ) : (
        <p className={`text-sm font-bold ${color}`}>{text}</p>
      )}
      <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
  );
}

export default function WarBattlePage({
  params: paramsPromise,
}: {
  params: Promise<{ warId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { data: me } = useGetMeQuery(undefined);
  const { data: war, isLoading: isWarLoading } = useGetWarDetailsQuery(
    params.warId,
  );

  const paperId = (war as any)?.questionPaperId?._id;

  const {
    data: paper,
    isLoading: isPaperLoading,
    isError,
  } = useGetSingleQuestionPaperQuery(paperId as string, {
    skip: !paperId,
  });

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [warriorsProgress, setWarriorsProgress] = useState<Record<string, any>>(
    {},
  );
  const [viewingExplanations, setViewingExplanations] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const questions = useMemo(() => {
    return Array.isArray(paper) ? paper : paper?.questionIds || [];
  }, [paper]);

  const stats = useMemo(() => {
    const total = questions.length;
    const answeredIndices = Object.keys(answers).map(Number);
    const correctItems = answeredIndices.filter(
      (idx) => answers[idx] === questions[idx].correctIndex,
    ).length;
    const wrongItems = answeredIndices.length - correctItems;
    const left = total - answeredIndices.length;
    const accuracy =
      answeredIndices.length > 0
        ? Math.round((correctItems / answeredIndices.length) * 100)
        : 0;

    return {
      correct: correctItems,
      wrong: wrongItems,
      left,
      accuracy,
      totalAnswered: answeredIndices.length,
    };
  }, [answers, questions]);

  useEffect(() => {
    if (me?._id && params.warId) {
      socket.emit("join_room", params.warId);

      return () => {
        // Maybe leave room?
      };
    }
  }, [me?._id, params.warId]);

  useEffect(() => {
    if (me?._id && params.warId) {
      socket.emit("submit_answer", {
        battleRoomId: params.warId,
        userId: me._id,
        progress: stats,
        userName: me.name,
      });
    }
  }, [stats, me?._id, params.warId, me?.name]);

  useEffect(() => {
    const handleProgress = (data: any) => {
      if (data.userId !== me?._id) {
        setWarriorsProgress((prev) => {
          // Only update if the progress has actually changed to prevent excessive re-renders
          const current = prev[data.userId];
          if (
            current &&
            current.correct === data.progress.correct &&
            current.accuracy === data.progress.accuracy &&
            current.totalAnswered === data.progress.totalAnswered
          ) {
            return prev;
          }
          return {
            ...prev,
            [data.userId]: { ...data.progress, userName: data.userName },
          };
        });
      }
    };

    socket.on("opponent_progress", handleProgress);

    return () => {
      socket.off("opponent_progress", handleProgress);
    };
  }, [me?._id]);

  const leaderboardData = useMemo(() => {
    const allPlayers = [
      {
        userId: me?._id,
        userName: me?.name,
        ...stats,
        isMe: true,
      },
      ...Object.entries(warriorsProgress).map(
        ([userId, data]: [string, any]) => ({
          userId,
          ...data,
          isMe: false,
        }),
      ),
    ];

    // Sort by correct answers, then by accuracy as a tie-breaker
    return allPlayers.sort((a, b) => {
      if (b.correct !== a.correct) return b.correct - a.correct;
      return b.accuracy - a.accuracy;
    });
  }, [stats, warriorsProgress, me]);

  const top10 = leaderboardData.slice(0, 10);
  const myRank = leaderboardData.findIndex((p) => p.isMe) + 1;
  const isMeInTop10 = myRank <= 10;

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const isDone = stats.left === 0;
  // In a war, we might not wait for everyone to finish to show results,
  // but for now let's keep it simple.

  const allWarriors = Object.values(warriorsProgress);
  const bestOpponent = allWarriors.reduce((best: any, current: any) => {
    if (!best || current.correct > best.correct) return current;
    return best;
  }, null);

  if (isWarLoading || isPaperLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
          <p className="text-blue-600 font-black uppercase tracking-widest animate-pulse">
            Loading War Zone...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 bg-slate-50/30">
      <header className="sticky w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                {(war as any)?.questionPaperId?.examName}
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  WAR ZONE • {Object.keys(warriorsProgress).length + 1} ACTIVE
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Trophy
                className={`w-5 h-5 ${showLeaderboard ? "text-amber-500 fill-amber-500" : ""}`}
              />
            </button>
            <div className="bg-white rounded-2xl p-1.5 px-4 border border-slate-200 shadow-sm flex items-center gap-6">
              <CompactStat
                icon={CheckCircle2}
                value={stats.correct}
                color="text-emerald-500"
              />
              <CompactStat
                icon={XCircle}
                value={stats.wrong}
                color="text-rose-500"
              />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Left
                </span>
                <span className="text-sm font-black text-slate-600">
                  {stats.left}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 py-8">
        <main className="space-y-8">
          {questions.map((q: any, qIndex: number) => (
            <motion.div
              key={q._id || qIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white"
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-black">
                  {qIndex + 1}
                </span>
                <h2 className="text-md md:text-2xl font-bold text-slate-800 leading-[1.7] pt-1">
                  {q.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option: string, optIndex: number) => {
                  const isSelected = answers[qIndex] === optIndex;
                  const isCorrect = q.correctIndex === optIndex;
                  const hasAnswered = answers[qIndex] !== undefined;

                  return (
                    <button
                      key={optIndex}
                      disabled={hasAnswered}
                      onClick={() => handleOptionSelect(qIndex, optIndex)}
                      className={`
                      group relative w-full p-4 rounded-2xl text-left border-2 transition-all duration-300
                      ${
                        !hasAnswered
                          ? "border-slate-100 bg-slate-50/50 hover:border-blue-500 hover:bg-white hover:shadow-md"
                          : isCorrect
                            ? "border-emerald-500 bg-emerald-50/50"
                            : isSelected
                              ? "border-rose-500 bg-rose-50/50"
                              : "border-slate-50 bg-slate-50/30 opacity-60"
                      }
                    `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${
                              !hasAnswered
                                ? "bg-white border-slate-200"
                                : isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : isSelected
                                    ? "bg-rose-500 text-white"
                                    : "bg-slate-100"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="font-bold">{option}</span>
                        </div>
                        {hasAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </main>

        <AnimatePresence>
          {showLeaderboard && (
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed inset-y-0 right-0 z-[60] w-[300px] bg-white border-l shadow-2xl p-4 lg:hidden"
            >
              <button
                onClick={() => setShowLeaderboard(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100"
              >
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>

              <div className="space-y-6 mt-12">
                <LeaderboardContent
                  top10={top10}
                  leaderboardData={leaderboardData}
                  isMeInTop10={isMeInTop10}
                  myRank={myRank}
                  stats={stats}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Desktop Leaderboard Always Visible */}
        <aside className="hidden lg:block h-fit sticky top-24 space-y-6">
          <LeaderboardContent
            top10={top10}
            leaderboardData={leaderboardData}
            isMeInTop10={isMeInTop10}
            myRank={myRank}
            stats={stats}
          />
        </aside>

        {showLeaderboard && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden"
            onClick={() => setShowLeaderboard(false)}
          />
        )}
      </div>

      {isDone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              WAR FINISHED!
            </h2>
            <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs">
              Exams are better together.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <div className="text-4xl font-black text-blue-600 mb-1">
                  {stats.correct}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase">
                  Your Score
                </div>
              </div>
              {bestOpponent && (
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                  <div className="text-4xl font-black text-rose-500 mb-1">
                    {bestOpponent.correct}
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase">
                    Top Warrior
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/25 transition-all active:scale-95"
            >
              Return Home
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function LeaderboardContent({
  top10,
  leaderboardData,
  isMeInTop10,
  myRank,
  stats,
}: any) {
  return (
    <>
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Top 10 Warriors
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            LIVE
          </span>
        </div>
        <div className="p-2 space-y-1">
          {top10.map((player: any, index: number) => (
            <motion.div
              key={player.userId}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                player.isMe
                  ? "bg-indigo-50 border border-indigo-100 shadow-sm"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    index === 0
                      ? "bg-amber-100 text-amber-600"
                      : index === 1
                        ? "bg-slate-200 text-slate-600"
                        : index === 2
                          ? "bg-orange-100 text-orange-600"
                          : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-bold truncate max-w-[100px] ${player.isMe ? "text-indigo-600" : "text-slate-700"}`}
                  >
                    {player.userName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {player.accuracy}% Acc
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-black ${player.isMe ? "text-indigo-600" : "text-slate-700"}`}
                >
                  {player.correct}
                </span>
                <p className="text-[8px] font-bold text-slate-400 uppercase">
                  Score
                </p>
              </div>
            </motion.div>
          ))}

          {leaderboardData.length === 0 && (
            <div className="p-8 text-center text-slate-300">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Waiting for warriors...
              </p>
            </div>
          )}
        </div>

        {!isMeInTop10 && (
          <div className="p-4 bg-indigo-600 mt-2 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">
                #{myRank}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Your Rank</span>
                <span className="text-[10px] font-bold opacity-70">
                  {stats.accuracy}% Accuracy
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black">{stats.correct}</span>
              <p className="text-[8px] font-bold opacity-70 uppercase">Score</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
          <Shield className="w-16 h-16" />
        </div>
        <h4 className="font-black text-lg leading-tight mb-2 uppercase italic">
          War zone tips
        </h4>
        <p className="text-indigo-100 text-xs font-medium leading-relaxed">
          Speed is important, but accuracy wins wars. Every mistake sets you
          back!
        </p>
      </div>
    </>
  );
}
