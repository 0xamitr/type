
export async function submit(wpm: Number, accuracy: Number, iscode: boolean){
    let user
    const fetchOptions1 = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' as RequestCredentials,
        withCredentials: true,
    };

    const res = await fetch('http://127.0.0.1:5000/check-login', fetchOptions1)
    const check = await res.json();
    if(check['logged_in'] == true)
        user = check['user']
    else
        return
    const fetchOptions = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'wpm': wpm, 
            'accuracy': accuracy,
            'user': user,
            'iscode': iscode,
        }),
    }
    const response = await fetch('http://127.0.0.1:5000/submit', fetchOptions)
    console.log("ok", await response.json())
}