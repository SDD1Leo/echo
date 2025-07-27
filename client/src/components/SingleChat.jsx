import { useEffect, useState, useRef } from "react";
import { ChatState } from "../store/ChatProvider";
import io from "socket.io-client";

const ENDPOINT = `http://localhost:3000`;
var socket, setSelectedChatCompare;

function SingleChat() {
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    user,
    token,
    fetchAgain,
    API
  } = ChatState();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null); // ✅ Step 1
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchChat = async () => {
    try {
      const response = await fetch(
        `${API}/api/message/${selectedChat._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setMessages(data);
        socket.emit("join chat", selectedChat._id);
      } else {
        console.log("messages cannot be fetched");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchChat();

      setSelectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !setSelectedChatCompare ||
        setSelectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // give ntification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  // ✅ Step 2: Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      setUserTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerlength = 3000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timediff = timenow - lastTypingTime;

      if (timediff >= timerlength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        setUserTyping(false);
      }
    }, timerlength);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    socket.emit("stop typing", selectedChat._id);
    try {
      const response = await fetch(`${API}/api/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          chatId: selectedChat._id,
        }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        socket.emit("new message", newMsg);
        setMessages((prev) => [...prev, newMsg]); // ✅ Add new message to array
        console.log("message sent successfully");
      } else {
        console.log("gadabad likha hai code");
      }
    } catch (error) {
      console.log("server chut");
    }
    setMessage("");
  };

  return (
    <>
      <div className="flex flex-col h-full max-h-screen p-4 bg-white border rounded shadow-md">
        {/* Message Area */}
        <div className="flex flex-col justify-end flex-1 overflow-y-auto mb-2 space-y-2 pr-2">
          {messages.map((elem) => {
            const isSender = elem.sender.name === user.name;

            return (
              <div
                key={elem._id}
                className={`max-w-xs p-2 rounded-lg ${
                  isSender
                    ? "bg-green-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                <div>{elem.content}</div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Send */}
        {isTyping && !userTyping && (
          <div className="text-sm text-gray-500 mb-1 animate-pulse">
            Typing...
          </div>
        )}

        <div className="flex items-center border-t pt-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default SingleChat;
