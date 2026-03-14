"use client";

import { useState } from "react";
import { useJoinCoachingMutation } from "@/redux/features/coaching/coaching.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function JoinCoachingForm() {
  const [joinCode, setJoinCode] = useState("");
  const [joinCoaching, { isLoading }] = useJoinCoachingMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) {
      toast.error("Join code is required");
      return;
    }

    try {
      await joinCoaching({ joinCode }).unwrap();
      toast.success("Joined coaching successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to join coaching");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Join a Coaching
        </h1>
        <p className="text-zinc-500 text-center mt-2">
          Enter the invitation code provided by your coach.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="joinCode">Invitation Code</Label>
          <Input
            id="joinCode"
            placeholder="e.g. AB12CD"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            className="rounded-xl text-center text-2xl font-mono tracking-widest uppercase"
            maxLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 font-bold"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Join Now"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
