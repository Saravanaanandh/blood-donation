import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend.onrender.com",
  {
    transports: ["websocket"], // 👈 belongs here, not in axios
    withCredentials: true,
  }
);
