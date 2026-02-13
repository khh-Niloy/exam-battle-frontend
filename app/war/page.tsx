"use client";

import { useState } from "react";
import CreateWarModal from "@/components/war/CreateWarModal";
import JoinWarModal from "@/components/war/JoinWarModal";
import WarDashboard from "@/components/war/WarDashboard";
import WarLobby from "@/components/war/WarLobby";
import TopHeader from "@/components/shared/TopHeader";

export default function WarPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedWarId, setSelectedWarId] = useState<string | null>(null);

  const handleWarCreated = (warId: string) => {
    setSelectedWarId(warId);
  };

  const handleWarJoined = (warId: string) => {
    setSelectedWarId(warId);
  };

  const handleViewWar = (warId: string) => {
    setSelectedWarId(warId);
  };

  const handleCloseLobby = () => {
    setSelectedWarId(null);
  };

  return (
    <>
      <TopHeader />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
        {selectedWarId ? (
          <WarLobby warId={selectedWarId} onClose={handleCloseLobby} />
        ) : (
          <WarDashboard
            onCreateWar={() => setShowCreateModal(true)}
            onJoinWar={() => setShowJoinModal(true)}
            onViewWar={handleViewWar}
          />
        )}

        <CreateWarModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleWarCreated}
        />

        <JoinWarModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleWarJoined}
        />
      </div>
    </>
  );
}
