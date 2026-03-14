"use client";

import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useGetMyCoachingQuery } from "@/redux/features/coaching/coaching.api";
import CreateCoachingForm from "@/components/coaching/CreateCoachingForm";
import JoinCoachingForm from "@/components/coaching/JoinCoachingForm";
import CoachingDashboard from "@/components/coaching/CoachingDashboard";
import StudentCoachingView from "@/components/coaching/StudentCoachingView";
import { Loader2 } from "lucide-react";

export default function CoachingPage() {
  const { data: user, isLoading: userLoading } = useGetMeQuery(undefined);
  const { data: coaching, isLoading: coachingLoading } =
    useGetMyCoachingQuery(undefined);

  if (userLoading || coachingLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </main>
    );
  }

  const isCoachingRole =
    user?.role === "COACHING" || user?.role === "SUPER_ADMIN";

  if (isCoachingRole) {
    if (!coaching) {
      return (
        <main className="mx-auto flex w-full max-w-5xl px-4 pt-4 pb-32 sm:pb-40">
          <CreateCoachingForm />
        </main>
      );
    }
    return (
      <main className="mx-auto flex w-full max-w-5xl px-4 pt-4 pb-32 sm:pb-40">
        <CoachingDashboard coaching={coaching} />
      </main>
    );
  }

  // Regular user (Student)
  if (!coaching) {
    return (
      <main className="mx-auto flex w-full max-w-5xl px-4 pt-4 pb-32 sm:pb-40">
        <JoinCoachingForm />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl px-4 pt-4 pb-32 sm:pb-40">
      <StudentCoachingView coaching={coaching} />
    </main>
  );
}
