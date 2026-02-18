"use client";

import { motion } from "framer-motion";
import {
  Sword,
  Plus,
  Users,
  Calendar,
  Trophy,
  Trash2,
  LogOut,
} from "lucide-react";
import {
  useGetMyCreatedWarsQuery,
  useGetMyJoinedWarsQuery,
  useCancelWarMutation,
  useLeaveWarMutation,
} from "@/redux/features/war/war.api";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { WarStatus } from "@/redux/features/war/war.types";

import { Roles } from "@/redux/features/auth/auth.types";

interface WarDashboardProps {
  onCreateWar: () => void;
  onJoinWar: () => void;
  onViewWar: (warId: string) => void;
}

export default function WarDashboard({
  onCreateWar,
  onJoinWar,
  onViewWar,
}: WarDashboardProps) {
  const { data: userData } = useGetMeQuery(undefined);
  const { data: createdWarsData, isLoading: loadingCreated } =
    useGetMyCreatedWarsQuery(undefined, {
      skip:
        userData?.role !== Roles.COACHING &&
        userData?.role !== Roles.SUPER_ADMIN,
    });
  const { data: joinedWarsData, isLoading: loadingJoined } =
    useGetMyJoinedWarsQuery(undefined);

  const [cancelWar, { isLoading: cancelling }] = useCancelWarMutation();
  const [leaveWar, { isLoading: leaving }] = useLeaveWarMutation();

  const isCoaching =
    userData?.role === Roles.COACHING || userData?.role === Roles.SUPER_ADMIN;
  const createdWars = (createdWarsData as any) || [];
  const joinedWars = (joinedWarsData as any) || [];

  const handleCancelWar = async (e: React.MouseEvent, warId: string) => {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to close this war and remove all players?",
      )
    )
      return;

    try {
      await cancelWar(warId).unwrap();
    } catch (error: any) {
      alert(error?.data?.message || "Failed to cancel war");
    }
  };

  const handleLeaveWar = async (e: React.MouseEvent, warId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to leave this war?")) return;

    try {
      await leaveWar(warId).unwrap();
    } catch (error: any) {
      alert(error?.data?.message || "Failed to leave war");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: WarStatus) => {
    switch (status) {
      case WarStatus.WAITING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case WarStatus.STARTED:
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case WarStatus.FINISHED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
      case WarStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-8 pb-32 sm:pb-40">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-zinc-800 dark:text-white mb-2">
          Exam Wars
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          Compete with others in epic knowledge battles
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        {isCoaching && (
          <button
            onClick={onCreateWar}
            className="group relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Plus className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="font-black text-lg">Create War</p>
                <p className="text-sm text-blue-100">Set up a new battle</p>
              </div>
            </div>
          </button>
        )}

        <button
          onClick={onJoinWar}
          className="group relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all"
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sword className="w-7 h-7" />
            </div>
            <div className="text-left">
              <p className="font-black text-lg">Join War</p>
              <p className="text-sm text-emerald-100">Enter with War ID</p>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Created Wars (Coaching Only) */}
      {isCoaching && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-black text-zinc-800 dark:text-white mb-4">
            My Created Wars
          </h2>
          {loadingCreated ? (
            <div className="text-center py-8 text-zinc-500">Loading...</div>
          ) : createdWars.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <Trophy className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No wars created yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {createdWars.map((war: any, index: number) => (
                <motion.div
                  key={war._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onViewWar(war.warId)}
                  className="w-full p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group relative cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-zinc-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {war.questionPaperId.examName}
                      </h3>
                      <p className="text-sm text-zinc-500 font-mono mt-1">
                        ID: {war.warId}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(war.status)}`}
                      >
                        {war.status}
                      </span>
                      {war.status === WarStatus.WAITING && (
                        <button
                          onClick={(e) => handleCancelWar(e, war.warId)}
                          disabled={cancelling}
                          className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5 border border-red-100 dark:border-red-900/50 text-xs font-black uppercase tracking-wider disabled:opacity-50 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Close War
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {war.participants.length}/{war.maxPlayers}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(war.scheduledStartTime)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Joined Wars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-black text-zinc-800 dark:text-white mb-4">
          My Joined Wars
        </h2>
        {loadingJoined ? (
          <div className="text-center py-8 text-zinc-500">Loading...</div>
        ) : joinedWars.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <Sword className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">No wars joined yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {joinedWars.map((war: any, index: number) => (
              <motion.div
                key={war._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onViewWar(war.warId)}
                className="w-full p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-zinc-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {war.questionPaperId.examName}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Created by {war.creatorId.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(war.status)}`}
                    >
                      {war.status}
                    </span>
                    {war.status === WarStatus.WAITING && (
                      <button
                        onClick={(e) => handleLeaveWar(e, war.warId)}
                        disabled={leaving}
                        className="px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1.5 border border-orange-100 dark:border-orange-900/50 text-xs font-black uppercase tracking-wider disabled:opacity-50 shadow-sm"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Leave War
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {war.participants.length}/{war.maxPlayers}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(war.scheduledStartTime)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
