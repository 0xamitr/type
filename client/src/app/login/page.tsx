"use client"
import styles from './styles.module.css'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import CustomForm from './../components/form'
import CustomInput from './../components/input'
import CustomButton from './../components/button'

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
            <CustomForm onSubmit={handleSubmit}>
                <h2 className='formhead'>LOGIN</h2>
                <CustomInput
                    inputheading={"Email"}
                    inputtype={"email"}
                />
                <CustomInput
                    inputheading={"Password"}
                    inputtype={"password"}
                />
                <CustomButton 
                    type='submit'
                    text='Login'
                />
                <Link href={'/signup'}><p>No account? Sign Up</p></Link>
                <Link href={'/forgotpassword'}><p>forgot password?</p></Link>
            </CustomForm>
        </>
    )
}