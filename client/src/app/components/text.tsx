"use client";
import styles from './text.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from "react";
import React from 'react';
import { submit } from '../Features/SubmitText';
import { Socket } from "socket.io-client";

export default function Text(props: any) {
    const [wpm, setWPM] = useState(0);
    const [finish, setFinish] = useState(false);
    const [check, setCheck] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const index = useRef(0);
    const time = useRef(0);
    const timerID = useRef<NodeJS.Timeout | null>(null);
    const start = useRef(false);
    const temp = useRef(0);
    const wrongvar = useRef(0);

    const socket: Socket = props.socket;
    const text: string = props.text;

    const startTime = () => {
        timerID.current = setInterval(() => {
            time.current++;
        }, 10);
    };

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === " ") event.preventDefault();
            if (event.key === "Escape") setCheck((prev) => !prev);
            if (["Shift", "CapsLock", "Control"].includes(event.key)) return;

            if (!start.current) {
                startTime();
                start.current = true;
            }

            if (event.key === " ") {
                temp.current++;
            }

            if (event.key === text[index.current] || (text[index.current] === "↵" && event.key === "Enter")) {
                index.current++;
                setCurrentIndex(index.current);

                if (index.current === text.length) {
                    const n = temp.current / (time.current / 6000);
                    const wpmtemp = Math.floor(n * 100) / 100;
                    if (timerID.current) clearInterval(timerID.current);
                    setFinish(true);
                    props.fetchRandomText();
                    setCheck((prev) => !prev);
                    temp.current++;
                    setWPM(wpmtemp);
                    const acc = Math.floor((100 - (wrongvar.current / text.length) * 100) * 100) / 100;
                    setAccuracy(acc);
                    index.current = 0;
                    setCurrentIndex(0);
                    if(socket){
                        socket.emit("finish-test", { room_name: props.roomId, id: socket.id });
                    }
                    else
                        submit(wpmtemp, acc, props.iscode);
                }

                if (socket) {
                    socket.emit("change-text", { room_name: props.roomId, text_length: index.current, id: socket.id });
                }
            } else {
                const el = document.getElementById(`${index.current + 1}`);
                if (el && !el.classList.contains(styles.wrong)) {
                    el.classList.add(styles.wrong);
                    wrongvar.current++;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [finish, check, text]);

    return (
        <>
            <p className={styles.test}>
                {Array.from(text).map((letter: string, i: number) => {
                    const isFirst = i === 0;
                    const isCurrent = i === currentIndex;
                    return (
                        <React.Fragment key={uuidv4()}>
                            <span
                                id={`${i + 1}`}
                                className={`${isCurrent ? styles.current : ""}`}
                            >
                                {letter === "^" ? <>&nbsp;&nbsp;&nbsp;&nbsp;</> : letter}
                            </span>
                            {letter === "↵" && <br />}
                        </React.Fragment>
                    );
                })}
            </p>
            {finish && (
                <>
                    <p>Speed: {wpm} wpm</p>
                    <p>Accuracy: {accuracy}%</p>
                </>
            )}
        </>
    );
}
