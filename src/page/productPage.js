import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../components/productCard";
import HeroSection from "../components/heroSection";
import "./ProductPage.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const ProductPage = ({ onAddtoCart }) => {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const scroll = (direction) => {
    if (isScrolling || !scrollRef.current) return;
    
    setIsScrolling(true);
    
   
    const containerWidth = scrollRef.current.clientWidth;
    const cardWidth = 240 + 24; // Card width + gap
    
 
    const scrollCards = Math.floor(containerWidth / cardWidth) - 1;
    const scrollAmount = scrollCards * cardWidth;
    
  
    const maxScroll = scrollRef.current.scrollWidth - containerWidth;
    let newPosition;
    
    if (direction === "left") {
      newPosition = Math.max(0, scrollPosition - scrollAmount);
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
    }
    
    // Apply smooth scroll with transform
    scrollRef.current.style.transform = `translateX(-${newPosition}px)`;
    setScrollPosition(newPosition);
    
    // Reset scrolling state after animation completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }
  
  // Track scroll position when user manually scrolls
  const handleScroll = () => {
    if (scrollRef.current && !isScrolling) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setLoadedProducts([]);
        
        const res = await axios.get(`${API}/product`);
        console.log("Products fetched:", res.data);
        setLoadedProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/product/wishlist`, {
          headers: { Authorization: token },
        });
        const ids = (res.data.products || []).map(item => (item.productId?._id || item._id));
        setWishlistIds(ids);
      } catch (err) {
        // Optionally toast error
      }
    };
    fetchWishlist();
  }, []);

  // Group products by category
  const categories = {};
  loadedProducts.forEach((product) => {
    if (!categories[product.category]) categories[product.category] = [];
    categories[product.category].push(product);
  });

  return (
    <>
      <HeroSection />
      <div className="container page-above-navbar mt-4">
        <h2 className="mb-3 fw-semibold text-center">Products</h2>
        {isLoading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="carousel-wrapper position-relative">
            <button 
              className="carousel-btn left" 
              onClick={() => scroll("left")}
              disabled={isScrolling || scrollPosition <= 0}
            >
              <SlArrowLeft size={18} />
            </button>

            <div className="carousel-container">
              <div 
                className="scroll-carousel" 
                ref={scrollRef}
                onScroll={handleScroll}
              >
                {loadedProducts.map((product) => (
                  <div className="scroll-card fade-in-item" key={product._id}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={onAddtoCart} 
                      isWishlisted={wishlistIds.includes(product._id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="carousel-btn right" 
              onClick={() => scroll("right")}
              disabled={isScrolling || (scrollRef.current && scrollPosition >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth)}
            >
              <SlArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
     
      <div className="container mt-5">
        <h3 className="mb-4 fw-semibold text-center">Shop by Category</h3>
        <div className="row g-4">
          {Object.entries(categories).map(([cat, products]) => {
            const firstProduct = products[0];
            return (
              <div className="col-12 col-md-6 col-lg-4" key={cat}>
                <Card
                  className="category-card shadow border-0 h-100 p-0 rounded-4"
                  style={{ cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onClick={() => navigate(`/Products?category=${encodeURIComponent(cat)}`)}
                >
                  <div style={{ height: 180, background: '#f6f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img
                      src={firstProduct.image || 'https://via.placeholder.com/300x200'}
                      alt={cat}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover', borderRadius: 0 }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h5 className="fw-bold mb-2 text-primary text-center" style={{ letterSpacing: 1 }}>{cat}</h5>
                    <div className="d-flex flex-wrap gap-3 mb-2 justify-content-center">
                      {products.slice(0, 2).map((product) => (
                        <div style={{ minWidth: 120, flex: '1 1 45%' }} key={product._id}>
                          <ProductCard 
                            product={product} 
                            onAddToCart={onAddtoCart} 
                            isWishlisted={wishlistIds.includes(product._id)}
                            hideCart={false}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-outline-primary w-100 mt-2 fw-semibold rounded-pill"
                      style={{ fontSize: '1rem', letterSpacing: 0.5, transition:'.2sx'}}
                      onClick={e => { e.stopPropagation(); navigate(`/Products?category=${encodeURIComponent(cat)}`); }}
                    >
                      Shop {cat}
                    </button>
                    {products.length > 2 && (
                      <div className="mt-2 text-end">
                        <span className="text-secondary small">+{products.length - 2} more in {cat}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
