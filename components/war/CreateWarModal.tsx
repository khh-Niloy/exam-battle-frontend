"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Calendar, FileText, Loader2 } from "lucide-react";
import { useCreateWarMutation } from "@/redux/features/war/war.api";
import { useGetAllQuestionPapersQuery } from "@/redux/features/questionPaper/questionPaper.api";

interface CreateWarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (warId: string) => void;
}

export default function CreateWarModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateWarModalProps) {
  const [activeTab, setActiveTab] = useState<"existing" | "coaching">(
    "existing",
  );
  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [scheduledTime, setScheduledTime] = useState("");

  const { data: questionPapersData, isLoading: papersLoading } =
    useGetAllQuestionPapersQuery(undefined);
  const [createWar, { isLoading: creating }] = useCreateWarMutation();

  // Ensure we have an array of papers
  const questionPapers = Array.isArray(questionPapersData)
    ? questionPapersData
    : (questionPapersData as any)?.data || [];

  // Filter papers by creator role
  const existingPapers = questionPapers.filter((paper: any) => {
    // If no creatorId, assume it's an existing/user paper
    if (!paper.creatorId) return true;

    // If creatorId is a string (not populated), we can't check role, so assume existing
    if (typeof paper.creatorId === "string") return true;

    const role = paper.creatorId?.role;
    return role !== "COACHING" && role !== "SUPER_ADMIN";
  });

  const coachingPapers = questionPapers.filter((paper: any) => {
    if (!paper.creatorId || typeof paper.creatorId === "string") return false;

    const role = paper.creatorId?.role;
    return role === "COACHING" || role === "SUPER_ADMIN";
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      questionPaperId: selectedPaperId,
      maxPlayers,
      scheduledStartTime: new Date(scheduledTime).toISOString(),
    };
    console.log("Creating war with payload:", payload);

    try {
      const result = await createWar(payload).unwrap();

      if (onSuccess) {
        onSuccess(result.warId);
      }
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Create war failed:", error);
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        const errorMessages = error.data.errors
          .map((err: any) => `${err.path.replace("body.", "")}: ${err.message}`)
          .join("\n");
        alert(`Validation Error:\n${errorMessages}`);
      } else {
        alert(error?.data?.message || "Failed to create war");
      }
    }
  };

  const resetForm = () => {
    setSelectedPaperId("");
    setMaxPlayers(10);
    setScheduledTime("");
    setActiveTab("existing");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get minimum datetime (current time + 5 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  const displayPapers =
    activeTab === "existing" ? existingPapers : coachingPapers;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Create Exam War
                  </h2>
                  <p className="text-blue-100 text-sm font-medium mt-1">
                    Set up a competitive battle for your students
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <button
                onClick={() => setActiveTab("existing")}
                className={`flex-1 py-4 px-6 font-bold text-sm transition-all relative ${
                  activeTab === "existing"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Existing Papers
                {activeTab === "existing" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("coaching")}
                className={`flex-1 py-4 px-6 font-bold text-sm transition-all relative ${
                  activeTab === "coaching"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Coaching-Created Papers
                {activeTab === "coaching" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Question Paper Selection */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                    Select Question Paper
                  </label>
                  {papersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : displayPapers.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                      No papers available in this category
                    </div>
                  ) : (
                    <div className="grid gap-3 max-h-64 overflow-y-auto pr-2">
                      {displayPapers.map((paper: any) => (
                        <motion.button
                          key={paper._id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPaperId(paper._id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            selectedPaperId === paper._id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          <div className="font-bold text-zinc-800 dark:text-white">
                            {paper.examName}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {paper.questionIds?.length || 0} questions
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Max Players */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                    <Users className="w-4 h-4 inline mr-2" />
                    Maximum Players
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="100"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="w-16 text-center">
                      <span className="text-2xl font-black text-blue-600">
                        {maxPlayers}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 mt-2">
                    <span>Min: 2</span>
                    <span>Max: 100</span>
                  </div>
                </div>

                {/* Scheduled Start Time */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Scheduled Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    min={getMinDateTime()}
                    required
                    className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white font-medium focus:border-blue-600 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    Must be at least 5 minutes in the future
                  </p>
                </div>
              </div>

              {/* Actions - Fixed at bottom */}
              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3 bg-zinc-50 dark:bg-zinc-900/50">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !selectedPaperId || !scheduledTime}
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create War"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
