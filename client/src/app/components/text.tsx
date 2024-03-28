'use client'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";
import React from 'react';

export default function Text(props: any) {
    const [wpm, setWPM] = useState(0)
    const [finish, setFinish] = useState(false)
    const [wrong, setWrong] = useState(0)
    const [check, setCheck] = useState(false)
    const [lswpm , setlsWpm] = useState(0);

    let time: number = 0
    let text: String = props.text
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
        const a = localStorage.getItem("WPMcount")
        const b = localStorage.getItem("totalWPM")
        if(a!=null && b!=null)
            setlsWpm(Math.floor(parseFloat(b)/parseFloat(a) * 100) / 100)
        const handleKeyDown = (event: any) => {
            if(event.key == " "){
                console.log("its space")
                event.preventDefault()
            }
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
                console.log(document.getElementById(`${index+2}`)?.textContent)
                if(document.getElementById(`${index+2}`)?.textContent == "    "){
                    index++
                    console.log("fafda")
                }
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
                const n = temp / (time / 6000)
                const wpmtemp = Math.floor(n * 100) / 100
                const totalWPM = localStorage.getItem("totalWPM")
                const WPMcount = localStorage.getItem("WPMcount")
                if(totalWPM == null)
                    localStorage.setItem("totalWPM", ""+wpmtemp)
                else    
                    localStorage.setItem("totalWPM", (parseFloat(totalWPM) + wpmtemp) + "")
                if(WPMcount == null)
                    localStorage.setItem("WPMcount", ""+1)
                else
                    localStorage.setItem("WPMcount", (parseInt(WPMcount)+1) + "")
                clearInterval(timerID)
                setFinish(true)
                setWrong(wrongvar)
                props.fetchRandomText()
                setCheck(!check)
                temp++
                setWPM(wpmtemp)
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [finish, check, text])

    return (
        <>
            <p>
                {Array.from(text).map((letter: String) => {
                    setindex++
                    let wtf = ""
                    if(setindex == 1)
                        wtf = "current"
                    return (
                        <React.Fragment key={uuidv4()}> 
                            <span id={`${setindex}`} className={wtf}>
                                {letter == "^" ? <>&nbsp;&nbsp;&nbsp;&nbsp;</>: letter}
                            </span>
                            {letter == "↵" && <br />}
                        </React.Fragment>
                    ) 
                })}
            </p>
            {finish &&
                <>
                    <p>Speed: {wpm} wpm</p>
                    <p>Accuracy: {Math.floor((100-((wrong/text.length)*100)) * 100) / 100}%</p>
                </>
            }
            <p>Average Speed: {lswpm}</p>
        </>
    )
}