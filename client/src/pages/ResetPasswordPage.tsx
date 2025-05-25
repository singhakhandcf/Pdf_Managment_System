import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("forgotEmail");

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/reset-password`, {
                email,
                newPassword: password,
            });
            alert("Password updated successfully");
            localStorage.removeItem("forgotEmail");
            navigate("/");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMsg =
                error.response?.data?.message || error.message || "Failed TO reset password";
            alert(errorMsg);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    placeholder="New Password"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    placeholder="Confirm Password"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
