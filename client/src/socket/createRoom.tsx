import  getSocket  from './socket';

export default function createRoom(onRoomCreated: (room_id: string) => void) {
    const socket = getSocket()
    console.log("Creating room...", socket);
    const randin = Math.floor(Math.random() * 1000);
    socket.emit("create-room", {username: "user"+randin}, (room_name: string) => {
        onRoomCreated(room_name);
    });
}