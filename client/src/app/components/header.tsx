"use client"

import Image from "next/image"
import icon from "../../../public/typing-icon.svg"
import Link from 'next/link'
import {getToken, destroyToken} from '../Features/TokenStorage'
import { useEffect, useState } from "react"

export function Header(){
    const [isloggedin, setIsloggedin] = useState(false)
    useEffect(()=>{
        const token = getToken();
        if(token != null)
            setIsloggedin(true)
    })
    return(
        <header>
            <div className="left">
                <Image className="logo" src={icon} alt="keyboard logo"></Image>
                <h2>TYPE</h2>
            </div>
            <div className="right">
                {
                    isloggedin?
                    <a onClick={destroyToken}>logout</a>
                    :
                    <Link href="/login">Login</Link>
                }
            </div>
        </header>
    )
}