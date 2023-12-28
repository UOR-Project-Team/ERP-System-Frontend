import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import supplierServices from '../services/services.supplier';
import validateSupplier from '../services/validate.supplier';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

function SupplierMaster() {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    Fullname:'',
    RegistrationNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    Address: '',
    City: '',
    Description: '',
    VatNo: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    Fullname:'',
    RegistrationNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    Address: '',
    City: '',
    Description: '',
    VatNo: '',
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSupplier(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      toast.error(`Check the inputs again`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return
    }
    
    try {
      const response = await supplierServices.createSupplier(formData)
      toast.success('Successfully Added', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      console.log('Supplier created:', response);
      handleReset();
      setTimeout(() => {
        navigate('/home/supplier-list');
      }, 2000);

    } catch(error) {
      console.error('Error creating supplier:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error Occured`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error('Error Occured', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
    }
    }

  };

  const handleReset = () => {
    setFormData((prevData) => ({
        Fullname:'',
        RegistrationNo: '',
        Email: '',
        ContactNo: '',
        Fax: '',
        Address: '',
        City: '',
        Description: '',
        VatNo: '',
    }));
    setErrorMessage({
        Fullname:'',
        RegistrationNo: '',
        Email: '',
        ContactNo: '',
        Fax: '',
        Address: '',
        City: '',
        Description: '',
        VatNo: '',
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className='master-content'>
        <form className='form-container'>
          <h3>Supplier Details</h3>
            <TextField className='text-line-type1' name='Fullname' value={formData.Fullname} onChange={(e) => handleChanges(e)} label="Full name" variant="outlined" />
            <label className='error-text'>{errorMessage.Fullname}</label>
            <TextField className='text-line-type1' name='RegistrationNo' value={formData.RegistrationNo} onChange={(e) => handleChanges(e)} label="Registration Number" variant="outlined" />
            <label className='error-text'>{errorMessage.RegistrationNo}</label>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant="outlined" />
                <label className='error-text'>{errorMessage.Description}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='VatNo' value={formData.VatNo} onChange={(e) => handleChanges(e)} label="VAT Number" variant="outlined" />
                <label className='error-text'>{errorMessage.VatNo}</label>
              </div>
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Email' value={formData.Email} onChange={(e) => handleChanges(e)} label="Email Address" variant="outlined"/>
                <label className='error-text'>{errorMessage.Email}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='ContactNo' value={formData.ContactNo} onChange={(e) => handleChanges(e)} label="Contact Number" variant="outlined" />
                <label className='error-text'>{errorMessage.ContactNo}</label>
              </div>
              </div>
              <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Fax' value={formData.Fax} onChange={(e) => handleChanges(e)} label="FAX number" variant="outlined" />
                <label className='error-text'>{errorMessage.Fax}</label>
              </div>
            
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Address' value={formData.Address} onChange={(e) => handleChanges(e)} label="Address" variant="outlined"/>
                <label className='error-text'>{errorMessage.Address}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='City' value={formData.City} onChange={(e) => handleChanges(e)} label="City" variant="outlined" />
                <label className='error-text'>{errorMessage.City}</label>
              </div>
            </div>          
                 
            <div className='button-container'>
              <button type='submit' class='submit-button' onClick={handleSubmit}>Submit</button>
              <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
            </div>
        </form>
        
      </div>
    </div>
  );
}

export default SupplierMaster;