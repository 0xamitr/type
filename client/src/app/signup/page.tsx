"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomForm from './../components/form'
import CustomInput from './../components/input'
import CustomButton from './../components/button'

export default function SignUp(){
    const [enterotp, setEnterotp] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [timer, setTimer] = useState(300)
    const [email, setEmail] = useState('');
    let url = process.env.NEXT_PUBLIC_API + "/register"
    const router = useRouter()

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
            const store = setInterval(function() {
                setTimer(prevTimer => prevTimer - 1)
                if(timer < 1)
                    router.push('/')
                    clearInterval(store);
            }, 1000);
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
        const response_data = await response.json()
        if(response_data.success)
            router.push('/')
        else{
            console.log(response_data)
        }
        
    }
    return(
        <>
            {
                !enterotp?
                <CustomForm onSubmit={handleSubmit}>
                    <h2 className='formhead'>SIGN UP</h2>
                    <CustomInput 
                        inputheading="Username"
                        type="text"
                        required="required"
                        minLength={4} 
                        maxLength={20}
                    />
                     <CustomInput 
                        inputheading="Email"
                        type="email"
                        required="required"                   
                    />
                     <CustomInput 
                        inputheading="Password"
                        type="password"
                        required minLength={8} 
                        maxLength={20}
                    />
                    <CustomButton 
                        type="submit"
                        text="Sign Up"
                    />
                </CustomForm>
                :
                <CustomForm onSubmit={checkOtp}>
                    <h2 className='formhead'>Enter OTP</h2>
                    <CustomInput 
                        inputheading="OTP"
                        type="number"
                        required
                    />
                    <CustomButton 
                        type="submit"
                        text="Sign Up"
                    />
                    <p>timer: {timer}</p>
                </CustomForm>
            }
        </>
    )
}