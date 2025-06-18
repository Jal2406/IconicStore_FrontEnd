import { useEffect, useState } from "react";
import EditProductCard from "../components/editProductCard";
import EditProductModal from "../components/editProductModal";
import axios from "axios";

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    const fetchP = async () => {
      const res = await axios.get('http://localhost:3000/product');
    const normalized = res.data.map(p => ({
      ...p,
      id: p._id,
    }));
    setProducts(normalized);
    }
    fetchP();
  }, []);

  // Open modal with selected product
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Save edited product
  const handleSaveEdit = (updatedProduct) => {
    setProducts((prev) =>
     prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p)
    );
    handleClose();
    window.location.reload(); 
     
  };

  return (
    <div className="container page-above-navbar mt-5">
      <h2 className="mb-4 fw-semibold text-center">Edit Products</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col" key={product.id}>
              <EditProductCard product={product} onEdit={handleEditClick} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted text-center">No products found.</p>
          </div>
        )}
      </div>

      {/* Single Modal outside the loop */}
      {selectedProduct && (
        <EditProductModal
          show={showModal}
          onClose={handleClose}
          product={selectedProduct}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default EditProduct;
