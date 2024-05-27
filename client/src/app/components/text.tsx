'use client'
import styles from './text.module.css'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";
import React from 'react'
import {submit} from '../Features/SubmitText'

export default function Text(props: any) {
    const [wpm, setWPM] = useState(0)
    const [finish, setFinish] = useState(false)
    const [check, setCheck] = useState(false)
    const [accuracy, setAccuracy] = useState(0)

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
        const handleKeyDown = (event: any) => {
            if(event.key == " "){
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
                document.querySelector(styles.current)?.classList.remove(styles.current)
                if(document.getElementById(`${index+2}`)?.textContent == "    "){
                    index++
                }
                index++
                document.getElementById(`${index}`)?.classList.add(styles.typed)
                document.getElementById(`${index+1}`)?.classList.add(styles.current)
            }
            else{
                if(!document.getElementById(`${index+1}`)?.classList.contains(styles.wrong)){
                    document.getElementById(`${index+1}`)?.classList.add(styles.wrong)
                    wrongvar++;
                }
            }
            if (index == text.length) {
                const n = temp / (time / 6000)
                const wpmtemp = Math.floor(n * 100) / 100
                clearInterval(timerID)
                setFinish(true)
                props.fetchRandomText()
                setCheck(!check)
                temp++
                setWPM(wpmtemp)
                const acc = Math.floor((100-((wrongvar/text.length)*100)) * 100) / 100
                setAccuracy(acc)
                console.log(acc)
                submit(wpmtemp, acc, props.iscode)
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [finish, check, text])

    return (
        <>
            <p className={styles.test}>
                {Array.from(text).map((letter: String) => {
                    setindex++
                    let wtf = ""
                    if(setindex == 1)
                        wtf = styles.current
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
                    <p>Accuracy: {accuracy}%</p>
                </>
            }
        </>
    )
}