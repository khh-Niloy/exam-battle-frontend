"use client";
import { useState } from "react";
import {
  useSearchUserQuery,
  useSendFriendRequestMutation,
  useGetPendingRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useLazySearchUserQuery,
} from "@/redux/features/user/user.api";
import { Search, UserPlus, Check, X, Loader2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

export default function FriendRequestsManager() {
  const [searchCode, setSearchCode] = useState("");
  const [triggerSearch, { data: searchResult, isFetching: isSearching }] =
    useLazySearchUserQuery();
  const [sendRequest, { isLoading: isSending }] =
    useSendFriendRequestMutation();

  const { data: pendingRequests, isLoading: loadingPending } =
    useGetPendingRequestsQuery(undefined);
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [rejectRequest] = useRejectFriendRequestMutation();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    try {
      console.log("searchCode", searchCode);
      await triggerSearch(searchCode.trim()).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || "User not found");
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult?.uniqueNameCode) return;
    try {
      await sendRequest(searchResult.uniqueNameCode).unwrap();
      toast.success("Friend request sent!");
      setSearchCode("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send request");
    }
  };

  const handleAccept = async (senderId: string) => {
    try {
      await acceptRequest(senderId).unwrap();
      toast.success("Friend request accepted!");
    } catch (err: any) {
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (senderId: string) => {
    try {
      await rejectRequest(senderId).unwrap();
      toast.success("Friend request rejected");
    } catch (err: any) {
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="w-full space-y-6 bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
      {/* Search Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-500" />
          Find Fighters
        </h3>
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter unique code (e.g. USER#1234)"
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-5 pr-14 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </form>

        <AnimatePresence>
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-900/30"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 shadow-sm">
                  {searchResult.image ? (
                    <Image
                      src={searchResult.image}
                      alt={searchResult.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-2 text-zinc-300" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm">{searchResult.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {searchResult.uniqueNameCode}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSendRequest}
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {isSending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <UserPlus className="w-3 h-3" />
                )}
                Send Request
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pending Requests Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-purple-500" />
          Incoming Requests
          {pendingRequests?.length > 0 && (
            <span className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-black">
              {pendingRequests.length}
            </span>
          )}
        </h3>

        {loadingPending ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
          </div>
        ) : pendingRequests?.length === 0 ? (
          <p className="text-xs text-center py-6 text-zinc-400 font-medium">
            No pending requests
          </p>
        ) : (
          <div className="space-y-3">
            {pendingRequests?.map((req: any) => (
              <motion.div
                key={req._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    {req.image ? (
                      <Image
                        src={req.image}
                        alt={req.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-full h-full p-2 text-zinc-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-xs">{req.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold tracking-tight">
                      {req.uniqueNameCode}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req._id)}
                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
