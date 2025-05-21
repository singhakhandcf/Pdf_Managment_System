import { useState } from "react";
import type { LoginData} from "../types/auth";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from 'axios';


const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/login", formData);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || error.message || "Login failed";
      alert(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      /><br /><br />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      /><br /><br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
