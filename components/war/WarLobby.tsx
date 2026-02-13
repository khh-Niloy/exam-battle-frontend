"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Clock,
  Play,
  X,
  Copy,
  Check,
  Loader2,
  Crown,
  User,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import {
  useGetWarDetailsQuery,
  useStartWarMutation,
  useRemoveParticipantMutation,
  useCancelWarMutation,
} from "@/redux/features/war/war.api";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { WarStatus } from "@/redux/features/war/war.types";

interface WarLobbyProps {
  warId: string;
  onClose: () => void;
}

export default function WarLobby({ warId, onClose }: WarLobbyProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { data: userData } = useGetMeQuery(undefined);
  const {
    data: warResponse,
    isLoading,
    refetch,
  } = useGetWarDetailsQuery(warId);
  const [startWar, { isLoading: starting }] = useStartWarMutation();
  const [removeParticipant, { isLoading: removing }] =
    useRemoveParticipantMutation();
  const [cancelWar] = useCancelWarMutation();

  const war = warResponse as any;
  const currentUserId = userData?._id;
  const isCreator = war?.creatorId?._id === currentUserId;

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Redirect when status changes
  useEffect(() => {
    if (war?.status === WarStatus.STARTED) {
      router.push(`/war/${warId}/battle`);
    } else if (war?.status === WarStatus.CANCELLED) {
      alert("This war has been cancelled by the creator.");
      onClose();
    }
  }, [war?.status, warId, router, onClose]);

  const handleCopyWarId = () => {
    navigator.clipboard.writeText(warId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartWar = async () => {
    if (!isCreator) return;

    try {
      await startWar(warId).unwrap();
      // Will auto-redirect via useEffect when status changes
    } catch (error: any) {
      alert(error?.data?.message || "Failed to start war");
    }
  };

  const handleRemoveParticipant = async (userId: string, name: string) => {
    if (!isCreator) return;
    if (!confirm(`Are you sure you want to remove ${name} from the war?`))
      return;

    try {
      await removeParticipant({ warId, userId }).unwrap();
    } catch (error: any) {
      alert(error?.data?.message || "Failed to remove participant");
    }
  };

  const handleCancelWar = async () => {
    if (!isCreator) return;
    if (
      !confirm(
        "Are you sure you want to close this war and remove all players?",
      )
    )
      return;

    try {
      await cancelWar(warId).unwrap();
      onClose(); // Go back to dashboard after cancelling
    } catch (error: any) {
      alert(error?.data?.message || "Failed to cancel war");
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

  const getTimeUntilStart = () => {
    if (!war?.scheduledStartTime) return "";
    const now = new Date();
    const scheduled = new Date(war.scheduledStartTime);
    const diff = scheduled.getTime() - now.getTime();

    if (diff < 0) return "Scheduled time passed";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days}d ${hours % 24}h`;
    if (hours > 0) return `in ${hours}h ${minutes % 60}m`;
    return `in ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!war) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-zinc-500">War not found</p>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const participantCount = war.participants.length;
  const spotsLeft = war.maxPlayers - participantCount;
  const canStart = isCreator && participantCount >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-8 pb-32 sm:pb-40">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-zinc-800 dark:text-white">
                  {war.questionPaperId.examName}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    war.status === WarStatus.WAITING
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
                      : war.status === WarStatus.STARTED
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {war.status}
                </span>
              </div>
              <p className="text-sm text-zinc-500">
                Created by <strong>{war.creatorId.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isCreator && war.status === WarStatus.WAITING && (
                <button
                  onClick={handleCancelWar}
                  className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 text-sm font-black uppercase tracking-wider border border-red-100 dark:border-red-900/50"
                >
                  <Trash2 className="w-4 h-4" />
                  Close War
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* War ID */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900">
            <div className="flex-1">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                WAR ID
              </p>
              <p className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400 tracking-widest">
                {warId}
              </p>
            </div>
            <button
              onClick={handleCopyWarId}
              className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-bold">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold">Participants</span>
              </div>
              <p className="text-2xl font-black text-zinc-800 dark:text-white">
                {participantCount}/{war.maxPlayers}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold">Scheduled</span>
              </div>
              <p className="text-lg font-black text-zinc-800 dark:text-white">
                {formatDateTime(war.scheduledStartTime)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {getTimeUntilStart()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Participants List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6"
        >
          <h2 className="text-xl font-black text-zinc-800 dark:text-white mb-4">
            Warriors ({participantCount})
          </h2>
          <div className="grid gap-3">
            {war.participants.map((participant: any, index: number) => (
              <motion.div
                key={participant.userId._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
                  {participant.userId.image ? (
                    <Image
                      src={participant.userId.image}
                      alt={participant.userId.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {participant.userId._id === war.creatorId._id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 dark:text-white">
                    {participant.userId.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Joined {formatDateTime(participant.joinedAt)}
                  </p>
                </div>

                {/* Remove Participant Button (Visible to Creator only) */}
                {isCreator &&
                  participant.userId._id.toString() !==
                    currentUserId?.toString() && (
                    <button
                      onClick={() =>
                        handleRemoveParticipant(
                          participant.userId._id,
                          participant.userId.name,
                        )
                      }
                      disabled={removing}
                      className="p-3 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all active:scale-95 disabled:opacity-50"
                      title="Remove Participant"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Button (Creator Only) */}
        {isCreator && war.status === WarStatus.WAITING && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handleStartWar}
              disabled={!canStart || starting}
              className="w-full py-4 px-6 rounded-2xl font-black text-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-green-500/25 flex items-center justify-center gap-3"
            >
              {starting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting War...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start War Now
                </>
              )}
            </button>
            {!canStart && participantCount < 2 && (
              <p className="text-center text-sm text-zinc-500 mt-3">
                Need at least 2 participants to start
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
