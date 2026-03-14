"use client";
import FriendRequestsManager from "@/components/home/FriendRequestsManager";
import {
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
} from "@/redux/features/user/user.api";
import { User, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { motion } from "framer-motion";

export default function FriendsPage() {
  const { data: friends, isLoading } = useGetFriendsQuery(undefined);
  const { data: pendingRequests } =
    useGetPendingRequestsQuery(undefined);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    socket.emit("get_online_users");
    const handleOnlineUsersList = (
      users: { userId: string; status: string }[],
    ) => {
      const statusMap: Record<string, string> = {};
      users.forEach((u) => (statusMap[u.userId] = u.status));
      setOnlineUsers(statusMap);
    };
    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: "AVAILABLE" }));
    };
    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };
    const handleStatusUpdate = ({
      userId,
      status,
    }: {
      userId: string;
      status: string;
    }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
    };

    socket.on("online_users_list", handleOnlineUsersList);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.on("user_status_updated", handleStatusUpdate);

    return () => {
      socket.off("online_users_list", handleOnlineUsersList);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("user_status_updated", handleStatusUpdate);
    };
  }, []);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 pt-4 pb-32 sm:pb-40">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-neutral-900">
          Friends
        </h1>
        <div className="flex bg-neutral-100 p-1 rounded-full">
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "friends"
                ? "bg-white shadow-sm text-orange-700"
                : "text-neutral-500"
            }`}
          >
            My Friends
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "requests"
                ? "bg-white shadow-sm text-orange-700"
                : "text-neutral-500"
            }`}
          >
            <span>Requests</span>
            {pendingRequests?.length ? (
              <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-orange-600 text-white text-[10px] font-black">
                {pendingRequests.length}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      {activeTab === "friends" ? (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            </div>
          ) : friends && friends.length > 0 ? (
            <div className="grid gap-3">
              {friends
                .filter((f: any) => f)
                .sort((a: any, b: any) => {
                  const aOnline = onlineUsers[a._id] ? 1 : 0;
                  const bOnline = onlineUsers[b._id] ? 1 : 0;
                  return bOnline - aOnline;
                })
                .map((friend: any) => {
                  const isAvailable = onlineUsers[friend._id] === "AVAILABLE";
                  const isBusy =
                    onlineUsers[friend._id] &&
                    onlineUsers[friend._id] !== "AVAILABLE";
                  const isOnline = isAvailable || isBusy;

                  return (
                    <motion.div
                      key={friend._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            {friend.image ? (
                              <Image
                                src={friend.image}
                                alt={friend.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <User className="w-full h-full p-3 text-zinc-300" />
                            )}
                          </div>
                          {isOnline && (
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${isAvailable ? "bg-green-500" : "bg-orange-500"}`}
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-800 dark:text-zinc-200">
                            {friend.name}
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                            {isOnline
                              ? isAvailable
                                ? "Online"
                                : "In Battle"
                              : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500 font-mono">
                        {friend.uniqueNameCode}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <User className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-700 font-medium">No friends yet</p>
              <button
                onClick={() => setActiveTab("requests")}
                className="mt-3 text-orange-600 text-sm font-semibold hover:underline"
              >
                Find friends
              </button>
            </div>
          )}
        </div>
      ) : (
        <FriendRequestsManager />
      )}
    </main>
  );
}
