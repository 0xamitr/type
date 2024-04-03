"use client"

import {storeToken, getToken} from '../Features/TokenStorage'
import { redirect } from 'next/navigation'

export default function Login(){
    let url = "http://127.0.0.1:5000/login"
    const handleSubmit = async(e: any)=> {
        e.preventDefault();
        let data = {
            email : e.target[0].value,
            password : e.target[1].value,
        }
        const response = await fetch(url, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseBody = await response.json();
        console.log("Response:", response);
        console.log("Response Body:", responseBody);
        if(responseBody.access_token && getToken() == null){
            storeToken(responseBody.access_token)
            redirect('/');
        }
    }
    return(
        <>
            <div><h2>LOGIN</h2></div>
            <form onSubmit={handleSubmit}>
                <label >
                    <p>Email</p>
                    <input type="email"/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password"/>
                </label>
                <input type="submit" />
            </form>
        </>
    )
}