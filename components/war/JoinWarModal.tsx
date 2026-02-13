"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sword, Loader2, AlertCircle } from "lucide-react";
import { useJoinWarMutation } from "@/redux/features/war/war.api";

interface JoinWarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (warId: string) => void;
}

export default function JoinWarModal({
  isOpen,
  onClose,
  onSuccess,
}: JoinWarModalProps) {
  const [warId, setWarId] = useState("");
  const [error, setError] = useState("");

  const [joinWar, { isLoading }] = useJoinWarMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate War ID format
    const warIdPattern = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
    if (!warIdPattern.test(warId)) {
      setError("Invalid War ID format. Must be 8 characters.");
      return;
    }

    try {
      const result = await joinWar({ warId }).unwrap();
      if (onSuccess) {
        onSuccess(result.warId);
      }
      handleClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to join war");
    }
  };

  const handleClose = () => {
    setWarId("");
    setError("");
    onClose();
  };

  const handleWarIdChange = (value: string) => {
    // Convert to uppercase and filter valid characters
    const cleaned = value
      .toUpperCase()
      .replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZ]/g, "")
      .slice(0, 8);
    setWarId(cleaned);
    setError("");
  };

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
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sword className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Join War</h2>
                    <p className="text-blue-100 text-sm font-medium">
                      Enter the 8-character War ID
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* War ID Input */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                  War ID
                </label>
                <input
                  type="text"
                  value={warId}
                  onChange={(e) => handleWarIdChange(e.target.value)}
                  placeholder="A3B7K9M2"
                  maxLength={8}
                  required
                  className="w-full px-6 py-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white font-mono text-2xl font-bold text-center tracking-widest focus:border-blue-600 focus:outline-none transition-colors uppercase"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-zinc-500">
                    8 characters (e.g., A3B7K9M2)
                  </p>
                  <p className="text-xs font-bold text-zinc-400">
                    {warId.length}/8
                  </p>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-900 dark:text-red-200">
                        Error
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Box */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  💡 <strong>Tip:</strong> Get the War ID from your admin or
                  from the war details page.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || warId.length !== 8}
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Sword className="w-4 h-4" />
                      Join War
                    </>
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
