import { useContext, createContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithRedirect,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const createUser = (email, password, firstName) => {
        return createUserWithEmailAndPassword(auth, email, password).then((user) => {
            console.log(user.user.uid,"user in auth context>>>>>>>>", user["user"]["uid"])
            fetch('https://us-central1-serverless-sdp19.cloudfunctions.net/add_users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({"uid" : user.user.uid, "display_name" : firstName, "email" : email,
                    "photo_url" : "https://img.freepik.com/free-icon/football-player_318-175817.jpg"}),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Response:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    };

    const signIn = (email, password) =>  {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider).then((user) => {
            console.log(user.user.uid,"google>>>>>>>>", user)
            fetch('https://us-central1-serverless-sdp19.cloudfunctions.net/add_users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({"uid" : user.user.uid, "display_name" : user.user.displayName, "email" : user.user.email,
                    "photo_url" : user.user.photoURL}),
            }).then((data) => {
                    navigate('/authQuestions')
                    console.log('Response:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
        // signInWithRedirect(auth, provider)
    };

    const facebookSignIn = async () => {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider).then(r => navigate('/authQuestions'));
        // signInWithRedirect(auth, provider)
    };

    const logOut = () => {
        signOut(auth).then(r => navigate('/login'))
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('User', currentUser,"checkNewUser>>>",currentUser?.additionalUserInfo?.isNewUser)
        });
        return () => {
            unsubscribe();
        };

    }, []);

    return (
        <AuthContext.Provider value={{ googleSignIn, facebookSignIn, logOut, user,createUser, signIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};