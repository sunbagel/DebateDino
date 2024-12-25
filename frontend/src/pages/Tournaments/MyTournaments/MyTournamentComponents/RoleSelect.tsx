import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/shadcn-components/ui/toggle-group"
import { TournamentRole } from "@/types/tournaments";

interface RoleDropdownProps {
    tournamentRoles: Array<TournamentRole>;
    setTournamentRoles: (value: Array<TournamentRole>) => void;
}

const RoleSelect : React.FC<RoleDropdownProps> = ({tournamentRoles, setTournamentRoles}) => {

    const handleRoleChange = (newRoles : TournamentRole[]) => {
        setTournamentRoles(newRoles);
    }

    return (
        <ToggleGroup type="multiple" value={tournamentRoles} onValueChange={handleRoleChange} className="justify-start">
            <ToggleGroupItem value="Attending" aria-label="Toggle attending">
                Attending
            </ToggleGroupItem>
            <ToggleGroupItem value="Hosting" aria-label="Toggle hosting">
                Hosting
            </ToggleGroupItem>
        </ToggleGroup>

    )
}

export default RoleSelect

