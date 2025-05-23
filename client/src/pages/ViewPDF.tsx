import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Comment {
  userName: string;
  comment: string;
}

interface Pdf {
  _id: string;
  title: string;
  url: string;
  uploadedBy: string;
  comments: Comment[];
}

const PdfViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [pdf, setPdf] = useState<Pdf | null>(null);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");

  const fetchPdf = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPdf(res.data.pdf);
    } catch (err) {
      console.error("Failed to load PDF", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/${id}/comment`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh PDF data
      setPdf(prev => prev ? { ...prev, comments: res.data.comments } : prev);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  useEffect(() => {
    fetchPdf();
  }, [id]);

  if (!pdf) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{pdf.title}</h1>

      <iframe
        src={pdf.url}
        title="PDF Viewer"
        className="w-full h-[600px] border rounded mb-6"
      />

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="space-y-3 mb-6">
        {pdf.comments.length > 0 ? (
          pdf.comments.map((c, idx) => (
            <div key={idx} className="border p-2 rounded bg-gray-50">
              <p className="font-medium">{c.userName}</p>
              <p className="text-gray-700">{c.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {token && (
        <div className="space-y-2">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            rows={3}
          />
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
