import React from "react";
import {useNavigate} from "react-router-dom";
import {UserAuth} from "../context/AuthContext";

const Game = () => {
    const { logOut, user } = UserAuth();
    const handleLogOut = async () => {
        try{
            await logOut()
        }catch (err){
            console.log(err)
        }
    }
    return <div>
        <h1>You Are Logged In, start playing the game!!</h1>
        {console.log(user,"user>>>>>>>")}
        <p>Welcome <b>{user?.displayName ? user.displayName : user?.uid}</b>, you have used <b>{user.email}</b> to create an account.</p>
        <p>Check console for all other details...</p>
        <button onClick={handleLogOut}>Logout</button>
    </div>;
};

export default Game;
