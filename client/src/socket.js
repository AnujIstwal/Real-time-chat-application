import { io } from "socket.io-client";

const SOCKET_URL = "https://real-time-chat-application-jdpy.onrender.com"; // Replace with your backend URL if deployed
export const socket = io(SOCKET_URL, { autoConnect: false });
