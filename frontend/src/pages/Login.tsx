import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/shadcn-components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {

    const { signin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const handleEmailChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        console.log(password);

        signin(email, password)
            .then(userCredential => {
                console.log(userCredential.user)
                // get prev location before signing in - otherwise, nav to home
                const from = location.state?.from?.pathname || "/";

                // replace : true ensures the user cannot navigate back to the login page after already logging in
                navigate(from, { replace: true });
            })
            .catch(err => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.log(errorCode);
                console.log(errorMessage);
            })
            
    }

    return (

        <div className="flex flex-col mx-auto rounded items-center mt-5 py-5 max-w-sm space-y-5 bg-green-300">
            <h1 className=" text-5xl font-bold">Sign in:</h1>
            <form className="flex flex-col" onSubmit={onSignIn}>
                <label className="text-xl" htmlFor="name">Email:</label>
                <input
                    className="rounded-md outline outline-2 p-1"
                    type="text"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                />
                <label className="text-xl" htmlFor="password">Password:</label>
                <input
                    className="rounded-md outline outline-2 p-1"
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <Button className="mt-4" type="submit">Log In</Button>
            </form>
            <div className="flex">
                <div>Don't have an account?</div>
                <Link to="/register" className="mx-3 underline hover:text-cyan-400">Register</Link>
            </div>
            
        </div>
    )
}

export default Login
