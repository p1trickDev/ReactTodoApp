import { useEffect } from "react";
import PropTypes from "prop-types";
import "../css/Modal.css";

function Modal({ isOpen, onClose, title, children, type }) {
  useEffect(() => {
    if (isOpen) {
      // Close modal automatically after 3 seconds for notifications
      if (type === "notification") {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, onClose, type]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-container ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">{children}</div>
        {type !== "notification" && (
          <div className="modal-footer">
            <button className="modal-button" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

Modal.defaultProps = {
  type: "default",
};

export default Modal;
