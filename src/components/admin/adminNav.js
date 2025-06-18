import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import "../navbar.css";
import "./AdminNav.css";

const AdminNavbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Parse user data safely
  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();
  const role = user?.role || null;
  const username = user?.fname || "Admin";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowProfileDropdown(false);
        setShowSearch(false);
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        !event.target.classList.contains("search-toggle")
      ) {
        setShowMobileMenu(false);
      }
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (role !== "admin") return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/admin/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
    <nav className={`navbar-elegant fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <NavLink to="/admin/dashboard" className="navbar-brand">
          Iconic<span className="brand-accent">Admin</span>
        </NavLink>
        {/* Hamburger for mobile */}
        <button
          className="navbar-hamburger d-lg-none"
          onClick={() => setShowMobileMenu((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className="navbar-links-container flex-grow-1">
          <ul className="navbar-links">
            <li className="nav-item">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                end
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/addProduct"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Add Product
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/editProduct"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Edit Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Manage Users
              </NavLink>
            </li>
          </ul>
          <div className="navbar-actions ms-auto d-flex align-items-center position-relative" style={{ gap: "1rem" }}>
            <div
              className={`collapsible-search-bar-admin ${showSearch ? "expanded" : ""}`}
              ref={searchInputRef}
              style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0, maxWidth: showSearch ? 180 : 28, transition: 'max-width 0.3s cubic-bezier(.4,0,.2,1)' }}
            >
              <form onSubmit={handleSearch} className="search-form" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <AiOutlineSearch
                  className="search-icon-admin align-middle"
                  onClick={toggleSearch}
                  aria-label="Search"
                  style={{ color: '#3a0ca3', fontSize: '1.25rem', cursor: 'pointer', strokeWidth: 1.2, minWidth: 24, marginRight: showSearch ? 6 : 0 }}
                />
                {showSearch && (
                  <input
                    className="search-input-admin"
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => setShowSearch(false)}
                    style={{ border: 'none', outline: 'none', background: 'none', fontSize: '1rem', color: '#222', fontWeight: 400, padding: 0, marginLeft: 2, minWidth: 0, flex: 1 }}
                  />
                )}
              </form>
            </div>
            {/* Profile dropdown stays unchanged */}
            <div className="profile-container position-relative" ref={dropdownRef}>
              <button
                className="profile-btn"
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                aria-label="Show profile menu"
              >
                <FaUserCircle size={24} />
              </button>
              {showProfileDropdown && (
                <div
                  className="profile-dropdown end-0 mt-2"
                  style={{ right: 0, left: "auto", minWidth: 280, position: "absolute" }}
                >
                  <div className="profile-header">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Profile"
                      className="profile-img"
                    />
                    <div>
                      <div className="profile-name">{username}</div>
                      <div className="profile-email">admin</div>
                    </div>
                  </div>
                  <NavLink to="/admin/dashboard" className="dropdown-item">
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/users" className="dropdown-item">
                    Manage Users
                  </NavLink>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Mobile dropdown menu */}
        {showMobileMenu && (
          <div className="mobile-nav-dropdown">
            <ul className="mobile-nav-list">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  end
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/addProduct"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Add Product
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/editProduct"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Edit Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/orders"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/users"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Manage Users
                </NavLink>
              </li>
              <li>
                <button
                  className="nav-link logout w-100 text-start"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
