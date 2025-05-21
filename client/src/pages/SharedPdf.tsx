import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import type { AxiosError } from "axios";

interface Comment {
    name: string;
    comment: string;
}

interface PdfData {
    url: string;
    comments: Comment[];
}

const SharedPdf = () => {
    const { token } = useParams();
    const [pdf, setPdf] = useState<PdfData | null>(null);
    const [newComment, setNewComment] = useState("");
    const [name, setName] = useState("");

    const fetchSharedPdf = async () => {
        try {
            const res = await API.get(`/pdf/shared/${token}`);
            setPdf(res.data.pdf);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || error.message || "Invalid or expired link!";
      alert(errorMsg);
        }
    };

    const handleComment = async () => {
        try {
            await API.post(`/pdf/comment/${token}`, { name, comment: newComment });
            setPdf((prev) =>
                prev
                    ? { ...prev, comments: [...prev.comments, { name, comment: newComment }] }
                    : prev
            );
            setNewComment("");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMsg =
                error.response?.data?.message || error.message || "Failed to post comment";
            alert(errorMsg);
        }
    };

    useEffect(() => {
        fetchSharedPdf();
    }, []);

    if (!pdf) return <div>Loading...</div>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Shared PDF</h2>
            <iframe src={pdf.url} width="100%" height="500px" title="PDF" />
            <h3>Comments</h3>
            {pdf.comments.map((c, i) => (
                <p key={i}><strong>{c.name}:</strong> {c.comment}</p>
            ))}

            <div>
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    placeholder="Your comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <br />
                <button onClick={handleComment}>Post Comment</button>
            </div>
        </div>
    );
};

export default SharedPdf;
