import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const API = process.env.REACT_APP_API_URL;

const MyAccount = () => {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({ oldPass: "", newPass: "", confirmPass: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/login/profile`, {
        headers: { Authorization: token },
      });
      setForm({
        fname: res.data.fname,
        lname: res.data.lname,
        email: res.data.email,
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Only run on mount
  }, []);

  useEffect(() => {
    console.log("[MyAccount] mount");
    return () => {
      console.log("[MyAccount] unmount");
    };
  }, []);

  useEffect(() => {
    console.log("[MyAccount] editMode:", editMode);
  }, [editMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/login/profile`, form, {
        headers: { Authorization: token },
      });
      toast.success("Profile updated");
      setEditMode(false);
      fetchProfile(); // Refetch profile after save
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.oldPass || !passwords.newPass || !passwords.confirmPass) {
      toast.error("Please fill all password fields");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/login/change-password`, {
        oldPass: passwords.oldPass,
        newPass: passwords.newPass,
      }, {
        headers: { Authorization: token },
      });
      toast.success("Password updated");
      setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 500, marginTop: 90 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
  <h2 className="fw-semibold">My Account</h2>
  {!editMode && (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => setEditMode(true)}
    >
      Edit Profile
    </button>
  )}
</div>
<form onSubmit={handleSave} className="card shadow-sm p-4 mb-4">

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="fname"
            value={form.fname}
            onChange={handleChange}
            disabled={!editMode}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lname"
            value={form.lname}
            onChange={handleChange}
            disabled={!editMode}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editMode}
            required    
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          {editMode && (
  <div className="d-flex justify-content-between align-items-center mt-4">
    <button type="submit" className="btn btn-success">Save</button>
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => setEditMode(false)}
    >
      Cancel
    </button>
  </div>
)}

        </div>
      </form>
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Change Password</h5>
          <button className="btn btn-outline-primary btn-sm" onClick={() => setShowPasswordForm((v) => !v)}>
            {showPasswordForm ? "Close" : "Edit"}
          </button>
        </div>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange}>
            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.oldPass}
                onChange={e => setPasswords({ ...passwords, oldPass: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.newPass}
                onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.confirmPass}
                onChange={e => setPasswords({ ...passwords, confirmPass: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
