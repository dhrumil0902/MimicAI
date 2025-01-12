import React, { useState, useEffect, useRef } from "react";
import "./chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { sender: "user", text: userMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a response from the server");
      }

      const data = await response.json();
      const content = data.response[0][1];
      const botMessage = { sender: "bot", text: content };

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Let's Chat</h1>
        <p className="chat-description">Hi, I am here to mimic Dhrumil, I will try to answer questions to the best of my ability, as if I was Dhrumil. I have been hyper-tuned to be his persona.</p>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message bot-message typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
      <div className="input-container">
        <input
          className="input"
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask me a question..."
        />
        <button className="button" onClick={handleSendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
