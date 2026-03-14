"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function VisitorPresence() {
  useEffect(() => {
    // Ensure connection exists while user is on the site.
    if (!socket.connected) {
      socket.connect();
    }

    const ping = () => {
      socket.emit("visitor_ping");
    };

    // Initial ping + keepalive.
    ping();
    const interval = setInterval(ping, 15_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}

