import { useEffect } from "react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/SideDrawer";
import { ChatState } from "../store/ChatProvider";


function Chat() {
    const {token,user,userAuth} = ChatState();
    useEffect(() => {
        userAuth()
    }, []);
    // console.log(user);

    return (  
        <div className=" w-full h-full flex flex-col bg-[url(https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
            <SideDrawer user={user}/>
            <div className=" w-full md:flex h-full ">
            <MyChats user={user}/>
            <ChatBox user={user}/>
            </div>
        </div>
    );
}

export default Chat;