import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await API.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("PDF Uploaded Successfully");
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || error.message || "Upload failed";
      alert(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
      <h2>Upload PDF</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} /><br /><br />
      <button type="submit">Upload</button>
    </form>
  );
};

export default Upload;
