import { useEffect, useState } from "react";
import API from "../services/api";
import { AxiosError } from "axios";

interface PdfData {
    _id: string;
    title: string;
    url: string;
}

const MyPDFs = () => {
    const [pdfs, setPdfs] = useState<PdfData[]>([]);

    const fetchMyPdfs = async () => {
        try {
            const res = await API.get("/pdf/mine");
            setPdfs(res.data.pdfs);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMsg =
                error.response?.data?.message || error.message || "Fetching failed";
            alert(errorMsg);
        }
    };

    useEffect(() => {
        fetchMyPdfs();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Uploaded PDFs</h2>
            {pdfs.length === 0 ? (
                <p>No PDFs uploaded yet.</p>
            ) : (
                pdfs.map((pdf) => (
                    <div key={pdf._id} style={{ marginBottom: "1rem" }}>
                        <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                            {pdf.title}
                        </a>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyPDFs;
