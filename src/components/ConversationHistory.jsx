import React, { useState, useEffect } from "react";

const ConversationHistory = () => {
  const [messages, setMessages] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8000/user-info", {
          method: "GET",
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        const username = localStorage.getItem("username");

        if (data.vendor_name !== username) {
          setError("You are not authorized to view this conversation history.");
          return;
        }

        setVendorName(data.vendor_name);
        fetchMessages(data.vendor_name); 
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const fetchMessages = async (vendorName) => {
    try {
      const response = await fetch(
        `http://localhost:8000/conversation-history?vendor_name=${vendorName}&page=${page}&page_size=${pageSize}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-md">
      <h2 className="text-xl font-bold mb-2">Conversation History</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {messages.map((msg) => (
          <li key={msg.id} className="mb-2">
            <span className="font-semibold">
              {msg.user_type === "end_user" ? "User" : "Chatbot"}:
            </span>{" "}
            {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationHistory;
