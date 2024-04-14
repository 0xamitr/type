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
    
        fetch(process.env.NEXT_PUBLIC_API + '/logout', fetchOptions)
        window.dispatchEvent(new Event('logout'));
    }
    return(
        <button onClick={logout}>LOGOUT</button>
    )
}