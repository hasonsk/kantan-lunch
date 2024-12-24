import React, { useEffect } from 'react';
import './Modal.css';
import { useDispatch, useSelector } from 'react-redux';
import { hideError, showError } from '../../../redux/errorSlice';

const ErrorModal = () => {
  const dispatch = useDispatch();
  const { value, message } = useSelector((state) => state.error);
  useEffect(() => {
    setTimeout(() => {
      dispatch(hideError());
    }, 5000);
  }, []);

  console.log('modal is');
  // Don't render if the modal is closed

  return (
    <>
      {value === true ? (
        <div className="error-modal-overlay">
          <div className="error-modal-content">
            <button
              className="error-modal-close"
              onClick={() => dispatch(hideError())}
            >
              X
            </button>
            <p>{message}</p>
          </div>
        </div>
      ) : (
        <div className="error-modal-overlay modal-close">
          <div className="error-modal-content">
            <button
              className="error-modal-close"
            >
              X
            </button>
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorModal;
