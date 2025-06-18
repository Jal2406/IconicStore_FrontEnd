import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";
import "../page/MainProductPage.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/product/wishlist", {
          headers: { Authorization: token },
        });
        setWishlist(res.data.products || []);
      } catch (err) {
        toast.error("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Remove from wishlist handler
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:3000/product/wishlist", {
        data: { productId },
        headers: { Authorization: token },
      });
      setWishlist((prev) => prev.filter((item) => (item.productId?._id || item._id) !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist.");
    }
  };

  return (
    <div className="container page-above-navbar py-5 min-vh-100">
      <h2 className="mb-4 fw-semibold text-center" style={{letterSpacing:1}}>My Wishlist</h2>
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center text-muted mt-5 fs-5">No products in your wishlist yet.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {wishlist.map((item) => {
            const prod = item.productId || item;
            return (
              <div className="col" key={prod._id}>
                <ProductCard 
                  product={prod} 
                  isWishlisted={true}
                  onRemoveFromWishlist={() => handleRemoveFromWishlist(prod._id)}
                  hideCart={true}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
