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
            const response = await fetch(process.env.NEXT_PUBLIC_API + '/check-login', fetchOptions)
            const check = await response.json();
            if(check['logged_in'] == true)
                setLoggedin(true)
            else
                setLoggedin(false)
            setShowlogin(true)
        }
        checkLogin()
        window.addEventListener('loginStatusChanged', handleLoginStatusChange);
        window.addEventListener('logout', handleLogout);
        return () => {
            window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
            window.removeEventListener('logout', handleLogout);
        };
    }, []);

    const handleLoginStatusChange = () => {
        setLoggedin(true);
    }

    const handleLogout = () => {
        setLoggedin(false);
    }
    return(
        <header>
            <Link href='/' className="left">
                <Image className="logo" src={icon} alt="keyboard logo"></Image>
                <h2>TYPE</h2>
            </Link>
            {showlogin && 
                <div className="right">
                    {loggedin ?
                        <Link href={"/profile"}>Profile</Link>:
                        <Link href={"/login"}>Login</Link>
                    }
                </div>
            }
        </header>
    )
}