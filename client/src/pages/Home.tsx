import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>📄 PDF Management & Collaboration System</h1>
      <p>Upload, share and collaborate on PDF documents easily!</p>
      <div style={{ marginTop: "2rem" }}>
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/login" style={{ marginLeft: "1rem" }}>
          <button className="bg-red-500">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
