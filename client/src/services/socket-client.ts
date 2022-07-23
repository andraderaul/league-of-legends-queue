import io from "socket.io-client";

const BASE_SOCKET_URI =
  import.meta.env.VITE_BASE_SOCKET_URI ?? "http://localhost:3001";

export const socketClient = io(BASE_SOCKET_URI);
