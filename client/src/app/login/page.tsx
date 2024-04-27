"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export default function Login(){
    const router = useRouter()
    let url = process.env.NEXT_PUBLIC_API + "/login"
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
            credentials: 'include' as RequestCredentials,
            body: JSON.stringify(data),
        });
        if(response.ok){
            router.push('/')
            window.dispatchEvent(new Event('loginStatusChanged'));
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
            <Link href={'/signup'}>No account? Sign Up</Link>
            <Link href={'/forgotpassword'}>forgot password?</Link>
        </>
    )
}