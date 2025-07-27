import { ChatState } from "../store/ChatProvider";


function ProfileModal(props) {
    const {user,selectedChat,setSelectedChat} = ChatState()

    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">User Profile</h2>
                <div className="flex flex-col items-center">
                    <img
                        className="w-24 h-24 rounded-full ring-4 ring-blue-500"
                        src={getSender(user, selectedChat.users).pic}
                        alt="User Avatar"
                    />
                    <p className="mt-3 text-gray-700">{getSender(user, selectedChat.users).name}</p>
                    <p className="mt-3 text-gray-700">{getSender(user, selectedChat.users).email}</p>
                </div>

                {/* Close Button */}
                <button
                    onClick={props.t}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default ProfileModal;