'use client'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";

export default function Text(props: any) {
    const [wpm, setWPM] = useState(0)
    const [finish, setFinish] = useState(false)

    let time: number = 0
    let text: String = props.text;
    let setindex: number = 0
    let index: number = 0
    let timerID: any
    let start: boolean = false
    let temp: number = 0

    const startTime = () => {
        timerID = setInterval(() => {
            time++;
        }, 10)
    }
    useEffect(() => {
        console.log("length", text.length)
        console.log(finish)
        const handleKeyDown = (event: any) => {

                if (!start) {
                    startTime()
                    start = true
                }
                if (event.key == " ") {
                    temp++
                }
                if (event.key == text[index]) {
                    document.querySelector(".current")?.classList.remove("current")
                    console.log(event.key)
                    index++
                    document.getElementById(`${index}`)?.classList.add("typed")
                    document.getElementById(`${index+1}`)?.classList.add("current")
                }
                if (index == text.length) {
                    console.log("ok")
                    clearInterval(timerID)
                    setFinish(true)
                    props.fetchRandomText()
                    temp++
                    const n = temp / (time / 6000)
                    setWPM(Math.floor(n * 100) / 100)
                }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    })

    return (
        <div>
            <h2>
                {Array.from(text).map((letter: String) => {
                    setindex++
                    let wtf = ""
                    if(setindex == 1)
                        wtf = "current"
                    return (
                        <span key={uuidv4()} id={`${setindex}`} className={wtf}>{letter}</span>
                    )
                })}
            </h2>
            {finish &&
                <h2>{wpm} wpm</h2>
            }
        </div>
    )
}