"use client"
import { useState } from 'react'

export default function SignUp(){
    const [enterotp, setEnterotp] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    let url = process.env.NEXT_PUBLIC_API + "/register"
    const handleSubmit = async(e: any)=> {
        e.preventDefault();
        const newUsername = e.target[0].value;
        const newEmail = e.target[1].value;
        const newPassword = e.target[2].value;
        setUsername(newUsername);
        setEmail(newEmail);
        setPassword(newPassword);
        let data = {
            name : newUsername,
            email: newEmail,
            password : newPassword
        }
        const response = await fetch(url, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: 'include' as RequestCredentials,
        });
        const res = await response.json()
        console.log(res)
        if(res.success){
            setEnterotp(true)
        }
    }
    const checkOtp = async(e:any) =>{
        e.preventDefault();
        let url = process.env.NEXT_PUBLIC_API + '/realregister'
        let otp = e.target[0].value
        let data = {
            otp: otp,
            name : username,
            email: email,
            password : password
        }
        console.log(data)
        const response = await fetch(url, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: 'include' as RequestCredentials,
        });
        console.log(response)
    }
    return(
        <>
            <div><h2>SignUp</h2></div>
            {
                !enterotp?
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>UserName</p>
                        <input type="text" required minLength={4} maxLength={20}/>
                    </label>
                    <label>
                        <p>Email</p>
                        <input type="email" required/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password"required minLength={8} maxLength={20}/>
                    </label>
                    <input type="submit" />
                </form>
                :
                <form onSubmit={checkOtp}>
                    <label>
                        <p>OTP</p>
                        <input type="number" required/>
                    </label>
                    <input type='submit' />
                </form>
            }
        </>
    )
}