import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="text-3xl font-extrabold text-blue-700">
          PDFCollab
        </Link>

        <div className="flex items-center space-x-8 font-medium text-gray-700">
          <Link to="/dashboard" className="hover:text-blue-600 transition">
            All PDFs
          </Link>
          <Link to="/mypdfs" className="hover:text-blue-600 transition">
            My PDFs
          </Link>
          <Link to="/upload" className="hover:text-blue-600 transition">
            Upload PDF
          </Link>
        </div>

        {location.pathname !== "/" && (
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 rounded text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
