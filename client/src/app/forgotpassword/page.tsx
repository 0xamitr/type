'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Forgotpassword(){
    const [isotp, setIsotp] = useState(true)
    const [beg, setBeg] = useState(true)
    const [emailstate, setEmailstate] = useState("")
    const url = process.env.NEXT_PUBLIC_API
    const router = useRouter()
    const handleEmailsubmit = async(e: any) =>{
        e.preventDefault();
        const email = e.target[0].value
        const data = {
            email: email
        }
        setEmailstate(email)
        const response = await fetch(url+'/forgotpassword', {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        if(response.ok)
            setBeg(false)

    }
    const handleOtpsubmit = async(e:any) =>{
        e.preventDefault();
        const otp = e.target[0].value
        const data = {
            otp: otp,
            email: emailstate
        }
        const response = await fetch(url+'/forgotpasswordotp', {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        if(response.ok)
            setIsotp(false)
    }
    const handlePasssubmit = async(e:any) =>{
        e.preventDefault();
        const pass = e.target[0].value
        const data = {
            password: pass,
            email: emailstate
        }
        const response = await fetch(url+'/resetpassword', {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        if(response.ok)
            router.push('/')
    }
    return(
        <>
            {
                beg?
                <form onSubmit={handleEmailsubmit}>
                    <h2 className='formhead'>ForgotPassword password? Enter email</h2>
                    <label>
                        <input type="email"/>
                    </label>
                    <button type='submit'>Submit</button>
                </form>
                :
                    isotp?
                    <form onSubmit={handleOtpsubmit}>
                        <h2 className='formhead'>Enter OTP</h2>
                        <h2>OTP</h2>
                        <label>
                            <input type="text"/>
                        </label>
                        <button type='submit'>Submit</button>
                    </form>
                    :
                    <form onSubmit={handlePasssubmit}>
                        <h2 className='formhead'>New Password</h2>
                        <label>
                            <input type="text"/>
                        </label>
                        <button type='submit'>Submit</button>
                    </form>
            }
        </>
    )
}