import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import customerServices from '../services/services.customer';
import validateCustomer from '../services/validate.customer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomerMaster() {

  const [formData, setFormData] = useState({
    title: '',
    fullname: '',
    email: '',
    nic: '',
    contactno: '',
    street1: '',
    street2: '',
    city: '',
    country: '',
    vatno: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    title: '',
    fullname: '',
    email: '',
    nic: '',
    contactno: '',
    street1: '',
    street2: '',
    city: '',
    country: '',
    vatno: '',
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCustomer(formData);
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
      const response = await customerServices.createCustomer(formData)
      toast.success('Successfully Added', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      console.log('Customer created:', response);
      handleReset();
    } catch (error) {
      const { message, attributeName } = error.response.data;

      toast.error(`${message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    
      if (attributeName) {
        if(attributeName==='Email') {
          setErrorMessage({
            email: 'This Email already Exists',
          });
        } else if(attributeName==='NIC') {
          setErrorMessage({
            nic: 'This National ID/Passport already Exists',
          });
        } else if(attributeName==='ContactNo') {
          setErrorMessage({
            contactno: 'This Contact Number already Exists',
          });
        } else if(attributeName==='VatNo') {
          setErrorMessage({
            vatno: 'This VAT Number already Exists',
          });
        }
      }

      console.error('Error:', message);

    }     

  };

  const handleReset = () => {
    setFormData((prevData) => ({
      title: '',
      fullname: '',
      nic: '',
      vatno: '',
      email: '',
      contactno: '',
      street1: '',
      street2: '',
      city: '',
      country: ''
    }));
    setErrorMessage({
      title: '',
      fullname: '',
      nic: '',
      vatno: '',
      email: '',
      contactno: '',
      street1: '',
      street2: '',
      city: '',
      country: '',
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className='master-content'>
        <form className='form-container'>
          <h3>Customer Details</h3>
            <div className='line-type3-container'>
              <div className='line-type3-left-content'>
                <Autocomplete
                  disablePortal
                  className='text-line-type2'
                  options={[{ label: 'Mr.' }, { label: 'Mrs.' }, { label: 'Mrs.' }, { label: 'Ms.' }, { label: 'Dr.' }, { label: 'Company' }]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Title"
                      name='title' 
                      value={formData.title}
                      onChange={(e) => {
                        handleChanges(e);
                      }}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prevData) => ({ ...prevData, title: newValue?.label || '' }));
                  }}
                  value={formData.title}
                />
                <label className='error-text'>{errorMessage.title}</label>
              </div>
              <div className='line-type3-right-content'>
                <TextField className='text-line-type2' name='fullname' value={formData.fullname} onChange={(e) => handleChanges(e)} label="Full Name" variant="outlined" />
                <label className='error-text'>{errorMessage.fullname}</label>
              </div>
            </div>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='nic' value={formData.nic} onChange={(e) => handleChanges(e)} label="National ID / Passport" variant="outlined" />
                <label className='error-text'>{errorMessage.nic}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='vatno' value={formData.vatno} onChange={(e) => handleChanges(e)} label="VAT Number" variant="outlined" />
                <label className='error-text'>{errorMessage.vatno}</label>
              </div>
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='email' value={formData.email} onChange={(e) => handleChanges(e)} label="Email" variant="outlined"/>
                <label className='error-text'>{errorMessage.email}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='contactno' value={formData.contactno} onChange={(e) => handleChanges(e)} label="Contact Number" variant="outlined" />
                <label className='error-text'>{errorMessage.contactno}</label>
              </div>
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='street1' value={formData.street1} onChange={(e) => handleChanges(e)} label="Street 1" variant="outlined"/>
                <label className='error-text'>{errorMessage.street1}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='street2' value={formData.street2} onChange={(e) => handleChanges(e)} label="Street 2" variant="outlined" />
                <label className='error-text'>{errorMessage.street2}</label>
              </div>
            </div>
            <div className='line-type2-container'>
            <div className='line-type2-content'>
                <TextField className='text-line-type2' name='city' value={formData.city} onChange={(e) => handleChanges(e)} label="City" variant="outlined"/>
                <label className='error-text'>{errorMessage.city}</label>
              </div>
              <div className='line-type2-content'>
                <Autocomplete
                  disablePortal
                  className='text-line-type2'
                  options={[{ label: 'Sri Lanka' }, { label: 'India' }]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      name='country' 
                      value={formData.country}
                      onChange={(e) => {
                        handleChanges(e);
                      }}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prevData) => ({ ...prevData, country: newValue?.label || '' }));
                  }}
                  value={formData.country}
                />
                <label className='error-text'>{errorMessage.country}</label>
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

export default CustomerMaster;