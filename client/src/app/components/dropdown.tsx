import Link from 'next/link';
import Image from "next/image"
import Logout from './logout';
import { useEffect, useState } from 'react';
import icon from "../../../public/usericon.png"
import styles from "./dropdown.module.css"

const DropdownMenu = () => {
  const [username, setUsername] = useState<string>("")
  const handle = async() =>{
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials,
      withCredentials: true,
    }
    const response = await fetch(process.env.NEXT_PUBLIC_API + '/getuser', fetchOptions)
    const data = await response.json()
    const user = data.username.username
    const capitalized = user.charAt(0).toUpperCase() + user.slice(1)
    setUsername(capitalized)
  }
  useEffect(()=>{
    handle()
  }, [])

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropbtn}>
        {/* <Image className="logo" src={icon} alt="keyboard logo"></Image> */}
        <h2>{username}</h2>
      </div>
      <div className={styles.dropdowncontent}>
        <Link href="/profile">
          <p className={styles.p}>Profile</p>
        </Link>
        <Logout />
      </div>
    </div>
  );
};

export default DropdownMenu;
