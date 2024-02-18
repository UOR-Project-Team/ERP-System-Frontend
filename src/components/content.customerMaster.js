import React, { useState } from 'react';
import customerServices from '../services/services.customer';
import validateCustomer from '../services/validate.customer';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import { useNavigate } from "react-router-dom";
import CustomTextfield from './custom.muiTextfield';
import CustomAutoComplete from './custom.muiAutoComplete';

function CustomerMaster() {

  const navigate = useNavigate();
  
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
    vatno: '',
    contactno: '',
    city: '',
    country: '',
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
        showErrorToast('Check the inputs again');
        return
    }
    
    try {
      const response = await customerServices.createCustomer(formData)
      showSuccessToast('Customer successfully added');
      console.log('Customer created:', response);
      handleReset();
      setTimeout(() => {
        navigate('/home/customer-list');
      }, 2000);
    } catch (error) {
      const { message, attributeName } = error.response.data;
      showErrorToast(`${message}`);
    
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
      email: '',
      nic: '',
      vatno: '',
      contactno: '',
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
                <CustomAutoComplete data={formData.title} error={errorMessage.title} list={[{ label: 'Mr.' }, { label: 'Mrs.' }, { label: 'Ms.' }, { label: 'Dr.' }, { label: 'Company' }]} name={'title'} label={'Title'} classtype={'text-line-type1'} handleChanges={handleChanges} setFormData={setFormData} />
                {errorMessage.title && (<label className='error-text'>{errorMessage.title}</label>)}
                <label className='error-text'>{errorMessage.title}</label>
              </div>
              <div className='line-type3-right-content'>
                <CustomTextfield data={formData.fullname} error={errorMessage.fullname} name={'fullname'} label={'Full Name'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.fullname && (<label className='error-text'>{errorMessage.fullname}</label>)}
              </div>
            </div>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.nic} error={errorMessage.nic} name={'nic'} label={'National ID / Passport'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.nic && (<label className='error-text'>{errorMessage.nic}</label>)}
              </div>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.vatno} name={'vatno'} label={'VAT Number'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              </div>
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.email} error={errorMessage.email} name={'email'} label={'Email'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.email && (<label className='error-text'>{errorMessage.email}</label>)}
              </div>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.contactno} error={errorMessage.contactno} name={'contactno'} label={'Contact Number'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.contactno && (<label className='error-text'>{errorMessage.contactno}</label>)}
              </div>
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.street1} name={'street1'} label={'Street 1'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              </div>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.street2} name={'street2'} label={'Street 2'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              </div>
            </div>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.city} error={errorMessage.city} name={'city'} label={'City'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.city && (<label className='error-text'>{errorMessage.city}</label>)}
              </div>
              <div className='line-type2-content'>
                <CustomAutoComplete data={formData.country} error={errorMessage.country} list={[{ label: 'Sri Lanka' }, { label: 'India' }]} name={'country'} label={'Country'} classtype={'text-line-type1'} handleChanges={handleChanges} setFormData={setFormData} />
                <label className='error-text'>{errorMessage.country}</label>
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

export default CustomerMaster;