// ChatbotPage.jsx
import React from "react";
// import ModeSelector from "../components/ModeSelector";
import FileUploader from "../components/FileUploader";
import MessageArea from "../components/MessageArea";
// import ConversationHistory from "../components/ConversationHistory";

const ChatbotPage = () => {
  // const [mode, setMode] = useState("RAG");

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        {/* <ModeSelector setMode={setMode} /> */}
        <FileUploader />
        {/* <ConversationHistory /> */}
      </div>
      <div>
        <MessageArea />
      </div>
    </div>
  );
};

export default ChatbotPage;
