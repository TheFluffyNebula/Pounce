import React, { useState } from "react";
import { socket } from "./socket";

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
      const response = await fetch('http://localhost:3001/api/rooms/create', {
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
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default HomePage;
