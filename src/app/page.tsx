'use client'

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {

  const [wpm, setWPM] = useState(0)
  const [finish, setFinish] = useState(false)

  let time:number = 0
  const text:String = "Hi! what is this that you are doing!"
  let setindex:number = 0
  let index:number = 0
  let timerID: any
  let start = false
  let temp = 0

  const startTime = () => {
    timerID = setInterval(()=>{
      time++;
    }, 10)
  }

  const handleKeyDown = (event: any) => {
    if(start == false){
      startTime()
      start = true
    }
    if(event.key == " "){
      temp++
    }
    console.log(time)
    if(event.key == text[index]){
      console.log(event.key)
      index++
      document.getElementById(`${index}`)?.classList.add("typed")
    }
    if(index == text.length) {
      console.log("done")
      clearInterval(timerID)
      setFinish(true)
      temp++
      const n = temp / (time / 6000)
      setWPM(Math.floor(n*100)/100)

    }
  }
  useEffect(()=>{
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [])

   return (
    <main>
      <div>
        <h2>
        {Array.from(text).map((letter: String)=> {
          {setindex++}
          return(
            <span id={`${setindex}`}>{letter}</span>
          )
        })}
        </h2>
        {finish &&
          <h2>{wpm} wpm</h2>        
        }
      </div>
    </main>
  )
}
