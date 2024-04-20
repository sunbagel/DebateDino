import { ReactNode, createContext, useEffect, useMemo, useState } from "react"
import { auth } from "@/lib/firebase-config"
import { User as FBUser, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

type AuthContextType = {
    currentUser: FBUser | null;
    loading: boolean;
    signup: (email: string, password: string) => Promise<UserCredential>;
    signin: (email: string, password: string) => Promise<UserCredential>;
    signout: () => Promise<void>;
    deleteUser: () => void;
}

type AuthProviderProps = {
    children : ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [currentUser, setCurrentUser] = useState<FBUser |null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    // deletes current user
    const deleteUser = () => {
        auth.currentUser?.delete().then(() => {
            console.log("FB User deleted due to user creation failure");
        }).catch((deleteError) => {
            console.error("Failed to delete Firebase user:", deleteError);
        });
    }
    
    useEffect(() => {
        // onAuthStateChanged() returns a cleanup function, which will unsub from onAuthChanged event
        const unsubscribe = auth.onAuthStateChanged(user => {
            // onAuthStateChanged() will SUBSCRIBE to all state changes to user
            console.log("STATE CHANGED", user?.email);
            // set user to the returned user in this event
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;

    },[])

    const value = useMemo(() => ({
        currentUser,
        loading,
        signup,
        signin,
        signout,
        deleteUser
    }), [currentUser, loading]);
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;