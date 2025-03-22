import React, { useState, useEffect, useRef } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SendIcon from "@mui/icons-material/Send";

const MessageArea = () => {
  const [inputMessage, setInputMessage] = useState(""); // State for user input
  const [messages, setMessages] = useState([]); // State for conversation messages
  const [lastUserMessage, setLastUserMessage] = useState(null); // State for the last user message
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  // Fetch conversation history from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/conversation-history?vendor_name=muzammil&page=1&page_size=10"
        );
        const data = await response.json();
        setMessages(
          data.messages.map((msg) => ({
            text: msg.message,
            userType: msg.user_type,
            timestamp: msg.timestamp,
          }))
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (message) => {
    if (message.trim()) {
      // Store the last user message before sending
      setLastUserMessage(message);

      // Add user message to the conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          userType: "end_user",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Simulate AI response (you can replace this with actual API call)
      const aiResponse = `AI response to: ${message}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: aiResponse,
          userType: "chatbot",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Clear input field if it's a new submission
      if (message === inputMessage) {
        setInputMessage("");
      }
    }
  };

  // Clear all messages
  const handleClearMessages = () => {
    setMessages([]); // Reset messages to an empty array
    setLastUserMessage(null); // Reset last user message
  };

  // Undo last message and reply
  const handleUndoMessage = () => {
    setMessages((prevMessages) => {
      if (prevMessages.length < 2) {
        return []; // If there are less than two messages, clear all
      }
      return prevMessages.slice(0, prevMessages.length - 2); // Remove last two messages (user + AI)
    });
    setLastUserMessage(null); // Reset last user message on undo
  };

  // Retry sending the last message
  const handleRetryMessage = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage); // Resubmit the last user message
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mt-4 flex space-x-2 flex-col">
        <div className="flex justify-stretch">
          <button
            onClick={handleRetryMessage}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            <ReplayIcon className="mb-1" />
            Retry
          </button>
          <button
            onClick={handleUndoMessage}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 ml-2"
          >
            <UndoIcon className="mb-1" />
            Undo
          </button>
          <button
            onClick={handleClearMessages}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 ml-2"
          >
            <DeleteForeverIcon className="mb-1" />
            Clear
          </button>
        </div>

        {/* Conversation Display Section */}
        <div className="mt-4 h-64 overflow-y-auto border border-gray-300 p-2 rounded-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.userType === "end_user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-md ${
                  msg.userType === "end_user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {/* Reference for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex justify-stretch mt-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            rows="1"
            className="w-5/6 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            className="px-4 py-2 w-1/6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <SendIcon className="mb-1" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;
