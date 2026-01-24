"use client";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { User, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function PlayerInfo() {
  const { data: user, isLoading, error } = useGetMeQuery(undefined);

  useEffect(() => {
    socket.emit("join_self", user?._id);
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <p className="text-gray-400 text-sm font-medium">Profile unavailable</p>
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative size-24 md:size-28 rounded-full overflow-hidden border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 flex items-center justify-center">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <User className="w-10 h-10 text-gray-300" />
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {user.name}
        </h2>

        {user.studentInfo ? (
          <>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {user.studentInfo.instituteName}
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              class - {user.studentInfo.class} ({user.studentInfo.group})
            </p>
          </>
        ) : (
          <p className="text-xs font-medium text-gray-400 italic">
            Student info pending
          </p>
        )}
      </div>
    </div>
  );
}
