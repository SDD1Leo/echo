import { createContext,useContext,useState,useEffect } from "react";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(true);

    const API = import.meta.env.VITE_APP_URI_API;

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false); // Mark loading as complete
    }, []);

    const userAuth = async() => {
        try {
            const response = await fetch(`${API}/api/auth/user`,{
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                setUser(data.userData)
                // console.log(user);
            } else {
                console.error("error fetching user data");
            }
        } catch (error) {
            console.log(`mesggage error ${error}`);
        }
    }
    const logoutUser = ()=>{
        setToken(null)
        setUser(null)
        return localStorage.removeItem("token")
    }

    useEffect(() => {
        userAuth()
    }, []);

    return <ChatContext.Provider value={{token,setToken,loading,user,userAuth,logoutUser,selectedChat,setSelectedChat,chats, setChats ,fetchAgain , setFetchAgain , API}}>
        {children}
    </ChatContext.Provider>
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;