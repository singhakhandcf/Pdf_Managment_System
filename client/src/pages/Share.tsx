import { useState } from "react";
import API from "../services/api";
import type { AxiosError } from "axios";

const Share = () => {
    const [pdfId, setPdfId] = useState("");
    const [shareLink, setShareLink] = useState("");

    const handleShare = async () => {
        try {
            const res = await API.post(`/pdf/share/${pdfId}`);
            setShareLink(`${window.location.origin}/shared/${res.data.token}`);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMsg =
                error.response?.data?.message || error.message || "Sharing failed";
            alert(errorMsg);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Share PDF</h2>
            <input
                type="text"
                placeholder="Enter PDF ID"
                value={pdfId}
                onChange={(e) => setPdfId(e.target.value)}
            />
            <button onClick={handleShare}>Generate Share Link</button>

            {shareLink && (
                <p>
                    Share this link:{" "}
                    <a href={shareLink} target="_blank" rel="noreferrer">
                        {shareLink}
                    </a>
                </p>
            )}
        </div>
    );
};

export default Share;
