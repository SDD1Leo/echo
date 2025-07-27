import { useEffect, useState } from "react";
import { ChatState } from "../store/ChatProvider";
import { toast } from "react-toastify";
import GroupChatModal from "../assets/GroupChatModal";


function MyChats(props) {
    const [loadingChats, setLoadingChats] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);  // Initialize as null
    const { selectedChat, setSelectedChat, chats, setChats, user, token , fetchAgain , API } = ChatState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const fetchChats = async () => {
        if (!loggedUser) return;  // Don't fetch chats if loggedUser is not set

        try {
            setLoadingChats(true);
            const response = await fetch(`${API}/api/chat`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setChats(data);
                // console.log("Fetched chats:", data);
            } else {
                toast.error("Failed to fetch chats");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingChats(false);
        }
    };

    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };

    useEffect(() => {
        setLoggedUser(props.user);
    }, [props.user]);  // Ensure loggedUser updates when props.user changes

    useEffect(() => {
        fetchChats();
    }, [loggedUser,fetchAgain]);  // Fetch chats only after loggedUser is set

    return (
        <div className={`h-screen md:w-1/3 bg-white bg-opacity-50 m-5 p-3 rounded-md ${selectedChat ? "hidden md:block" : "block"}`}
        >
            <div className="flex justify-between items-center">
                <p className="text-4xl font-thin">My Chats</p>

                <groupchatmodal>
                    <button
                        onClick={toggleModal}
                        className="bg-gray-200 px-4 py-2 rounded-lg">New Group Chat</button>

                    {isModalOpen ?
                        <GroupChatModal t={toggleModal} />
                        : <></>}

                </groupchatmodal>
            </div>

            {loadingChats ? (
                <div className="w-full h-full flex items-center justify-center">
                    <div className=" w-10 h-10 border-4 rounded-full animate-spin border-white border-l-gray-400   "></div>
                </div>
            ) : (
                <div className="p-5">
                    {chats.map((elem) => (
                        <div
                            key={elem._id}
                            className={`w-full  my-2 p-2 rounded-md cursor-pointer ${selectedChat?._id === elem._id ? "bg-gradient-to-r from-pink-500 to-purple-900" : "bg-white"}`
                            }
                            onClick={() => setSelectedChat(elem)} // ✅ Set the selected chat
                        >
                            {!elem.isGroupChat ? getSender(loggedUser, elem.users) : elem.chatName}
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
}

export default MyChats;
