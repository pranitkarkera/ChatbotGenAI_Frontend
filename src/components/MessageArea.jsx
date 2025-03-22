import React, { useState, useEffect, useRef } from "react";
// import ReplayIcon from "@mui/icons-material/Replay";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SendIcon from "@mui/icons-material/Send";
import Pagination from "../components/Pagination";

const MessageArea = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/conversation-history?vendor_name=muzammil&page=${currentPage}&page_size=${pageSize}`
        );
        const data = await response.json();
        setAllMessages(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentPage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const handleSendMessage = async (message) => {
    if (message.trim()) {
  
      setAllMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          userType: "end_user",
          timestamp: new Date().toISOString(),
        },
      ]);

      if ((allMessages.length + 1) % pageSize === 0) {
        setCurrentPage((prevPage) => prevPage + 1);
      }

      await fetchResponse(message);

      setInputMessage("");
    }
  };

  const fetchResponse = async (message) => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.reply) {
        setAllMessages((prevMessages) => [
          ...prevMessages,
          {
            text: data.reply,
            userType: "chatbot",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setAllMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, something went wrong.",
          userType: "chatbot",
          timestamp: new Date().toISOString(),
        },
      ]);
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
        <div ref={messagesEndRef} />
      </div>

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
