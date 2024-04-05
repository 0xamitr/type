"use client"
import { useState, useEffect } from "react";

export default function profile(){
    const [userdata, setUserData] = useState<any>(null); // Use 'any' type to suppress type checking
    const handle = async() =>{
        const fetchOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' as RequestCredentials,
          withCredentials: true,
        };
    
        const response = await fetch('http://127.0.0.1:5000/protected', fetchOptions)
        const data = await response.json()
        setUserData(data)
    }
    useEffect(()=>{
        handle();
    }, [])
    return(
        <>
            <h2>PROFILE</h2>
            {userdata && <h3>{userdata.user_id}</h3>}
        </>
    )
}