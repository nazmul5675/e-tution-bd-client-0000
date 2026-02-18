import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const GoogleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    const [loading, setLoading] = useState(true);

    const registerUserWithEmailPass = (email, password) => {

        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const updateUser = (profile) => {
        setLoading(true);
        return updateProfile(auth.currentUser, profile);
    };

    const GoogleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, GoogleProvider);
    };

    const signOutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unSubscribed = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);


            setLoading(false);
        });

        return () => unSubscribed();
    }, []);

    const showToast = (message, type = "success") => {
        if (type === "success") toast.success(message);
        else if (type === "error") toast.error(message);
        else if (type === "info") toast.info(message);
        else if (type === "warning") toast.warning(message);
    };


    const authInfo = {
        user,
        loading,
        registerUserWithEmailPass,
        signInUser,
        updateUser,
        signOutUser,
        GoogleLogin,
        setUser,
        showToast,
    };

    return <AuthContext.Provider value={authInfo}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
    </AuthContext.Provider>;
};

export default AuthProvider;
