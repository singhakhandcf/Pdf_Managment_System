// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PdfViewer from "./pages/ViewPDF";
import MyPDFs from "./pages/MyPDFs";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pdf/:id" element={<PdfViewer />} />
      <Route path="/mypdfs" element={<MyPDFs />} />
    </Routes>
  );
};

export default App;
