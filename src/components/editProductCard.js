
const EditProductCard = ({ product, onEdit }) => {
    

  return (
    <div className="col card h-100 shadow-sm">
      <img
        src={product.image || "https://via.placeholder.com/300x200"}
        className="card-img-top"
        alt={product.name}
        style={{ objectFit: "cover", height: "200px" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted mb-1">{product.category}</p>
        <p className="card-text fw-bold mb-2">₹{product.price}</p>
        <div className="mt-auto d-grid">
          <button
            className="btn btn-primary"
            onClick={() => onEdit(product)}
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductCard;
