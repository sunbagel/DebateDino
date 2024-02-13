import { useState } from "react";
import '../styles/NavBar.css'

const NavBar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
  return (
    
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center text-gray-800 text-xl font-bold">
            <img src="../../walterworth.png" alt="Logo" className="h-8"/>
            <span className="self-center whitespace-nowrap">DebateDino</span>
        </a>

        <div className="flex md:order-2">
          <button type="button" className="block text-gray-800">
            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-600">
              {/* Replace with your user profile image */}
              <img src="../../walterworth.png" alt="User profile" className="object-cover h-full w-full" />
            </div>
          </button>
          <a href="#" className="navbar-link">
            Profile
            
            </a>
          <button type="button" className="text-gray-800 hover:text-gray-600 md:hidden ml-3" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <div>X</div> : <div>Menu</div>}
            {/* <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" /> */}
          </button>
        </div>

        <div className={`md:flex items-center ${isMobileMenuOpen ? 'block' : 'hidden'}`}>

            {/* links */}
            <div className="flex flex-col md:flex-row md:ml-6">
                <a href="#" className="navbar-link">Home</a>
                <a href="#" className="navbar-link">About</a>
                <a href="#" className="navbar-link">Tournaments</a>
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
