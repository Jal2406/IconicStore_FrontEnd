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
    subCategory: 'All',
    size: "All",
    color: "All",
    brand: "All"
  });
  const[subCategories, setSubCategories] = useState([]);
  const[brands, setBrands] = useState([])
  const[sizes, setSizes] = useState([])
  const[colors, setcolors] = useState([])
  const [wishlistIds, setWishlistIds] = useState([]);
  const [searchParams] = useSearchParams();
  const param = searchParams.get("category");
  const API = process.env.REACT_APP_API_URL;

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
        const res = await axios.get(`${API}/product`);
        setLoadedProducts(res.data);
        setFilteredProducts(res.data);
        const uniqueCategories = ["All", ...new Set(res.data.map(p => p.category))];
        const uniqueSize = ["All", ...new Set(res.data.map(p => p.size))];
        const uniqueBrand = ["All", ...new Set(res.data.map(p => p.brand))];
        const uniqueColor = ["All", ...new Set(res.data.map(p => p.color))];
        const uniquesubCategory = ["All", ...new Set(res.data.map(p => p.subCategory))];
        setCategories(uniqueCategories);
        setBrands(uniqueBrand)
        setSubCategories(uniquesubCategory)
        setcolors(uniqueColor)
        setSizes(uniqueSize)
        
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

  const handleFilterChange = (e) => {
  const { name, value, type } = e.target;

  let parsedValue = value;

  if (type === "number") {
    parsedValue = value === "" ? "" : Math.max(0, Number(value));
  }

  if (typeof parsedValue === "string") {
    parsedValue = parsedValue.trim();
    if (parsedValue === "" || parsedValue === "All") {
      parsedValue = "All";
    }
  }

  if (filters[name] === parsedValue) return;

  setFilters((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));

  setCurrentPage(1);
};


  useEffect(() => {
  const filtered = loadedProducts.filter((product) => {
    const matchCategory =
      filters.category === "All" || product.category === filters.category;
    const matchsubCategory = filters.subCategory === "All" || product.subCategory === filters.subCategory
    const matchBrand = filters.brand === "All" || product.brand === filters.brand
    const matchsize = filters.size === "All" || product.size === filters.size
    const matchPrice =
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice;
    return matchCategory && matchPrice && matchsubCategory && matchBrand && matchsize;
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
            {/* Brand Filter */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Brand</label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="form-select rounded-3 shadow-sm"
              >
                {brands.map((brand, idx) => (
                  <option key={idx} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Subcategory</label>
              <select
                name="subCategory"
                value={filters.subCategory}
                onChange={handleFilterChange}
                className="form-select rounded-3 shadow-sm"
              >
                {subCategories.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Filter */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Color</label>
              <select
                name="color"
                value={filters.color}
                onChange={handleFilterChange}
                className="form-select rounded-3 shadow-sm"
              >
                {colors.map((color, idx) => (
                  <option key={idx} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Size</label>
              <select
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="form-select rounded-3 shadow-sm"
              >
                {sizes.map((size, idx) => (
                  <option key={idx} value={size}>
                    {size}
                  </option>
                ))}
              </select>
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
