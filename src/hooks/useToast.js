import { useState, useEffect, useRef } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const useToastMessage = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    if (show) {
      const options = {
        animation: true,
        autohide: true,
        delay: 5000,
      };
      const toastElement = toastRef.current;
      const toast = new bootstrap.Toast(toastElement, options);
      toast.show();

      toastElement.addEventListener('hidden.bs.toast', () => setShow(false));
    }
  }, [show]);

  const showToast = (message) => {
    setMessage(message);
    setShow(true);
  };

  return {
    showToast,
    ToastMessage: (
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div ref={toastRef} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <i className="bi bi-info-circle-fill text-primary me-2"></i>
            <strong className="me-auto">Aviso</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {message}
          </div>
        </div>
      </div>
    ),
  };
};

export default useToastMessage;
