import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, UploadCloud } from "lucide-react";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  console.log("token is",token);

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
      formData.append("file", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg border">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6 flex items-center justify-center gap-2">
          <UploadCloud size={24} />
          Upload a PDF
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter PDF title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose PDF file
            </label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full border rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              "Upload PDF"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
