"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import TopHeader from "@/components/shared/TopHeader";
import { Roles } from "@/redux/features/auth/auth.types";
import Link from "next/link";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapSelectorButton from "@/components/home/MapSelectorButton";

const FriendsSidebar = dynamic(
  () => import("@/components/home/FriendsSidebar"),
);
const QuestionPaperModal = dynamic(
  () => import("@/components/home/QuestionPaperModal"),
);
const ActiveFriendsList = dynamic(
  () => import("@/components/home/ActiveFriendsList"),
);
const FriendRequestsManager = dynamic(
  () => import("@/components/home/FriendRequestsManager"),
);
const BattleLobby = dynamic(() => import("@/components/home/BattleLobby"));

const guestSlides = [
  {
    id: "battles",
    label: "1v1 Battle",
    title: "Are you good at math? Challenge your friend to a 1v1 battle.",
    body: "Play a live battle where you can see each other’s mistakes, correct answers, and accuracy in real time. It feels like a real exam battlefield.",
  },
  {
    id: "wars",
    label: "Exam Wars",
    title: "Join scheduled exams with a live leaderboard.",
    body: "Enter at the start time, finish under the timer, and watch your rank update as other students submit.",
  },
  {
    id: "analytics",
    label: "Progress",
    title: "Track your accuracy and fix where you lose marks.",
    body: "See what you got wrong, your accuracy percentage, and which topics you need to practice more.",
  },
];

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
  const [visitorCount, setVisitorCount] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const isAuthenticated = Boolean(userProfile?._id);

  useEffect(() => {
    if (!userProfile?._id) return;

    socket.emit("join_self", userProfile._id);

    const handleAcceptInvitation = (data: any) => {
      setSenderData(data);
      setIsInvitationOpen(true);
    };

    const handleJoinLobby = (data: any) => {
      setIsFriendsOpen(false);
      setIsLobbyOpen(true);
      setLobbyData(data);
      if (data.selectedPaper) {
        setSelectedPaper(data.selectedPaper);
      }
    };

    const handleLobbyDisbanded = () => {
      setIsLobbyOpen(false);
      setLobbyData(null);
    };

    const handleArenaUpdated = (data: any) => {
      setLobbyData(data);
      if (data.selectedPaper) {
        setSelectedPaper(data.selectedPaper);
      }
    };

    socket.on("acceptInvitation", handleAcceptInvitation);
    socket.on("join_lobby", handleJoinLobby);
    socket.on("lobby_disbanded", handleLobbyDisbanded);
    socket.on("arena_updated", handleArenaUpdated);

    return () => {
      socket.off("acceptInvitation", handleAcceptInvitation);
      socket.off("join_lobby", handleJoinLobby);
      socket.off("lobby_disbanded", handleLobbyDisbanded);
      socket.off("arena_updated", handleArenaUpdated);
    };
  }, [userProfile?._id]);

  useEffect(() => {
    const handleVisitorCount = (payload: { count: number }) => {
      setVisitorCount(payload.count);
    };

    socket.on("visitor_count", handleVisitorCount);

    return () => {
      socket.off("visitor_count", handleVisitorCount);
    };
  }, []);

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

  // Guest / unauthenticated view: focused welcome + CTA + slider
  if (!isAuthenticated) {
    const activeSlide = guestSlides[activeSlideIndex];

    return (
      <div className="min-h-screen w-full pb-24 text-neutral-950">
        {/* Light orange gradient mesh background (brighter toward the bottom) */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[var(--bg-auth-mesh)]" />

        <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pt-10 md:px-6 md:pt-12">
          {/* Hero copy */}
          <section className="flex flex-col gap-4 md:gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-600">
              Exam practice • live competition
            </p>
            <h1 className="font-heading text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
              Welcome to <span className="text-orange-600">Exam</span>{" "}
              <span className="text-orange-950">Battle</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-700 md:text-base">
              Practice for exams with timed battles, scheduled wars, and clear
              progress tracking — built for students who want results.
            </p>

            {/* Auth CTAs */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link href="/login">
                <Button className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600/90">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="rounded-lg border-orange-200 bg-white px-6 py-2.5 text-sm font-semibold text-orange-950 hover:bg-orange-50"
                >
                  Register
                </Button>
              </Link>
              <span className="text-xs text-neutral-600">
                Register in{" "}
                <span className="font-semibold text-orange-700">
                  under 5 seconds
                </span>
                .
              </span>
            </div>
          </section>

          {/* Single slider: text first, image below */}
          <section
            aria-label="What you can do on Exam Battle"
            className="w-full"
          >
            <div className="mb-3 flex items-center justify-end text-[11px] font-medium text-neutral-600">
              Live visitors:{" "}
              <span className="ml-1 font-semibold text-orange-700">
                {visitorCount}
              </span>
            </div>
            <div className="space-y-4 rounded-2xl border border-orange-200 bg-white/80 p-4 shadow-sm backdrop-blur md:p-6">
              {/* Text + controls */}
              <div className="flex flex-col justify-between gap-4">
                <header className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="mt-1 text-base font-semibold text-black/90 md:text-lg">
                      {activeSlide.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-md border-orange-200 bg-white px-3 text-sm text-orange-950 hover:bg-orange-50"
                      onClick={() =>
                        setActiveSlideIndex(
                          (prev) =>
                            (prev - 1 + guestSlides.length) %
                            guestSlides.length,
                        )
                      }
                      aria-label="Previous slide"
                    >
                      Prev
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-md border-orange-200 bg-white px-3 text-sm text-orange-950 hover:bg-orange-50"
                      onClick={() =>
                        setActiveSlideIndex(
                          (prev) => (prev + 1) % guestSlides.length,
                        )
                      }
                      aria-label="Next slide"
                    >
                      Next
                    </Button>
                  </div>
                </header>

                <div className="space-y-2">
                  <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
                    {activeSlide.body}
                  </p>
                </div>

                {/* Image / visual preview below text */}
                <div className="relative mt-3 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_20%_10%,#fb923c33,transparent_55%),radial-gradient(circle_at_80%_70%,#f9731633,transparent_60%),linear-gradient(135deg,#fff7ed,#ffffff)]">
                  <div className="absolute inset-0 border border-orange-100/80" />
                  <div className="relative flex min-h-[160px] items-end justify-between p-4 md:min-h-[190px] md:p-5">
                    <span className="inline-flex items-center bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-900">
                      {activeSlide.label}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {activeSlideIndex + 1} / {guestSlides.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {guestSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(index)}
                      className={`h-1.5 transition-all ${
                        index === activeSlideIndex
                          ? "w-7 bg-orange-600"
                          : "w-2 bg-orange-200"
                      }`}
                      aria-label={`Show slide ${index + 1}: ${slide.label}`}
                      aria-current={
                        index === activeSlideIndex ? "true" : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Authenticated lobby view (existing behavior)
  return (
    <>
      <TopHeader />
      <div className="flex flex-col items-center px-4 pt-2 sm:px-12 pb-32 sm:pb-40 w-full min-h-screen">
        <div className="mb-2 mt-2 w-full max-w-5xl text-right text-[11px] font-medium text-neutral-600">
          Live visitors:{" "}
          <span className="ml-1 font-semibold text-orange-500">
            {visitorCount}
          </span>
        </div>
        {isInvitationOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white px-6 py-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Battle request
                </div>
                <button
                  type="button"
                  className="text-xs text-neutral-500 hover:text-neutral-800"
                  onClick={() => setIsInvitationOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                  {friend?.image ? (
                    <Image
                      src={friend.image}
                      alt={friend.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-6 w-6 text-neutral-400" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <p className="text-sm font-semibold text-neutral-900">
                    {friend?.name || "Player"}
                  </p>
                  {friend?.studentInfo && (
                    <p className="text-[11px] text-neutral-600">
                      Class {friend.studentInfo.class}
                      {friend.studentInfo.group
                        ? ` · ${friend.studentInfo.group}`
                        : null}
                    </p>
                  )}
                </div>
              </div>
              <p className="mb-5 text-sm text-neutral-700">
                is challenging you to a battle. Start a live 1v1 match now?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsInvitationOpen(false);
                    handleAcceptInvitation();
                  }}
                  className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600/90"
                >
                  Accept &amp; battle
                </button>
                <button
                  type="button"
                  onClick={() => setIsInvitationOpen(false)}
                  className="w-full rounded-lg px-4 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="w-full max-w-5xl flex flex-col items-center gap-8">
          {!isLobbyOpen && <ActiveFriendsList selectedPaper={selectedPaper} />}

          <div className="w-full">
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
                {/* Join War Button for Users */}
                {userProfile?.role !== Roles.COACHING &&
                  userProfile?.role !== Roles.SUPER_ADMIN && (
                    <Link href="/war" className="mb-4">
                      <button className="group relative flex items-center gap-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.4)] transition-all overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center justify-center w-10 h-10 bg-white/20 rounded-2xl backdrop-blur-md">
                          <span>⚔️</span>
                        </div>
                        <span>Join Exam War</span>
                      </button>
                    </Link>
                  )}

                <h2 className="text-3xl font-black text-zinc-800 dark:text-white">
                  Ready for Battle?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                  Challenge your friends and climb the leaderboard
                </p>

                {(userProfile?.role === Roles.COACHING ||
                  userProfile?.role === Roles.SUPER_ADMIN) && (
                  <Link href="/war" className="pt-4">
                    <button className="group relative flex items-center gap-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_50px_rgba(79,70,229,0.4)] transition-all overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-center w-10 h-10 bg-white/20 rounded-2xl backdrop-blur-md">
                        <Swords className="w-5 h-5 text-white" />
                      </div>
                      <span>Manage Exam Wars</span>
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
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
