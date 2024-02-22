import { useNavigate } from "react-router-dom";

const Tournaments = () => {

    const navigate = useNavigate();

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
        </div>

    )

}


export default Tournaments;


