"use client"
import { useState, useEffect } from "react";

export default function Profile(){
    const [data, setData] = useState<any>(null)

    const handle = async() =>{
        const fetchOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' as RequestCredentials,
          withCredentials: true,
        }
    
        const response = await fetch(process.env.NEXT_PUBLIC_API + '/protected', fetchOptions)
        const responsedata = await response.json()
        console.log(responsedata)
        setData(responsedata)
    }

    useEffect(()=>{
        handle();
    }, [])

    return(
        <div className="profile">
            <h1 className="profile-center">PROFILE</h1>
            {data &&
                <div className="profile-container">
                    <h2>USER DATA</h2>
                    <div className="profile-user">
                        <p>ID: {data.user_data.id}</p>
                        <p>Username: {data.user_data.username}</p>
                    </div>
                    <h2 className="profile-center">TEXTS</h2>
                    <h3>Daily Stats</h3>
                    <div className="profile-text">
                        <div className="box">
                            <p>{(data.text_data.text_tests_today)}</p>
                            <p>Tests Today</p>
                        </div>
                        <div className="box">
                            <p>{((data.text_data.cumm_text_accuracy_today) / data.text_data.text_tests_today).toFixed(2)}</p>
                            <p>Accuracy Today</p>
                        </div>
                        <div className="box">
                            <p>{(data.text_data.highest_text_wpm_today).toFixed(2)}</p>
                            <p>Highest WPM Today</p>
                        </div>
                    </div>
                    <h3>All Time Stats</h3>
                    <div className="profile-text">
                        <div className="box">
                            <p>{(data.text_data.text_tests)}</p>
                            <p>Total Tests</p>
                        </div>
                        <div className="box">
                            <p>{((data.text_data.cumm_text_accuracy) / data.text_data.text_tests).toFixed(2)}</p>
                            <p>Overall Accuracy</p>
                        </div>
                        <div className="box">
                            <p>{((data.text_data.cumm_text_wpm) / data.text_data.text_tests).toFixed(2)}</p>
                            <p>Overall WPM</p>
                        </div>
                        <div className="box">
                            <p>{(data.text_data.highest_text_wpm_ever).toFixed(2)}</p>
                            <p>Highest WPM Ever</p>
                        </div>
                    </div>
                    <h2 className="profile-center">CODE</h2>
                    <h3>Daily Stats</h3>
                    <div className="profile-code">
                        <div className="box">
                            <p>{(data.code_data.code_tests_today).toFixed(2)}</p>
                            <p>Tests Today</p>
                        </div>
                        <div className="box">
                            <p>{((data.code_data.cumm_code_accuracy_today) / data.code_data.code_tests_today).toFixed(2)}</p>
                            <p>Accuracy Today</p>
                        </div>
                        <div className="box">
                            <p>{(data.code_data.highest_code_wpm_today).toFixed(2)}</p>
                            <p>Highest WPM Today</p>
                        </div>
                    </div>
                    <h3>All Time Stats</h3>
                    <div className="profile-code">
                        <div className="box">
                            <p>{(data.code_data.code_tests)}</p>
                            <p>Total Tests</p>
                        </div>
                        <div className="box">
                            <p>{((data.code_data.cumm_code_accuracy) / data.code_data.code_tests).toFixed(2)}</p>
                            <p>Overall Accuracy</p>
                        </div>
                        <div className="box">
                            <p>{((data.code_data.cumm_code_wpm) / data.code_data.code_tests).toFixed(2)}</p>
                            <p>Overall WPM</p>
                        </div>
                        <div className="box">
                            <p>{(data.code_data.highest_code_wpm_ever).toFixed(2)}</p>
                            <p>Highest WPM Ever</p>
                        </div>
                    </div>
                </div>     
            }
        </div>
    )
}