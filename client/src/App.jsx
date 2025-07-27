import { Route, Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Register from "./pages/Register"
import Chat from "./pages/Chat"
import Logout from "./pages/Logout"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  )
}