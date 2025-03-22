import React, { useState, useEffect } from "react";

const ConversationHistory = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/conversation-history")
      .then((res) => res.json())
      .then((data) => setMessages(data.messages))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2>Conversation History</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            {msg.message} ({msg.user_type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationHistory;
