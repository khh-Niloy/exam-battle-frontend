"use client";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { Crown, Skull, Calendar, ArrowRight } from "lucide-react";
// We need to fetch history from the new API.
// Since we haven't created a 'history' slice yet, we can simple fetch it for now using RTK Query or fetch.
// But we should probably add it to the API definition properly.

// Temporary fetch implementation inside component for speed, 
// OR better: Create correct API slice extension immediately.
// Let's modify the auth.api or create a battle.api first?
// Let's create `battle.api.ts` first, then use it here.
import { useGetBattleHistoryQuery } from "@/redux/features/battle/battle.api";

export default function HistoryPage() {
    // Assuming we created this hook
    const { data: history, isLoading } = useGetBattleHistoryQuery(undefined);
    const { data: me } = useGetMeQuery(undefined);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-black text-slate-900 mb-8 px-2 uppercase tracking-tight italic">
                    Battle History
                </h1>

                <div className="space-y-4">
                    {history?.data?.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No battles yet</p>
                        </div>
                    ) : (
                        history?.data?.map((battle: any) => {
                            const myParticipant = battle.participants.find((p: any) => p.userId._id === me?._id);
                            // Opponent is the other one
                            const opponent = battle.participants.find((p: any) => p.userId._id !== me?._id);

                            const isWin = myParticipant?.result === "win";
                            const isDraw = myParticipant?.result === "draw";

                            return (
                                <div key={battle._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${isWin ? "bg-emerald-500" : isDraw ? "bg-slate-300" : "bg-rose-500"}`} />

                                    <div className="flex items-center justify-between pl-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isWin ? "bg-emerald-50 text-emerald-600" : isDraw ? "bg-slate-100 text-slate-500" : "bg-rose-50 text-rose-500"}`}>
                                                    {isWin ? "Victory" : isDraw ? "Draw" : "Defeat"}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase">
                                                    {new Date(battle.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-sm">
                                                vs {opponent?.userId?.name || "Unknown"}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                                                {battle.questionPaperId?.examName}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-2xl font-black text-slate-800 italic">
                                                {myParticipant?.score}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
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
        </div>
    );
}
