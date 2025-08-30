// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
// Replace react-toastify with react-hot-toast
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
const API = process.env.REACT_APP_API_URL
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`,{
      withCredentials:true
    });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrder = orders.filter(o => o.status !== 'delivered')

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API}/orders/${orderId}/status`,
        { status: newStatus },{
      withCredentials:true
    }
      );
      toast.success("Order status updated.");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status.");
      console.error(err);
    }
  };

  return (
    <div className="container page-above-navbar mt-5">
      <h2 className="mb-4 fw-semibold text-center">Customer Orders</h2>
      {loading ? (
        <div className="text-center my-5">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted mt-5 fs-5">No orders found.</div>
      ) : (
        <div className="table-responsive rounded-4 shadow-sm">
          <table className="table table-hover table-borderless align-middle mb-0">
            <thead className="table-dark rounded-top-4">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrder.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId?.email || "Unknown"}</td>
                  <td>{order.address}</td>
                  <td>{order.paymentMethod.toUpperCase()}</td>
                  <td>{order.status}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.products.map((p, index) => (
                        <li key={index}>
                          {p.productId?.name || "[Deleted Product]"} x {p.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="form-select rounded-pill shadow-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
