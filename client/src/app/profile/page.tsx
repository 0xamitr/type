"use client"
import { useState, useEffect } from "react";

export default function Profile(){
    const [user_data, setUser_Data] = useState<any>(null); // Use 'any' type to suppress type checking
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
        console.log(data)
        setUser_Data(data)
    }
    useEffect(()=>{
        handle();
    }, [])

    const renderValue = (value: any) => {
        return value !== null ? value : 0;
      };
    return(
        <>
            <h2>PROFILE</h2>
            {user_data && 
                <div>
                    <p>Id: {user_data.id}</p>
                    <p>Username: {user_data.username}</p>
                    <p>Total Tests: {renderValue(user_data.total_tests)}</p>
                    <p>Tests Today: {renderValue(user_data.tests_today)}</p>
                    <p>Overall Accuracy: {renderValue(user_data.overall_accuracy)}</p>
                    <p>Accuracy Today: {renderValue(user_data.accuracy_today)}</p>
                    <p>Overall WPM: {renderValue(user_data.overall_wpm)}</p>
                    <p>WPM Today: {renderValue(user_data.wpm_today)}</p>
                    <p>Highest WPM Ever: {renderValue(user_data.highest_wpm_ever)}</p>
                    <p>Highest WPM Today: {renderValue(user_data.highest_wpm_today)}</p>
                    <p>Highest Accuracy Today: {renderValue(user_data.highest_accuracy_today)}</p>
                </div>
            }
        </>
    )
}