import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "EMPLOYEE"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (isRegister) {
        res = await registerUser(form);
      } else {
        res = await loginUser({ 
          email: form.email, 
          password: form.password 
        });
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1e3a5f, #0f172a)"
    }}>
      <div style={{
        background: "white", padding: "40px",
        borderRadius: "16px", width: "100%",
        maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "40px" }}>🤖</div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e3a5f" }}>
            Knowledge Bot
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            AI-Powered Company Assistant
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: "flex", background: "#f1f5f9",
          borderRadius: "8px", padding: "4px", marginBottom: "24px"
        }}>
          <button onClick={() => setIsRegister(false)} style={{
            flex: 1, padding: "8px",
            background: !isRegister ? "white" : "transparent",
            border: "none", borderRadius: "6px",
            fontWeight: "600", cursor: "pointer",
            color: !isRegister ? "#1e3a5f" : "#666"
          }}>Login</button>
          <button onClick={() => setIsRegister(true)} style={{
            flex: 1, padding: "8px",
            background: isRegister ? "white" : "transparent",
            border: "none", borderRadius: "6px",
            fontWeight: "600", cursor: "pointer",
            color: isRegister ? "#1e3a5f" : "#666"
          }}>Register</button>
        </div>

        {/* Form */}
        {isRegister && (
          <input name="name" placeholder="Full Name"
            value={form.name} onChange={handleChange}
            style={inputStyle} />
        )}
        <input name="email" placeholder="Email"
          value={form.email} onChange={handleChange}
          style={inputStyle} />
        <input name="password" placeholder="Password"
          type="password" value={form.password}
          onChange={handleChange} style={inputStyle} />

        {isRegister && (
          <select name="role" value={form.role}
            onChange={handleChange} style={inputStyle}>
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "12px",
          background: loading ? "#94a3b8" : "#1e3a5f",
          color: "white", border: "none",
          borderRadius: "8px", fontSize: "16px",
          fontWeight: "600", cursor: "pointer"
        }}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px",
  marginBottom: "16px", border: "1px solid #e2e8f0",
  borderRadius: "8px", fontSize: "14px",
  outline: "none", boxSizing: "border-box"
};