import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ChatState } from "../store/ChatProvider";

function Logout() {
    const { logoutUser } = ChatState();

    useEffect(()=>{
        logoutUser();
    },[logoutUser]);
    
    return <Navigate to="/" />
}

export default Logout;