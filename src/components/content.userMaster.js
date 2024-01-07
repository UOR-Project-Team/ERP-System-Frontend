import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import validateUser from '../services/validate.user';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from '@mui/material/Autocomplete';

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
    password: '',
    NIC: '',
    jobrole: '',
    contactno: '',
    address: '',
    city: '',
  })

  
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
        const response = await axios.post('http://localhost:8081/user/create', formData)

        if(response.status ===200){
          console.log("Suucesfully Added")
          showSuccessToast('User created successfully!');
          handleReset();
          setTimeout(() => {
            navigate('/home/customer-list');
          }, 2000);
        }else{
           // showToastMessage('Error occurred. Please try again.', 'error');
            showErrorToast('Failed to create user. Please try again.');
        }

    }catch(error){
        console.error('Error:', error);
    }
    
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      password: '',
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
            <TextField className='text-line-type1' name='Fullname' value={formData.Fullname} onChange={(e) => handleChanges(e)} label="Full Name" variant="outlined" />
            <label className='error-text'>{errorMessage.Fullname}</label>
            <TextField className='text-line-type1' name='username' value={formData.username} onChange={(e) => handleChanges(e)} label=" Username" variant="outlined" />
            <label className='error-text'>{errorMessage.username}</label>
            <TextField className='text-line-type1' name='password' value={formData.password} onChange={(e) => handleChanges(e)} label=" Password" variant="outlined" />
            <label className='error-text'>{errorMessage.password}</label>

            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='NIC' value={formData.NIC} onChange={(e) => handleChanges(e)} label="National ID / Passport" variant="outlined" />
                <label className='error-text'>{errorMessage.NIC}</label>
              </div>
              <div className='line-type2-content'>
                <Autocomplete
                  disablePortal
                  className='text-line-type2'
                  options={[{ label: 'Administrator' }, { label: 'Staff Member' }]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Job Role"
                      name='jobrole' 
                      value={formData.jobrole}
                      onChange={(e) => {
                        handleChanges(e);
                      }}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prevData) => ({ ...prevData, jobrole: newValue?.label || '' }));
                  }}
                  value={formData.jobrole}
                />
                   <label className='error-text'>{errorMessage.jobrole}</label>
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
                <TextField className='text-line-type2' name='address' value={formData.address} onChange={(e) => handleChanges(e)} label="Address" variant="outlined"/>
                <label className='error-text'>{errorMessage.address}</label> 
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='city' value={formData.city} onChange={(e) => handleChanges(e)} label="City" variant="outlined" />
                <label className='error-text'>{errorMessage.city}</label> 
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
