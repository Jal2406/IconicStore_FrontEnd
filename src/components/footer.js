import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top">
      <div className="container text-center text-md-start">
        <div className="row gy-4">
          {/* Brand Info */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold text-white mb-3">IconicStore</h5>
            <p className="text-light small">
              Discover premium quality products crafted for your modern lifestyle.
              Shop with confidence and experience the best service.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="text-uppercase fw-semibold text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled text-light small">
              <li><a href="/" className="text-decoration-none text-light">Home</a></li>
              <li><a href="/cart" className="text-decoration-none text-light">Cart</a></li>
              <li><a href="/addProduct" className="text-decoration-none text-light">Add Product</a></li>
              <li><a href="/editProduct" className="text-decoration-none text-light">Products</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 className="text-uppercase fw-semibold text-white mb-3">Contact Us</h6>
            <p className="text-light small mb-1">Email: support@iconicstore.com</p>
            <p className="text-light small">Phone: +91 98765 43210</p>
          </div>

          {/* Social Media */}
          <div className="col-md-3">
            <h6 className="text-uppercase fw-semibold text-white mb-3">Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5 rounded-circle bg-secondary bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center" aria-label="Facebook" style={{transition:'background 0.2s'}}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light fs-5 rounded-circle bg-secondary bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center" aria-label="Instagram" style={{transition:'background 0.2s'}}>
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr className="border-light mt-4 opacity-25" />
        <div className="text-center text-light text-muted small pt-2">
          © {new Date().getFullYear()} IconicStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
