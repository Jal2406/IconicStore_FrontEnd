import {motion} from 'framer-motion'

export const PlaceOrderButton = ({onClick, isPlacingOrder}) => {
    return(
    <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-success rounded-pill px-4"
          onClick={onClick}
          disabled={isPlacingOrder}
        >
        {isPlacingOrder ? "Placing Order..." : "Place Order"}
    </motion.button>
    )
}

export const OrderStatusButton = ({statusColors, onClick, status, statusIcons}) => {
    return(
        <button
            className="order-card-status"
            style={statusColors[status]}
            onClick={onClick}
            >
            {statusIcons[status]}
            <span>{status}</span>
        </button>
    )
}

