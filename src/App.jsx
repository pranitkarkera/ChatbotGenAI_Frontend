import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Use Routes instead of Switch
import Header from "./components/Header";
import ChatbotPage from "./pages/ChatbotPage"; // Import ChatbotPage component
import UserLogin from "./pages/UserLogin"; // Import UserLogin component

const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px" }} className="bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<UserLogin />} /> {/* Login Page */}
          <Route path="/chatbot" element={<ChatbotPage />} />{" "}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
