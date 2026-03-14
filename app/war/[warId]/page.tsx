"use client";

import { use, useState } from "react";
import WarLobby from "@/components/war/WarLobby";
import TopHeader from "@/components/shared/TopHeader";
import { useRouter } from "next/navigation";

export default function WarLobbyPage({
  params: paramsPromise,
}: {
  params: Promise<{ warId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();

  const handleClose = () => {
    router.push("/war");
  };

  return (
    <>
      <TopHeader />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
        <WarLobby warId={params.warId} onClose={handleClose} />
      </div>
    </>
  );
}
