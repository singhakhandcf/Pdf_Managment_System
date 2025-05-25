import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
        email,
        password,
      });
      console.log(res.data.data, "login");
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("name", res.data.data.name);
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || error.message || "Login failed";
      alert(errorMsg);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/forgot-password`,
        { email }
      );
      console.log(res.status,"status");

      // Assuming response contains success status and maybe userId or temp token
      alert("OTP has been sent to your email.");
      localStorage.setItem("forgotEmail", email); // store for OTP verification
      navigate("/verify-otp");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || error.message || "Something went wrong";
      alert(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
          className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
        >
          Forgot Password?
        </button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
