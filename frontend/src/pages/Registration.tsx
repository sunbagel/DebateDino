import { useState } from "react";
import useAuth from "@/hooks/useAuth"
import { Button } from "@/shadcn-components/ui/button";

const Registration = () => {
    const { signup } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const register = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        console.log(password);

        signup(email, password)
            .then(userCredential => {
                console.log(userCredential.user)
            })
            .catch(err => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.log(errorCode);
                console.log(errorMessage);
            })
    }
    return (
        <div>
            <div className="flex flex-col items-center min-h-screen space-y-5">
                <h1 className=" text-5xl font-bold">Register:</h1>
                <form className="flex flex-col max-w-lg" onSubmit={register}>
                    <label className="text-xl" htmlFor="name">Email:</label>
                    <input
                        className="rounded-md outline outline-2"
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <label className="text-xl" htmlFor="password">Password:</label>
                    <input
                        className="rounded-md outline outline-2"
                        type="text"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button className="my-4 text-sm rounded-md bg-blue-300" type="submit">Register</Button>
                </form>

            </div>
        
        </div>
    )
}

export default Registration