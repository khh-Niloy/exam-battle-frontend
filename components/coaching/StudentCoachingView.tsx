"use client";
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
    <div className="space-y-8 w-full">
      {/* Header */}
      <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">
              My coaching
            </p>
            <h1 className="text-lg font-semibold text-neutral-900">
              {coaching.name}
            </h1>
            <p className="mt-1 text-xs text-neutral-600">
              {coaching.description ||
                "Access exams and resources shared by your coach."}
            </p>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
            <GraduationCap className="h-4 w-4 text-orange-600" />
            <span>
              Coach:{" "}
              <span className="font-semibold">
                {coaching.ownerId?.name || "Instructor"}
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Resource Feed */}
        <div className="space-y-4 lg:col-span-2">
          <header className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <FileText className="h-4 w-4 text-neutral-600" />
              Available papers
            </h2>
            <Button
              variant="ghost"
              className="h-8 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
            >
              See all
            </Button>
          </header>

          <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-neutral-600">
            <FileText className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
            <p className="text-sm font-medium">No papers available yet.</p>
            <p className="mt-1 text-xs">
              Your coach will add practice sets and exams here.
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <Trophy className="h-4 w-4 text-orange-500" />
              My progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-neutral-600">Exams completed</span>
                  <span className="font-semibold">0 / 0</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full w-0 rounded-full bg-orange-500" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-neutral-800">
                    Next live exam
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-orange-700">
                  TBA
                </span>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function ResourceCard({ title, type, time, questions, status }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            status === "New"
              ? "bg-orange-50 text-orange-600"
              : "bg-neutral-50 text-neutral-400"
          }`}
        >
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-neutral-900">
              {title}
            </h3>
            {status === "New" && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs text-neutral-600">
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
        className={`rounded-lg px-4 text-xs font-semibold ${
          status === "New"
            ? "bg-orange-600 hover:bg-orange-600/90 text-white"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        }`}
      >
        {status === "New" ? "Start Exam" : "Review"}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
