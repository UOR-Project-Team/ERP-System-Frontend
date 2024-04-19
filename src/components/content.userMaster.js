import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import validateUser from '../services/validate.user';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userServices from '../services/services.user';
import CustomTextfield from './custom.muiTextfield';
import CustomAutoComplete from './custom.muiAutoComplete';

function UserMaster() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Fullname:'',
    email: '',
    username: '',
    password: '',
    NIC: '',
    jobrole: '',
    contactno: '',
    address: '',
    city: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    Fullname:'',
    email: '',
    username: '',
    NIC: '',
    jobrole: '',
    contactno: '',
    address: '',
    city: '',
  });

  const handleChanges = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    const validationErrors = validateUser(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      console.log(validationErrors)
      showErrorToast('Enter valid Input');
      return
    }

    try{
      const response = await userServices.createUser(formData)
      showSuccessToast('User successfully added');
      console.log('User created:', response);
      handleReset();
      setTimeout(() => {
        navigate('/home/user-list');
      }, 2000);

    } catch(error) {
      const { message, attributeName } = error.response.data;
      showErrorToast(`${message}`);

      if (attributeName) {
        if(attributeName==='Fullname') {
          setErrorMessage({
            Fullname: 'Name Alredy Taken',
          });
        }else if(attributeName==='Username') {
          setErrorMessage({
            username: 'Username already Exists',
          });
        } else if(attributeName==='NIC') {
          setErrorMessage({
            NIC: 'This National ID/Passport already Exists',
          });
        } else if(attributeName==='ContactNo') {
          setErrorMessage({
            contactno: 'This Contact Number already Exists',
          });
        }
      }
        console.error('Error:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      Fullname:'',
      email: '',
      username: '',
      password: '',
      NIC: '',
      jobrole: '',
      contactno: '',
      address: '',
      city: '',
        
  });
    setErrorMessage({
      Fullname:'',
      email: '',
      username: '',
      NIC: '',
      jobrole: '',
      contactno: '',
      address: '',
      city: '',
    });
  };

  return (
    <div className='master-content'>
      <form className='form-container'>
        <h3>User Details</h3>
          <CustomTextfield data={formData.Fullname} error={errorMessage.Fullname} name={'Fullname'} label={'Fullname'} classtype={'text-line-type1'} handleChanges={handleChanges} />
          {errorMessage.Fullname && (<label className='error-text'>{errorMessage.Fullname}</label>)}
          <CustomTextfield data={formData.username} error={errorMessage.username} name={'username'} label={'Username'} classtype={'text-line-type1'} handleChanges={handleChanges} />
          {errorMessage.username && (<label className='error-text'>{errorMessage.username}</label>)}
          <CustomTextfield data={formData.password} error={errorMessage.password} name={'password'} label={'Password'} classtype={'text-line-type1'} handleChanges={handleChanges} />

          <div className='line-type2-container'>
            <div className='line-type2-content'>
              <CustomTextfield data={formData.NIC} error={errorMessage.NIC} name={'NIC'} label={'National ID / Passport'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              {errorMessage.NIC && (<label className='error-text'>{errorMessage.NIC}</label>)}
            </div>
            <div className='line-type2-content'>
              <CustomAutoComplete data={formData.jobrole} error={errorMessage.jobrole} list={[{ label: 'Administrator' }, { label: 'Staff Member' }]} name={'jobrole'} label={'Job Role'} classtype={'text-line-type2'} handleChanges={handleChanges} setFormData={setFormData} />
              {errorMessage.jobrole && (<label className='error-text'>{errorMessage.jobrole}</label>)}
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
              <CustomTextfield data={formData.address} error={errorMessage.address} name={'address'} label={'Address'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              {errorMessage.address && (<label className='error-text'>{errorMessage.address}</label>)}
            </div>
            <div className='line-type2-content'>
              <CustomTextfield data={formData.city} error={errorMessage.city} name={'city'} label={'City'} classtype={'text-line-type2'} handleChanges={handleChanges} />
              {errorMessage.city && (<label className='error-text'>{errorMessage.city}</label>)}
            </div>
          </div>

          <div className='button-container'>
            <button type='submit' className='submit-button' onClick={handleSubmit}>Submit</button>
            <button type='reset' className='reset-button' onClick={handleReset}>Reset</button>
          </div>
      </form>
      <ToastContainer/>
    </div>    
  );
};

export default UserMaster;
