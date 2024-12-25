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
    option: SortOption;
    setOption: (value: SortOption) => void;
}

const SortDropdown : React.FC<SortDropdownProps> = ({option, setOption}) => {

    const DEFAULT_SORT_OPTION: SortOption = "name";

    // type checker
    const isSortOption = (value: string): value is SortOption => {
        return ["name", "host", "date", "duration", "dinos"].includes(value);
    };

    const selectOption = (value: string) => {
        if(isSortOption(value)){
            // type safe
            setOption(value);
        } else {
            console.warn("Error selecting a sort option received: ${value}. Reverting to default sorting.");
            setOption(DEFAULT_SORT_OPTION);
        }
    }
    

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={option} onValueChange={selectOption}>
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
