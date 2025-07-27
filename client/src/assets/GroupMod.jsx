import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../store/ChatProvider";

function GroupMod(props) {

    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);


    const { user, chats, setChats, token, selectedChat, setFetchAgain, setSelectedChat , API } = ChatState();

    const nameHandler = (e) => {
        setGroupChatName(e.target.value)
    }

    const searchHandler = async (query) => {

        if (!query) {
            return
        } else {
            try {
                setLoading(true);
                const response = await fetch(`${API}/api/user?search=${query}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json();
                console.log(data)
                if (response.ok) {
                    setSearchResult(data);
                    setLoading(false)
                } else {
                    toast.error(data.message ? data.message : "error response")
                }
            } catch (error) {
                console.log("Server Error")
            }
        }
    }

    const updateGroupName = async () => {
        setLoading(true);
        if (!groupChatName) {
            toast.warning("please enter valid name")
        } else {

            try {
                const response = await fetch(`${API}/api/chat/rename`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "chatId": selectedChat._id,
                        "chatName": groupChatName
                    })
                })

                const data = await response.json()

                if (response.ok) {
                    toast.success("chat renamed successfull")
                    setLoading(false)
                } else {
                    toast.error("some error occurred")
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                setFetchAgain(prev => !prev);
                setLoading(false)
            }
        }
    }

    const removeUser = async (chatid, userid) => {
        setLoading(true);
    
        // Check if the current user is an admin or removing themselves
        if (selectedChat.groupAdmin._id !== user._id && userid !== user._id) {
            toast.warning("Only admins can remove someone!");
            setLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`${API}/api/chat/groupremove`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    "chatId": chatid,
                    "userId": userid
                })
            });
    
            if (response.ok) {
                toast.success("User removed successfully!");
    
                const updatedChat = {
                    ...selectedChat,
                    users: selectedChat.users.filter(u => u._id !== userid),
                };
    
                setSelectedChat(updatedChat);
    
                // If the removed user is the current user, remove the chat from myChats
                if (userid === user._id) {
                    setChats(prevChats => prevChats.filter(chat => chat._id !== chatid));
                    setSelectedChat(null); // Deselect chat if removed
                }
    
                setFetchAgain(prev => !prev);
            } else {
                toast.error("User removal failure!");
            }
        } catch (error) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };
    

    const addUser = async (chatid, user) => {
        setLoading(true);
        if (selectedChat.users.find((u) => u._id === user._id)) {
            toast.warning("user already exists in group")
            return;
        } else {
            try {
                const response = await fetch(`${API}/api/chat/groupadd`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "chatId": chatid,
                        "userId": user._id
                    })
                });

                if (response.ok) {
                    toast.success("User added successfully!");

                    // ✅ Update selectedChat state to remove the user immediately
                    setSelectedChat((prevChat) => ({
                        ...prevChat,
                        users: [...prevChat.users, user] // Append new user to the array
                    }));

                    setFetchAgain(prev => !prev);
                } else {
                    toast.error("User add failure!");
                }
            } catch (error) {
                console.error("Server Error:", error);
                toast.error("Server error: " + error.message);
            } finally {
                setLoading(false);
            }
        }
    };



    return (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                {/* Close Button at Top-Left of Modal */}
                <button
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    onClick={props.t}
                >
                    ✖
                </button>

                <h2 className="text-xl text-center mb-4">Update Group Chat</h2>


                <div>
                    {selectedChat.users.map(function (elem) {
                        return (
                            <span class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm  border-purple-400">{elem.name}
                                <button onClick={() => { removeUser(selectedChat._id, elem._id) }} className=" ml-2">✖</button></span>

                        )
                    })}
                </div>


                <input
                    className="w-3/4 my-2 border-2 border-gray-300 rounded-lg p-2"
                    placeholder="Name of the Group Chat"
                    value={groupChatName}
                    onChange={(e) => { nameHandler(e) }}
                    type="text"
                />

                <button
                    onClick={() => { updateGroupName() }}
                    className="w-1/4 bg-green-400 rounded-md p-2">Update</button>

                <input
                    className="w-full my-2 border-2 border-gray-300 rounded-lg p-2"
                    placeholder="Add Users"
                    onChange={(e) => { searchHandler(e.target.value) }}
                    type="text"
                />



                {loading ?

                    <div className=" w-full flex justify-center p-2 ">
                        <div className="h-10 w-10 border-4 border-gray-400 border-l-gray-500 rounded-full animate-spin"></div>
                    </div>
                    :
                    <div>
                        {
                            searchResult.map(function (elem) {
                                return (
                                    <div
                                        onClick={() => addUser(selectedChat._id, elem)}
                                        className="border-2 border-gray-300 bg-white my-2 p-3 rounded-md flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gradient-to-r from-pink-500 to-purple-900">
                                        {/* User Avatar */}
                                        <img
                                            src={elem.pic}
                                            className="w-8 h-8 rounded-full border-2 border-gray-300 object-cover"
                                            alt="User Avatar"
                                        />

                                        {/* User Details - Centered in Remaining Space */}
                                        <div className="flex flex-col items-center justify-center flex-grow ">
                                            <p className="text-lg font-medium text-gray-800 ">{elem.name}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>}

                <button
                    onClick={(e) => { removeUser(selectedChat._id, user._id) }}
                    className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Leave Group
                </button>
            </div>
        </div>

    );
}

export default GroupMod;