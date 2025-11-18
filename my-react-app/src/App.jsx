import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Search from "./components/Search";
import Notifications from "./components/Notifications";
import TrialDetails from "./components/TrialDetails";
import SavedTrials from "./components/SavedTrials";
import CreateProfile from "./components/CreateProfile";
import ProfilePage from "./components/ProfilePage"; 
import Chatbot from "./components/Chatbot";  

// Check JWT token
const isAuthenticated = () => !!localStorage.getItem("access_token");

// Wrapper to hide chatbot on public pages
const ChatbotWrapper = () => {
  const location = useLocation();

  const hideOn = ["/", "/login", "/signup"];

  if (!isAuthenticated() || hideOn.includes(location.pathname)) {
    return null;
  }

  return <Chatbot />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Create Profile */}
        <Route
          path="/create-profile"
          element={isAuthenticated() ? <CreateProfile /> : <Navigate to="/login" />}
        />

        {/* Authenticated Routes */}
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={isAuthenticated() ? <Search /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={isAuthenticated() ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/details"
          element={isAuthenticated() ? <TrialDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/saved"
          element={isAuthenticated() ? <SavedTrials /> : <Navigate to="/login" />}
        />

        {/* Profile Page */}
        <Route
          path="/profile-page"
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Floating Chatbot (protected) */}
      <ChatbotWrapper />
    </Router>
  );
}

export default App;
