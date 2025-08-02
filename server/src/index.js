import cors from "cors";
import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import roomRoutes from "./routes/roomRoutes.js";
import roomSockets from "./sockets/roomSockets.js";

const clientServerUrl = process.env.CLIENT_URL || "http://localhost:5173";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: clientServerUrl, methods: ["GET", "POST"] },
});

app.use(cors({ origin: clientServerUrl }));
app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/api/rooms", roomRoutes);

roomSockets(io);

/**
  In Express.js version 5 and later, the wildcard * behaves differently than in previous versions. 
  It now acts as a named parameter. If used without a name, like app.all('*', ...), it can cause this error. 
  The correct syntax for a wildcard that matches anything is typically /{*any} or similar, 
  depending on the specific path-to-regexp version and configuration.
*/
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
