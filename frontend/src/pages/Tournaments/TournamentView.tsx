import axios from '@/lib/axios'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tournament } from "@/types/tournaments";
import { Card, CardContent, CardHeader } from '@/shadcn-components/ui/card';
import { Button } from '@/shadcn-components/ui/button';

const TournamentView = () => {

    const {id} = useParams();


    const [tournament, setTournament] = useState<Tournament>()
    useEffect(() => {
        axios.get(`tournaments/${id}`)
        .then(res => {
            console.log(res.data);
            setTournament(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [id])

    return (
        <div className="container mx-auto flex min-h-screen flex-col pb-10">
            <div className="flex pt-10 h-96 justify-center relative items-center" >
                <div className="rounded-3xl w-full h-full absolute bg-cover bg-cente" style={{backgroundImage: 'url("../../public/walterworth.png")'}}/>
                <div className="z-0 w-full h-full absolute bg-gray-300 blur-md opacity-80"></div>
                <img className="h-96 z-10" src="../../public/walterworth.png"></img>
            </div>
            <div className="pt-10 flex flex-row justify-between">
                <div className='flex flex-col gap-10'>
                    <h1 className="font-bold text-3xl">{tournament?.name}</h1>
                    <div>
                        <h1 className="font-bold text-xl">Location</h1>
                        <div className="flex flex-row gap-2 items-center">
                            <svg width="30" height="50" viewBox="0 0 256 256">
                                <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                    <path d="M45 0C25.463 0 9.625 15.838 9.625 35.375C9.625 44.317 12.928 52.89 19.082 58.584L45 90l26.97 -31.765C76.072 52.89 79.375 44.317 79.375 35.375C79.375 15.838 63.537 0 45 0zM45 48.705C36.965 48.705 30.452 42.192 30.452 34.157C30.452 26.122 36.965 19.609 45 19.609C53.035 19.609 59.548 26.122 59.548 34.157C59.548 42.192 53.035 48.705 45 48.705z" fill="black" />
                                </g>
                            </svg>
                            <div>
                                <h2>{tournament?.location}</h2>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Description</h1>
                        <p>{tournament?.description}</p>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Refund Policy</h1>
                        <h2>{tournament?.refundPolicy}</h2>
                    </div>
                </div>
                <div>
                    <Card className="fixed bottom-0 left-0 w-full bg-gray-200 p-4 sm:static sm:bottom-auto sm:left-auto sm:w-auto sm:bg-transparent sm:p-0">
                        <CardHeader>Price: </CardHeader>
                        <CardContent>
                            <Button>Register</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    )

}


export default TournamentView;


