import React, { useState } from "react";
import { socket } from "./socket";
import './HomePage.css';

function HomePage() {
  const [roomId, setRoomId] = useState("");

  const createRoom = async () => {
    if (!roomId) {
      alert("Room ID cannot be empty");
      return;
    }
    console.log(`Creating room ${roomId}`);
    // call createRoom from roomUtils
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || "https://pounce.onrender.com"}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response);
      if (response.ok) {
        const data = await response.json();
        socket.emit("join", data.roomId);
        console.log('Room created:', data);
      } else {
        console.error('Failed to create room');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const joinRoom = () => {
    if (roomId === "") {
      alert("Room ID cannot be empty");
      return;
    }
    console.log(`Joining room ${roomId}`);
    socket.emit("join", roomId);
  };

  return (
    <div className="homepage">
      <div className="homepage-title">
        <span className="homepage-suits">
          <span className="suit red">♥</span>
          <span className="suit black">♠</span>
        </span>
        <h1>Pounce</h1>
        <span className="homepage-suits">
          <span className="suit red">♦</span>
          <span className="suit black">♣</span>
        </span>
      </div>
      <div className="homepage-card">
        <input
          type="text"
          placeholder="Room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn-create" onClick={createRoom}>Create Room</button>
        <hr className="homepage-divider" />
        <button className="btn-join" onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default HomePage;
