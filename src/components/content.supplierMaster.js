import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import supplierServices from '../services/services.supplier';
import validateSupplier from '../services/validate.supplier';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';

function SupplierMaster() {

  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    Title: '',
    Fullname:'',
    Description: '',
    RegistrationNo: '',
    VatNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    Street1: '',
    Street2: '',
    City: '',
    Country: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    Title: '',
    Fullname:'',
    RegistrationNo: '',
    VatNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    City: '',
    Country: '',
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
      showErrorToast('Check the inputs again');
      return
    }
    
    try {
      const response = await supplierServices.createSupplier(formData)
      showSuccessToast('Supplier successfully added');
      console.log('Supplier created:', response);
      handleReset();
      setTimeout(() => {
        navigate('/home/supplier-list');
      }, 2000);

    } catch (error) {
      const { message, attributeName } = error.response.data;
      showErrorToast(`${message}`);
    
      if (attributeName) {
        if(attributeName==='UC_Email') {
          setErrorMessage({
            Email: 'This Email already Exists',
          });
        } else if(attributeName==='UC_RegistrationNo') {
          setErrorMessage({
            RegistrationNo: 'This Registration Number already Exists',
          });
        } else if(attributeName==='UC_ContactNo') {
          setErrorMessage({
            ContactNo: 'This Contact Number already Exists',
          });
        } else if(attributeName==='UC_VatNo') {
          setErrorMessage({
            VatNo: 'This VAT Number already Exists',
          });
        }
      }

      console.error('Error:', message);

    }     

  };

  const handleReset = () => {
    setFormData((prevData) => ({
      Title: '',
      Fullname:'',
      Description: '',
      RegistrationNo: '',
      VatNo: '',
      Email: '',
      ContactNo: '',
      Fax: '',
      Street1: '',
      Street2: '',
      City: '',
      Country: '',
    }));
    setErrorMessage({
      Title: '',
      Fullname:'',
      RegistrationNo: '',
      VatNo: '',
      Email: '',
      ContactNo: '',
      Fax: '',
      City: '',
      Country: '',
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className='master-content'>
        <form className='form-container'>
          <h3>Supplier Details</h3>
          <div className='line-type3-container'>
              <div className='line-type3-left-content'>
                <Autocomplete
                  disablePortal
                  className='text-line-type2'
                  options={[{ label: 'Mr.' }, { label: 'Mrs.' }, { label: 'Ms.' }, { label: 'Dr.' }, { label: 'Company' }]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Title"
                      name='title' 
                      error={errorMessage.Title ? true : false}
                      value={formData.Title}
                      onChange={(e) => {
                        handleChanges(e);
                      }}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prevData) => ({ ...prevData, Title: newValue?.label || '' }));
                  }}
                  value={formData.Title}
                />
                <label className='error-text'>{errorMessage.Title}</label>
              </div>
              <div className='line-type3-right-content'>
                <TextField error={errorMessage.Fullname ? true : false} className='text-line-type2' name='Fullname' value={formData.Fullname} onChange={(e) => handleChanges(e)} label="Full Name" variant="outlined" />
                <label className='error-text'>{errorMessage.Fullname}</label>
              </div>
            </div>
            <TextField className='text-line-type2' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant="outlined" />
            <label className='error-text'></label>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField error={errorMessage.RegistrationNo ? true : false} className='text-line-type1' name='RegistrationNo' value={formData.RegistrationNo} onChange={(e) => handleChanges(e)} label="Registration Number" variant="outlined" />
                <label className='error-text'>{errorMessage.RegistrationNo}</label>  
              </div>
              <div className='line-type2-content'>
                <TextField error={errorMessage.VatNo ? true : false} className='text-line-type2' name='VatNo' value={formData.VatNo} onChange={(e) => handleChanges(e)} label="VAT Number" variant="outlined" />
                <label className='error-text'>{errorMessage.VatNo}</label>
              </div>
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField error={errorMessage.Email ? true : false} className='text-line-type2' name='Email' value={formData.Email} onChange={(e) => handleChanges(e)} label="Email" variant="outlined"/>
                <label className='error-text'>{errorMessage.Email}</label>
              </div>
              <div className='line-type2-content'>
                <TextField error={errorMessage.ContactNo ? true : false} className='text-line-type2' name='ContactNo' value={formData.ContactNo} onChange={(e) => handleChanges(e)} label="Contact Number" variant="outlined" />
                <label className='error-text'>{errorMessage.ContactNo}</label>
              </div>
              </div>
              <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField error={errorMessage.Fax ? true : false} className='text-line-type2' name='Fax' value={formData.Fax} onChange={(e) => handleChanges(e)} label="Fax Number" variant="outlined" />
                <label className='error-text'>{errorMessage.Fax}</label>
              </div>
            
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Street1' value={formData.Street1} onChange={(e) => handleChanges(e)} label="Street 1" variant="outlined"/>
                <label className='error-text'></label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Street2' value={formData.Street2} onChange={(e) => handleChanges(e)} label="Street 2" variant="outlined" />
                <label className='error-text'></label>
              </div>
            </div>
            <div className='line-type2-container'>
            <div className='line-type2-content'>
              <TextField error={errorMessage.City ? true : false} className='text-line-type2' name='City' value={formData.City} onChange={(e) => handleChanges(e)} label="City" variant="outlined"/>
              <label className='error-text'>{errorMessage.City}</label>
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
                    error={errorMessage.Country ? true : false}
                    value={formData.Country}
                    onChange={(e) => {
                      handleChanges(e);
                    }}
                  />
                )}
                onChange={(_, newValue) => {
                  setFormData((prevData) => ({ ...prevData, Country: newValue?.label || '' }));
                }}
                value={formData.Country}
              />
              <label className='error-text'>{errorMessage.Country}</label>
            </div>
          </div>
          <div className='button-container'>
            <button type='submit' className='submit-button' onClick={handleSubmit}>Submit</button>
            <button type='reset' className='reset-button' onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierMaster;