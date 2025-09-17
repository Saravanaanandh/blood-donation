import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1"
    :"/api/v1",
  {
    transports: ["websocket"], // 👈 belongs here, not in axios
    withCredentials: true,
  }
);
