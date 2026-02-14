import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  User,
  Sword,
  Shield,
  Zap,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { socket } from "@/lib/socket";
import ChatSidebar from "../shared/ChatSidebar";

export interface LobbyPlayer {
  _id: string;
  name: string;
  image?: string;
  studentInfo?: {
    class: string;
    group: string;
    instituteName: string;
  };
}

interface BattleLobbyProps {
  player1: LobbyPlayer;
  player2: LobbyPlayer;
  battleRoomId: string;
  selectedPaper: any | null;
  onLeave: () => void;
  onStartBattle?: () => void;
  onSelectArena?: () => void;
}

import { useGetMeQuery } from "@/redux/features/auth/auth.api";

export default function BattleLobby({
  player1,
  player2,
  battleRoomId,
  selectedPaper,
  onStartBattle,
  onLeave,
  onSelectArena,
}: BattleLobbyProps) {
  const { data: me } = useGetMeQuery(undefined);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    socket.on("opponent_ready", () => {
      setIsOpponentReady(true);
    });

    socket.on("opponent_unready", () => {
      setIsOpponentReady(false);
    });

    socket.on("battle_start", (data: { battleRoomId: string }) => {
      // Mark players as in battle
      if (me?._id) {
        socket.emit("mark_in_battle", {
          player1: player1._id,
          player2: player2._id,
        });
      }

      // Redirect immediately
      router.push(`/battle/${battleRoomId}?paperId=${selectedPaper?._id}`);
    });

    return () => {
      socket.off("opponent_ready");
      socket.off("opponent_unready");
      socket.off("battle_start");
    };
  }, [me, player1._id, player2._id, battleRoomId, router, selectedPaper?._id]);

  const handleReady = () => {
    if (!me?._id) return;

    if (isReady) {
      setIsReady(false);
      socket.emit("player_unready", { battleRoomId, userId: me._id });
    } else {
      setIsReady(true);
      socket.emit("player_ready", { battleRoomId, userId: me._id });
    }
  };

  const leaveTeam = () => {
    const opponentId = me?._id === player1._id ? player2._id : player1._id;
    socket.emit("leave_lobby", {
      opponentId,
      battleRoomId,
      selfId: me?._id,
    });
    onLeave();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          onSelectArena?.();
        }}
        className="cursor-pointer mb-6 sm:mb-12 text-center group relative w-full h-[100px] bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-zinc-100 flex items-stretch transition-all hover:shadow-[0_20px_40px_-10px_rgba(64,136,253,0.15)] hover:border-blue-100"
      >
        <div className="relative flex-1 px-5 flex flex-col justify-center gap-0.5 text-center">
          <h2 className="text-lg font-black text-zinc-900 uppercase italic tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
            {selectedPaper?.examName || "Select Arena"}
          </h2>

          <p className="text-zinc-400 font-bold text-[9px] uppercase tracking-widest mt-1">
            {selectedPaper
              ? `${selectedPaper.questionIds?.length || 0} Quests Ready`
              : "Tap to change battlefield"}
          </p>
        </div>
      </motion.div>

      {/* Players Container - Side-by-side on mobile */}
      <div className="w-full flex md:grid md:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-8 items-center relative">
        {/* Player 1 Card */}
        <div className="flex-1 min-w-0">
          <PlayerCard
            player={player1}
            side="left"
            color="blue"
            isReady={me?._id === player1._id ? isReady : isOpponentReady}
          />
        </div>

        {/* VS Badge - Scaled for mobile */}
        <div className="relative md:static flex-shrink-0 z-20">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 0.3,
            }}
            className="w-10 h-10 sm:w-20 sm:h-20 bg-[#4088FD] rounded-xl sm:rounded-3xl flex items-center justify-center border-2 sm:border-8 border-[#F8FAFC] dark:border-black shadow-lg sm:shadow-2xl shadow-blue-500/40"
          >
            <span className="text-xs sm:text-2xl font-black text-white italic">
              VS
            </span>
          </motion.div>
        </div>

        {/* Player 2 Card */}
        <div className="flex-1 min-w-0">
          <PlayerCard
            player={player2}
            side="right"
            color="red"
            isReady={me?._id === player2._id ? isReady : isOpponentReady}
          />
        </div>
      </div>

      {/* Action Footer - Tightened */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 sm:mt-16 flex flex-col items-center gap-4 sm:gap-6 w-full"
      >
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95 border border-zinc-200 dark:border-zinc-700"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat with opponent
          </button>

          <div className="flex items-center gap-2 sm:gap-3 text-zinc-400 font-bold uppercase tracking-widest text-[8px] sm:text-xs">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500" />
            {isReady
              ? "Waiting for opponent..."
              : "Real-time Connection Established"}
          </div>
        </div>

        <ChatSidebar
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          roomId={battleRoomId}
          currentUserId={me?._id || ""}
          currentUserName={me?.name || "Player"}
          currentUserImage={me?.image}
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleReady}
            className={`group relative w-full sm:w-auto ${isReady ? "bg-orange-500" : "bg-[#4088FD]"} text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl sm:shadow-2xl shadow-blue-500/25`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">
              {isReady ? "Cancel Ready" : "Ready"}
            </span>
          </button>

          <button
            onClick={leaveTeam}
            className="group relative w-full sm:w-auto bg-red-400 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl sm:shadow-2xl shadow-red-500/25"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">Leave</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function PlayerCard({
  player,
  side,
  color,
  isReady,
}: {
  player: LobbyPlayer;
  side: "left" | "right";
  color: "blue" | "red";
  isReady?: boolean;
}) {
  const isBlue = color === "blue";

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      className={`relative group w-full ${side === "right" ? "text-right" : "text-left"}`}
    >
      {/* Background Accent */}
      <div
        className={`absolute inset-0 bg-${isBlue ? "blue" : "red"}-500/5 blur-[40px] sm:blur-[80px] rounded-full translate-y-5 sm:translate-y-10`}
      />

      {/* Avatar Section */}
      <div
        className={`relative mb-2 sm:mb-8 flex flex-col ${side === "right" ? "items-end" : "items-start"}`}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className={`relative w-full aspect-[3.5/4] sm:w-48 sm:h-64 rounded-2xl sm:rounded-[3rem] overflow-hidden border-2 sm:border-8 ${isReady ? "border-green-500 ring-4 ring-green-500/20" : isBlue ? "border-blue-500/20" : "border-red-500/20"} dark:border-zinc-800 shadow-xl sm:shadow-2xl transition-all duration-300`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent to-${isBlue ? "blue" : "red"}-500/20 z-10`}
          />
          {player?.image ? (
            <Image
              src={player?.image}
              alt={player?.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-8 h-8 sm:w-20 sm:h-20 text-zinc-300" />
            </div>
          )}

          {/* Status Badge - Hidden on very small screens or made smaller */}
          {isReady && (
            <div
              className={`absolute bottom-2 sm:bottom-6 ${side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6"} z-20`}
            >
              <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-white backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg border border-white/20">
                <span className="text-[6px] sm:text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                  <CheckCircle2 className="w-2 h-2 sm:w-3 sm:h-3" />
                  Ready
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info - Tightened for mobile */}
        <div
          className={`mt-2 sm:mt-6 w-full ${side === "right" ? "text-right" : "text-left"}`}
        >
          <h2 className="text-xs sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter truncate">
            {player?.name}
          </h2>
          <div
            className={`flex items-center gap-1 sm:gap-2 ${side === "right" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${isBlue ? "bg-blue-500" : "bg-red-500"} animate-pulse`}
            />
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[6px] sm:text-[10px] truncate max-w-[80%]">
              {player?.studentInfo?.class
                ? `Cl ${player?.studentInfo?.class} • ${player?.studentInfo?.group}`
                : "Challenger"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats - Hidden on tiny screens, shown on sm+ */}
      <div
        className={`hidden sm:grid grid-cols-3 gap-2 sm:gap-4 ${side === "right" ? "justify-end" : ""}`}
      >
        <StatIcon
          Icon={Shield}
          color={isBlue ? "text-blue-500" : "text-red-500"}
        />
        <StatIcon
          Icon={Sword}
          color={isBlue ? "text-blue-500" : "text-red-500"}
        />
        <StatIcon
          Icon={User}
          color={isBlue ? "text-blue-500" : "text-red-500"}
        />
      </div>
    </motion.div>
  );
}

export function StatIcon({ Icon, color }: { Icon: any; color: string }) {
  return (
    <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
      <Icon className={`w-3 h-3 sm:w-5 sm:h-5 ${color}`} />
    </div>
  );
}
