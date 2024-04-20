import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from '@/lib/axios'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn-components/ui/card";
import { Tournament } from "@/types/tournaments";



const Tournaments = () => {

    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState<Array<Tournament>>([]);

    useEffect(() => {
        axios.get(`/public/tournaments`)
        .then(res => {
            const tournamentRes: Tournament[] = res.data;
            return setTournaments(tournamentRes);
        })
        .catch(err => {
            console.log(err);
        })
    }, [setTournaments])

    return (
        <div className="container mx-auto flex min-h-screen flex-col">
            <div className="flex justify-between pt-10">
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold">Tournaments</h1>
                </div>
                <div className="flex">
                    <button onClick={() => navigate('create')} className="px-6 py-2 bg-black text-white rounded">Create Tournament</button>
                </div>
            </div>
            <div className="pt-10 flex gap-10 flex-wrap">
                {tournaments.map((tournament) => {
                    return (
                        <Card>
                            <CardHeader className="pt-5 flex justify-center items-center">
                                <img src="../../walterworth.png" alt="User profile" className="max-w-48 rounded-lg" />
                            </CardHeader>
                            <CardContent>
                                <CardTitle>{tournament.name}</CardTitle>
                                <CardDescription>{tournament.description}</CardDescription>
                            </CardContent>
                            <CardContent>
                                <CardDescription>{tournament.location}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <p>Insert host name</p>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>

    )

}


export default Tournaments;


