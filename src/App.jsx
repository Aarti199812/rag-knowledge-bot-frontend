import { useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [showAdmin, setShowAdmin] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowAdmin(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (showAdmin && user.role === "ADMIN") {
    return (
      <AdminPanel
        user={user}
        onBack={() => setShowAdmin(false)}
      />
    );
  }

  return (
    <Chat
      user={user}
      onLogout={handleLogout}
      onAdmin={() => setShowAdmin(true)}
    />
  );
}