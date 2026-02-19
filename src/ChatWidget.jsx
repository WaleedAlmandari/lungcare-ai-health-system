// src/components/ChatWidget.jsx
import React, { useState } from "react";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! Ask me anything about lung health." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply || "⚠️ Error from AI." };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Failed to connect to AI." }]);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      <div className={`chatbox ${open ? "open" : ""}`}>
        <div className="chat-header">
          <span>💬 AI Health Chatbot</span>
          <button onClick={() => setOpen(false)}>✖</button>
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.sender}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      {!open && (
        <button className="chat-toggle" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
}
