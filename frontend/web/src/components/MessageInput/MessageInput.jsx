import { useState } from "react";
import "../MessageInput/MessageInput.css";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="message-input-container">
      <form className="message-send-form" onSubmit={handleSubmit}>
        <input
          className="message-input"
          id="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="send-button"> Send </button>
      </form>
    </div>
  );
};

export default MessageInput;
