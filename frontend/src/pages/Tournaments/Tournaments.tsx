import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from '@/lib/axios'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn-components/ui/card";
import { Tournament } from "@/types/tournaments";
import { Checkbox } from "@/shadcn-components/ui/checkbox";
import { Button } from "@/shadcn-components/ui/button";
import { Skeleton } from "@/shadcn-components/ui/skeleton";

interface Options {
    [key: string]: string[]; // Index signature
    Status: string[];
    Level: string[];
}
const filters: Options = {
    Status: ["Upcoming", "Open", "Ended"],
    Level: ["Beginner", "Intermediate", "Advanced"]
}


const Tournaments = () => {

    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState<Array<Tournament>>([]);

    const goToTournament = (id: string) => {
        console.log('hi')
        navigate(`/tournaments/view/${id}`)
    }

    useEffect(() => {
        axios.get(`tournaments`)
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
                        {tournaments && tournaments.map(t => {
                            return (
                                <div key={t._id} className="hover:cursor-pointer hover:border-transparent border-2 border-l-4 hover:border-green-600 transition duration-300 ease-in-out" onClick={() => goToTournament(t._id ? t._id : "0")}>
                                    <Card className="flex flex-row p-3 rounded-none" >
                                        <CardContent>
                                            <img className="max-w-48 rounded-lg" src="../../walterworth.png" />
                                        </CardContent>
                                        <CardContent>
                                            <h1 className="text-2xl font-bold">{t.name}</h1>
                                            <div className="flex flex-row gap-1"><h2 className="font-bold">{t.debaters ? t.debaters.length : 0}</h2> participants</div>
                                            <p className="pt-2">{t.description}</p>
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


export default Tournaments;


