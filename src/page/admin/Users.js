import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/admin/users', {
          headers: { Authorization: token }
        });

        console.log("Fetched from backend:", res.data); // should be an array
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("Unexpected data format:", res.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);


  const filteredUsers = Array.isArray(users)
  ? users.filter((user) =>
      (`${user.fname} ${user.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : [];

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
        headers: { Authorization: token }
      });
      // fetchUsers();
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <div className="container page-above-navbar mt-4">
      <h2 className="mb-4 fw-semibold text-center">User Management</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        className="form-control my-3 rounded-pill shadow-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="table-responsive rounded-4 shadow-sm">
        <table className="table table-hover table-borderless align-middle mb-0">
          <thead className="table-dark rounded-top-4">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.fname} {user.lname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2 rounded-pill px-3"
                    onClick={() => {
                      setEditUser(user);
                      setForm({
                        name: user.name,
                        email: user.email,
                        role: user.role
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setEditUser(null)}></button>
              </div>
              <div className="modal-body pt-0">
                <input
                  type="text"
                  className="form-control mb-2 rounded-3 shadow-sm"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  className="form-control mb-2 rounded-3 shadow-sm"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <select
                  className="form-control rounded-3 shadow-sm"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setEditUser(null)}>Cancel</button>
                <button className="btn btn-success rounded-pill px-4">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
