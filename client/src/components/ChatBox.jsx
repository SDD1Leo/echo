import { useEffect, useState } from "react";
import { ChatState } from "../store/ChatProvider";
import ProfileModal from "../assets/ProfileModal";
import GroupMod from "../assets/GroupMod";
import SingleChat from "./SingleChat";


function ChatBox(props) {

    const { selectedChat, setSelectedChat ,fetchAgain} = ChatState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    };

    useEffect(() => {
        
    }, [fetchAgain]);

    return (
        <div className={`md:w-2/3 h-screen bg-opacity-60 bg-white m-5 p-3 rounded-md flex flex-col ${selectedChat ? "block" : "hidden md:block"}`}
        >
            {selectedChat ? (
                <div className="w-full h-full flex flex-col">
                    {/* Header */}
                    <div className="w-full flex justify-between items-center pb-2 border-b border-gray-300">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSelectedChat(null)}
                                className="text-3xl w-10 h-10 pb-1 flex justify-center items-center rounded-md bg-white"
                            >
                                ←
                            </button>
                            <a className="text-3xl font-thin px-4 flex items-center">
                                <img className="w-10 h-10 border border-gray-300 rounded-full mr-4"
                                    src={getSender(props.user, selectedChat.users).pic}
                                    alt="User Avatar"
                                />
                                {!selectedChat.isGroupChat ? getSender(props.user, selectedChat.users).name : selectedChat.chatName}
                            </a>
                        </div>
                        <button
                            onClick={toggleModal}
                            className="text-3xl w-10 h-10 pb-1 flex justify-center items-center rounded-md bg-white"
                        >
                            ◉
                        </button>
                        {isModalOpen && ( selectedChat.isGroupChat ?
                            <GroupMod t={toggleModal} users={selectedChat}/>
                            :
                            <ProfileModal t={toggleModal}/>
                        )}
                    </div>

                    <div className="flex-1 bg-gray-300 bg-opacity-70 rounded-lg overflow-y-auto p-4">
                        <SingleChat/>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex justify-center items-center text-4xl">
                    Click on a user to start chatting!
                </div>
            )}
        </div>

    );
}

export default ChatBox;