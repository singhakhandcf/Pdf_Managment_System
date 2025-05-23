// src/pages/UploadPdf.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Upload= () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pdf", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        alert("PDF uploaded successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload a PDF</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter title"
          className="w-full px-3 py-2 border rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          className="w-full"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
