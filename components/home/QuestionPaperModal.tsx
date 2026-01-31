"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Loader2, Trophy, Zap } from "lucide-react";
import { useGetAllQuestionPapersQuery } from "@/redux/features/questionPaper/questionPaper.api";

export default function QuestionPaperModal({
  isOpen,
  onClose,
  onSelect,
  handleUpdateArena,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (paper: any) => void;
  handleUpdateArena: (paper: any) => void;
}) {
  const { data: papers, isLoading } = useGetAllQuestionPapersQuery(undefined, {
    skip: !isOpen,
  });

  if (papers) {
    onSelect(papers[0]);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="modal-root"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[350px] bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-900 uppercase italic tracking-tighter">
                    Select Arena
                  </h2>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                    Ready for competitive battle
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-zinc-50 rounded-xl transition-all text-zinc-400 hover:text-zinc-900 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[380px] space-y-2.5 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-[8px]">
                    Updating Arenas...
                  </p>
                </div>
              ) : papers?.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-10 h-10 text-zinc-100 mx-auto mb-3" />
                  <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
                    No arenas found
                  </p>
                </div>
              ) : (
                papers?.map((paper: any, index: number) => (
                  <motion.button
                    key={paper._id || index}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelect(paper);
                      handleUpdateArena(paper);
                      onClose();
                    }}
                    className="group relative w-full rounded-2xl p-4 transition-all bg-zinc-50 hover:bg-white border border-transparent hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 text-left flex items-center gap-4"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <BookOpen className="w-5 h-5 text-white" />
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-zinc-800 italic uppercase tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                        {paper.examName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-[8px] font-bold uppercase tracking-widest">
                        <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/50 flex items-center gap-1">
                          <Trophy className="w-2.5 h-2.5" />{" "}
                          {paper.questionIds?.length || 0} Qs
                        </span>
                        <span className="text-zinc-400">Competitive</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 text-center">
              <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
                Balanced Arena Environment
              </p>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </AnimatePresence>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
