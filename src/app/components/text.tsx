'use client'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";

export default function Text(props: any) {
    const [wpm, setWPM] = useState(0)
    const [finish, setFinish] = useState(false)
    const [wrong, setWrong] = useState(0)

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
        console.log("length", text.length)
        console.log(finish)
        const handleKeyDown = (event: any) => {
            console.log(event.key)
            if(event.key == "Escape"){
                setFinish(true)
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
            if (event.key == text[index]) {
                document.querySelector(".current")?.classList.remove("current")
                console.log(event.key)
                index++
                document.getElementById(`${index}`)?.classList.add("typed")
                document.getElementById(`${index+1}`)?.classList.add("current")
            }
            else{
                console.log("wrong", event.key, text[index], index)
                document.getElementById(`${index+1}`)?.classList.add("wrong")
                wrongvar++;
            }
            if (index == text.length) {
                console.log("ok")
                clearInterval(timerID)
                setFinish(true)
                setWrong(wrongvar)
                props.fetchRandomText()
                temp++
                const n = temp / (time / 6000)
                setWPM(Math.floor(n * 100) / 100)
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            console.log(":fsklajfkl")
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [finish, text])

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
                <>
                    <h3>Speed: {wpm} wpm</h3>
                    <h3>Accuracy: {Math.floor((100-((wrong/text.length)*100)) * 100) / 100}%</h3>
                </>
            }
        </div>
    )
}