import { useEffect, useState } from "react";
import API from "../services/api";

interface PdfData {
  _id: string;
  title: string;
  url: string;
  uploadedBy: {
    name: string;
  };
}

const Dashboard = () => {
  const [pdfs, setPdfs] = useState<PdfData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPdfs = async () => {
    try {
      const res = await API.get(`/pdf/all?page=${page}`);
      setPdfs(res.data.pdfs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch PDFs",error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, [page]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All PDFs</h2>
      {pdfs.map((pdf) => (
        <div key={pdf._id} style={{ marginBottom: "1rem" }}>
          <a href={pdf.url} target="_blank" rel="noopener noreferrer">
            {pdf.title}
          </a>
          <p>Uploaded by: {pdf.uploadedBy.name}</p>
        </div>
      ))}

      <div>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>{page}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
