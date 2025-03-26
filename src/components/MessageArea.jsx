import React, { useState, useEffect, useRef } from "react";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SendIcon from "@mui/icons-material/Send";
import Pagination from "../components/Pagination";

const MAX_CHAR_LIMIT = 200; // Set your desired character limit here

const MessageArea = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem("username");

  // Function to fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/conversation-history?vendor_name=${username}&page=${currentPage}&page_size=${pageSize}`
      );
      const data = await response.json();
      // Format messages to match frontend structure
      const formattedMessages = data.messages.map((msg) => ({
        message: msg.message,
        user_type: msg.user_type,
        timestamp: msg.timestamp,
      }));
      setAllMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Polling to fetch messages every 2 seconds
  useEffect(() => {
    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 2000); // Polling every 2 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentPage, username, pageSize]);

  // Scroll to the bottom of the message area when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  // Function to handle sending a message
  const handleSendMessage = async (message) => {
    const trimmedMessage = message.trim();

    if (trimmedMessage) {
      // Optimistically update the UI
      setAllMessages((prevMessages) => [
        ...prevMessages,
        {
          message: trimmedMessage,
          user_type: "end_user", // Match backend field name
          timestamp: new Date().toISOString(),
        },
      ]);

      try {
        // Send message to backend
        const response = await fetch("http://127.0.0.1:8000/query/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendor_name: username,
            user_type: "end_user",
            query: trimmedMessage,
          }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        // Clear input field after sending
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove optimistic update if failed
        setAllMessages((prevMessages) => prevMessages.slice(0, -1));
        setAllMessages((prevMessages) => [
          ...prevMessages,
          {
            message: "Error connecting to server",
            user_type: "chatbot",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
  };

  const handleClearMessages = () => {
    setAllMessages([]);
    setCurrentPage(1);
  };

  const handleUndoMessage = () => {
    setAllMessages((prevMessages) => {
      if (prevMessages.length < 2) {
        return [];
      }
      return prevMessages.slice(0, prevMessages.length - 2);
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Pagination
        currentPage={currentPage}
        onNextPage={() => setCurrentPage((prev) => prev + 1)}
        onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      />

      <div className="mt-4 h-64 overflow-y-auto border border-gray-300 p-2 rounded-md">
        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.user_type === "end_user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-md ${
                msg.user_type === "end_user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex justify-stretch mt-2">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.shiftKey) {
                return; // Allow new line if Shift is pressed
              }
              e.preventDefault(); // Prevent default behavior (new line)
              handleSendMessage(inputMessage); // Send message on Enter
            }
          }}
          placeholder="Type a message..."
          rows="1"
          maxLength={MAX_CHAR_LIMIT} // Set max length for the textarea
          className="w-5/6 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => handleSendMessage(inputMessage)}
          disabled={
            inputMessage.trim().length === 0 ||
            inputMessage.length > MAX_CHAR_LIMIT
          } // Disable button if empty or over limit
          className={`px-4 py-2 w-1/6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            inputMessage.length > MAX_CHAR_LIMIT
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <SendIcon className="mb-1" />
          Send
        </button>
      </div>

      {/* Display remaining character count */}
      <div className="mt-2 text-sm text-gray-600">
        {MAX_CHAR_LIMIT - inputMessage.length} characters remaining
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleUndoMessage}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          <UndoIcon /> Undo
        </button>
        <button
          onClick={handleClearMessages}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          <DeleteForeverIcon /> Clear All
        </button>
      </div>
    </div>
  );
};

export default MessageArea;
