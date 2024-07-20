import React, { useState } from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'When can I select my benefits?', time: '1:54 PM' },
  ]);

  const handleSendPrompt = (prompt: string) => {
    setIsChatActive(true);
    setIsLoading(true);
    setMessages([...messages, { sender: 'user', text: prompt, time: new Date().toLocaleTimeString() }]);
    
    // Simulate fetching data from the database
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'system',
          text: 'You can select your 2024 benefits during open enrollment. It starts November 15, 2023.',
          link: 'vanguard.com/benefits',
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setIsLoading(false);
    }, 2000); // Simulate 2 second delay
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Hi, Matt.</h1>
        <p>Help is here—however & whenever you need it.</p>
      </header>

      {!isChatActive ? (
        <>
          <div className="main-content">
            <div className="card">
              <img src="your-image-url-1" alt="Centralized knowledge base" className="card-image" />
              <h2>Centralized knowledge base</h2>
              <p>A searchable knowledge base allows crew to find answers quickly</p>
            </div>
            <div className="card">
              <img src="your-image-url-2" alt="Actionable assistance" className="card-image" />
              <h2>Actionable assistance</h2>
              <p>Integrate functionalities for requesting help from colleagues or HR directly</p>
            </div>
          </div>

          <div className="button-section">
            <button className="action-button">Check my vacation and sick leave balances</button>
            <button className="action-button">Give me a quick way find company discounts</button>
            <button className="action-button">Contact HR support</button>
            <button className="action-button">Help me change my benefit selections for 2025</button>
          </div>
        </>
      ) : (
        <div className="chat-section">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <p>{msg.text}</p>
              {msg.link && <a href={`https://${msg.link}`} target="_blank" rel="noopener noreferrer">{msg.link}</a>}
              <span className="chat-time">{msg.time}</span>
            </div>
          ))}
          {isLoading && <div className="chat-loading">Loading...</div>}
        </div>
      )}

      <footer className="footer">
        <p>Got questions or a prompt? I’m happy to help.</p>
        <input
          type="text"
          placeholder="Type your message here..."
          className="input-prompt"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
              handleSendPrompt(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </footer>
    </div>
  );
};

export default HomePage;
