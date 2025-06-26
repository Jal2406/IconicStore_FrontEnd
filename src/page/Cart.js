import { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutInput from "../components/ui/CheckoutInput";
import {PlaceOrderButton} from "../components/ui/Button";


const Cart = ({ onRemoveFromCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const API = process.env.REACT_APP_API_URL;
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  // Additional fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // Delivery address fields
  const [flat, setFlat] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  
  const fullAdress = `${flat}, ${area}${landmark ? ", " + landmark : ""}, ${city}, ${state}, ${country} - ${pincode}`;
  // setAddress(fullAdress);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try { 
      const response = await axios.get(`${API}/product/cart`, {
        headers: { Authorization: token }
      });
      console.log("Cart response data:", response.data);
      const rawItems = response.data.products || [];
      const mappedItems = rawItems.map(item => ({
        id: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        price: item.productId.price,
        quantity: item.quantity
      }));
      setCartItems(mappedItems);

    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const getTotal = () => cartItems.reduce((t, item) => t + item.price * item.quantity, 0);

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/product/cart/${productId}`, {
        headers: { Authorization: token }
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleCheckout = async () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !flat.trim() || !area.trim() || !pincode.trim() || !city.trim() || !state.trim() || !country.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    // Compose address string for backend compatibility
    const addressString = `${flat}, ${area}${landmark ? ", " + landmark : ""}, ${city}, ${state}, ${country} - ${pincode}`;
    setIsPlacingOrder(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API}/product/checkout`,
        {
          name,
          phone,
          email,
          address: addressString,
          paymentMethod,
          products: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          totalAmount: getTotal()
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json"
          }
        }
      );
      alert("Order placed successfully!");
      setCartItems([]);
      setShowCheckout(false);
      setName(""); setPhone(""); setEmail("");
      setFlat(""); setArea(""); setLandmark(""); setPincode(""); setCity(""); setState(""); setCountry("");
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Failed to place order. Try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleRazorpayPayment = async () => {
    const token = localStorage.getItem("token");
    try {
      // Razorpay expects amount in paise, so multiply by 100 here
      const response = await axios.post(
        `${API}/payment/create-order`,
        {
          amount: parseInt(getTotal() * 100), // INR to paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`
        },
        {
          headers: { Authorization: token }
        }
      );
      const options = {
        key: "rzp_test_JVB6uyPjz1CHAi",
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: response.data.id,
        handler: async (response) => {
  try {
        const verificationResponse = await axios.post(
          `${API}/payment/verify-payment`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: parseInt(getTotal() * 100),
            address: fullAdress,
            products: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            })),
          },
          {
            headers: { Authorization: token }
          }
        );
        alert("Order placed successfully!");
        setCartItems([]);
        setShowCheckout(false);
      } catch (err) {
        console.error("Payment verification failed", err);
        alert("Failed to place order. Try again.");
      }
    },
        prefill: {
          name,
          email,
          contact: phone
        },
        theme: {
          color: "#F37254"
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Razorpay payment failed", err);
      alert("Failed to initiate payment. Try again.");
    }
  }

  return (
    <div className="container page-above-navbar min-vh-100">
      <h2 className="mb-4 fw-semibold text-center">Your Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="card shadow-sm border-0 rounded-4 p-0 mb-4"
          >
            <ul className="list-group list-group-flush">
              {cartItems.map(item => (
                <motion.li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h5 className="mb-1 fw-semibold">{item.name}</h5>
                    <small className="text-muted">Category: {item.category}</small>
                    <div className="text-secondary">Price: ₹{item.price}</div>
                    <div className="text-secondary">Quantity: {item.quantity}</div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold fs-5 text-success">₹{item.price * item.quantity}</span>
                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </div>
                </motion.li>
              ))}
              <li className="list-group-item d-flex justify-content-between align-items-center py-3 px-2 bg-light rounded-bottom-4">
                <strong>Total</strong>
                <strong className="text-primary">₹{getTotal()}</strong>
              </li>
            </ul>
          </motion.div>

          <div className="mt-4 text-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary rounded-pill px-4 py-2 shadow-sm"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-muted mt-5 fs-5"
        >Your cart is empty.</motion.div>
      )}

      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal d-block"
            tabIndex="-1"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="modal-dialog modal-dialog-centered"
            >
              <div className="modal-content shadow rounded-4 border-0">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-semibold">Checkout</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCheckout(false)}></button>
                </div>
                <div className="modal-body pt-0">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <CheckoutInput lable={'Full Name'} value={name} placeholder={'Enter your Name'} onChange={(e) => {setName(e.target.value)}} required={true}/>
                    </div>
                    <div className="col-md-6 mb-3">
                      <CheckoutInput lable={'Phone Number'} value={phone} placeholder={'Enter your Phone Number'} onChange={(e) => {setPhone(e.target.value)}} required={true}/>
                    </div>
                  </div>
                  <div className="mb-3">
                    <CheckoutInput lable={'Email'} value={email} placeholder={'Enter your Email'} onChange={(e) => {setEmail(e.target.value)}} required={true}/>
                  </div>
                  <div className="mb-3">
                    <CheckoutInput lable={'Area'} value={flat} placeholder={'Flat No./ Apartment Name'} onChange={(e) => {setFlat(e.target.value)}} required={true}/>
                  </div>
                  <div className="mb-3">
                    <CheckoutInput lable={'Area'} value={area} placeholder={'Area / Locality'} onChange={(e) => {setArea(e.target.value)}} required={true}/>
                  </div>
                  <div className="mb-3">
                    <CheckoutInput lable={'Landmark'} value={landmark} placeholder={'Landmark (Optional)'} onChange={(e) => {setLandmark(e.target.value)}}/>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <CheckoutInput lable={'City'} value={city} placeholder={'City'} onChange={(e) => {setCity(e.target.value)}} required={true}/>
                    </div>
                    <div className="col-md-6 mb-3">
                      <CheckoutInput lable={'Pincode'} value={pincode} placeholder={'Pincode'} onChange={(e) => {setPincode(e.target.value)}} required={true}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <CheckoutInput lable={'State'} value={state} placeholder={'State'} onChange={(e) => {setState(e.target.value)}} required={true}/>
                    </div>
                    <div className="col-md-6 mb-3">
                      <CheckoutInput lable={'country'} value={country} placeholder={'Country'} onChange={(e) => {setCountry(e.target.value)}} required={true}/>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Payment Method</label>
                    <select className="form-select rounded-3 shadow-sm" onChange={e => setPaymentMethod(e.target.value)} value={paymentMethod}>
                      <option value="cod" >Cash on Delivery (COD)</option>
                      <option value="razorpay" onClick={handleRazorpayPayment}>UPI or Credit/Debit Card</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowCheckout(false)}>Cancel</button>
                  {paymentMethod === "razorpay" ? (
                    <PlaceOrderButton onClick={handleRazorpayPayment} isPlacingOrder={isPlacingOrder}/>
                  ) :
                    <PlaceOrderButton onClick={handleCheckout} isPlacingOrder={isPlacingOrder}/> 
                  }
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
