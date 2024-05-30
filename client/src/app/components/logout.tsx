import { useRouter } from "next/navigation";
import styles from "./logout.module.css"

export default function Logout(){
  const router = useRouter()
    const logout = async() =>{
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API + '/logout', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          console.log('Logout successful');
          router.push('/')
          window.dispatchEvent(new Event('logout'));
        } 
        else {
          console.error('Logout failed');
        }
      } 
      catch (error) {
        console.error('Error during logout:', error);
      }
    }
    return(
        <div onClick={logout}>
          <p className={styles.p}>Logout</p>
        </div>
    )
}