import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface Comment {
  userName: string;
  comment: string;
}

interface Pdf {
  _id: string;
  title: string;
  url: string;
  ownerName: string;
  comments: Comment[];
}

const MyPdfs = () => {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPDFs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/view/mypdfs?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPdfs(res.data.data.pdfs);
      setTotalPages(res.data.data.totalPages);
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
    if (token) navigate(`/pdf/${id}`);
    else navigate("/login");
  };

  const openShareModal = (pdfId: string) => {
    setSelectedPdfId(pdfId);
    setShowModal(true);
    setStatusMessage("");
    setEmail("");
  };

  const handleShare = async () => {
    if (!email || !selectedPdfId) { setStatusMessage("Please enter recipent's mail"); return; }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/share/${selectedPdfId}`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      setStatusMessage("✅ Share link sent successfully!");
      setEmail("")
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Failed to send share link.");
      setEmail("")
    }
  };

  const filteredPdfs = pdfs.filter(
    (pdf) =>
      pdf.title.toLowerCase().includes(searchTerm) ||
      pdf.ownerName.toLowerCase().includes(searchTerm)
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = localStorage.getItem("name"); // assuming you stored it as 'name'

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("name");
  //   navigate("/");
  // };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (

    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 relative overflow-hidden"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-end mb-4 relative">
          <div className="flex justify-end mb-4">
            <div className="relative flex items-center" ref={dropdownRef}>
  <button
    onClick={() => setShowDropdown((prev) => !prev)}
    className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow-md hover:bg-blue-50 transition flex items-center"
  >
    👤 {userName}
    <svg
      className="w-4 h-4 ml-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.585l3.71-4.355a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </button>

  {showDropdown && (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-32 bg-white rounded-lg shadow-lg z-10 text-sm">
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        🚪 Logout
      </button>
    </div>
  )}
</div>

          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex-1 w-full">
            <h1 className="text-4xl font-bold text-blue-700 mb-4 md:mb-0">
              🌍 Public PDF Library
            </h1>
            <br />
            <div className="relative w-full mb-8">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by title or uploader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition transform hover:scale-105"
            >
              📁 Dashboard
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition transform hover:scale-105"
            >
              ⬆️ Upload PDF
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPdfs.length === 0 ? (
            <p className="text-center text-gray-500 text-lg col-span-full mt-6">
              😢 No PDFs found
            </p>
          ) : (
            filteredPdfs.map((pdf) => (
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
                  Uploaded by: <span className="font-medium">{pdf.ownerName}</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleView(pdf._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded"
                  >
                    View PDF
                  </button>
                  <button
                    onClick={() => openShareModal(pdf._id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded"
                  >
                    🔗 Share
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            ⬅️ Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>

        {/* Share Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Share this PDF via Email</h3>
              <input
                type="email"
                placeholder="Enter recipient's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              />
              {statusMessage && (
                <p className="text-sm text-center mb-3 text-blue-600">{statusMessage}</p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  Send Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default MyPdfs;
