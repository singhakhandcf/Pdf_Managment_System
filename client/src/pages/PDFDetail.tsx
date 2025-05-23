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

const PDFDetail = () => {
  const { id } = useParams();
  const [pdf, setPdf] = useState<Pdf | null>(null);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");

  const fetchPDF = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pdf/${id}`);
      setPdf(res.data.pdf);
    } catch (err) {
      console.error("Failed to fetch PDF", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/${id}/comment`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      fetchPDF(); // Refresh comments
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  useEffect(() => {
    fetchPDF();
  }, []);

  if (!pdf) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{pdf.title}</h1>

      <div className="border rounded p-4 shadow mb-6">
        <iframe
          src={pdf.url}
          title={pdf.title}
          className="w-full h-[500px]"
        ></iframe>
        <p className="mt-2 text-sm text-gray-600">
          Uploaded by: {pdf.uploadedBy}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        {pdf.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-2">
            {pdf.comments.map((comment, idx) => (
              <li key={idx} className="border rounded p-2">
                <strong>{comment.userName}</strong>: {comment.comment}
              </li>
            ))}
          </ul>
        )}
      </div>

      {token && (
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFDetail;
