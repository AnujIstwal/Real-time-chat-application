const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { time, timeStamp } = require("console");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

let rooms = ["Gaming", "Tech", "Boxing", "General", "Music"]; // Store active rooms
const users = new Set(); // Store active usernames

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send initial rooms to newly connected user
    socket.emit("roomList", rooms);

    // Create new room
    socket.on("createRoom", (roomName) => {
        if (!rooms.includes(roomName)) {
            rooms.push(roomName);
            io.emit("roomList", rooms); // Notify all clients
            console.log(`New room created: ${roomName}`);
        }
    });

    // Join a room
    socket.on("joinRoom", ({ username, room }, callback) => {
        if (users.has(username)) {
            return callback({ error: "Username is already taken!" });
        }

        users.add(username); // Add user to active list
        socket.username = username; // Store in socket instance
        socket.room = room; // Store room name in socket instance

        socket.join(room);
        rooms[room] = rooms[room] || [];
        rooms[room].push(username);

        io.to(room).emit("roomUsers", rooms[room]);

        const joinTime = new Date().toISOString();
        console.log(`${username} joined room: ${room}`);
        socket.to(room).emit("message", {
            sender: "System",
            text: `${username} has joined the chat`,
            timestamp: joinTime,
        });
        callback();
    });

    // Handle messages
    socket.on("sendMessage", ({ room, message, sender }) => {
        const timestamp = new Date().toISOString();
        io.to(room).emit("message", { sender, text: message, timestamp });
    });

    // Leave room
    socket.on("leaveRoom", () => {
        if (socket.username && socket.room) {
            users.delete(socket.username); // Remove from active users list
            socket.leave(socket.room); // Leave the room

            const leaveTime = new Date().toISOString();
            console.log(`${socket.username} leaved room: ${socket.room}`);

            io.to(socket.room).emit("message", {
                sender: "System",
                text: `${socket.username} left the room!`,
                timeStamp: leaveTime,
            });

            socket.room = null;
            socket.username = null;
        }
    });

    //Disconnect
    // Remove user on disconnect
    socket.on("disconnect", () => {
        if (socket.username) {
            users.delete(socket.username);
            io.to(socket.room).emit("message", {
                sender: "System",
                text: `${socket.username} disconnected!`,
            });
        }
    });
});

server.listen(5000, () => console.log("Server running on port 5000"));
