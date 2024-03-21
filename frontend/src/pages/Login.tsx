import { useState } from "react";
import useAuth from "@/hooks/useAuth"

const Login = () => {

    const { signin } = useAuth();

    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const handleEmailChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const signIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        console.log(password);

        signin(email, password)
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
        <div className="space-y-5">
            <div className="bg-green-300 rounded-md p-5">
                <form className="flex flex-col" onSubmit={signIn}>
                    <label htmlFor="name">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="text"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <button type="submit">Log In</button>
                </form>

            </div>

        </div>
    )
}

export default Login
