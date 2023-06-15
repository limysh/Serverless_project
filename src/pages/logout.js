import React from "react";
import login from "./login";
import {UserAuth} from "../context/AuthContext";

const Logout = () => {
    const { logOut, user } = UserAuth();
    const handleLogOut = async () => {
        try{
            await logOut()
        }catch (err){
            console.log(err)
        }
    }
    return <div>
        <h1>You are Logged out Now!!</h1>
        <h1>Welcome {user.displayName}</h1>
        <button onClick={handleLogOut}>Logout</button>
    </div>;
};

export default Logout;
