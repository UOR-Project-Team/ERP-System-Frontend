import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import customerServices from '../services/services.customer';
import validateCustomer from '../services/validate.customer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomerMaster() {

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
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
    firstname: '',
    lastname: '',
    email: '',
    nic: '',
    contactno: '',
    street1: '',
    street2: '',
    city: '',
    country: '',
    vatno: '',
  });

  const [initialCountry, setInitialCountry] = useState('');

  useEffect(() => {
    setInitialCountry(formData.country);
  }, [formData]);

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
        position: "top-center",
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
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      console.log('Customer created:', response);
      handleReset();
    } catch(error) {
      console.error('Error creating customer:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error Occured`, {
          position: "top-center",
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
          position: "top-center",
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
      ...prevData,
      country: '',
      firstname: '',
      lastname: '',
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
      firstname: '',
      lastname: '',
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
            <TextField className='text-line-type1' name='firstname' value={formData.firstname} onChange={(e) => handleChanges(e)} label="First Name" variant="outlined" />
            <label className='error-text'>{errorMessage.firstname}</label>
            <TextField className='text-line-type1' name='lastname' value={formData.lastname} onChange={(e) => handleChanges(e)} label="Last Name" variant="outlined" />
            <label className='error-text'>{errorMessage.lastname}</label>
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
                />
                <label className='error-text'>{errorMessage.country}</label>
              </div>
            </div>
            <div className='button-container'>
              <button type='submit' class='submit-button' onClick={handleSubmit}>Submit</button>
              <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
            </div>
        </form>
        {formData.country}
      </div>
    </div>
  );
}

export default CustomerMaster;
