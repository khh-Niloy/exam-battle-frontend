"use client";

import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Share2,
  Settings,
  PlusCircle,
  Copy,
  LayoutDashboard,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRemoveStudentMutation } from "@/redux/features/coaching/coaching.api";

interface CoachingDashboardProps {
  coaching: any;
}

export default function CoachingDashboard({
  coaching,
}: CoachingDashboardProps) {
  const [removeStudent, { isLoading: isRemoving }] = useRemoveStudentMutation();

  const copyJoinCode = () => {
    navigator.clipboard.writeText(coaching.joinCode);
    toast.success("Join code copied to clipboard!");
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      try {
        await removeStudent(studentId).unwrap();
        toast.success("Student removed successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to remove student");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            {coaching.name}
          </h1>
          <p className="text-zinc-500 mt-1">
            {coaching.description || "No description set"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 border border-zinc-200 dark:border-zinc-700">
            <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Join Code:
            </span>
            <span className="text-lg font-mono font-bold text-blue-600">
              {coaching.joinCode}
            </span>
            <button
              onClick={copyJoinCode}
              className="text-zinc-400 hover:text-blue-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11">
            <Share2 className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6 text-orange-500" />}
          label="Total Students"
          value={coaching.students?.length || 0}
          color="bg-orange-50 dark:bg-orange-950/20"
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-blue-500" />}
          label="Question Papers"
          value="0"
          color="bg-blue-50 dark:bg-blue-950/20"
        />
        <StatCard
          icon={<LayoutDashboard className="w-6 h-6 text-purple-500" />}
          label="Active Exams"
          value="0"
          color="bg-purple-50 dark:bg-purple-950/20"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Students list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-400" />
                Recent Students
              </h2>
              <Button
                variant="ghost"
                className="text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {coaching.students?.length > 0 ? (
                coaching.students.map((item: any) => (
                  <div
                    key={item.studentId?._id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600">
                        {item.studentId?.name?.[0] || "S"}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">
                          {item.studentId?.name || "Unknown Student"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {item.studentId?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400">
                        Joined {new Date(item.joinedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleRemoveStudent(item.studentId?._id)}
                        disabled={isRemoving}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  No students joined yet. Share your code to get started!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-zinc-400" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/creation" className="block">
                <ActionButton
                  icon={<PlusCircle />}
                  label="Create New Paper"
                  color="bg-blue-600"
                />
              </Link>
              <Link href="/creation" className="block">
                <ActionButton
                  icon={<FileText />}
                  label="Manage Papers"
                  color="bg-zinc-800 dark:bg-zinc-700"
                />
              </Link>
              <ActionButton
                icon={<Settings />}
                label="Coaching Settings"
                color="bg-zinc-200 dark:bg-zinc-800"
                textColor="text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 ${color} shadow-sm`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label, color, textColor = "text-white" }: any) {
  return (
    <div
      className={`w-full flex items-center gap-3 p-4 rounded-2xl ${color} ${textColor} font-bold transition-transform active:scale-95 cursor-pointer`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
