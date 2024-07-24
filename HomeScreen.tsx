import React, { useState, useEffect, useRef } from 'react';
import './HomeScreen.cssgi'; // Adjust the path as necessary


const MainChatComponent: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<{ user: string; agent: string }[]>([]);
  const [initialBlocksVisible, setInitialBlocksVisible] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendPrompt = () => {
    if (prompt.trim()) {
      const userMessage = { user: `Username: ${prompt}`, agent: `Agent: ${prompt}` };
      setConversation([...conversation, userMessage]);
      setPrompt('');
      setInitialBlocksVisible(false);
      setIsHeaderVisible(false); // Hide the header when a prompt is sent
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const suggestionCards = [
    { text: "Find YouTube videos with inspiring best man speeches", icon: "path/to/youtube-icon.png" },
    { text: "Compare the differences between pickleball and tennis", icon: "path/to/icon.png" },
    { text: "Write code for a specific task, including edge cases", icon: "path/to/icon.png" },
    { text: "Write a thank you note to my colleague", icon: "path/to/icon.png" },
  ];

  return (
    <div className="main-chat-container">
      <div className="top-bar">
        <img src="path/to/logo.png" alt="Logo" className="logo" />
        <img src="path/to/profile-picture.png" alt="Profile" className="profile-picture" />
      </div>

      <h1>This is a main chat component</h1>
      {isHeaderVisible && (
        <div className="header">
          <h1>Hello, Prabesh</h1>
          <h2>How can I help you today?</h2>
        </div>
      )}
      {initialBlocksVisible && (
        <>
          <div className="large-boxes">
            <div className="large-box">
              <img src="path/to/large-icon1.png" alt="Large Icon 1" />
              <div>Large Box 1 Text</div>
            </div>
            <div className="large-box">
              <img src="path/to/large-icon2.png" alt="Large Icon 2" />
              <div>Large Box 2 Text</div>
            </div>
          </div>
          <div className="suggestion-cards">
            {suggestionCards.map((card, index) => (
              <div key={index} className="suggestion-card" onClick={() => setPrompt(card.text)}>
                <div>{card.text}</div>
                <img src={card.icon} alt="icon" />
              </div>
            ))}
          </div>
        </>
      )}
      {!initialBlocksVisible && (
        <div className="chat-container" ref={chatContainerRef}>
          {conversation.map((msg, index) => (
            <div key={index} className="chat-message">
              <div className="username">{msg.user}</div>
              <div className="agent-response">
                <img src="path/to/agent-icon.png" alt="Agent" />
                {msg.agent}
              </div>
            </div>
          ))}
         
        </div>
      )}
      <div className="input-bar-container">
        <div className="input-bar">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt here"
          />
          <button onClick={handleSendPrompt}>
            <img src="path/to/send-icon.png" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChatComponent;
