import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css"; // سنضيفه بعد قليل

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hello! Ask me anything about lung health." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process your request."
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error from AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* الزر العائم */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {/* نافذة الشات */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>💬 AI Health Chatbot</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="message assistant">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend} disabled={loading}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
