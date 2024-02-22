import { useState } from "react";
const CreateTournaments = () => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [refundPolicy, setRefundPolicy] = useState('');

    const changeText = (e: React.ChangeEvent<HTMLInputElement>, setFunc: (a: string) => void): void => {
        setFunc(e.target.value);
    }

    const createTournament = (e: React.ChangeEvent<HTMLButtonElement>) => {
        e.preventDefault();

    }

    return (
        <div className="container mx-auto flex min-h-screen flex-col">
            <div className="flex pt-10">
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold">Create a Tournament</h1>
                </div>
            </div>
            <div className="pt-5">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tournament Name
                        </label>
                        <input value={name} onChange={(e) => changeText(e, setName)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="How would you like to call it?" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description
                        </label>
                        <input value={desc} onChange={(e) => changeText(e, setDesc)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="What's it about?" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Date
                        </label>
                        <input value={date} onChange={(e) => changeText(e, setDate)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="When will it happen?" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Location
                        </label>
                        <input value={location} onChange={(e) => changeText(e, setLocation)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Where will it happen?" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Refund Policy
                        </label>
                        <input value={refundPolicy} onChange={(e) => changeText(e, setRefundPolicy)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Refund Policy" required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onSubmit={createTournament} className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}


export default CreateTournaments;


