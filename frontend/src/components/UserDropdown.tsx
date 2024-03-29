import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/shadcn-components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom";



const UserDropdown = () => {

    const navigate = useNavigate();

    return (

        <DropdownMenu>
            <DropdownMenuTrigger>
                
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-600">
                    {/* Replace with your user profile image */}
                    <img src="../../walterworth.png" alt="User profile" className="object-cover h-full w-full" />
                </div>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Mount Ashwort</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={()=> navigate('profile')}>
                    Profile
                </DropdownMenuItem>

                {/* maybe make a separate view for personal tournaments */}
                <DropdownMenuItem onSelect={() => navigate('tournaments')}>
                    My Tournaments
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem>Sign Out</DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>



    )

}


export default UserDropdown;


