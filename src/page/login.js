import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
      const res = await axios.post('http://localhost:3000/login',{
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
