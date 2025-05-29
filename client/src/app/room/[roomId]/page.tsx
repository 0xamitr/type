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
                if (totaltext.current == 0)
                    totaltext.current = res.data.text_length;
                setRoom_data(res.data);
                console.log("joinies", res.data)
                if(res.data.text_length == 0){
                    totaltext.current = 0;
                    setText("");
                }
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
    const [room_data, setRoom_data] = useState<any>([]);
    return (
        <div>
            <h1>Room Page</h1>
            <p>This is the room page.</p>

            <p>Room ID: {roomId}</p>

            {room_data && room_data.joinies && room_data.joinies.length && room_data.joinies.map((joiny: any, index: any) => (
                <div key={index}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <p>{joiny.username}</p>
                        {joiny.id == socket.id && <p> (you)</p>}
                        {
                            !room_data.status &&
                            (text.length == 0 &&
                                (
                                    joiny.status ?
                                        <button onClick={() => handleStatusChange(joiny.id)}>Ready</button> :
                                        <button onClick={() => handleStatusChange(joiny.id)}>Not Ready</button>
                                )
                            )
                        }
                        {
                            room_data.status && joiny.status &&
                            (text.length > 0 &&
                                joiny.id == socket.id ?
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <p>{room_data.status}</p>
                                    <Text text={text} iscode={false} socket={socket} roomId={roomId} fetchRandomText={() => { }} />
                                    <Progress text_length={joiny.text_length} total_length={totaltext.current} />
                                </div>
                                :
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <p>{room_data.status}</p>
                                    <p>{text}</p>
                                    <Progress text_length={joiny.text_length} total_length={totaltext.current} />
                                </div>)
                        }
                        {
                            joiny.pos > 0 &&
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <p>Position: {joiny.pos}</p>
                            </div>
                        }
                    </div>
                </div>
            ))}

        </div>
    );
}