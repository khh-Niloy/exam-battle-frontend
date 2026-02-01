"use client";
const user_image = "https://api.dicebear.com/7.x/avataaars/svg?seed=BattleUser";
import Image from "next/image";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { Swords, Trophy, BookOpen } from "lucide-react";

export default function ProfilePage() {
    const { data: user, isLoading } = useGetMeQuery(undefined);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-6">
            <div className="max-w-md mx-auto space-y-8">
                {/* Profile Header */}
                <div className="text-center">
                    <div className="relative inline-block mb-4">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-blue-100">
                            <Image
                                src={user?.image || user_image}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-1">
                        {user?.name}
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                        {user?.role} • Class {user?.studentInfo?.class}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-sm text-center">
                        <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mb-3 text-blue-600">
                            <Swords className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black text-slate-800">
                            --
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Total Battles
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-emerald-100 shadow-sm text-center">
                        <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center mb-3 text-emerald-600">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black text-slate-800">
                            --
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Victories
                        </div>
                    </div>
                </div>

                {/* Academic Info */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Academic Info</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Institute</span>
                            <span className="text-xs font-bold text-slate-700 text-right">{user?.studentInfo?.instituteName || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Group</span>
                            <span className="text-xs font-bold text-slate-700 text-right">{user?.studentInfo?.group || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-slate-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</span>
                            <span className="text-xs font-bold text-slate-700 text-right">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
