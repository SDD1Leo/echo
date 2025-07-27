import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChatState } from "../store/ChatProvider";

function Logout() {
  const { logoutUser } = ChatState();
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    logoutUser(); // clear token, user, etc.
    setTimeout(() => {
      setLoggedOut(true);
    }, 100); // short delay
  }, []);

  if (loggedOut) return <Navigate to="/" />;
  return null;
}

export default Logout;
