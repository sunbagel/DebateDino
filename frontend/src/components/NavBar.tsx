import { useState } from "react";
import '../styles/NavBar.css';
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/shadcn-components/ui/button";



const NavBar = () => {

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  return (
    
    <nav className="bg-lime-200 bg-opacity-50 shadow-md">
      <div className="container mx-auto px-6 py-8 flex justify-between items-center">
        <Link to="/" className="flex items-center text-gray-800 text-xl font-bold">
            <img src="../../debatedino.png" alt="Logo" className="h-8"/>
            <span className="self-center whitespace-nowrap">DebateDino</span>
        </Link>

        <div className="flex md:order-2">
          
          
          { currentUser ? <UserDropdown/> : <Button onClick={() => navigate("/login")}>Log In</Button>}


          <button type="button" className="text-gray-800 hover:text-gray-600 md:hidden ml-3" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <div>X</div> : <div>Menu</div>}
            {/* <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" /> */}
          </button>
        </div>

        <div className={`md:flex items-center ${isMobileMenuOpen ? 'block' : 'hidden'}`}>

            {/* links */}
            <div className="flex flex-col md:flex-row md:ml-6">
                <Link to="/" className="navbar-link">Home</Link>
                <Link to="/about" className="navbar-link">About</Link>
                <Link to="/tournaments" className="navbar-link">Tournaments</Link>
            </div>

            {/* search */}
            <div className="md:flex md:justify-end mt-2 md:mt-0 md:w-1/2 lg:w-1/4">
                <div className="relative">
                <input type="text" className="search-bar" placeholder="Search" />
                <div className="absolute top-0 left-0 inline-flex items-center p-2">
                    {/* <SearchIcon className="h-6 w-6 text-gray-500" /> */}
                </div>
                </div>
            </div>


        </div>
      </div>
    </nav>
    

  )
}

export default NavBar
