import Image from "next/image";
import { Shield, Sword, User } from "lucide-react";
import { motion } from "framer-motion";
import { LobbyPlayer, StatIcon } from "./BattleLobby";

export default function PlayerCard({
  player,
  side,
  color,
}: {
  player: LobbyPlayer;
  side: "left" | "right";
  color: "blue" | "red";
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
          className={`relative w-full aspect-[3.5/4] sm:w-48 sm:h-64 rounded-2xl sm:rounded-[3rem] overflow-hidden border-2 sm:border-8 ${isBlue ? "border-blue-500/20" : "border-red-500/20"} dark:border-zinc-800 shadow-xl sm:shadow-2xl`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent to-${isBlue ? "blue" : "red"}-500/20 z-10`}
          />
          {player.image ? (
            <Image
              src={player.image}
              alt={player.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-8 h-8 sm:w-20 sm:h-20 text-zinc-300" />
            </div>
          )}

          {/* Status Badge - Hidden on very small screens or made smaller */}
          <div
            className={`absolute bottom-2 sm:bottom-6 ${side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6"} z-20`}
          >
            <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg border border-white/20">
              <span className="text-[6px] sm:text-[10px] font-black uppercase tracking-tighter text-zinc-800 dark:text-white">
                Ready
              </span>
            </div>
          </div>
        </motion.div>

        {/* Info - Tightened for mobile */}
        <div
          className={`mt-2 sm:mt-6 w-full ${side === "right" ? "text-right" : "text-left"}`}
        >
          <h2 className="text-xs sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter truncate">
            {player.name}
          </h2>
          <div
            className={`flex items-center gap-1 sm:gap-2 ${side === "right" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${isBlue ? "bg-blue-500" : "bg-red-500"} animate-pulse`}
            />
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[6px] sm:text-[10px] truncate max-w-[80%]">
              {player.studentInfo?.class
                ? `Cl ${player.studentInfo.class} • ${player.studentInfo.group}`
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
