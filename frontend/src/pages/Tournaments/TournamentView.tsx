import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tournament } from "@/types/tournaments";

const TournamentView = () => {

    const {id} = useParams();


    const [tournament, setTournament] = useState<Tournament>()
    useEffect(() => {
        axios.get(`tournaments/${id}`)
        .then(res => {
            console.log(res.data);
            // setTournament(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [id])

    return (
        <div>
            
        </div>

    )

}


export default TournamentView;


