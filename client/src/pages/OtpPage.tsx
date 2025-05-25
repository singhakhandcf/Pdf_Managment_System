import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("forgotEmail");

    const handleSubmit = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/verify-otp`, {
                email,
                otp,
            });
            navigate("/reset-password");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMsg =
                error.response?.data?.message || error.message || "Invalid OTP !";
            alert(errorMsg);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    placeholder="4-digit OTP"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OtpPage;
