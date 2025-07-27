import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../store/ChatProvider";

function GroupChatModal(props) {

    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);


    const { user, chats, setChats, token , API } = ChatState();

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

    const selectUser = (user) => {
        if (!selectedUsers.includes(user)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const deleteUser = (user) => {
        setSelectedUsers((prevUsers) => prevUsers.filter((id) => id !== user));
    };
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!groupChatName || !selectedUsers) {
            toast.warning("Please enter all the fields")
        } else {
            try {
                const response = await fetch(`${API}/api/chat/group`,{
                    method:"POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "name":groupChatName,
                        "users": JSON.stringify(selectedUsers.map(user => user._id)) 
                    })
                })

                const data = await response.json();
                if (response.ok) {
                    setChats([data,...chats])
                    props.t();
                    toast.success("group created successfully!")
                } else {
                    toast.error("group not created")
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

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

                <h2 className="text-xl text-center mb-4">Create Group Chat</h2>

                <input
                    className="w-full my-2 border-2 border-gray-300 rounded-lg p-2"
                    placeholder="Name of the Group Chat"
                    value={groupChatName}
                    onChange={(e) => { nameHandler(e) }}
                    type="text"
                />

                <input
                    className="w-full my-2 border-2 border-gray-300 rounded-lg p-2"
                    placeholder="Add Users"
                    onChange={(e) => { searchHandler(e.target.value) }}
                    type="text"
                />

                <div>
                    {selectedUsers.map(function(elem){
                        return(
                            <span class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm  border-purple-400">{elem.name} 
                            <button onClick={() => {deleteUser(elem)}} className=" ml-2">✖</button></span>
                            
                        )
                    })}
                </div>

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
                                        onClick={() => selectUser(elem)}
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
                    onClick={(e) => { handleSubmit(e) }}
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Create Chat
                </button>
            </div>
        </div>

    );
}

export default GroupChatModal;