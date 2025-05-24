import { useEffect, useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

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

const Dashboard = () => {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPDFs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/public/pdfs?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API response:", res.data);

      setPdfs(res.data.pdfs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch PDFs", err);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleView = (id: string) => {
    if (token) {
      navigate(`/pdf/${id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        🌍 Public PDF Library
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(pdfs) && pdfs.map(pdf => (
          <div
            key={pdf._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{pdf.title}</h2>
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              Open PDF in new tab
            </a>
            <p className="text-gray-600 mt-2 text-sm">
              Uploaded by: <span className="font-medium">{pdf.uploadedBy}</span>
            </p>

            <button
              onClick={() => handleView(pdf._id)}
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded"
            >
              View Details & Comments
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded text-sm disabled:opacity-50"
        >
          ⬅️ Previous
        </button>
        <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded text-sm disabled:opacity-50"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
