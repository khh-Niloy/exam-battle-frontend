"use client";
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
    <div className="space-y-8 w-full">
      {/* Header Section */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <LayoutDashboard className="w-5 h-5 text-orange-600" />
            {coaching.name}
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            {coaching.description || "No description set"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-600">
              Join Code:
            </span>
            <span className="font-mono text-sm font-semibold text-orange-700">
              {coaching.joinCode}
            </span>
            <button
              onClick={copyJoinCode}
              className="text-xs font-medium text-neutral-500 hover:text-orange-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <Button className="h-9 rounded-lg bg-orange-600 px-4 text-xs font-semibold text-white hover:bg-orange-600/90">
            <Share2 className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={<Users className="w-6 h-6 text-orange-500" />}
          label="Total Students"
          value={coaching.students?.length || 0}
          color="bg-orange-50"
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-neutral-700" />}
          label="Question Papers"
          value="0"
          color="bg-neutral-50"
        />
        <StatCard
          icon={<LayoutDashboard className="w-6 h-6 text-neutral-700" />}
          label="Active Exams"
          value="0"
          color="bg-neutral-50"
        />
      </section>

      {/* Main Content Area */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Students list */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <Users className="w-4 h-4 text-neutral-500" />
                Students
              </h2>
              <Button
                variant="ghost"
                className="h-8 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {coaching.students?.length > 0 ? (
                coaching.students.map((item: any) => (
                  <div
                    key={item.studentId?._id}
                    className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
                        {item.studentId?.name?.[0] || "S"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          {item.studentId?.name || "Unknown Student"}
                        </p>
                        <p className="text-[11px] text-neutral-600">
                          {item.studentId?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] text-neutral-600">
                        Joined {new Date(item.joinedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleRemoveStudent(item.studentId?._id)}
                        disabled={isRemoving}
                        className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        title="Remove Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-sm text-neutral-600">
                  No students joined yet. Share your code to get started!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <PlusCircle className="w-4 h-4 text-neutral-500" />
              Quick actions
            </h2>
            <div className="space-y-3">
              <Link href="/creation" className="block">
                <ActionButton
                  icon={<PlusCircle />}
                  label="Create New Paper"
                  color="bg-orange-600"
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
                color="bg-neutral-100"
                textColor="text-neutral-900"
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`p-4 rounded-2xl border border-neutral-200 ${color} shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-600">{label}</p>
          <p className="text-xl font-semibold text-neutral-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, color, textColor = "text-white" }: any) {
  return (
    <div
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${color} ${textColor} text-sm font-semibold cursor-pointer`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
