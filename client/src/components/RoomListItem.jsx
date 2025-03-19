import React from "react";

export default function RoomListItem({ room, onClick, currentRoom }) {
  return (
    <div className="flex items-center justify-between p-2">
      <span>{room}</span>
      <button
        type="button"
        className={`my-2 block rounded-full px-4 py-1 text-sm ${currentRoom !== "" ? "cursor-not-allowed" : "cursor-pointer"} ${currentRoom === room ? "bg-lime-600 text-zinc-100" : "cursor-not-allowed bg-zinc-200 text-zinc-800 hover:bg-zinc-300"}`}
        onClick={onClick}
        disabled={currentRoom !== ""}
      >
        {currentRoom === room ? "Joined" : "Join"}
      </button>
    </div>
  );
}
