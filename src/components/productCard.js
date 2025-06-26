import axios from "axios";
import React, { useState, useEffect } from "react";
// Replace react-toastify with react-hot-toast
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import "./productCard.css";
const API = process.env.REACT_APP_API_URL; 

toast.info = (message) =>
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: 'linear-gradient(to right, #2193b0, #6dd5ed)',
      color: 'white',
    },
  });


const ProductCard = ({ product, onAddToCart, isWishlisted = false, onRemoveFromWishlist, hideCart }) => {
  const [isWished, setIsWished] = useState(isWishlisted);

  const [cartClicked, setCartClicked] = useState(false);

  const handleCartClick = (product) => {
    // Animate icon
    setCartClicked(true);
    setTimeout(() => setCartClicked(false), 400); // match animation duration

    // Only call one toast: remove from here, keep in handleAddToCart
    onAddToCart && onAddToCart(product);
    handleAddToCart(product); 
    console.log(product)// Call the function to add to cart
    // handleAddToCart(product) will show the toast
  };

  // Rest of the component remains the same, just update toast calls
  // For example:
  // toast.error("Failed to add to cart") becomes toast.error("Failed to add to cart")
  // The syntax is the same, but the styling will be different

  useEffect(() => {
    setIsWished(isWishlisted);
  }, [isWishlisted]);

  const handleAddToCart = async (product) => {
    try {
      const res = await axios.post(
        `${API}/product/addTocart`,
        { productId: product._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response:", res.data);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        toast.error("Please login to add products to cart.", { autoClose: 4000 });
      } else {
        toast.error("Something went wrong. Try again.", { autoClose: 4000 });
      }
      console.error("Add to cart error:", error);
    }
  };

  const toggleWishlist = async () => {
  const newWishedStatus = !isWished;

  try {
    if (newWishedStatus) {
      await axios.post(
        `${API}/product/wishlist`,
        { productId: product._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      await axios.delete(
        `${API}/product/wishlist`,
        {
          data: { productId: product._id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
    }

    setIsWished(newWishedStatus);
    toast.info(
      `${product.name} ${newWishedStatus ? "added to" : "removed from"} wishlist.`,
      { autoClose: 1000 }
    );
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      toast.error("Please login to manage wishlist.", { autoClose: 4000 });
    } else {
      toast.error("Something went wrong. Try again.", { autoClose: 4000 });
    }
    console.error("Wishlist toggle error:", error);
  }
};


  return (
    <div className="col card h-100 shadow-sm position-relative product-card rounded-4 border-0 p-0">
      <div className="product-image-container">
        <img
          src={product.image || "https://via.placeholder.com/300x200"}
          className="card-img-top rounded-top-4"
          alt={product.name}
          style={{ objectFit: "cover", height: "200px" }}
        />
        <div className="hover-menu">
          {!hideCart && (
            <div
              className={`action-icon cart-icon ${cartClicked ? "clicked" : ""}`}
              onClick={() => handleCartClick(product)}
              tabIndex={0}
              aria-label="Add to cart"
              role="button"
            >
              <AiOutlineShoppingCart size={20} />
            </div>
          )}
          <div 
            className="action-icon"
            onClick={onRemoveFromWishlist ? () => onRemoveFromWishlist(product._id) : toggleWishlist}
            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
            tabIndex={0}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            role="button"
          >
            {isWished ? (
              <AiFillHeart className="heart-icon active" size={20} />
            ) : (
              <AiOutlineHeart className="heart-icon" size={20} />
            )}
          </div>
        </div>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <h5 className="card-title fw-semibold mb-1 text-truncate">{product.name}</h5>
        <p className="card-text text-muted mb-1 small">{product.category}</p>
        <p className="card-text fw-bold mb-2 text-primary">₹{product.price}</p>
      </div>
    </div>
  );
};
export default ProductCard;
