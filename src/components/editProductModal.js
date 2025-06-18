import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditProductModal = ({ show, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    id:'',
    name: "",
    category: "",
    price: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product._id,
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
      });
    }
  }, [product]);
  console.log(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
  if (!formData.name || !formData.category || !formData.price) return;

  const updatedProduct = {
    name: formData.name,
    category: formData.category,
    price: parseInt(formData.price),
  };

  try {
    const res = await axios.put(
      `http://localhost:3000/product/${formData.id}`,{
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        }
      }
    );
    
    console.log("Updated Product:", res.data);
    onSave({...res.data, id:res.data._id});
    onClose();
  } catch (error) {
    console.error("Error updating product:", error);
    
  }
};

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Shoes">Shoes</option>
              <option value="Watches">Watches</option>
              <option value="Audio">Audio</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
