import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          📚 PDF Manager
        </Link>
        <div className="flex gap-4 text-sm md:text-base">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/mypdfs" className="hover:underline">
            My PDFs
          </Link>
          <Link to="/upload" className="hover:underline">
            Upload PDF
          </Link>
          <button
            onClick={handleLogout}
            className="hover:underline bg-red-500 px-2 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
