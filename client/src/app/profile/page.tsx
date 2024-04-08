"use client"
import { useState, useEffect } from "react";

export default function Profile(){
    const [data, setData] = useState<any>(null); // Use 'any' type to suppress type checking
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
        const responsedata = await response.json()
        console.log(responsedata)
        setData(responsedata)
    }
    useEffect(()=>{
        handle();
    }, [])

    return(
        <>
            <h2>PROFILE</h2>
            {data &&
                <div>
                    <div>
                        <p>Id: {data.user_data.id}</p>
                        <p>Username: {data.user_data.username}</p>
                    </div>
                    <div>
                        <p>Total Tests: {(data.text_data.text_tests)}</p>
                        <p>Tests Today: {(data.text_data.text_tests_today)}</p>
                        <p>Overall Accuracy: {(data.text_data.cumm_text_accuracy) / data.text_data.text_tests}</p>
                        <p>Accuracy Today: {(data.text_data.cumm_text_accuracy_today) / data.text_data.text_tests_today}</p>
                        <p>Overall WPM: {(data.text_data.cumm_text_wpm) / data.text_data.text_tests}</p>
                        <p>Highest WPM Today: {(data.text_data.highest_text_wpm_today)}</p>
                        <p>Highest WPM Ever: {(data.text_data.highest_text_wpm_ever)}</p>
                    </div>
                    <div>
                    <p>Total Tests: {(data.code_data.code_tests)}</p>
                    <p>Tests Today: {(data.code_data.code_tests_today)}</p>
                    <p>Overall Accuracy: {(data.code_data.cumm_code_accuracy) / data.code_data.code_tests}</p>
                    <p>Accuracy Today: {(data.code_data.cumm_code_accuracy_today) / data.code_data.code_tests_today}</p>
                    <p>Overall WPM: {(data.code_data.cumm_code_wpm) / data.code_data.code_tests}</p>
                    <p>Highest WPM Today: {(data.code_data.highest_code_wpm_today)}</p>
                    <p>Highest WPM Ever: {(data.code_data.highest_code_wpm_ever)}</p>

                    </div>
                </div>     
            }
        </>
    )
}