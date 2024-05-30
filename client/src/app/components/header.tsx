"use client"
import Image from "next/image"
import icon from "../../../public/typing-icon.svg"
import DropdownMenu from './dropdown';
import { useEffect, useState } from "react"
import Link from "next/link"
import styles from "./header.module.css"

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
        <header id={styles.header}>
            <Link href='/' className={styles.left}>
                <Image className={styles.logo} src={icon} alt="keyboard logo"></Image>
                <h1>TYPE</h1>
            </Link>
            {showlogin && 
                <div className={styles.right}>
                    {loggedin ?
                        <DropdownMenu />
                        :
                        <Link href={"/login"}><h2>Login</h2></Link>
                    }
                </div>
            }
        </header>
    )
}