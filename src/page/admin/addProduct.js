import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const categoryOptions = {
  Electronics: ["Mobiles", "Laptops", "Audio", "Cameras"],
  Fashion: ["Men", "Women", "Kids"],
  Footwear: ["Shoes", "Sandals", "Sneakers"],
  Accessories: ["Watches", "Bags", "Jewelry"],
};

const AddProducts = () => {
  const [productName, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("color", color);
    formData.append("size", size);
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:3000/product", formData,{
      withCredentials:true
    });

      if (res.status === 201) {
        alert("Product added successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to add product");
    }
  };

  return (
    <motion.div
      className="container-fluid page-above-navbar bg-gray-100 min-vh-100 py-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9 col-sm-10">
          <motion.div
            className="card shadow-lg border-0 rounded-4 overflow-hidden"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-header bg-white border-bottom">
              <h3 className="text-center my-3 text-gray-800 fw-semibold">
                Add New Product
              </h3>
            </div>
            <div className="card-body p-5 bg-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label fw-semibold text-gray-700">
                    Product Name
                  </label>
                  <input
                    value={productName}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="form-control shadow-sm transition-all focus:ring focus:ring-indigo-200"
                    placeholder="e.g. Galaxy Watch 5"
                    required
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold text-gray-700">Brand</label>
                  <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    type="text"
                    className="form-control shadow-sm"
                    placeholder="e.g. Samsung, Nike"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-gray-700">
                      Category
                    </label>
                    <select
                      className="form-control shadow-sm"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubCategory("");
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      {Object.keys(categoryOptions).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-gray-700">
                      Subcategory
                    </label>
                    <select
                      className="form-control shadow-sm"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {category &&
                        categoryOptions[category].map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control shadow-sm"
                    min="1"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="form-control shadow-sm"
                      min="0"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-gray-700">Color</label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="form-control shadow-sm"
                      placeholder="e.g. Black, Red"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold text-gray-700">Size</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="form-control shadow-sm"
                    placeholder="e.g. M, L, 42 EU"
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control shadow-sm"
                    placeholder="Short product description"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold text-gray-700">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                  />
                </div>

                <motion.div
                  className="d-grid mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary py-2 px-4 rounded-pill shadow"
                  >
                    ➕ Add Product
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProducts;
