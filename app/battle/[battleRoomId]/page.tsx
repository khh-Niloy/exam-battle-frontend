"use client";
import { useSearchParams } from "next/navigation";
import { useGetSingleQuestionPaperQuery } from "@/redux/features/questionPaper/questionPaper.api";
import { useState, useEffect, use, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Timer,
  Sword,
  Shield,
  Trophy,
  Target,
  Hash,
  Activity,
  Loader2,
  Home,
} from "lucide-react";
import { socket } from "@/lib/socket";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import BattleResultModal from "@/components/battle/BattleResultModal";

function CompactStat({
  value,
  color,
  icon: Icon,
}: {
  value: number;
  color: string;
  icon: any;
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-[32px]">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-sm font-black italic ${color}`}>{value}</span>
    </div>
  );
}

export default function BattlePage({
  params: paramsPromise,
}: {
  params: Promise<{ battleRoomId: string }>;
}) {
  const params = use(paramsPromise);
  const searchParams = useSearchParams();
  const paperId = searchParams ? searchParams.get("paperId") : null;
  const { data: me } = useGetMeQuery(undefined);

  const {
    data: paper,
    isLoading,
    isError,
    error,
  } = useGetSingleQuestionPaperQuery(paperId as string, {
    skip: !paperId,
  });

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [opponentProgress, setOpponentProgress] = useState({
    correct: 0,
    wrong: 0,
    accuracy: 0,
    left: 0,
    totalAnswered: 0,
  });

  const questions = useMemo(() => {
    return Array.isArray(paper) ? paper : paper?.questionIds || [];
  }, [paper]);

  // Sync initial 'left' for opponent once questions are loaded
  useEffect(() => {
    if (
      questions.length > 0 &&
      opponentProgress.totalAnswered === 0 &&
      opponentProgress.left === 0
    ) {
      setOpponentProgress((prev) => ({ ...prev, left: questions.length }));
    }
  }, [questions.length, opponentProgress.totalAnswered, opponentProgress.left]);

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
    if (me?._id && params.battleRoomId) {
      socket.emit("join_battle", {
        battleRoomId: params.battleRoomId,
        userId: me._id,
      });

      return () => {
        socket.emit("leave_battle", {
          userId: me._id,
          battleRoomId: params.battleRoomId,
        });
      };
    }
  }, [me?._id, params.battleRoomId]);

  useEffect(() => {
    if (me?._id && params.battleRoomId) {
      socket.emit("submit_answer", {
        battleRoomId: params.battleRoomId,
        userId: me._id,
        progress: stats,
      });
    }
  }, [stats, me?._id, params.battleRoomId]);

  useEffect(() => {
    const handleOpponentProgress = (data: any) => {
      console.log(">>>> BATTLE PAGE: Received Opponent Progress:", data);

      // If we're testing with the same account in two windows,
      // we can check if it's a different session or just allow it for now.
      // In production, users will have different IDs.
      if (data.userId !== me?._id) {
        setOpponentProgress(data.progress);
      } else {
        // Optional: for local testing with same account,
        // you might want to see updates from the other window.
        // Uncomment the line below if you are testing alone.
        // setOpponentProgress(data.progress);
      }
    };

    socket.on("opponent_progress", handleOpponentProgress);

    return () => {
      socket.off("opponent_progress", handleOpponentProgress);
    };
  }, [me?._id]);

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const [viewingExplanations, setViewingExplanations] = useState(false);

  const isBattleOver = stats.left === 0 && opponentProgress.left === 0;

  const winner = useMemo(() => {
    if (!isBattleOver) return "draw";
    if (stats.correct > opponentProgress.correct) return "me";
    if (stats.correct < opponentProgress.correct) return "opponent";
    return "draw";
  }, [isBattleOver, stats.correct, opponentProgress.correct]);

  // Handle "Show Explanation" button click
  const handleShowExplanation = () => {
    setViewingExplanations(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-600 font-black uppercase tracking-widest animate-pulse">
            Syncing Battlefield...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 font-black text-2xl italic uppercase tracking-widest mb-4">
          Battle Error
        </div>
        <p className="text-zinc-500 text-center">
          {error && "data" in (error as any)
            ? (error as any).data.message
            : "Failed to load the battlefield data."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Premium Sticky Header - Symmetric Compact Style */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-blue-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-4 md:gap-8">
            {/* Player 1 (You) Stats */}
            <div className="flex-1 min-w-[300px] flex items-center justify-start gap-4">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-600 items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Sword className="w-5 h-5" />
              </div>
              <div className="flex-1 bg-white border border-blue-100 rounded-2xl p-2 px-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    You
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {stats.accuracy}% Accuracy
                  </span>
                </div>
                <div className="flex items-center gap-4">
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
                  <CompactStat
                    icon={Hash}
                    value={stats.left}
                    color="text-slate-400"
                  />
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-2">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(stats.totalAnswered / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Divider */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
              </div>
            </div>

            {/* Player 2 (Opponent) Stats */}
            <div className="flex-1 min-w-[300px] flex items-center justify-end gap-4">
              <div className="flex-1 bg-white border border-rose-100 rounded-2xl p-2 px-4 shadow-sm text-right">
                <div className="flex items-center justify-between mb-1 flex-row-reverse">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                    Opponent
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {opponentProgress.accuracy}% Accuracy
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-row-reverse">
                  <CompactStat
                    icon={CheckCircle2}
                    value={opponentProgress.correct}
                    color="text-emerald-500"
                  />
                  <CompactStat
                    icon={XCircle}
                    value={opponentProgress.wrong}
                    color="text-rose-500"
                  />
                  <CompactStat
                    icon={Hash}
                    value={opponentProgress.left}
                    color="text-slate-400"
                  />
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-2 rotate-180">
                    <motion.div
                      className="h-full bg-rose-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(opponentProgress.totalAnswered / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-rose-500 items-center justify-center text-white shadow-lg shadow-rose-500/20">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Questions Feed */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {questions.map((q: any, qIndex: number) => (
          <motion.div
            key={q._id || qIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`bg-white rounded-[2.5rem] border ${answers[qIndex] !== undefined ? "border-blue-100 shadow-sm" : "border-slate-200"} p-6 md:p-10 transition-all duration-500`}
          >
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 italic">
                {qIndex + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight pt-1">
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
                      group relative w-full p-5 rounded-2xl text-left border-2 transition-all duration-300
                      ${!hasAnswered
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
                          className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black italic border
                          ${!hasAnswered
                              ? "bg-white border-slate-200 text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500"
                              : isCorrect
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : isSelected
                                  ? "bg-rose-500 border-rose-400 text-white"
                                  : "bg-slate-100 border-slate-100 text-slate-300"
                            }
                        `}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span
                          className={`font-bold ${hasAnswered && (isCorrect || isSelected) ? "text-slate-900" : "text-slate-600"}`}
                        >
                          {option}
                        </span>
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

            {viewingExplanations && q.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm leading-relaxed text-slate-600 overflow-hidden"
              >
                <span className="block text-xs font-black text-blue-500 uppercase tracking-widest mb-2">
                  Explanation
                </span>
                {q.explanation}
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Start: Updated Result Logic */}

        {/* Waiting Overlay: When I'm done but opponent isn't */}
        {stats.left === 0 && !isBattleOver && !viewingExplanations && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 bg-white rounded-[3rem] border border-blue-100 shadow-2xl text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 text-blue-500 shadow-inner">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">
                You are blazing fast!
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
                Waiting for opponent to finish...
              </p>
            </div>
          </motion.div>
        )}

        {/* Final Modal: When both are done */}
        {isBattleOver && !viewingExplanations && (
          <BattleResultModal
            myScore={stats.correct}
            opponentScore={opponentProgress.correct}
            myAccuracy={stats.accuracy}
            opponentAccuracy={opponentProgress.accuracy}
            winner={winner}
            onShowExplanation={handleShowExplanation}
            onBackToLobby={() => (window.location.href = "/")}
          />
        )}
        {/* Back to Lobby Button (Visible when viewing explanations) */}
        {viewingExplanations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-50 pointer-events-none"
          >
            <button
              onClick={() => (window.location.href = "/")}
              className="pointer-events-auto bg-white text-slate-900 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 border border-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Lobby
            </button>
          </motion.div>
        )}
      </main>


      {/* Visual Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_40%)]" />
    </div>
  );
}
