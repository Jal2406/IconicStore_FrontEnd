import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const Signup = ({ onUserUpdate }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pass: "",
    confirmPass: "",
    role: "buyer",
  });
  const [error, setError] = useState(null);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const { firstName, lastName, email, pass, confirmPass } = form;

    if (!firstName || !lastName || !email || !pass || !confirmPass) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address.");
      return;
    }

    if (pass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    const res = await axios.post('http://localhost:3000/signup', {
      fname: firstName,
      lname:lastName,
      email,
      pass,
      role: form.role,
    })
    const data = res.data;
    if (data.token && data.role) {
      localStorage.setItem('token', data.token);
      const userData = localStorage.setItem('user', JSON.stringify(data.user));
      onUserUpdate(userData);
      navigate("/");
    } else {
      setError(data.message || "An error occurred during signup.");
    }
  };

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "450px", width: "100%", borderRadius: "12px" }}
      >
        <h3 className="mb-4 text-center text-secondary fw-semibold">
          Create Account
        </h3>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <label htmlFor="firstName">First Name</label>
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="lastName">Last Name</label>
              </div>
            </div>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              name="pass"
              value={form.pass}
              onChange={handleChange}
              required
              minLength={6}
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm Password"
              name="confirmPass"
              value={form.confirmPass}
              onChange={handleChange}
              required
              minLength={6}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            style={{ borderRadius: "8px" }}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-success text-decoration-none fw-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
