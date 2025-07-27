import { useState } from "react";
import { ChatState } from "../store/ChatProvider";
import { toast } from "react-toastify";
import Loading from "./Loading";

function SideDrawer(props) {

    const { token, setSelectedChat, chats, setChats , API  } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const searchHandler = (e) => {
        setSearch(e.target.value)
    }

    const submitSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            toast.warning("please enter a name")
        } else {
            try {
                setLoading(true);
                const response = await fetch(`${API}/api/user?search=${search}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json();
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

    const accessChat = async (userid) => {
        try {
            setLoadingChat(true);
            const response = await fetch(`${API}/api/chat`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: userid })
            });
    
            const data = await response.json(); // ✅ Parse data first
    
            if (response.ok) {
                toast.success("Chat created successfully!");
    
                if (!chats.find((c) => c._id === data._id)) {  // ✅ Use data._id instead of user._id
                    setChats((prevChats) => [data, ...prevChats]);
                }
    
                setSelectedChat(data);
                setLoadingChat(false)
            } else {
                toast.error(data.message || "Failed to create chat"); // ✅ Now data is defined
            }
        } catch (error) {
            toast.error(error.message);
        } 
    };
    

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="bg-white bg-opacity-50 m-5 rounded-md px-3 flex flex-row justify-between items-center">
            <div className="text-center">
                {/* Drawer Toggle Button */}
                <button className="" onClick={toggleDrawer}>
                    ⌕ Search Users
                </button>

                {/* Drawer Component */}
                <div
                    className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 
                    ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div>

                        <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                            Search Users
                        </h5>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={toggleDrawer}
                            className="absolute top-2.5 end-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8"
                        >
                            X
                        </button>
                    </div>

                    <div className="w-full flex justify-evenly   items-center">
                        <input
                            className="p-2 rounded-md border-2 border-gray-400  "
                            type="text"
                            placeholder="search by name"
                            value={search}
                            onChange={(e) => { searchHandler(e) }} />
                        <button
                            onClick={(e) => { submitSearch(e) }}
                            className=" bg-gray-300 border-2 border-gray-400 p-2 rounded-md  ">Go</button>
                    </div>

                    <div className="my-3 p-3 w-full flex flex-col">
                        {loading ? <Loading /> :
                            searchResult.map(function (elem) {
                                return (
                                    <>
                                        <div
                                            onClick={() => { accessChat(elem._id) }}
                                            className="border-2 border-gray-300 bg-white my-2 p-3 rounded-md flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gradient-to-r from-pink-500 to-purple-900">
                                            {/* User Avatar */}
                                            <img
                                                src={elem.pic}
                                                className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                                                alt="User Avatar"
                                            />

                                            {/* User Details - Centered in Remaining Space */}
                                            <div className="flex flex-col items-center justify-center flex-grow ">
                                                <p className="text-lg font-medium text-gray-800 ">{elem.name}</p>
                                                <p className="text-sm text-gray-500">{elem.email}</p>
                                            </div>
                                        </div>


                                    </>
                                )
                            })
                        }
                    </div>

                    {
                        loadingChat?<><div className=" w-10 h-10 border-4 rounded-full animate-spin border-white border-l-gray-400   "></div></>:<></>
                    }
                </div>
            </div>

            <div>Chat-App</div>

            {/* Profile Dropdown */}
            <div className="relative inline-block text-left">
                <button
                    onClick={toggleDropdown}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none"
                    type="button"
                >
                    <img
                        className="w-5 h-5 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                        src={props.user.pic}
                        alt="User Avatar"
                    />

                    <svg
                        className="w-2.5 h-2.5 ms-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                        />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                                <button
                                    onClick={toggleModal}
                                    className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    My Profile
                                </button>
                            </li>
                            <li>
                                <a
                                    href="/logout"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">User Profile</h2>
                        <div className="flex flex-col items-center">
                            <img
                                className="w-24 h-24 rounded-full ring-4 ring-blue-500"
                                src={props.user.pic}
                                alt="User Avatar"
                            />
                            <p className="mt-3 text-gray-700">{props.user.name}</p>
                            <p className="mt-3 text-gray-700">{props.user.email}</p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={toggleModal}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SideDrawer;
