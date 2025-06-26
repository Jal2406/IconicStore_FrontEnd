import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { EditInputs } from "./ui/ModalInput";

const API = process.env.REACT_APP_API_URL;

const EditProductModal = ({ show, onClose, product, onSave, categories}) => {
  // const[categories, setCategories] = useState([]);
  const[products, setProducts] = useState([])

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

  const [formData, setFormData] = useState({
    id:'',
    name: "",
    category: "",
    price: "",
    subCategory: "",
    color: "",
    size:"",
    description:"",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product._id,
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        subCategory: product.subCategory ||  "",
        color: product.color || "",
        size: product.size || "",
        description: product.description || "",
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
    subCategory: formData.subCategory ||  "",
    color: formData.color || "",
    size: formData.size || "",
    description: formData.description || "",
  };

  try {
    const res = await axios.put(
      `${API}/${formData.id}`,{
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
          <EditInputs label={'Product Name'} type={'text'} placeholder={'Enter Name'} value={formData.name} onChange={handleChange}/>
          <EditInputs label={'Description'} type={'text'} placeholder={'Description'} value={formData.description} onChange={handleChange}/>
          <EditInputs label={'size'} type={'text'} placeholder={'Size'} value={formData.size} onChange={handleChange}/>
          <EditInputs label={'color'} type={'text'} placeholder={'Color'} value={formData.color} onChange={handleChange}/>
          <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>z
          </Form.Group>
          <EditInputs label={'Price'} type={'number'} placeholder={'Enter Price'} value={formData.price} onChange={handleChange}/>
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
