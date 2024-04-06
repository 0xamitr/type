export default function Logout(){
    const logout = async() =>{
        const fetchOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' as RequestCredentials,
          withCredentials: true,
        };
    
        fetch('http://127.0.0.1:5000/logout', fetchOptions)
    }
    return(
        <button onClick={logout}>LOGOUT</button>

    )
}