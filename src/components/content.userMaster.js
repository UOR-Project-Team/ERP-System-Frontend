import React, { useState } from 'react';
import axios from 'axios';
import './Style.css';
import { useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import validateUser from '../services/validate.user';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserMaster() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Fullname:'admintest',
    email: 'admintest@gmail.com',
    username: 'admintest',
    password: 'a22',
    NIC: '123',
    jobrole: 'admin',
    contactno: '89765421',
    address: '10,Galle',
    city: 'matara',
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
           // showToastMessage('Operation successful!', 'success');
           showSuccessToast('User created successfully!');
           setTimeout(() => {
            navigate('/home/user-list'); // Navigate to '/home/employee-list' after 3 seconds
          }, 2000);
        }else{
           // showToastMessage('Error occurred. Please try again.', 'error');
            showErrorToast('Failed to create user. Please try again.');
        }

    }catch(error){
        console.error('Error:', error);
    }
    //reset the form
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
        
  })
  };

  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
          <h3>Customer Details</h3>
            <TextField className='text-line-type1' name='Fullname' value={formData.Fullname} onChange={handleInputChange} label="Full Name" variant="outlined" />
            <label className='error-text'>{errorMessage.Fullname}</label>
            <TextField className='text-line-type1' name='username' value={formData.username} onChange={handleInputChange} label=" Username" variant="outlined" />
            <label className='error-text'>{errorMessage.username}</label>
            <TextField className='text-line-type1' name='password' value={formData.password} onChange={handleInputChange} label=" Password" variant="outlined" />
            <label className='error-text'>{errorMessage.password}</label>

            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='NIC' value={formData.NIC} onChange={handleInputChange} label="National ID / Passport" variant="outlined" />
                <label className='error-text'>{errorMessage.NIC}</label>
              </div>
              <div className='line-type2-content'>
                  <TextField
                    className='text-line-type2'
                    name='jobrole'
                    value={formData.jobrole}
                    onChange={handleInputChange}
                    label="Select Job Role"
                    variant="outlined"
                    select
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value=""></option>
                    <option value="admin">Admin</option>
                    <option value="user">Staff</option>
                  </TextField>
                   <label className='error-text'>{errorMessage.jobrole}</label>
              </div>
            </div>

            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='email' value={formData.email} onChange={handleInputChange} label="Email" variant="outlined"/>
                <label className='error-text'>{errorMessage.email}</label> 
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='contactno' value={formData.contactno} onChange={handleInputChange} label="Contact Number" variant="outlined" />
                <label className='error-text'>{errorMessage.contactno}</label> 
              </div>
            </div>

            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='address' value={formData.address} onChange={handleInputChange} label="Address" variant="outlined"/>
                <label className='error-text'>{errorMessage.address}</label> 
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='city' value={formData.city} onChange={handleInputChange} label="City" variant="outlined" />
                <label className='error-text'>{errorMessage.city}</label> 
              </div>
            </div>

            <div className='button-container'>
              <button type='submit' class='submit-button' onClick={handleSubmit}>Submit</button>
              <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
            </div>

        </form>

        {/* <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} /> */}
        <ToastContainer/>
  </div>
      
  );
};

export default UserMaster;
