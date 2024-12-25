import { Input } from "@/shadcn-components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// props for the options
interface SearchBarProps {
    onSearch: (value: string) => void;
}

const TournamentSearchBar : React.FC<SearchBarProps> = ({onSearch}) => {

    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent page refresh
        onSearch(searchQuery); // Perform the search
    };

    return (
        <form className="relative w-full" onSubmit={handleSubmit}>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" type="submit">
                <Search className="pr-2"/>
            </button>
            
            <Input
                type="text"
                placeholder="search..."
                className="w-full pl-8 focus-visible:ring-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-slate-700 rounded-none"
                onChange={handleChange}
                value={searchQuery}
            />
        </form>
    );
};

export default TournamentSearchBar;
