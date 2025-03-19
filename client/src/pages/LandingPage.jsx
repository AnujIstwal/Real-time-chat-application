import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSend } from "react-icons/io";

export default function LandingPage({ onJoin }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!fullName || !username) return;
    localStorage.setItem("username", username);
    localStorage.setItem("fullName", fullName);
    onJoin(username, fullName);
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#292929] text-white">
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h1
          className="mb-4 text-4xl font-bold tracking-wider"
          style={{ fontFamily: "'Jersey 25', sans-serif" }}
        >
          CHATIFY
        </h1>
        <p className="mb-6 font-mono text-lg text-zinc-50">
          Let's join the community and start chatting
        </p>
        <input
          type="text"
          placeholder="Full Name"
          className="mb-4 w-[80%] rounded-full border border-zinc-600 bg-[#3D3D3D] px-8 py-3 font-mono tracking-wider text-zinc-300 focus:outline-none"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          className="mb-4 w-[80%] rounded-full border border-zinc-600 bg-[#3D3D3D] px-8 py-3 font-mono tracking-wider text-zinc-300 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="flex w-32 items-center justify-center rounded-full border border-zinc-200 p-3 transition hover:bg-zinc-700"
        >
          <span className="text-xl">
            <IoIosSend />
          </span>
        </button>
      </div>
    </div>
  );
}
