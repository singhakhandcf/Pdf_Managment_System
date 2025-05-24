import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { User, ChevronDown, Upload } from "lucide-react";

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const menuRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

  console.log("token is",token);

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (token && name) {
      setUsername(name);
    } else {
      setUsername(null);
    }
  }, [token]);

  // 👇 Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }

      if (
        authRef.current &&
        !authRef.current.contains(e.target as Node)
      ) {
        setShowAuthOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleUploadClick = () => {
    if (token) {
      navigate("/upload");
    } else {
      setShowAuthOptions(true);
    }
  };

  return (
    <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow relative z-50">
      <Link to="/" className="text-2xl font-bold">
        📄 PDFCollab
      </Link>

      <div className="flex items-center gap-6 text-sm relative">
        {/* 👤 User Dropdown */}
        <div
          className="flex items-center gap-2 cursor-pointer relative"
          onClick={() => setMenuOpen(!menuOpen)}
          ref={menuRef}
        >
          <User size={18} />
          <span className="font-medium">
            {username ? `Welcome, ${username}` : `Welcome, Guest`}
          </span>
          <ChevronDown size={16} />
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white text-black border rounded shadow-lg">
              {username ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 🔗 Dashboard link */}
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>

        {/* ⬆ Upload Icon Button */}
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-1 hover:underline"
        >
          <Upload size={16} />
          Upload
        </button>

        {/* 🔐 Auth Options Dropdown */}
        {showAuthOptions && (
          <div
            ref={authRef}
            className="absolute top-full right-0 mt-2 w-44 bg-white text-black border rounded shadow-lg"
          >
            <div className="px-4 py-2 border-b font-semibold">
              Login Required
            </div>
            <Link
              to="/login"
              onClick={() => setShowAuthOptions(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setShowAuthOptions(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
