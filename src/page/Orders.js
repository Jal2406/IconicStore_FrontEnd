import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import { motion } from "framer-motion";
import { Package, History, Truck, XCircle } from "lucide-react";
import axios from "axios";
import "../components/OrderCard.css";
const API = process.env.REACT_APP_API_URL;


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("live");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/orders/userOrders`,{
      withCredentials:true
    });
            setOrders(res.data);
            console.log(res.data)
            setError(null);
        } catch (err) {
            setError("Failed to fetch orders. Please try again later.");
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter logic
    const liveOrders = orders.filter(o => o.status === "pending" || o.status === "shipped");
    const historyOrders = orders.filter(o => o.status === "delivered" || o.status === "cancelled");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="container page-above-navbar mt-5">
            <h2 className="mb-4 fw-semibold text-center">My Orders</h2>
            <div className="row">
                {/* Sidebar Filters */}
                <aside className="col-12 col-md-3 mb-4 mb-md-0">
                    <div className="card shadow-sm p-4 sticky-top rounded-4" style={{ top: 100 }}>
                        <h5 className="fw-bold mb-3">Order Filters</h5>
                        <div className="mb-2">
                            <button
                                className={`btn w-100 mb-2 rounded-3 fw-semibold ${filter === "live" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setFilter("live")}
                            >
                                <Truck size={18} className="me-2" /> Live Orders
                            </button>
                            <button
                                className={`btn w-100 rounded-3 fw-semibold ${filter === "history" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setFilter("history")}
                            >
                                <History size={18} className="me-2" /> Order History
                            </button>
                        </div>
                    </div>
                </aside>
                {/* Orders Grid */}
                <main className="col-12 col-md-9">
                    {loading ? (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger text-center my-5">
                            {error}
                            <button className="btn btn-link d-block mx-auto mt-3" onClick={fetchOrders}>Try Again</button>
                        </div>
                    ) : (
                        <>
                            {filter === "live" && (
                                liveOrders.length === 0 ? (
                                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                                        <Package className="mb-3" size={48} style={{ color: '#bdbdbd' }} />
                                        <h4 className="fw-semibold mb-2">No Live Orders</h4>
                                        <div className="text-muted">You have no pending or shipped orders.</div>
                                    </div>
                                ) : (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="row g-4"
                                    >
                                        {liveOrders.map((order) => (
                                            <div className="col-12 col-md-6" key={order._id}>
                                                <OrderCard order={order} />
                                            </div>
                                        ))}
                                    </motion.div>
                                )
                            )}
                            {filter === "history" && (
                                historyOrders.length === 0 ? (
                                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                                        <XCircle className="mb-3" size={48} style={{ color: '#bdbdbd' }} />
                                        <h4 className="fw-semibold mb-2">No Order History</h4>
                                        <div className="text-muted">No delivered or cancelled orders found.</div>
                                    </div>
                                ) : (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="row g-4"
                                    >
                                        {historyOrders.map((order) => (
                                            <div className="col-12 col-md-6" key={order._id}>
                                                <OrderCard order={order} />
                                            </div>
                                        ))}
                                    </motion.div>
                                )
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Orders;