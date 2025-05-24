import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Reply {
  userName: string;
  text: string;
}

interface Comment {
  _id:string;
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

const InvitedPdfViewer = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [pdf, setPdf] = useState<Pdf | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("invitedUserName");
    if (!storedName) {
      const name = prompt("Enter your name to comment:");
      if (name) {
        localStorage.setItem("invitedUserName", name);
        setUserName(name);
      }
    } else {
      setUserName(storedName);
    }
  }, []);

  const fetchPdf = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/public/share/${shareId}`
      );
      console.log(res.data.pdf,"PDFS")
      setPdf(res.data.pdf);
    } catch (err) {
      console.error("Failed to load shared PDF", err);
    }
  };

  useEffect(() => {
    if (shareId) fetchPdf();
  }, [shareId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/share/${shareId}/comment`,
        {
          userName,
          comment: newComment,
        }
      );
      setPdf(res.data.pdf);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleReplySubmit = async (commentId:string,index: number) => {
    const reply = replyText[index];
    if (!reply?.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/share/${shareId}/comment/${commentId}/reply`,
        {
          userName,
          text: reply,
        }
      );
      setPdf(res.data.pdf);
      setReplyText((prev) => ({ ...prev, [index]: "" }));
    } catch (err) {
      console.error("Failed to add reply", err);
    }
  };

  if (!pdf) return <div className="p-6 text-center">Loading PDF...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row p-6 gap-6">
      {/* PDF View */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">{pdf.title}</h1>
        <iframe
          src={pdf.url}
          title="PDF Viewer"
          className="w-full h-[600px] border rounded"
        />
      </div>

      {/* Sidebar Comments */}
      <div className="w-full md:w-[400px] bg-gray-50 border p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>

        <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto pr-2">
          {pdf.comments.length > 0 ? (
            pdf.comments.map((c, idx) => (
              <div key={idx} className="bg-white border p-3 rounded">
                <p className="font-medium">{c.userName}</p>
                <p className="text-gray-700 mb-2">{c.text}</p>

                {/* Replies */}
                {c.replies!==undefined&&c.replies?.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {c.replies.map((r, rIdx) => (
                      <div key={rIdx} className="text-sm text-gray-600 border-l pl-2">
                        <span className="font-medium">{r.userName}: </span>{r.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Box */}
                <div className="mt-2 space-y-1">
                  <input
                    type="text"
                    value={replyText[idx] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({ ...prev, [idx]: e.target.value }))
                    }
                    className="w-full p-1 border rounded text-sm"
                    placeholder="Write a reply..."
                  />
                  <button
                    onClick={() => handleReplySubmit(c._id,idx)}
                    className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* Add New Comment */}
        <div className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            rows={3}
          />
          <button
            onClick={handleCommentSubmit}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitedPdfViewer;
