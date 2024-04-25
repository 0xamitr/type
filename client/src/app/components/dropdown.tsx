import Link from 'next/link';
import Logout from './logout';

const DropdownMenu = () => {
  return (
    <div className="dropdown">
      <p className="dropbtn">Menu</p>
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
