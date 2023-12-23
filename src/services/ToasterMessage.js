// import React, { useEffect } from 'react';
// import './ToasterMessage.css'; 

// const Toaster = ({ message, showToast, type, setShowToast }) => {
//     useEffect(() => {
//       let timer;
//       if (showToast) {
//         timer = setTimeout(() => {
//           setShowToast(false);
//         }, 3000);
//       }
//       return () => clearTimeout(timer);
//     }, [showToast, setShowToast]);
  
//     return (
//       <div className={`toaster-container ${showToast ? 'show' : ''}`}>
//         <div className={`toaster ${type}`}>
//           <div className="toast-content">
            
//             <p>{message} </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

// export default Toaster;



import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 1000, // Display duration in milliseconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 2000, // Display duration in milliseconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};
