import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Logout from "./pages/logout";
import { AuthContextProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard";
import GameLobby from "./pages/game"; // Import the GameLobby component

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game-lobby" element={<GameLobby />} /> {/* Add the route for the GameLobby component */}
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
