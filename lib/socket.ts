import { envVars } from "@/config/envVars";
import { io } from "socket.io-client";

export const socket = io(envVars.NEXT_PUBLIC_BASE_SOCKET_URL, {
  autoConnect: true,
});
