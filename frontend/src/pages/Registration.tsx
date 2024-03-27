import { useState } from "react";
import useAuth from "@/hooks/useAuth"
import { Button } from "@/shadcn-components/ui/button";
import axios from "@/lib/axios";
import { auth } from "@/lib/firebase-config";
import { useLocation, useNavigate } from "react-router-dom";

const Registration = () => {
    const { signup } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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
                // console.log(userCredential.user)
                return userCredential.user.getIdToken();
            })
            .then(token => {
                // console.log("token: ", token)
                const userData = {
                    fb_id: auth.currentUser?.uid,
                    name: "test fb",
                    password: password,
                    email: email,
                    institution: "University of Waterloo",
                    agreement: "NO I DON'T agree",
                    debating: [],
                    judging: [],
                    hosting: []
                };

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                return axios.post('users', userData, config)
            })
            .then(res => {
                console.log(res);
                const from = location.state?.from?.pathname || "/";

                // replace : true ensures the user cannot navigate back to the login page after already logging in
                navigate(from, { replace: true });
            })
            .catch(err => {
                console.log(err);
                const errorCode = err.code;
                const errorMessage = err.message;
                console.log(errorCode);
                console.log(errorMessage);
            })
    }
    return (
        <div>
            <div className="flex flex-col mx-auto rounded items-center mt-5 py-5 max-w-sm space-y-5 bg-blue-300">
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
                    <Button className="my-4 text-sm rounded-md" type="submit">Register</Button>
                </form>

            </div>
        
        </div>
    )
}

export default Registration
