import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProductPage from './page/productPage';
import AddProducts from './page/AddProduct';
import { useEffect, useState } from 'react';
import defaultProducts from './data/product';
import EditProduct from './page/admin/editProduct'
import Cart from './page/Cart';
import SearchResults from './components/SearchResult';
import PrivateRoute from './components/PrivateRoute';
// Remove ToastItem import
// import ToastItem from './components/ToastItem';
import Login from './page/login';
import Signup from './page/signup';
import Footer from './components/footer';
import AdminNavbar from './components/admin/adminNav';
// Remove react-toastify imports
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import MainProductPage from './page/MainProductPage';
import PrivateAdminRoute from './components/admin/AdminPrivateRoute';
import AdminOrders from './page/admin/Order';
import AdminUserManagement from './page/admin/Users';
import Wishlist from './page/Wishlist';
import MyAccount from './page/MyAccount';
import Orders from './page/Orders';
// Import toast and our custom toaster
import toast from 'react-hot-toast';
import CustomToaster from './components/CustomToast';
import AdminDashboard from './page/admin/Dashboard';
import ForgotPass from './page/forget-password';
import ResetPassword from './page/reset-password';
import axios from 'axios';
import { useAuth } from './components/AuthContext';



function App() {
  const navigate = useNavigate();
  const {user, role} = useAuth();
  

  // useEffect(() => {
  //   const AdminCheck = async () => {
  //     const res = await axios.get(`${process.env.REACT_APP_API_URL}/login/verify-admin`)
  //     setAdmin(res.data)
  //   }

  //   AdminCheck();
  //   console.log(isAdmin)
  // }, []);

  // Remove the old toasts state
  // const [toasts, setToasts] = useState([]);
  // Replace with react-hot-toast
  const addToast = (message) => {
    toast(message, {
      icon: '🛒',
    });
  };

  const[product, setProduct] = useState(()=>{
    try {
      const saved = JSON.parse(localStorage.getItem('products'));
      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      } else {
        return defaultProducts;
      }
    } catch (err) {
      return defaultProducts;
    }
  })

  useEffect(() => {
    if (Array.isArray(product)) {
      localStorage.setItem('products', JSON.stringify(product));
    }
  }, [product]);


   const [cartItems, setCartItems] = useState(() => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
});

useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}, [cartItems]);

const addToCart = (product) => {
 
  const existingItem = (cartItems || []).find((item) => item.id === product.id);
  if (existingItem) {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id
    ? { ...item, quantity: item.quantity + 1 }
    : item
  )
);
} else {
  setCartItems((prevCart) => [
    ...prevCart,
    { ...product, quantity: 1 }
  ]);
}

addToast(`Added "${product.name}" to cart!`);
};

const removeFromCart = (id) => {
  setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
};
  return (

    <div className="d-flex flex-column min-vh-100">
        {role === "admin" ? <AdminNavbar /> : <Navbar />}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/search" element={<SearchResults onAddToCart={addToCart} />} />
            <Route index path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path='/forgot-password' element={<ForgotPass/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>
            <Route              
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart cartItems={cartItems} onRemoveFromCart={removeFromCart} />
                </PrivateRoute>
            }
            />
            <Route path='/account' element={
              <PrivateRoute>
                <MyAccount />
              </PrivateRoute>
            } />

            <Route path='/myorders' element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }/>
            <Route path='/wishlist' element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            } />
            <Route
              index
              element={<ProductPage products={product} onAddtoCart={addToCart} />}
            />
            <Route
              path="/Products"
              element={
                <MainProductPage products={product} onAddtoCart={addToCart} />
                }
            />
            <Route
              path="/addProduct"
              element={
                <PrivateAdminRoute>
                  <AddProducts />
                </PrivateAdminRoute>
              }
            />
            <Route
              path="/editProduct"
              element={
                <PrivateAdminRoute>
                  <EditProduct  />
                </PrivateAdminRoute>
              }
            />
            <Route path='/admin/orders' element={
              <PrivateAdminRoute>
                <AdminOrders />
              </PrivateAdminRoute>
            } />
            <Route path='/admin/users' element={
              <PrivateAdminRoute >
                <AdminUserManagement/>
              </PrivateAdminRoute>
            } />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateAdminRoute>
                  <AdminDashboard />
                </PrivateAdminRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      {/* Replace ToastContainer with our CustomToaster */}
      <CustomToaster />
    </div>
  );
}

export default App;
