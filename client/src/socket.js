import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://pounce.onrender.com";
export const socket = io(SERVER_URL, {
    transports: ["websocket", "polling"],
});
