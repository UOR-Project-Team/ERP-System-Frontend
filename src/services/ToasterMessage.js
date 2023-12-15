import React, { useEffect } from 'react';
import './ToasterMessage.css'; 

const Toaster = ({ message, showToast, type, setShowToast }) => {
    useEffect(() => {
      let timer;
      if (showToast) {
        timer = setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
      return () => clearTimeout(timer);
    }, [showToast, setShowToast]);
  
    return (
      <div className={`toaster-container ${showToast ? 'show' : ''}`}>
        <div className={`toaster ${type}`}>
          <div className="toast-content">
            <p>Alert.....</p>
            <p>{message} </p>
          </div>
        </div>
      </div>
    );
  };

export default Toaster;
