import { Toast } from 'bootstrap';
import { useEffect, useRef } from 'react';
const ToastItem = ({ message }) => {
  const toastRef = useRef(null);

 useEffect(() => {
    // Wait until the DOM is painted
    const timer = setTimeout(() => {
      if (toastRef.current) {
        const bsToast = new Toast(toastRef.current);
        bsToast.show();
      }
    }, 0); // Run after render

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={toastRef}
      className="toast align-items-center text-white bg-success border-0 mb-2"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default ToastItem;