"use client"

import getSocket from "../../../socket/socket";
import { useParams } from 'next/navigation'
import { use, useEffect, useState, useRef } from 'react';
import Text from "@/app/components/text";
import Progress from "@/app/components/progress";
export default function RoomPage() {
    const socket = getSocket();
    const params = useParams();
    const roomId = params.roomId;
    const randin = Math.floor(Math.random() * 1000);
    let totaltext = useRef(0);
    useEffect(() => {
        console.log("1")
        socket.emit("join-room", { room_name: roomId, username: "user" + randin })
        socket.on("update", (res: any) => {
            if (res && res.data && res.data) {
                if(totaltext.current == 0)
                    totaltext.current = res.data.text_length;
                setJoinies(res.data.joinies);
                console.log("joinies", res.data.joinies)
            }
        })
        socket.on("start-test", (res: any) => {
            console.log(res)
            setText(res.text)
        })
    }, []);

    const handleStatusChange = (id: string) => {
        socket.emit("change-status", { room_name: roomId, id: id })
    }


    const [text, setText] = useState<string>('');
    const [joinies, setJoinies] = useState<any[]>([]);
    return (
        <div>
            <h1>Room Page</h1>
            <p>This is the room page.</p>

            <p>Room ID: {roomId}</p>

            {joinies.length && joinies.map((joiny, index) => (
                <div key={index}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <p>{joiny.username}</p>
                        {
                            text.length == 0 &&
                                joiny.status ?
                                <button onClick={() => handleStatusChange(joiny.id)}>Ready</button> :
                                <button onClick={() => handleStatusChange(joiny.id)}>Not Ready</button>
                        }
                        {
                            text.length > 0 &&
                            joiny.id == socket.id ?
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <Text text={text} iscode={false} socket={socket} roomId={roomId} fetchRandomText={()=>{}}/> 
                                <Progress text_length = {joiny.text_length} total_length = {totaltext.current}/>
                            </div>
                            : 
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <p>{text}</p>
                                <Progress text_length = {joiny.text_length} total_length = {totaltext.current}/>
                            </div>
                        }
                    </div>
                </div>
            ))}

        </div>
    );
}