import "./App.css";
import React from "react";
import Homepage from "./pages/Homepage";
import { Routes, Route} from "react-router-dom"
import ChatPage from "./pages/ChatPage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
