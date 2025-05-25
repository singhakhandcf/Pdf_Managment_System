import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-8">
          📄 PDF Management
        </h1>

        <div className="bg-gradient-to-r from-blue-100 via-white to-blue-100 border border-blue-200 p-6 rounded-xl shadow-lg max-w-2xl w-full mb-16">
          <p className="text-lg text-gray-700 leading-relaxed">
            Manage your documents smarter. Upload, share, and collaborate on PDFs
            with teammates or classmates — all in one place.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-center">
        <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-blue-700 mb-2">📤 Easy Upload</h3>
          <p className="text-gray-600">
            Drag and drop or select files to upload your PDFs instantly and securely.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-blue-700 mb-2">📝 Collaborate</h3>
          <p className="text-gray-600">
            Add comments, share with others, and work together seamlessly on any document.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-blue-700 mb-2">🔒 Privacy First</h3>
          <p className="text-gray-600">
            Your PDFs are secure with us. Only you and the people you choose can view them.
          </p>
        </div>
      </section>

      {/* Conditionally render only when user is NOT logged in */}
      {!isLoggedIn && (
        <section className="flex justify-center gap-6 py-10 bg-blue-50">
          <Link
            to="/register"
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold text-lg hover:bg-blue-100 transition"
          >
            Login
          </Link>
        </section>
      )}
    </Layout>
  );
};

export default Home;
