import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = location.state?.token || null; // Ideally passed after OTP verification

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!token) {
            alert("Access denied. Please verify OTP first.");
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/user/reset-password', {
                token,
                newPassword: password
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.status === 200) {
                alert("Password reset successful. Please log in.");
                navigate('/login');
            } else {
                alert("Reset failed. Try again.");
            }
        } catch (error) {
            console.error("Reset error:", error);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', paddingTop: '7rem' }}>
            <div className="card shadow-lg p-4 rounded-4 w-100" style={{ maxWidth: '420px' }}>
                <h3 className="text-center mb-4 text-success fw-bold">Reset Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">New Password</label>
                        <input
                            type="password"
                            className="form-control rounded-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control rounded-3 py-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Re-enter new password"
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 py-2 fw-semibold rounded-3 shadow-sm">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
