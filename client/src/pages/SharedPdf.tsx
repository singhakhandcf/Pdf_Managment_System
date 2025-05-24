import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Pdf {
  title: string;
  url: string;
  ownerName: string;
}

const SharedPdf = () => {
  const { shareId } = useParams();
  const [pdf, setPdf] = useState<Pdf | null>(null);

  useEffect(() => {
    const fetchSharedPdf = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pdf/shared/${shareId}`);
        setPdf(res.data.pdf);
      } catch (err) {
        console.error("Error fetching shared PDF", err);
      }
    };

    fetchSharedPdf();
  }, [shareId]);

  if (!pdf) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{pdf.title}</h1>
      <p className="text-gray-600 mb-2">Shared by: {pdf.ownerName}</p>
      <a
        href={pdf.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Open PDF
      </a>
    </div>
  );
};

export default SharedPdf;
