"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "@/lib/socket";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useGetSingleQuestionPaperQuery } from "@/redux/features/questionPaper/questionPaper.api";

export default function BattlePage() {
    const params = useParams();
    const battleId = params?.battleId as string;

    const [battleData, setBattleData] = useState<any>(null);
    const [isSocketLoading, setIsSocketLoading] = useState(true);

    const paperId = battleData?.selectedPaper?._id;
    console.log("Battle Data State:", battleData);
    console.log("Paper ID for API:", paperId);

    const { data: paperResponse, isLoading: isPaperLoading, error } = useGetSingleQuestionPaperQuery(
        paperId,
        { skip: !paperId }
    );

    console.log("API Response:", paperResponse);
    if (error) console.error("API Error:", error);

    useEffect(() => {
        if (battleId) {
            socket.emit("join_battle", { battleRoomId: battleId });
        }

        socket.on("battle_details", (data: any) => {
            console.log("Battle Details (Socket):", data);
            setBattleData(data);
            setIsSocketLoading(false);
        });

        return () => {
            socket.off("battle_details");
        };
    }, [battleId]);

    const isLoading = isSocketLoading || isPaperLoading;

    const paper = paperResponse?.data;
    const questions = paper?.questionIds || [];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            {paper?.examName || "Battle Arena"}
                        </h1>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            Attempting {questions.length} Questions
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                Opponent
                            </p>
                            <p className="text-sm font-black text-zinc-900 dark:text-white">
                                {/* Logic to show opponent name based on who 'me' is */}
                                {/* userProfile check needed here, but simplifying for now */}
                                Opponent
                            </p>
                        </div>
                    </div>
                </header>

                {/* Questions List */}
                <div className="space-y-6">
                    {questions.map((q: any, index: number) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={q._id || index}
                            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm"
                        >
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-black text-sm flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-gray-100">
                                        {q.questionText}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {q.options?.map((option: string, i: number) => (
                                            <label
                                                key={i}
                                                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-all group"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${q._id}`}
                                                    value={option}
                                                    className="w-4 h-4 text-blue-600 border-zinc-300 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Bar */}
                <div className="sticky bottom-6 flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        Submit Answers
                    </button>
                </div>
            </div>
        </div>
    );
}
