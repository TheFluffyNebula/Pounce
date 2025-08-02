import cors from "cors";
import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import roomRoutes from "./routes/roomRoutes.js";
import roomSockets from "./sockets/roomSockets.js";

// const clientServerUrl = "http://localhost:5173";
// Use Render's environment variable or fallback to localhost for dev
const clientServerUrl = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: clientServerUrl, methods: ["GET", "POST"] },
});

app.use(cors({ origin: clientServerUrl }));
// app.use(cors());
// app.use(cors({ origin: clientServerUrl, optionsSuccessStatus: 200 }));

app.use(express.json());

// Serve the frontend (React build)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/dist")));


app.use("/api/rooms", roomRoutes);

roomSockets(io);

// Handle any unknown routes and serve the frontend (React index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;