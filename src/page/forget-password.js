import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API = process.env.REACT_APP_API_URL;

const ForgotPass = () => {
    const [email, setEmail] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!email) {
            alert("Please enter your email address.");
            return;
        }
        try{
            const res = axios.post(`${API}/user/forget-password`,
                { email },
                { headers: { 'Content-Type': 'application/json' } }     
            )
            setShowOtp(true);
                       
        }
        catch(error) {
            console.error("Error sending reset link:", error);
            alert("Failed to send reset link. Please try again.");
        }
    };

    const handleOtpChange = (e, idx) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);

        if (value && idx < 5) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handleVerify = async() => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            alert("Please enter a complete OTP.");
            return;
        }

        try {
            const res = await axios.post(`${API}/user/verify-otp`, {
                email,
                otp: otpString
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.status === 200) {
                const reset = res.data.token; 
                navigate('/reset-password', { state: { token: reset } });
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Failed to verify OTP. Please try again.");
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', paddingTop: '7rem' }}>
            <div className="card shadow-lg p-4 rounded-4 w-100" style={{ maxWidth: '420px' }}>
                <h3 className="text-center mb-4 text-primary fw-bold">Forgot Password</h3>

                {!showOtp ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                            <input
                                type="email"
                                className="form-control rounded-3 py-2"
                                id="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm"
                        >
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-muted mb-4 fw-medium">Enter the 6-digit OTP sent to your email</p>
                        <div className="d-flex justify-content-center gap-2 mb-4">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => (inputRefs.current[idx] = el)}
                                    type="text"
                                    maxLength={1}
                                    inputMode="numeric"
                                    className="form-control text-center fs-4 rounded shadow-sm"
                                    style={{ width: '44px', height: '55px' }}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, idx)}
                                    onKeyDown={(e) => handleKeyDown(e, idx)}
                                />
                            ))}
                        </div>
                        <button onClick={handleVerify} className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm">
                            Verify OTP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPass;
