import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const token = localStorage.getItem("access_token");

  // Only render if token exists
  if (!token) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm your AI Clinical Assistant. How can I help you today?" }
  ]);
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(prev => !prev);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setMessages(prev => [...prev, { role: "user", content: userQuestion }]);
    setQuestion("");

    try {
      const res = await fetch("https://ai-clinical-trial-matchmaker.onrender.com/chatbot/ask", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!res.ok) throw new Error("Failed to get response from AI");

      const data = await res.json();
      const answer = data.answer || "Sorry, I couldn't understand your question.";
      setMessages(prev => [...prev, { role: "bot", content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", content: `Error: ${err.message}` }]);
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
      <button className="chatbot-icon" onClick={toggleChat}>💬</button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            AI Clinical Chat
            <button className="close-btn" onClick={toggleChat}>✖</button>
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
              placeholder="Ask anything..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
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
