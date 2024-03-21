import { useState } from "react";
import useAuth from "@/hooks/useAuth"

const Login = () => {

    const { signup, signin, signout } = useAuth();

    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const handleEmailChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
    const register = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        console.log(password);

        signup( email, password)
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


    const logOut = () => {
        signout()
            .then(()=>{
                console.log("signed out");
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="space-y-5">
            <div className="bg-blue-300 rounded-md p-5">
                <form className="flex flex-col"  onSubmit={register}>
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
                    <button type="submit">Register</button>
                </form>
            
            </div>


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


            <div className="bg-red-300 rounded-md p-5">
                    <button type="button" onClick={logOut}>Logout</button>

            </div>
        </div>
    )
}

export default Login
