"use client";
import FriendsSidebar from "@/components/home/FriendsSidebar";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import BattleLobby from "@/components/home/BattleLobby";
import MapSelectorButton from "@/components/home/MapSelectorButton";
import QuestionPaperModal from "@/components/home/QuestionPaperModal";
import ActiveFriendsList from "@/components/home/ActiveFriendsList";
import TopHeader from "@/components/shared/TopHeader";

export default function Home() {
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [senderData, setSenderData] = useState<any>(null);
  const [isAccept, setIsAccept] = useState(false);
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);
  const [lobbyData, setLobbyData] = useState<any>(null);
  const { data: userProfile } = useGetMeQuery(undefined);

  useEffect(() => {
    if (userProfile?._id) {
      socket.emit("join_self", userProfile._id);
    }

    socket.on("acceptInvitation", (data) => {
      setSenderData(data);
      setIsInvitationOpen(true);
    });

    socket.on("join_lobby", (data: any) => {
      setIsFriendsOpen(false);
      setIsLobbyOpen(true);
      setLobbyData(data);
      if (data.selectedPaper) {
        setSelectedPaper(data.selectedPaper);
      }
    });

    socket.on("lobby_disbanded", () => {
      setIsLobbyOpen(false);
      setLobbyData(null);
    });

    socket.on("arena_updated", (data: any) => {
      setLobbyData(data);
      if (data.selectedPaper) {
        setSelectedPaper(data.selectedPaper);
      }
    });

    return () => {
      socket.off("acceptInvitation");
      socket.off("join_lobby");
      socket.off("lobby_disbanded");
      socket.off("arena_updated");
    };
  }, [userProfile]);

  console.log(selectedPaper);

  const handleAcceptInvitation = () => {
    socket.emit("accepted", {
      acceptedUserInfo: userProfile,
      senderUserInfo: senderData?.senderInfo,
      selectedPaper: senderData?.selectedPaper,
    });
    setIsAccept(true);
    setIsInvitationOpen(false);
  };

  const handleUpdateArena = (paper: any) => {
    if (!isLobbyOpen) return;
    socket.emit("update_arena", {
      ...lobbyData,
      selectedPaper: paper,
    });
  };

  const friend = senderData?.senderInfo;

  return (
    <>
      <TopHeader />
      <div className="flex flex-col items-center px-4 pt-4 sm:px-12 overflow-hidden w-full">
        <AnimatePresence mode="wait">
          {isInvitationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 100, rotate: -5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  y: 100,
                  rotate: 5,
                  transition: { duration: 0.2 },
                }}
                className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl border border-white/20 dark:border-zinc-800 p-8 rounded-[3rem] text-center shadow-[0_40px_100px_rgba(0,0,0,0.2)] pointer-events-auto max-w-sm w-full relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4088FD]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-2 -left-2 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <div className="relative w-24 h-24 mx-auto mb-6 group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-full h-full bg-gradient-to-br from-[#4088FD] to-[#3a7bd5] rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white dark:border-zinc-800">
                      {friend?.image ? (
                        <Image
                          src={friend.image}
                          alt={friend.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-2xl border-4 border-white dark:border-zinc-900 flex items-center justify-center">
                      <span className="text-xs">⚔️</span>
                    </div>
                  </div>

                  <h1 className="text-[10px] font-black text-[#4088FD] uppercase tracking-[0.4em] mb-2">
                    Battle Request
                  </h1>
                  <h2 className="text-2xl font-black text-zinc-800 dark:text-white mb-1">
                    {friend?.name || "Player One"}
                  </h2>
                  {friend?.studentInfo && (
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
                      Class {friend.studentInfo.class} •{" "}
                      {friend.studentInfo.group}
                    </p>
                  )}

                  <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 text-sm">
                    Is challenging you to a knowledge battle! Do you accept?
                  </p>
                </motion.div>

                <div className="flex flex-col gap-3 relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsInvitationOpen(false);
                      handleAcceptInvitation();
                    }}
                    className="w-full bg-[#4088FD] text-white py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#3a7bd5] transition-colors shadow-xl shadow-blue-500/25 active:scale-95"
                  >
                    Accept & Battle
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsInvitationOpen(false)}
                    className="w-full bg-transparent text-zinc-400 dark:text-zinc-500 py-3 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors active:scale-95"
                  >
                    Maybe later
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="w-full max-w-5xl flex flex-col items-center gap-6">
          {!isLobbyOpen && <ActiveFriendsList selectedPaper={selectedPaper} />}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            {isLobbyOpen ? (
              <BattleLobby
                player1={lobbyData.senderUserInfo}
                player2={lobbyData.acceptedUserInfo}
                battleRoomId={lobbyData.battleRoomId}
                selectedPaper={selectedPaper}
                onSelectArena={() => setIsQuestionPaperOpen(true)}
                onLeave={() => {
                  setIsLobbyOpen(false);
                  setLobbyData(null);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Welcome message or something else catchy can go here */}
                <h2 className="text-3xl font-black text-zinc-800 dark:text-white">
                  Ready for Battle?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                  Challenge your friends and climb the leaderboard
                </p>
              </div>
            )}
          </motion.div>
        </main>

        <QuestionPaperModal
          handleUpdateArena={handleUpdateArena}
          isOpen={isQuestionPaperOpen}
          onClose={() => setIsQuestionPaperOpen(false)}
          onSelect={(paper) => setSelectedPaper(paper)}
        />
      </div>
    </>
  );
}
