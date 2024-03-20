import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

const Login = () => {

    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const auth = getAuth();

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

        createUserWithEmailAndPassword(auth, email, password)
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
                <form className="flex flex-col" onSubmit={register}>
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
                    <button type="submit">Login</button>
                </form>

            </div>
        </div>
    )
}

export default Login
