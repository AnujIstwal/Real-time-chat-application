import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import ChatRoom from "./ChatRoom";
import { IoLogOutOutline } from "react-icons/io5";
import ChatArea from "../components/ChatArea";
import { useRef } from "react";

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const chatRef = useRef(null);

  const userName = localStorage.getItem("username");
  const fullName = localStorage.getItem("fullName");

  useEffect(() => {
    socket.connect();

    // Fetch room list from server
    socket.on("roomList", (serverRooms) => {
      setRooms(serverRooms);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = (room) => {
    if (currentRoom) {
      socket.emit("leaveRoom", { room: currentRoom, username: userName });
    }
    setCurrentRoom(room);
    socket.connect();
    socket.emit("joinRoom", { username: userName, room }, (response) => {
      if (response?.error) {
        alert(response.error); // Show error if username exists
        navigate("/"); // Redirect to login page
      }
    });

    // Detect if the device is mobile
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 200); // Delay to allow DOM rendering
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", {
        room: currentRoom,
        message,
        sender: userName,
      });
      setMessage("");
    }
  };

  const leaveChat = () => {
    socket.disconnect();
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col bg-[#3D3D3D] text-white md:h-screen md:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full items-center justify-between bg-[#292929] px-6 py-2 md:w-[16%] md:flex-col md:rounded-r-4xl md:py-10">
        <h1
          className="text-2xl font-semibold tracking-wider md:text-3xl"
          style={{ fontFamily: "'Jersey 25', sans-serif" }}
        >
          CHATIFY
        </h1>
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName}&fontSize=24&bold=true`}
          alt="Avatar"
          className="h-10 w-10 rounded-full md:mt-8 md:h-14 md:w-14"
        />
        <p className="hidden text-lg font-semibold text-zinc-200 md:mt-2 md:block">
          {fullName}
        </p>
        <button
          onClick={leaveChat}
          className="mt-auto cursor-pointer px-4 py-2 text-3xl hover:scale-105"
        >
          <IoLogOutOutline />
        </button>
      </aside>

      {/* Rooms List */}
      <ChatRoom
        rooms={rooms}
        joinRoom={joinRoom}
        setRooms={setRooms}
        currentRoom={currentRoom}
      />

      <ChatArea
        chatRef={chatRef}
        currentRoom={currentRoom}
        messages={messages}
        userName={userName}
        message={message}
        setMessage={setMessage}
        setMessages={setMessages}
        sendMessage={sendMessage}
        setCurrentRoom={setCurrentRoom}
      />
    </div>
  );
};

export default Dashboard;
