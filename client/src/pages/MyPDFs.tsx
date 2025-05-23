import { useEffect, useState } from "react";
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

const MyPDFs = () => {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [filteredPDFs, setFilteredPDFs] = useState<Pdf[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState<{ [key: string]: boolean }>({});

  const pdfsPerPage = 10;
  const token = localStorage.getItem("token");

  const fetchUserPDFs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/mypdfs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPdfs(res.data.pdfs);
    } catch (err) {
      setError("Failed to fetch your PDFs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPDFs();
  }, []);

  useEffect(() => {
    const filtered = pdfs.filter((pdf) =>
      pdf.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPDFs(filtered);
    setPage(1); // reset page on new search
  }, [searchTerm, pdfs]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPDFs.length / pdfsPerPage);
  const paginatedPDFs = filteredPDFs.slice(
    (page - 1) * pdfsPerPage,
    page * pdfsPerPage
  );

  const handleCommentChange = (pdfId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [pdfId]: value }));
  };

  const handleCommentSubmit = async (pdfId: string) => {
    const comment = commentInputs[pdfId];
    if (!comment || comment.trim() === "") return;

    setSubmitLoading((prev) => ({ ...prev, [pdfId]: true }));

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/${pdfId}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Clear input
      setCommentInputs((prev) => ({ ...prev, [pdfId]: "" }));
      // Refresh PDFs to get updated comments
      await fetchUserPDFs();
    } catch (err) {
      alert("Failed to add comment. Try again.");
      console.error(err);
    } finally {
      setSubmitLoading((prev) => ({ ...prev, [pdfId]: false }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My PDFs</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search PDFs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading PDFs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : paginatedPDFs.length === 0 ? (
        <p className="text-center text-gray-600">No PDFs found.</p>
      ) : (
        <div className="space-y-8">
          {paginatedPDFs.map((pdf) => (
            <div key={pdf._id} className="p-5 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{pdf.title}</h2>
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
              <p className="text-sm text-gray-600 mt-1">Uploaded by: You</p>

              {/* Comments */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Comments</h3>
                {pdf.comments.length > 0 ? (
                  <ul className="max-h-36 overflow-y-auto space-y-1 border p-2 rounded bg-gray-50">
                    {pdf.comments.map((cmt, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-semibold">{cmt.userName}:</span> {cmt.comment}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}

                {/* Add Comment */}
                {token ? (
                  <div className="mt-3 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[pdf._id] || ""}
                      onChange={(e) => handleCommentChange(pdf._id, e.target.value)}
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={submitLoading[pdf._id]}
                    />
                    <button
                      onClick={() => handleCommentSubmit(pdf._id)}
                      disabled={submitLoading[pdf._id]}
                      className={`px-4 py-2 rounded-md text-white ${
                        submitLoading[pdf._id] ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {submitLoading[pdf._id] ? "Posting..." : "Comment"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500 italic">Login to add comments.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPDFs;
