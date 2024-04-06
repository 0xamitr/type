"use client"

import Image from "next/image"
import icon from "../../../public/typing-icon.svg"
import Logout from './logout';
import { useEffect, useState } from "react"
import Link from "next/link"

export function Header(){
    const [loggedin, setLoggedin] = useState(false)
    const [showlogin, setShowlogin] = useState(false)
    useEffect(()=>{
        const fetchOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include' as RequestCredentials,
            withCredentials: true,
        };

        const checkLogin = async() =>{
            const response = await fetch('http://127.0.0.1:5000/check-login', fetchOptions)
            const check = await response.json();
            if(check['logged_in'] == true)
                setLoggedin(true)
            setShowlogin(true)
        }
        checkLogin()
    }, [])
    return(
        <header>
            <div className="left">
                <Image className="logo" src={icon} alt="keyboard logo"></Image>
                <h2>TYPE</h2>
            </div>
            {showlogin && 
                <div className="right">
                    {loggedin ?
                        <Logout />:
                        <Link href={"/login"}>Login</Link>
                    }
                </div>
            }
        </header>
    )
}