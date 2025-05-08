import { io } from "socket.io-client";

const URL = "http://localhost:3001";
transports: ['websocket'] // disable xhr poll
export const socket = io(URL);

// const SERVER_URL = process.env.REACT_APP_SERVER_URL || "https://hearts-q4nx.onrender.com";
// export const socket = io(SERVER_URL, {
//     transports: ["websocket", "polling"],
// });
