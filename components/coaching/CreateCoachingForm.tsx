"use client";

import { useState } from "react";
import { useCreateCoachingMutation } from "@/redux/features/coaching/coaching.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CreateCoachingForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createCoaching, { isLoading }] = useCreateCoachingMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Coaching name is required");
      return;
    }

    try {
      await createCoaching({ name, description }).unwrap();
      toast.success("Coaching created successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create coaching");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Setup Your Coaching
        </h1>
        <p className="text-zinc-500 text-center mt-2">
          Create your space for mentoring and managing students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Coaching Name</Label>
          <Input
            id="name"
            placeholder="e.g. Master Minds Coaching"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Tell your students what this coaching is about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Create Coaching"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
