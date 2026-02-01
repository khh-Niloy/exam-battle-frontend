"use client";
import { motion } from "framer-motion";
import { Trophy, Home, BookOpen, Crown, Frown } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface BattleResultModalProps {
    myScore: number;
    opponentScore: number;
    myAccuracy: number;
    opponentAccuracy: number;
    winner: "me" | "opponent" | "draw";
    onShowExplanation: () => void;
    onBackToLobby: () => void;
}

export default function BattleResultModal({
    myScore,
    opponentScore,
    myAccuracy,
    opponentAccuracy,
    winner,
    onShowExplanation,
    onBackToLobby,
}: BattleResultModalProps) {
    useEffect(() => {
        if (winner === "me") {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) =>
                Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [winner]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center overflow-hidden"
            >
                <div className="relative z-10">
                    {/* Header Icon */}
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-50 mb-8 border border-blue-100 shadow-inner">
                        {winner === "me" ? (
                            <Crown className="w-12 h-12 text-yellow-500 fill-yellow-500 animate-bounce" />
                        ) : winner === "opponent" ? (
                            <Frown className="w-12 h-12 text-slate-400" />
                        ) : (
                            <Trophy className="w-12 h-12 text-blue-500" />
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic mb-2">
                        {winner === "me"
                            ? "Victory!"
                            : winner === "opponent"
                                ? "Defeat"
                                : "Draw!"}
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">
                        {winner === "me"
                            ? "You crushed it!"
                            : winner === "opponent"
                                ? "Better luck next time!"
                                : "What a close match!"}
                    </p>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className={`p-6 rounded-[2rem] border ${winner === "me" ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-100"}`}>
                            <div className="text-5xl font-black text-blue-600 mb-1">
                                {myScore}
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                Your Score
                            </div>
                            <div className="mt-2 text-xs font-bold text-blue-400">
                                {myAccuracy}% Acc
                            </div>
                        </div>

                        <div className={`p-6 rounded-[2rem] border ${winner === "opponent" ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-100"}`}>
                            <div className="text-5xl font-black text-rose-500 mb-1">
                                {opponentScore}
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                Opponent
                            </div>
                            <div className="mt-2 text-xs font-bold text-rose-400">
                                {opponentAccuracy}% Acc
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onShowExplanation}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                            <BookOpen className="w-5 h-5" />
                            Show Explanations
                        </button>

                        <button
                            onClick={onBackToLobby}
                            className="w-full py-4 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Home className="w-5 h-5" />
                            Back to Lobby
                        </button>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent -z-0" />
            </motion.div>
        </div>
    );
}
