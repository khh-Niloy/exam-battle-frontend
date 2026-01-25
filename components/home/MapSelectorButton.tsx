"use client";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Trophy } from "lucide-react";

interface MapSelectorButtonProps {
  selectedPaper: any | null;
  onClick: () => void;
}

import { useGetAllQuestionPapersQuery } from "@/redux/features/questionPaper/questionPaper.api";

export default function MapSelectorButton({
  selectedPaper,
  onClick,
}: MapSelectorButtonProps) {
  const { data: papers, isLoading } = useGetAllQuestionPapersQuery(undefined);
  selectedPaper = papers?.[0];

  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative w-full h-[100px] bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-zinc-100 flex items-stretch transition-all hover:shadow-[0_20px_40px_-10px_rgba(64,136,253,0.15)] hover:border-blue-100"
    >
      {/* Map Thumbnail Part */}

      {/* Info Part */}
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

      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </motion.button>
  );
}
