const OrderDes = ({order}) => {
    return(
        <div className="order-card-products">
          {order.products.map((item) => (
            <div className="order-card-product-item" key={item._id}>
              <div className="order-card-product-name">{item.productId.name}</div>
              <div className="order-card-product-qty">Qty: <b>{item.quantity}</b></div>
              <div className="order-card-product-price">₹{item.productId.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
    )
}

export default OrderDes;