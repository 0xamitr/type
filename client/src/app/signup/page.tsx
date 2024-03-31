"use client"

export default function SignUp(){
    const handleSubmit = (e: any)=> {
        e.preventDefault();
        console.log(e.target[0].value)
        console.log(e.target[1].value)
    }
    return(
        <>
            <div><h2>SignUp</h2></div>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>UserName</p>
                    <input type="username"/>
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