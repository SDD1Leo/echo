import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import ChatProvider from './store/ChatProvider.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <ChatProvider>
  <BrowserRouter>
    <App />
    <ToastContainer 
    theme="dark"
    autoClose={1500}/>
  </BrowserRouter>
  </ChatProvider>
)
