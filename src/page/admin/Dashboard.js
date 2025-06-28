import React, { useEffect, useState } from "react";
import { FaStar, FaBoxOpen, FaCheckCircle, FaChartBar, FaTags } from "react-icons/fa";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

// Placeholder API functions
const fetchMostSellingItems = async () => {
  // TODO: Replace with real API call
  return [
    { id: 1, name: "Nike Air Max", sold: 120, image: "https://via.placeholder.com/80" },
    { id: 2, name: "Apple Watch", sold: 95, image: "https://via.placeholder.com/80" },
    { id: 3, name: "Sony Headphones", sold: 80, image: "https://via.placeholder.com/80" },
  ];
};
const fetchTopRatedItems = async () => {
  // TODO: Replace with real API call
  return [
    {
      id: 1,
      name: "Nike Air Max",
      type: "Shoes",
      image: "/images/1749537972033-LostAndFound.jpg",
      views: 133,
      downloads: "20k",
    },
    {
      id: 2,
      name: "Apple Watch",
      type: "Watches",
      image: "/images/1749538423236-nordwood-themes-wt4gUtdv1-U-unsplash.jpg",
      views: 222,
      downloads: "40k",
    },
    {
      id: 3,
      name: "Nike Air Max",
      type: "Shoes",
      image: "/images/1749538527614-Screenshot_2023-11-04-20-13-01-92_e0622096d88164da06cba5132c1ca21b.jpg",
      views: 122,
      downloads: "25k",
    },
    {
      id: 4,
      name: "Sony Headphones",
      type: "Audio",
      image: "/images/1749704715758-Screenshot 2024-06-26 234347.png",
      views: 144,
      downloads: "35k",
    },
  ];
};
const fetchOrderStats = async () => {
  // TODO: Replace with real API call
  const res = await axios.get(`${API}/orders/states`,{
      withCredentials:true
    })
  console.log(res.data);
  return {
    totalOrders: res.data.length,
    deliveredOrders: res.data.delivered,
  };
};
const fetchCategoryWiseSelling = async () => {
  //TODO: Replace with real API call
  return [
    { category: "Shoes", sold: 150, icon: <FaTags className="text-indigo-600" /> },
    { category: "Watches", sold: 100, icon: <FaTags className="text-green-600" /> },
    { category: "Audio", sold: 70, icon: <FaTags className="text-pink-600" /> },
  ];
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const [mostSelling, setMostSelling] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, deliveredOrders: 0 });
  const [categorySelling, setCategorySelling] = useState([]);

  useEffect(() => {
    // Simulate API calls
    fetchMostSellingItems().then(setMostSelling);
    fetchTopRatedItems().then(setTopRated);
    fetchOrderStats().then(setOrderStats);
    fetchCategoryWiseSelling().then(setCategorySelling);
  }, []);

  return (
    <motion.div
      className="container page-above-navbar py-5 min-vh-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 className="fw-bold mb-4 text-center" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>Admin Dashboard</motion.h2>
      <div className="row g-4 mb-5 justify-content-center">
        <motion.div className="col-12 col-md-4" variants={cardVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
          <Card>
            <div className="d-flex align-items-center gap-3">
              <FaBoxOpen size={36} className="text-primary" />
              <div>
                <div className="fw-semibold fs-5">Total Orders</div>
                <div className="fs-3 fw-bold text-primary">{orderStats.totalOrders}</div>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div className="col-12 col-md-4" variants={cardVariants} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
          <Card>
            <div className="d-flex align-items-center gap-3">
              <FaCheckCircle size={36} className="text-success" />
              <div>
                <div className="fw-semibold fs-5">Orders Delivered</div>
                <div className="fs-3 fw-bold text-success">{orderStats.deliveredOrders}</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Horizontally scrollable cards */}
      <motion.div className="mb-5">
        <h4 className="fw-semibold mb-3">Most Selling Items</h4>
        <div className="scroll-x d-flex gap-4 pb-2" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {mostSelling.map((item, idx) => (
            <motion.div key={item.id} className="flex-shrink-0" style={{ minWidth: 260, maxWidth: 260 }} variants={cardVariants} initial="initial" animate="animate" transition={{ delay: 0.1 + idx * 0.1 }}>
              <Card>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <img src={item.image} alt={item.name} className="rounded-3 shadow-sm" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                  <div>
                    <div className="fw-semibold">{item.name}</div>
                    <div className="text-muted small">Sold: <span className="fw-bold text-primary">{item.sold}</span></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className="mb-5">
        <h4 className="fw-semibold mb-3">Top Rated Items</h4>
        <div className="scroll-x d-flex gap-4 pb-2" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {topRated.map((item, idx) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 bg-dark text-light rounded-4 shadow border-0"
              style={{ minWidth: 320, maxWidth: 320, overflow: 'hidden', position: 'relative' }}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 + idx * 0.1 }}
            >
              <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '1.25rem', borderTopRightRadius: '1.25rem' }}
                />
              </div>
              <div className="p-3">
                <div className="fw-bold fs-5 mb-1 text-white">{item.name}</div>
                <div className="text-secondary mb-2" style={{ fontSize: '1rem' }}>{item.type}</div>
                <div className="d-flex gap-4 align-items-center mt-2">
                  <span className="d-flex align-items-center gap-1 text-light">
                    <svg width="18" height="18" fill="currentColor" className="bi bi-eye me-1" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.12 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5A2.5 2.5 0 1 0 8 10a2.5 2.5 0 0 0 0-4.5zM8 9A1 1 0 1 1 8 7a1 1 0 0 1 0 2z"/></svg>
                    {item.views}
                  </span>
                  <span className="d-flex align-items-center gap-1 text-light">
                    <svg width="18" height="18" fill="currentColor" className="bi bi-cloud-arrow-down me-1" viewBox="0 0 16 16"><path d="M4.406 1.342A5.53 5.53 0 0 1 8 0a5.53 5.53 0 0 1 3.594 1.342C13.74 2.387 14.5 4.06 14.5 6c0 1.098-.356 2.13-.97 2.98A3.5 3.5 0 1 1 4.5 13H4a4 4 0 1 1 .406-11.658zM8 15a.5.5 0 0 0 .5-.5V10.707l1.146 1.147a.5.5 0 0 0 .708-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 10.707V14.5A.5.5 0 0 0 8 15z"/></svg>
                    {item.downloads}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div>
        <h4 className="fw-semibold mb-3">Category Wise Selling</h4>
        <div className="scroll-x d-flex gap-4 pb-2" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {categorySelling.map((cat, idx) => (
            <motion.div key={cat.category} className="flex-shrink-0" style={{ minWidth: 220, maxWidth: 220 }} variants={cardVariants} initial="initial" animate="animate" transition={{ delay: 0.1 + idx * 0.1 }}>
              <Card>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <span className="fs-2">{cat.icon}</span>
                  <div>
                    <div className="fw-semibold">{cat.category}</div>
                    <div className="text-muted small">Sold: <span className="fw-bold text-primary">{cat.sold}</span></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
