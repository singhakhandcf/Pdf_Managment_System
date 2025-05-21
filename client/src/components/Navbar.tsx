import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <a href="/">Home</a>{" | "}
      <a href="/dashboard">Dashboard</a>{" | "}
      <a href="/upload">Upload</a>{" | "}
      <a href="/mypdfs">My PDFs</a>{" | "}
      <a href="/share">Share</a>{" | "}
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <a href="/login">Login</a>{" | "}
          <a href="/register">Register</a>
        </>
      )}
    </nav>
  );
};

export default Navbar;
