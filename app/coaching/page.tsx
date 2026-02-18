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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const isCoachingRole =
    user?.role === "COACHING" || user?.role === "SUPER_ADMIN";

  if (isCoachingRole) {
    if (!coaching) {
      return (
        <div className="container mx-auto px-4 py-8">
          <CreateCoachingForm />
        </div>
      );
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <CoachingDashboard coaching={coaching} />
      </div>
    );
  }

  // Regular user (Student)
  if (!coaching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <JoinCoachingForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentCoachingView coaching={coaching} />
    </div>
  );
}
