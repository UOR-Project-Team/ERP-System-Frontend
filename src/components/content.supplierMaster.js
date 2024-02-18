import React, { useState } from 'react';
import supplierServices from '../services/services.supplier';
import validateSupplier from '../services/validate.supplier';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import CustomTextfield from './custom.muiTextfield';
import CustomAutoComplete from './custom.muiAutoComplete';

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
                <CustomAutoComplete data={formData.Title} error={errorMessage.Title} list={[{ label: 'Mr.' }, { label: 'Mrs.' }, { label: 'Ms.' }, { label: 'Dr.' }, { label: 'Company' }]} name={'Title'} label={'Title'} classtype={'text-line-type1'} handleChanges={handleChanges} setFormData={setFormData} />
                {errorMessage.Title && (<label className='error-text'>{errorMessage.Title}</label>)}
              </div>
              <div className='line-type3-right-content'>
                <CustomTextfield data={formData.Fullname} error={errorMessage.Fullname} name={'Fullname'} label={'Full Name'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.Fullname && (<label className='error-text'>{errorMessage.Fullname}</label>)}
              </div>
            </div>
            <CustomTextfield data={formData.Description} error={errorMessage.Description} name={'Description'} label={'Description'} classtype={'text-line-type1'} handleChanges={handleChanges} />
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.RegistrationNo} error={errorMessage.RegistrationNo} name={'RegistrationNo'} label={'Registraion Number'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.RegistrationNo && (<label className='error-text'>{errorMessage.RegistrationNo}</label>)}
              </div>
              <div className='line-type2-content'>
              <CustomTextfield data={formData.VatNo} error={errorMessage.VatNo} name={'VatNo'} label={'VAT Number'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              </div>
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.Email} error={errorMessage.Email} name={'Email'} label={'Email'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.Email && (<label className='error-text'>{errorMessage.Email}</label>)}
              </div>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.ContactNo} error={errorMessage.ContactNo} name={'ContactNo'} label={'Contact Number'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.ContactNo && (<label className='error-text'>{errorMessage.ContactNo}</label>)}
              </div>
              </div>
              <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.Fax} error={errorMessage.Fax} name={'Fax'} label={'FAX Number'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.Fax && (<label className='error-text'>{errorMessage.Fax}</label>)}
              </div>
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.Street1} error={errorMessage.Street1} name={'Street1'} label={'Street 01'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.Street1 && (<label className='error-text'>{errorMessage.Street1}</label>)}
              </div>
              <div className='line-type2-content'>
                <CustomTextfield data={formData.Street2} error={errorMessage.Street2} name={'Street2'} label={'Street 02'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                {errorMessage.Street2 && (<label className='error-text'>{errorMessage.Street2}</label>)}
              </div>
            </div>
            <div className='line-type2-container'>
            <div className='line-type2-content'>
              <CustomTextfield data={formData.City} error={errorMessage.City} name={'City'} label={'City'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              {errorMessage.City && (<label className='error-text'>{errorMessage.City}</label>)}
            </div>
            <div className='line-type2-content'>
              <CustomAutoComplete data={formData.Country} error={errorMessage.Country} list={[{ label: 'Sri Lanka' }, { label: 'India' }]} name={'Country'} label={'Country'} classtype={'text-line-type1'} handleChanges={handleChanges} setFormData={setFormData} />
              {errorMessage.Country && (<label className='error-text'>{errorMessage.Country}</label>)}
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