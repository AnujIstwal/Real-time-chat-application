import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { socket } from "../socket"; // Import socket instance

export default function ChatArea({
  chatRef,
  currentRoom,
  messages,
  userName,
  message,
  setMessage,
  setMessages,
  sendMessage,
  setCurrentRoom,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji); // Append emoji to message
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom"); // Emit the leaveRoom event
    setCurrentRoom(""); // Reset current room
    setMessages([]);
  };

  return (
    <section className="flex h-screen flex-col items-center justify-center bg-[#4A4A4A] md:flex-1">
      {/* Chat Area */}
      <div
        id="chat-section"
        className="flex w-full flex-1 flex-col overflow-auto bg-[#4A4A4A] text-white"
      >
        {currentRoom ? (
          <>
            <div className="flex justify-between border-b border-zinc-700 bg-[#5C5C5C] px-8 py-4">
              <h2 className="text-xl font-semibold">{currentRoom}</h2>
              <button
                type="button"
                className="cursor-pointer rounded-xl bg-rose-400 px-4 py-2 text-white transition-colors hover:bg-rose-500"
                onClick={handleLeaveRoom} // Call handleLeaveRoom function on click
              >
                Leave
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-auto p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === userName
                      ? "justify-end"
                      : msg.sender === "System"
                        ? "justify-center"
                        : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-xl p-3 md:max-w-md lg:max-w-lg ${
                      msg.sender === userName
                        ? "rounded-tr-none bg-[#333333] text-white"
                        : msg.sender === "System"
                          ? "bg-transparent text-sm text-zinc-400"
                          : "rounded-tl-none bg-[#636363] text-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">
                        {msg.sender === userName || msg.sender === "System"
                          ? ""
                          : msg.sender}
                      </p>
                      <span
                        className={`text-xs text-gray-400 ${msg.sender === "System" ? "hidden" : "block"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // Ensures 12-hour format with AM/PM
                        })}
                      </span>
                    </div>

                    {/* Render Markdown-formatted text */}
                    <ReactMarkdown
                      children={msg.text}
                      remarkPlugins={[remarkGfm]}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={chatRef}
              className="flex border-t border-gray-700 p-2 sm:p-4"
            >
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="mr-2 cursor-pointer text-white hover:scale-105"
              >
                <BsEmojiSmile size={24} />
              </button>

              {/* Emoji Picker */}
              {showPicker && (
                <div className="absolute bottom-12 left-0">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <input
                className="flex-1 rounded-full border border-zinc-600 bg-[#3D3D3D] px-8 py-3 font-mono tracking-wide text-zinc-300 focus:outline-none"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    sendMessage();
                  }
                }}
              />
              <button
                className="scale-90 cursor-pointer rounded-full bg-zinc-200 p-4 text-zinc-800 transition-transform hover:scale-105 md:ml-2"
                onClick={sendMessage}
              >
                <span className="text-2xl">
                  <IoIosSend />
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-y-2">
            <h1 className="text-2xl font-semibold">No chat room joined yet?</h1>
            <p className="text-zinc-300">Select a room to start chatting</p>
          </div>
        )}
      </div>
    </section>
  );
}
