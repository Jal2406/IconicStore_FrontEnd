import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = process.env.REACT_APP_API_URL;


const Login = ({ onUserUpdate }) => {
  const [form, setForm] = useState({ email: "", pass: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!form.email || !form.pass) {
      setError("Please fill in all fields.");
      return;
    }
    // const formData = new FormData(form);
    // const formDataObject = Object.fromEntries(formData.entries());
    // const jsonString = JSON.stringify(formDataObject);
    console.log(form);
    try {
      const res = await axios.post(`${API}/login`,{
        email:form.email,
        pass:form.pass
      });
      const data = res.data
      if(data.token){
        localStorage.setItem('token', data.token)
        const userData = localStorage.setItem('user', JSON.stringify(data.user));
        onUserUpdate(userData);
        navigate("/");
      }
    } catch (err) {
      console.log("Error While Loging in", err)
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${API}/auth/google`
   
    
  }
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >

      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
      >
        <h3 className="mb-4 text-center text-secondary fw-semibold">
          Welcome Back
        </h3>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="loginEmail"
              placeholder="name@example.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
            <label htmlFor="loginEmail">Email address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="loginPass"
              placeholder="Password"
              name="pass"
              value={form.pass}
              onChange={handleChange}
              required
            />
            <label htmlFor="loginPass">Password</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ borderRadius: "8px" }}
          >
            Login
          </button>
         <button
            type="button"
            className="btn btn-outline-danger w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: "8px", fontWeight: 500 }}
            onClick={handleGoogleLogin}
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.23l6.9-6.9C36.68 2.13 30.7 0 24 0 14.82 0 6.73 5.1 2.69 12.55l8.06 6.26C12.6 13.13 17.88 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.75 28.81A14.5 14.5 0 0 1 9.5 24c0-1.68.29-3.3.8-4.81l-8.06-6.26A23.93 23.93 0 0 0 0 24c0 3.77.9 7.34 2.49 10.47l8.26-5.66z"/>
              <path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.19-5.6c-2.01 1.35-4.59 2.15-8.7 2.15-6.12 0-11.4-3.63-13.25-8.81l-8.26 5.66C6.73 42.9 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          Login with Google
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary text-decoration-none fw-semibold"
          >
            Sign Up
          </Link>
        </p>
        <p className="text-center text-muted small mt-3 mb-0">
          {" "}
          <Link
            to="/forgot-password"
            className="text-primary text-decoration-none fw-semibold"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
