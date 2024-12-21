import { Button } from "@/shadcn-components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn-components/ui/dropdown-menu"
import { SortOption } from "@/types/tournamentSortOptions";
import { useState } from "react"

// props for the options
interface SortDropdownProps {
    position: SortOption;
    setPosition: (value: SortOption) => void;
}

const SortDropdown : React.FC<SortDropdownProps> = ({position, setPosition}) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={position} onValueChange={(value) => setPosition(value as SortOption)}>
                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="host">Host</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="duration">Duration</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dinos">Number of Dinos</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
  

export default SortDropdown;
