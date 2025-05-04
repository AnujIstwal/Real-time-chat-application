import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { socket } from "../socket";
import RoomListItem from "../components/RoomListItem";
import { PuffLoader } from "react-spinners";

export default function ChatRoom({ rooms, joinRoom, currentRoom, isLoading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  // Function to handle room creation
  const createRoom = () => {
    if (newRoomName.trim() && !rooms.includes(newRoomName)) {
      socket.emit("createRoom", newRoomName);
      setNewRoomName("");
      setIsModalOpen(false);
    }
  };

  return (
    <section className="w-full overflow-auto bg-[#3D3D3D] px-4 py-6 md:w-[28%] md:py-16">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 flex w-full items-center justify-between">
          <h2 className="text-xl font-semibold">Rooms</h2>
          <button
            type="text"
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-violet-500 px-3 py-2 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-2xl">
              <IoIosAdd />
            </span>
            <span>New room</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-y-2 rounded-3xl bg-[#292929] p-6 text-white">
            <PuffLoader color="white" />
            <p className="text-sm text-zinc-300">Fetching rooms...</p>
          </div>
        ) : (
          <div className="w-full rounded-3xl bg-[#292929] p-6 text-white">
            {rooms.map((room) => (
              <RoomListItem
                key={room}
                room={room}
                onClick={() => joinRoom(room)}
                currentRoom={currentRoom}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Creation Modal */}
      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
          <div className="overflow-auto rounded bg-gray-800 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white">Create a New Room</h3>
            <input
              type="text"
              className="mt-2 w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
              placeholder="Enter room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                onClick={createRoom}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
