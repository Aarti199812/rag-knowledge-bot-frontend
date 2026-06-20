import { useState, useEffect, useRef } from "react";
import { createSession, askQuestion, getChatHistory } from "../services/api";

export default function Chat({ user, onLogout, onAdmin }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = async () => {
    try {
      const res = await createSession(user.id || 1);
      setSessionId(res.data.id);
      setMessages([{
        role: "assistant",
        content: `Hi ${user.name}! 👋 I am AI assistant of your. ask me anything`
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!question.trim() || loading) return;

    const userMsg = { role: "user", content: question };
    setMessages(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await askQuestion(sessionId, question);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: res.data.answer
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, there was an error. Please try again!"
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      
      {/* Header */}
      <div style={{
        background: "#1e3a5f", color: "white",
        padding: "16px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🤖</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px" }}>Knowledge Bot</h2>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
              AI Company Assistant
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px" }}>👤 {user.name}</span>
          {user.role === "ADMIN" && (
            <button onClick={() => onAdmin()} style={{
              background: "rgba(255,255,255,0.2)",
              border: "none", color: "white",
              padding: "6px 12px", borderRadius: "6px",
              cursor: "pointer", fontSize: "13px"
            }}>Admin Panel</button>
          )}
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,0.2)",
            border: "none", color: "white",
            padding: "6px 12px", borderRadius: "6px",
            cursor: "pointer", fontSize: "13px"
          }}>Logout</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "24px", display: "flex",
        flexDirection: "column", gap: "16px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              maxWidth: "70%", padding: "12px 16px",
              borderRadius: msg.role === "user" 
                ? "18px 18px 4px 18px" 
                : "18px 18px 18px 4px",
              background: msg.role === "user" ? "#1e3a5f" : "white",
              color: msg.role === "user" ? "white" : "#1a1a1a",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              fontSize: "14px", lineHeight: "1.6"
            }}>
              {msg.role === "assistant" && (
                <span style={{ marginRight: "8px" }}>🤖</span>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              background: "white", padding: "12px 16px",
              borderRadius: "18px 18px 18px 4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              🤖 Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{
        padding: "0 24px 12px",
        display: "flex", gap: "8px", flexWrap: "wrap"
      }}>
        {["What is the leave policy?", "Tell me about WFH rules", "When is appraisal conducted?"].map(q => (
          <button key={q} onClick={() => setQuestion(q)} style={{
            padding: "6px 14px", borderRadius: "20px",
            border: "1px solid #cbd5e1", background: "white",
            cursor: "pointer", fontSize: "13px", color: "#475569"
          }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 24px", background: "white",
        borderTop: "1px solid #e2e8f0",
        display: "flex", gap: "12px"
      }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask your question here..."
          style={{
            flex: 1, padding: "12px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "24px", fontSize: "14px",
            outline: "none"
          }}
        />
        <button onClick={sendMessage} disabled={loading} style={{
          width: "48px", height: "48px",
          background: "#1e3a5f", border: "none",
          borderRadius: "50%", cursor: "pointer",
          fontSize: "20px"
        }}>➤</button>
      </div>
    </div>
  );
}