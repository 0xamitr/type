import Link from 'next/link';
import Image from "next/image"
import Logout from './logout';
import { useEffect, useState } from 'react';
import icon from "../../../public/usericon.png"

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
    <div className="dropdown">
      <div className="dropbtn">
        {/* <Image className="logo" src={icon} alt="keyboard logo"></Image> */}
        <h2>{username}</h2>
      </div>
      <div className="dropdown-content">
        <Link href="/profile">
          <p>Profile</p>
        </Link>
        <Logout />
      </div>
    </div>
  );
};

export default DropdownMenu;
