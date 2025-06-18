import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import "./navbar.css";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token) {
      setIsLoggedIn(true);
      setUser(userData);
    }

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
      
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target) &&
        !event.target.classList.contains('search-toggle')
      ) {
        setShowSearch(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?filter=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    navigate("/login");
  };

  const toggleSearch = () => {
    setShowSearch((prev) => {
      const newState = !prev;
      if (!prev) {
        setTimeout(() => {
          const inputEl = searchInputRef.current?.querySelector("input");
          if (inputEl) inputEl.focus();
        }, 0);
      }
      return newState;
    });
  };

  return (
    <nav className={`navbar-elegant fixed-top ${scrolled ? 'scrolled' : ''}`}> 
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          Iconic<span className="brand-accent">Store</span>
        </NavLink>

        {/* Hamburger for mobile */}
        <button className="navbar-hamburger d-lg-none rounded-circle border-0 bg-white shadow-sm p-2 ms-2" onClick={() => setShowMobileMenu((prev) => !prev)} aria-label="Toggle navigation">
          {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className="navbar-links-container flex-grow-1">
          <ul className="navbar-links">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/MyOrders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                My Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cart" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <FaShoppingCart className="icon-cart" />
                Cart
              </NavLink>
            </li>
          </ul>

          <div className="navbar-actions ms-auto d-flex align-items-center position-relative" style={{ gap: "1rem" }}>
            <div
              className={`collapsible-search-bar-default ${showSearch ? "expanded" : ""}`}
              ref={searchInputRef}
              style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0, maxWidth: showSearch ? 180 : 28, transition: 'max-width 0.3s cubic-bezier(.4,0,.2,1)' }}
            >
              <form onSubmit={handleSearch} className="search-form" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <AiOutlineSearch
                  className="search-icon-default align-middle"
                  onClick={toggleSearch}
                  aria-label="Search"
                  style={{ color: '#4361ee', fontSize: '1.25rem', cursor: 'pointer', strokeWidth: 1.2, minWidth: 24, marginRight: showSearch ? 6 : 0 }}
                />
                {showSearch && (
                  <input
                    className="search-input-default"
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => setShowSearch(false)}
                    style={{ border: 'none', outline: 'none', background: 'none', fontSize: '1rem', color: '#222', fontWeight: 400, padding: 0, marginLeft: 2, minWidth: 0, flex: 1 }}
                  />
                )}
              </form>
            </div>
            <div className="profile-container position-relative" ref={dropdownRef}>
              <button
                className="profile-btn"
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                aria-label="Show profile menu"
              >
                <FaUserCircle size={24} />
              </button>
              {showProfileDropdown && (
                <div className="profile-dropdown end-0 mt-2" style={{right:0, left:'auto', minWidth:280, position:'absolute'}}>
                  <div className="profile-header">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Profile"
                      className="profile-img"
                    />
                    <div>
                      <div className="profile-name">{user?.fname || "User"}</div>
                      <div className="profile-email text-muted small">{user?.email || ""}</div>
                    </div>
                  </div>
                  <NavLink to="/account" className="dropdown-item">My Account</NavLink>
                  <NavLink to="/wishlist" className="dropdown-item">Wishlist</NavLink>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {showMobileMenu && (
          <div className="mobile-nav-dropdown rounded-4 shadow border-0 p-3 bg-white">
            <ul className="mobile-nav-list">
              <li><NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setShowMobileMenu(false)} end>Home</NavLink></li>
              <li><NavLink to="/Products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setShowMobileMenu(false)}>Products</NavLink></li>
              <li><NavLink to="/MyOrders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setShowMobileMenu(false)}>My Orders</NavLink></li>
              <li><NavLink to="/cart" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setShowMobileMenu(false)}><FaShoppingCart className="icon-cart" />Cart</NavLink></li>
              <li><NavLink to="/wishlist" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setShowMobileMenu(false)}>Wishlist</NavLink></li>
              <li><NavLink to="/account" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setShowMobileMenu(false)}>My Account</NavLink></li>
              <li><NavLink to="/login" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setShowMobileMenu(false)}>Login</NavLink></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
