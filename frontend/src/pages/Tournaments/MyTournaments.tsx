import axios from '@/lib/axios'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tournament } from "@/types/tournaments";
import FilterTag from '@/components/tournament/FilterTag';
import { MapPin, UserRound } from "lucide-react"
import { Card, CardContent } from '@/shadcn-components/ui/card';
import { Skeleton } from '@/shadcn-components/ui/skeleton';
import { Checkbox } from '@/shadcn-components/ui/checkbox';
import useAuth from '@/hooks/useAuth';
import { TournamentUser } from '@/types/users';
import { format } from 'date-fns';

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
    const [tournaments, setTournaments] = useState<Array<Tournament>>()
    const [user, setUser] = useState<TournamentUser>()

    const goToTournament = (id: string) => {
        navigate(`/tournaments/view/${id}`)
    }

    useEffect(() => {

        async function getTournaments(){
            try {
                if (!fbUser) {
                    console.error("Couldn't fetch profile - User not signed in, or user id not found");
                    return;
                }

                const token = await fbUser.getIdToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                axios.get(`/users/${fbUser?.uid}/tournaments?role=debater`, config)
                    .then(res => {
                        const tournamentRes: Tournament[] = res.data;
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
        
    }, [setTournaments, fbUser])

    return (
        <div className="container mx-auto flex min-h-screen flex-col">
            <div className="flex justify-between pt-10">
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold">My Tournaments</h1>
                </div>
                <div className="flex">
                    <button onClick={() => navigate('create')} className="px-6 py-2 bg-black text-white rounded">Create Tournament</button>
                </div>
            </div>
            <div className="pt-10 flex">
                <div className="flex flex-col md:flex-row gap-20">
                    <div className="flex flex-row md:flex-col gap-10 md:gap-2">
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
                    <div className="flex flex-col gap-3">
                        {!tournaments && (
                            <div className="flex flex-col space-y-3">
                                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        )}
                        {tournaments && tournaments.reverse().map(t => {
                            return (
                                <div key={t._id} className="hover:cursor-pointer hover:border-transparent border-2 border-l-4 hover:border-green-600 transition duration-300 ease-in-out" onClick={() => goToTournament(t._id ? t._id : "0")}>
                                    <Card className="flex flex-row p-3 rounded-none" >
                                        <div className="flex flex-row w-3/4">
                                            <CardContent>
                                                <img className="max-w-48 rounded-lg" src="../../debatedino.png" />
                                            </CardContent>

                                            <CardContent className="space-y-3">
                                                <h1 className="text-2xl font-bold">{t.name}</h1>
                                                <p>{format(new Date(t.date), 'MM-dd-yyyy')}</p>
                                                <p className="pt-2">{t.description}</p>

                                                <div className="mt-10 pt-10">
                                                    <FilterTag name="Beginner"/>
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
            </div>
        </div>

    )

}


export default MyTournaments;


