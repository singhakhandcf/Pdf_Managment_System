// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">All PDFs</h1>

      <div className="space-y-4">
        {pdfs.map(pdf => (
          <div key={pdf._id} className="p-4 border rounded shadow-sm hover:shadow transition">
            <h2 className="text-lg font-semibold">{pdf.title}</h2>
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline block mb-1"
            >
              Open in new tab
            </a>
            <Link
              to={`/pdf/${pdf._id}`}
              className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded inline-block"
            >
              View Details & Comments
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Uploaded by: {pdf.uploadedBy}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">Page {page}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
