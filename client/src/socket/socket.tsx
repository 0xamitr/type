"use client";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

let socket: Socket;

export default function getSocket(): Socket {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_API);
        socket.on("connect", () => {
            console.log("Connected to server");
        })
        
        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        })
    }
    return socket;
}