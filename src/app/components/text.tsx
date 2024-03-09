'use client'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";
import React from 'react';

export default function Text(props: any) {
    const [wpm, setWPM] = useState(0)
    const [finish, setFinish] = useState(false)
    const [wrong, setWrong] = useState(0)
    const [check, setCheck] = useState(false)

    let time: number = 0
    let text: String = props.text;
    let setindex: number = 0
    let index: number = 0
    let timerID: any
    let start: boolean = false
    let temp: number = 0
    let wrongvar: number = 0

    const startTime = () => {
        timerID = setInterval(() => {
            time++;
        }, 10)
    }
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if(event.key == "Escape"){
                setCheck(!check)
            }
            if(event.key == "Shift" || event.key == "CapsLock" || event.key == "Control"){
                return
            }
            if (!start) {
                startTime()
                start = true
            }
            if (event.key == " ") {
                temp++
            }
            if (event.key == text[index] || (text[index] == "↵" && event.key == "Enter")) {
                document.querySelector(".current")?.classList.remove("current")
                index++
                document.getElementById(`${index}`)?.classList.add("typed")
                document.getElementById(`${index+1}`)?.classList.add("current")
            }
            else{
                if(!document.getElementById(`${index+1}`)?.classList.contains("wrong")){
                    document.getElementById(`${index+1}`)?.classList.add("wrong")
                    wrongvar++;
                }
            }
            if (index == text.length) {
                clearInterval(timerID)
                setFinish(true)
                setWrong(wrongvar)
                props.fetchRandomText()
                setCheck(!check)
                temp++
                const n = temp / (time / 6000)
                setWPM(Math.floor(n * 100) / 100)
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [finish, check, text])

    return (
        <div>
            <h2>
                {Array.from(text).map((letter: String) => {
                    setindex++
                    let wtf = ""
                    if(setindex == 1)
                        wtf = "current"
                    return (
                        <React.Fragment key={uuidv4()}> 
                            <span id={`${setindex}`} className={wtf}>
                                {letter}
                            </span>
                            {letter == "↵" && <br />}
                        </React.Fragment>
                    ) 
                })}
            </h2>
            {finish &&
                <>
                    <h3>Speed: {wpm} wpm</h3>
                    <h3>Accuracy: {Math.floor((100-((wrong/text.length)*100)) * 100) / 100}%</h3>
                </>
            }
        </div>
    )
}