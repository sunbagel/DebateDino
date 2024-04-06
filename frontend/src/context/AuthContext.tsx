import { ReactNode, createContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase-config"
import { User as FBUser, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

type AuthContextType = {
    currentUser: FBUser | null;
    signup: (email: string, password: string) => Promise<UserCredential>;
    signin: (email: string, password: string) => Promise<UserCredential>;
    signout: () => Promise<void>;
}

type AuthProviderProps = {
    children : ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [currentUser, setCurrentUser] = useState<FBUser |null>(null);

    const signup = (email : string, password : string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signin = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const signout = () => {
        // DOES NOT REVOKE TOKEN - ONLY CLEARS USER SESSION
        return signOut(auth);
    }
    
    useEffect(() => {
        // onAuthStateChanged() returns a cleanup function, which will unsub from onAuthChanged event
        const unsubscribe = auth.onAuthStateChanged(user => {
            // onAuthStateChanged() will SUBSCRIBE to all state changes to user
            
            // set user to the returned user in this event
            setCurrentUser(user);
        })

        return unsubscribe;

    },[])

    const value = {
        currentUser,
        signup,
        signin,
        signout
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;