"use client";
import { useState, useEffect } from "react";
import { useGetFriendsQuery } from "@/redux/features/user/user.api";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { socket } from "@/lib/socket";
import Image from "next/image";
import { User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ActiveFriendsList({
  selectedPaper,
}: {
  selectedPaper: any | null;
}) {
  const { data: friends, isLoading } = useGetFriendsQuery(undefined);
  const { data: user } = useGetMeQuery(undefined);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});

  const handleSendInvitation = (friend: any) => {
    if (onlineUsers[friend._id] && onlineUsers[friend._id] !== "AVAILABLE") {
      return;
    }
    socket.emit("invitation", {
      receiverFriendId: friend._id,
      senderInfo: user,
      selectedPaper,
    });
  };

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

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-800 rounded-full mb-2" />
            <div className="h-3 w-12 bg-gray-200 dark:bg-zinc-800 rounded mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (!friends || friends.length === 0) return null;

  return (
    <div className="w-full mb-2">
      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="text-sm flex items-center gap-2">
          <span className="text-sm text-black/85 font-semibold">
            Your Battle Buddies!
          </span>
        </h3>
        <div className="h-px flex-1 bg-gray-100 dark:bg-zinc-800 ml-4 hidden sm:block"></div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide snap-x">
        {friends.map((friend: any) => {
          const isAvailable = onlineUsers[friend._id] === "AVAILABLE";
          const isBusy =
            onlineUsers[friend._id] && onlineUsers[friend._id] !== "AVAILABLE";
          const isOnline = isAvailable || isBusy;

          return (
            <motion.div
              key={friend._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex-shrink-0 flex flex-col items-center gap-3 snap-center cursor-pointer group relative"
            >
              {/* Card Container */}
              <div className="relative">
                <div
                  className={`relative w-18 h-18 rounded-[1.8rem] p-1 transition-all duration-300 ${
                    isOnline
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 p-[2px] shadow-lg shadow-green-500/20"
                      : "bg-gray-100 dark:bg-zinc-800 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700"
                  }`}
                >
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-900">
                    {friend.image ? (
                      <Image
                        src={friend.image}
                        alt={friend.name}
                        fill
                        className={`object-cover transition-all duration-500 ${!isOnline ? "grayscale group-hover:grayscale-0" : ""}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                        <User className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Invite Button for Available Users */}
                {isAvailable && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendInvitation(friend);
                    }}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#4088FD] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/40 border-2 border-white dark:border-zinc-900 z-20 hover:bg-[#3272d9] flex items-center gap-1"
                  >
                    <span>Invite</span>
                  </motion.button>
                )}

                {/* Status Badge for others */}
                {!isAvailable && (
                  <div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-xl z-10 whitespace-nowrap border-2 border-white dark:border-zinc-900 ${
                      isOnline
                        ? "bg-orange-500"
                        : "bg-zinc-400 dark:bg-zinc-600"
                    }`}
                  >
                    {isOnline ? "In Game" : "Offline"}
                  </div>
                )}
              </div>

              <div className="text-center pt-3">
                <p
                  className={`text-sm font-bold truncate max-w-[80px] transition-colors ${
                    isOnline ? "text-black" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {friend.name}
                </p>
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
