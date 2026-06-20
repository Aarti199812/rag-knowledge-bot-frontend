import { useState, useEffect } from "react";
import { uploadDocument, getAllDocuments, deleteDocument } from "../services/api";

export default function AdminPanel({ user, onBack }) {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await getAllDocuments();
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id || 1);
      await uploadDocument(formData);
      setMessage("✅ Document upload ho gaya!");
      setFile(null);
      fetchDocuments();
    } catch (err) {
      setMessage("❌ Upload failed!");
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete karna hai?")) return;
    try {
      await deleteDocument(id);
      setMessage("✅ Document delete ho gaya!");
      fetchDocuments();
    } catch (err) {
      setMessage("❌ Delete failed!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* Header */}
      <div style={{
        background: "#1e3a5f", color: "white",
        padding: "16px 24px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📁</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px" }}>Admin Panel</h2>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
              Document Management
            </p>
          </div>
        </div>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.2)",
          border: "none", color: "white",
          padding: "8px 16px", borderRadius: "6px",
          cursor: "pointer"
        }}>← Back to Chat</button>
      </div>

      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>

        {/* Upload Section */}
        <div style={{
          background: "white", borderRadius: "12px",
          padding: "24px", marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{ margin: "0 0 16px", color: "#1e3a5f" }}>
            📤 Document Upload karo
          </h3>

          <div style={{
            border: "2px dashed #cbd5e1", borderRadius: "8px",
            padding: "32px", textAlign: "center",
            marginBottom: "16px", cursor: "pointer",
            background: file ? "#f0fdf4" : "#f8fafc"
          }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput" type="file"
              accept=".pdf" style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div style={{ fontSize: "40px" }}>📄</div>
            <p style={{ color: "#64748b", margin: "8px 0" }}>
              {file ? `✅ ${file.name}` : "PDF file select karo"}
            </p>
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>
              Click to browse
            </p>
          </div>

          {message && (
            <p style={{
              padding: "10px", borderRadius: "6px",
              background: message.includes("✅") ? "#f0fdf4" : "#fef2f2",
              color: message.includes("✅") ? "#16a34a" : "#dc2626",
              marginBottom: "12px"
            }}>{message}</p>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              width: "100%", padding: "12px",
              background: !file || uploading ? "#94a3b8" : "#1e3a5f",
              color: "white", border: "none",
              borderRadius: "8px", fontSize: "16px",
              fontWeight: "600", cursor: "pointer"
            }}
          >
            {uploading ? "Uploading..." : "Upload karo"}
          </button>
        </div>

        {/* Documents List */}
        <div style={{
          background: "white", borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{ margin: "0 0 16px", color: "#1e3a5f" }}>
            📚 Uploaded Documents ({documents.length})
          </h3>

          {documents.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "32px" }}>
              Koi document nahi hai abhi
            </p>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px", borderRadius: "8px",
                border: "1px solid #e2e8f0", marginBottom: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "24px" }}>📄</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: "#1a1a1a" }}>
                      {doc.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                      {doc.fileType} • {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={{
                    background: "#fef2f2", color: "#dc2626",
                    border: "1px solid #fecaca",
                    padding: "6px 12px", borderRadius: "6px",
                    cursor: "pointer", fontSize: "13px"
                  }}
                >🗑️ Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}