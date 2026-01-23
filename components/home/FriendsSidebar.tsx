"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Sword, Loader2 } from "lucide-react";
import { useGetFriendsQuery } from "@/redux/features/user/user.api";
import Image from "next/image";

export default function FriendsSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: friends, isLoading } = useGetFriendsQuery(undefined, {
    skip: !isOpen, // Only fetch when open
  });

  const handleSendInvitation = (friend: any) => {
    console.log("Invitation sent to:", friend.name);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xs bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Battle Buddies
                </h2>
                {!isLoading && (
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {friends?.length || 0} Players Found
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                </div>
              ) : friends?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm font-medium">
                    No other players found
                  </p>
                </div>
              ) : (
                friends?.map((friend: any) => (
                  <div
                    key={friend._id}
                    className="group p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-zinc-800 flex items-center gap-4"
                  >
                    <div className="relative">
                      <div className="size-12 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-900 shadow-sm">
                        {friend.image ? (
                          <Image
                            src={friend.image}
                            alt={friend.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {friend.name}
                      </h3>
                      {friend.studentInfo ? (
                        <p className="text-[10px] font-bold text-gray-400 truncate">
                          {friend.studentInfo.class} ({friend.studentInfo.group}
                          )
                        </p>
                      ) : (
                        <p className="text-[10px] font-bold text-gray-300 italic">
                          User
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1 transition-opacity">
                      <button
                        onClick={() => handleSendInvitation(friend)}
                        className="px-3 py-1.5 bg-[#4088FD] text-white rounded-lg text-xs font-bold hover:bg-[#3a7bd5] transition-all shadow-lg shadow-blue-500/20"
                      >
                        Send Invitation
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
