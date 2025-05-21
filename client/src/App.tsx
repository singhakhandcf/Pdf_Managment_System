import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewPDF from "./pages/ViewPDF";
import MyPDFs from "./pages/MyPDFs";
import Share from "./pages/Share";
import SharedPdf from "./pages/SharedPdf";
import PrivateRoute from "./utils/PrivateRoute";

type AppProps = {
  className?: string;
};


const App: React.FC<AppProps> = ({ className }) => {
  return (
    <div className={className}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pdf/:id" element={<ViewPDF />} />
      <Route path="/mypdfs" element={<MyPDFs />} />
      <Route path="/share" element={<Share />} />
      <Route path="/shared/:token" element={<SharedPdf />} />
      {/* <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} /> */}
      <Route path="/mypdfs" element={<PrivateRoute><MyPDFs /></PrivateRoute>} />
      <Route path="/share" element={<PrivateRoute><Share /></PrivateRoute>} />
    </Routes>
    </div>
  );
}

export default App;
