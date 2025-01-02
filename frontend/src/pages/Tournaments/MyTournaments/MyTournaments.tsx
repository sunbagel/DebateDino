import axios from '@/lib/axios'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tournament, TournamentRole } from "@/types/tournaments";
import FilterTag from '@/pages/Tournaments/MyTournaments/MyTournamentComponents/FilterTag';
import { CalendarDays, MapPin, UserRound } from "lucide-react"
import { Card, CardContent } from '@/shadcn-components/ui/card';
import { Skeleton } from '@/shadcn-components/ui/skeleton';
import { Checkbox } from '@/shadcn-components/ui/checkbox';
import useAuth from '@/hooks/useAuth';
import { TournamentUser } from '@/types/users';
import { format } from 'date-fns';
import TournamentSearchBar from '@/pages/Tournaments/MyTournaments/MyTournamentComponents/TournamentSearchBar';
import SortDropdown from './MyTournamentComponents/SortDropdown';
import { SortOption } from '@/types/tournamentSortOptions';
import RoleSelect from './MyTournamentComponents/RoleSelect';

interface Options {
    [key: string]: string[]; // Index signature
    Status: string[];
    Level: string[];
}

const filters: Options = {
    Status: ["Upcoming", "Open", "Ended"],
    Level: ["Beginner", "Intermediate", "Advanced"]
}

const MyTournaments = () => {
    const navigate = useNavigate();

    // authentication details
    const { currentUser: fbUser } = useAuth();
    const [tournaments, setTournaments] = useState<Array<Tournament>>();
    const [user, setUser] = useState<TournamentUser>();
    const [sortOption, setSortOption] = useState<SortOption>("name");
    const [tournamentRoles, setTournamentRoles] = useState<Array<TournamentRole>>([]);
    

    const goToTournament = (id: string) => {
        navigate(`/tournaments/view/${id}`)
    }

    const onSearch = (searchQuery : string) => {
        console.log("query", searchQuery);
    }

    const getToken = async () => {
        try {
            if (!fbUser) {
                console.error("Couldn't fetch profile - User not signed in, or user id not found");
                return;
            }
    
            const token = await fbUser.getIdToken();
            return token;

        } catch(err){
            console.error("Failed to get bearer token");
            throw err;
        }
        
    }

    useEffect(() => {

        async function getTournaments(){
            try {

                const token = await getToken();
                
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        roles: tournamentRoles
                    },
                    paramsSerializer:{
                        // formats query parameters
                        indexes: null
                    }
                };

                axios.get(`/users/${fbUser?.uid}/tournaments`, config)
                    .then(res => {
                        const tournamentRes: Tournament[] = res.data;
                        console.log(tournamentRes);
                        return setTournaments(tournamentRes);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            } catch (err) {
                console.error(err);
            }

        }

        getTournaments();
        console.log(tournamentRoles)
        
    }, [setTournaments, fbUser, tournamentRoles])

    useEffect(() => {
        console.log(sortOption);
        // TODO: sort existing tournaments based on fields...
        // backend or frontend logic? if backend then it should be grouepd with tounramentRoles + search query
    }, [sortOption])


    return (
        <div className="container mx-auto flex min-h-screen flex-col">
    
            <div className="flex flex-col justify-between pt-10 space-y-6">
                <h1 className="text-5xl font-bold">My Tournaments</h1>
                <RoleSelect tournamentRoles={tournamentRoles} setTournamentRoles={setTournamentRoles}/>
            </div>
            
            
            <div className="pt-10 flex">
                <div className="flex flex-col px-5 lg:w-3/4 md:w-3/4 md:flex-row gap-20">
                    <div className="flex flex-col flex-grow gap-3 ">
                        {/* TODO: MAKE THE SKELETON MATCH THE ACTUAL CARD */}
                        {!tournaments && (
                            <div className="flex flex-col space-y-3">
                                <p className="text-3xl font-bold pb-4 my-4">No tournaments found!</p>
                                <Skeleton className="h-[125px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        )}
                        {tournaments && tournaments.reverse().map(t => {
                            return (
                                <div key={t._id} className="border-transparent hover:cursor-pointer hover:border-lime-300 hover:rounded-lg border-2 border-l-4 transition duration-300 ease-in-out rounded-lg" onClick={() => goToTournament(t._id ? t._id : "0")}>
                                    <Card className="flex flex-row p-3 rounded-md" >
                                        <div className="flex flex-row w-3/4">
                                            <CardContent>
                                                <img className="max-w-48 rounded-lg" src="../../debatedino.png" />
                                            </CardContent>

                                            <CardContent className="space-y-3">
                                                <h1 className="text-2xl font-bold">{t.name}</h1>
                                                <div className="flex flex-row space-x-2">
                                                    <CalendarDays />
                                                    <p className="text-gray-700 text-md font-medium">
                                                        <span className="text-lime-500 font-semibold">
                                                            {format(new Date(t.startDate), 'MMM dd, yyyy')}
                                                        </span>
                                                        <span className="mx-1 text-gray-500">to</span>
                                                        <span className="text-lime-500 font-semibold">
                                                            {format(new Date(t.endDate), 'MMM dd, yyyy')}
                                                        </span>
                                                    </p>
                                                </div>
                                                
                                                <p className="pt-2">{t.description}</p>

                                                <div className="mt-10 pt-10">
                                                    <FilterTag name={t.tournamentLevel}/>
                                                </div>
                                                
                                            </CardContent>
                                        </div>

                                        <div className="border-l border-gray-300 h-auto self-stretch"></div>

                                        <CardContent className="flex flex-col space-y-3 items-start text-sm text-gray-700 w-1/4">
                                            <p className="flex items-center space-x-2 text-lg">
                                                <UserRound/>
                                                <span className="font-medium">{t.debaters ? t.debaters.length : 0} dinos</span>
                                            </p>
                                            <p className="flex space-x-2 items-center text-lg ">
                                                <MapPin/>
                                                <span>{t.location || "N/A"}</span>
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                    
                </div>
                <div className="flex flex-row px-5 md:flex-col gap-10 md:gap-2 lg:ml-auto lg:w-[25%] md:w-[300px]">
                    <TournamentSearchBar onSearch={onSearch} />
                    <SortDropdown option={sortOption} setOption={setSortOption} />
                    {Object.keys(filters).map((category) => {
                        return (
                            <div key={category}>
                                <h3 className="font-bold">{category}</h3>
                                <div className="flex flex-col">
                                    {filters[category].map((f: string) => {
                                        return (
                                            <div key={f} className="flex flex-row items-center gap-1">
                                                <Checkbox key={f} id={f} />
                                                <label htmlFor={f}>
                                                    {f}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )

}


export default MyTournaments;


