import React from "react";
import "./OrderCard.css";
import { Truck, CheckCircle, Hourglass, MapPin, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderStatusButton } from "./ui/Button";
import OrderDes from "./orderDes";

const statusIcons = {
  pending: <Hourglass className="text-yellow-500" />,
  shipped: <Truck className="text-blue-500" />,
  delivered: <CheckCircle className="text-green-500" />,
  cancelled: <CheckCircle className="text-gray-400" />,
};

const statusColors = {
  pending: { background: "#fffbe6", color: "#b59f00" },
  shipped: { background: "#e0f2fe", color: "#2563eb" },
  delivered: { background: "#e6fffa", color: "#059669" },
  cancelled: { background: "#f3f4f6", color: "#888" },
};

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="order-card"
    >
      {/* Header Section */}
      <div className="order-card-header">
        <div className="order-card-title">Order #{order._id.slice(-6)}</div>
        <OrderStatusButton statusColors={statusColors} onClick={() => setIsExpanded((v) => !v)} status={order.status} statusIcons={statusIcons}/>
      </div>
      {/* Main Content */}
      <div className="order-card-body">
        {/* Address Section */}
        <div className="order-card-address">
          <MapPin size={16} style={{ color: '#4361ee', marginRight: 6, verticalAlign: -2 }} />
          {order.address}
        </div>
        {/* Products Section */}
        <OrderDes order={order}/>
        {/* Order Summary (expandable) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="order-card-summary"
            >
              <div>Payment: <b>{order.paymentMethod}</b></div>
              <div>Total: <span style={{ color: '#059669', fontWeight: 700 }}>₹{order.totalAmount.toLocaleString()}</span></div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="order-card-expand-btn"
          onClick={() => setIsExpanded((v) => !v)}
        >
          {isExpanded ? "Show Less" : "Show More"}
          <span style={{ display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
        </button>
      </div>
    </motion.div>
  );
};

export default OrderCard;