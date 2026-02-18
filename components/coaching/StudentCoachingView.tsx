"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  FileText,
  Clock,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentCoachingViewProps {
  coaching: any;
}

export default function StudentCoachingView({
  coaching,
}: StudentCoachingViewProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              My Coaching
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {coaching.name}
          </h1>
          <p className="text-blue-100 max-w-2xl text-lg mb-8">
            {coaching.description ||
              "Welcome to your learning hub! Here you can access all the resources and exams shared by your coach."}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/10">
              <GraduationCap className="w-5 h-5 text-blue-200" />
              <span className="font-bold">
                Coach: {coaching.ownerId?.name || "The Instructor"}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resource Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              Available Papers
            </h2>
            <Button variant="ghost" className="text-blue-600 font-bold">
              See All
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No papers available yet.</p>
              <p className="text-sm opacity-60">
                Your coach will post resources here soon.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              My Progress
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-500">Exams Completed</span>
                  <span className="font-bold">0/0</span>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-0 rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">Next Live Exam</span>
                </div>
                <span className="text-xs font-bold text-orange-600 font-mono">
                  TBA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ title, type, time, questions, status }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-4 rounded-2xl ${status === "New" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400"}`}
        >
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            {status === "New" && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> {questions} Qs
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {time}
            </span>
          </div>
        </div>
      </div>
      <Button
        className={`rounded-xl px-6 ${status === "New" ? "bg-blue-600 hover:bg-blue-700" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
      >
        {status === "New" ? "Start Exam" : "Review"}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}
