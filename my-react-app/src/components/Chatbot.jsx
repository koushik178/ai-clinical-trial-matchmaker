import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const token = localStorage.getItem("access_token");

  // Hide widget if user not logged in
  if (!token) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm your AI Clinical Assistant. How can I help you today?" }
  ]);
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userQuestion = question.trim();

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setQuestion("");

    try {
      const res = await fetch("https://ai-clinical-trial-matchmaker.onrender.com/chatbot/ask", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!res.ok) throw new Error("Unable to process your request right now.");

      const data = await res.json();
      const botReply = data.answer || "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", content: "Network error. Please try again." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      {/* Floating Chat Icon */}
      <button className="chatbot-icon" onClick={toggleChat}>
        Chat
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            AI Clinical Assistant
            <button className="close-btn" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
