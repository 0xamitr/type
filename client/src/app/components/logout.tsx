export default function Logout(){
    const logout = async() =>{
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API + '/logout', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          console.log('Logout successful');
        } 
        else {
          console.error('Logout failed');
        }
      } 
      catch (error) {
        console.error('Error during logout:', error);
      }
      window.dispatchEvent(new Event('logout'));
    }
    return(
        <div onClick={logout}>
          <p>Logout</p>
        </div>
    )
}