import React, { useState, useEffect, useRef } from "react";
import "./chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const chatEndRef = useRef(null);

  // Handles sending a message
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { sender: "user", text: userMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserMessage("");
    setLoading(true);

    try {
      // Send user message to backend
      const response = await fetch("http://18.217.214.147:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error("Failed to get a response from the server");
      }

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.response[0][1] };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Oops! Something went wrong. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Automatically scroll to the bottom when messages are updated
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <h1>Let's Chat</h1>
        <p className="chat-description">
          Hi, I am here to mimic Dhrumil. I will try to answer your questions to
          the best of my ability, as if I were Dhrumil. I have been hyper-tuned
          to be his persona.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="message bot-message typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={chatEndRef}></div> {/* Scroll Target */}
      </div>

      {/* Input Section */}
      <div className="input-container">
        <input
          className="input"
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me a question..."
        />
        <button
          className="button"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"} {/* Show dynamic button text */}
        </button>
      </div>
    </div>
  );
};

export default Chat;
