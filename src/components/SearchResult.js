import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './productCard';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL;
const SearchResults = ({ onAddToCart }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('filter') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API}/product/search?filter=${query}`);
        setProducts(res.data);
      } catch (err) {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  // useEffect(() => {
  //   const fetchFilter = async () => {
  //     const res = await axios.get(`http://localhost:3000/product/search?filter=${filter}`);
  //   }
  // }, [filter]);
    


  return (
    <div className="container mt-4">
      <h2>Search Results for "{query}"</h2>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="row">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
