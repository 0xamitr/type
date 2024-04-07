"use client"

export default function SignUp(){
    let url = "http://127.0.0.1:5000/register"
    const handleSubmit = async(e: any)=> {
        e.preventDefault();
        let data = {
            name : e.target[0].value,
            email: e.target[1].value,
            password : e.target[2].value
        }
        const response = await fetch(url, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: 'include' as RequestCredentials,
        });
    }
    return(
        <>
            <div><h2>SignUp</h2></div>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>UserName</p>
                    <input type="text" required minLength={4} maxLength={20}/>
                </label>
                <label>
                    <p>EMAIL</p>
                    <input type="email" required/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password"required minLength={8} maxLength={20}/>
                </label>
                <input type="submit" />
            </form>
        </>
    )
}