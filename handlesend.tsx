import React, { useRef } from 'react';
import './MainChatComponent.css'; // Ensure you create a corresponding CSS file

const MainChatComponent: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputRef.current) {
      const message = inputRef.current.value;
      if (message.trim() !== "") {
        console.log("Message sent:", message); // Replace this with your send message logic
        inputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        placeholder="Type your message..."
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="chat-input"
      />
      <button onClick={handleSendMessage} className="send-button">
        <img src="path/to/send-icon.png" alt="Send" className="send-icon" />
      </button>
    </div>
  );
};

export default MainChatComponent;
