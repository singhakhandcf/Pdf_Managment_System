import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Reply {
  userName: string;
  text: string;
}

interface Comment {
  _id: string;
  userName: string;
  text: string;
  replies?: Reply[];
}

interface Pdf {
  _id: string;
  title: string;
  url: string;
  ownerName: string;
  comments: Comment[];
}

const PdfViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [pdf, setPdf] = useState<Pdf | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState<string[]>([]);
  const token = localStorage.getItem("token");

  const fetchPdf = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPdf(res.data.pdf);
      setReplyTexts(Array(res.data.pdf.comments.length).fill(""));
    } catch (err) {
      console.error("Failed to load PDF", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/${id}/comment`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPdf(prev => prev ? { ...prev, comments: res.data.pdf.comments } : prev);
      setNewComment("");
      setReplyTexts(Array(res.data.pdf.comments.length).fill(""));
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleReplySubmit = async (commentId:string,commentIndex: number) => {
    const reply = replyTexts[commentIndex];
    if (!reply.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/${id}/comment/${commentId}/reply`,
        { text: reply }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPdf(res.data.pdf);
      setReplyTexts(prev => {
        const updated = [...prev];
        updated[commentIndex] = "";
        return updated;
      });
    } catch (err) {
      console.error("Failed to add reply", err);
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
            <div key={idx} className="border p-2 rounded bg-gray-50 space-y-2">
              <p className="font-medium">{c.userName}</p>
              <p className="text-gray-700">{c.text}</p>

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {c.replies.map((r, i) => (
                    <div key={i} className="border-l-2 pl-2 text-sm text-gray-800">
                      <p className="font-semibold">{r.userName}</p>
                      <p>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply box */}
              {token && (
                <div className="ml-4">
                  <textarea
                    value={replyTexts[idx] || ""}
                    onChange={e => {
                      const updated = [...replyTexts];
                      updated[idx] = e.target.value;
                      setReplyTexts(updated);
                    }}
                    className="w-full p-1 border rounded text-sm"
                    rows={2}
                    placeholder="Reply..."
                  />
                  <button
                    onClick={() => handleReplySubmit(c._id,idx)}
                    className="mt-1 text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Comment box */}
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
