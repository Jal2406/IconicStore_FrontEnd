import React, { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import "./MainProductPage.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

const MainProductPage = ({ onAddtoCart }) => {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "All",
    minPrice: 0,
    maxPrice: 100000,
  });
  const [wishlistIds, setWishlistIds] = useState([]);
  const [searchParams] = useSearchParams();
  const param = searchParams.get("category");

  useEffect(() => {
  if (param) {
    setFilters((prev) => ({
      ...prev,
      category: param
    }));
  }
}, [param]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:3000/product");
        setLoadedProducts(res.data);
        setFilteredProducts(res.data);
        const uniqueCategories = ["All", ...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
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
        const res = await axios.get("http://localhost:3000/product/wishlist", {
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name.includes("Price") ? Number(value) : value,
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
  const filtered = loadedProducts.filter((product) => {
    const matchCategory =
      filters.category === "All" || product.category === filters.category;
    const matchPrice =
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice;
    return matchCategory && matchPrice;
  });

  setFilteredProducts(filtered);
}, [filters, loadedProducts]);
  

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <div className="container page-above-navbar mt-5">
      <h2 className="mb-4 fw-semibold text-center">Explore Products</h2>
      <div className="row">
        {/* Sidebar Filters */}
        <aside className="col-12 col-md-3 mb-4 mb-md-0">
          <div className="card shadow-sm p-4 sticky-top rounded-4" style={{ top: 100 }}>
            <h5 className="fw-bold mb-3">Filters</h5>
            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select rounded-3 shadow-sm"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Min Price (₹)</label>
              <input
                type="number"
                className="form-control rounded-3 shadow-sm"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Max Price (₹)</label>
              <input
                type="number"
                className="form-control rounded-3 shadow-sm"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="100000"
              />
            </div>
          </div>
        </aside>
        {/* Product Grid */}
        <main className="col-12 col-md-9">
          {isLoading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {paginatedProducts.map((product) => (
                  <div className="col" key={product._id}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={onAddtoCart} 
                      isWishlisted={wishlistIds.includes(product._id)}
                    />
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link rounded-pill shadow-sm px-4"
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link rounded-circle mx-1 shadow-sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link rounded-pill shadow-sm px-4"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <div className="text-center text-muted mt-5 fs-5">No products found.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainProductPage;
