import React, { useState, useEffect } from 'react'
import '../assets/styles/login.css';
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validateUser from '../services/validate.userLoginForms';
import {Usertoken} from '../services/token.userToken'
import { validateUsername, validatePassword, validateConfirmPassword } from '../services/validate.Password'
import img1 from '../assets/images/login-background-1.jpg'
import img2 from '../assets/images/login-background-2.jpg'
import img3 from '../assets/images/login-background-3.jpg'
import Modal from 'react-modal';
import TextField from '@mui/material/TextField';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import connection from "../connection";

const images = [ img1, img2, img3 ];

function Login({ updateAuthentication }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(0)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [resetformData, setresetFormData] = useState({
    username: '',
    password: '',
    cnfPassword: '',
  })

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setresetFormData((prevData) => ({ ...prevData, [name]: value }));

    setErrorMessages({
      username: '',
      password: '',
      cnfPassword: '',
    });
  };

  //for model - reset Password
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    password: '',
    cnfPassword: '',
  });

  //for login form
  const [errorMessage, setErrorMessage] = useState({
    username: '',
    password: '',
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (image === images.length - 1) {
        setImage(0);
      } else {
        setImage((prevImage) => (prevImage + 1) % images.length)
      }
    }, 20000)
    return () => {
      clearInterval(interval)
    };
  }, [image]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit= async(event)=>{
    event.preventDefault();
    const validationErrors = validateUser(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      showErrorToast(`Please check the inputs`);
      return
    }
  
    try {
      const response = await axios.post('http://localhost:8080/login', {
          username: formData.username, 
          password: formData.password,
      });

      if (response.status === 200) {
        console.log('Successfully logged in');
        const { token } = response.data;
        localStorage.setItem('token', token);

        const userinfo = await Usertoken();

        if(userinfo){
            const {loginflag} = userinfo;
            console.log('test3');
            console.log(loginflag)
            setresetFormData(prevData => ({
              ...prevData,
              username: userinfo.username
            }));
            

            if(loginflag >0 && loginflag <100){
              updateAuthentication(true);
              //navigate('/home')
            }else{
              console.log('need to reset password')
              openModal();
              

            }

        } else {
          console.log('Token not found');
        }

    
        
      } else {
        showErrorToast(`Please try again later`);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        showErrorToast(`Invalid credentials`);
      } else {
        showErrorToast(`Internal Server Error`);
      }
    }
  }

  const handleReset = ()=>{
    closeModal()
    updateAuthentication(true);
  }

  const handlepasswordUpdate =async(event)=>{
    event.preventDefault();

    const usernameError = validateUsername(resetformData.username);
    const passwordError = validatePassword(resetformData.password);
    const confirmPasswordError = validateConfirmPassword(resetformData.password, resetformData.cnfPassword);

    setErrorMessages({
      username: usernameError,
      password: passwordError,
      cnfPassword: confirmPasswordError,
    });

    if(!usernameError && !passwordError && !confirmPasswordError) {

      try {
        
        const response = await connection.post(`/reset/${resetformData.username}`, resetformData);
        
        if(response.status ===200){
            console.log("Suucesfully Updated")
            showSuccessToast('Password successfully Changed!');
    
            setTimeout(() => {
              closeModal();
              updateAuthentication(true);
            }, 2000);
            
        }else{
          showErrorToast('Failed to Update password. Please try again.');
        }
      } catch (error) {
        console.error('Error updating Password', error);
      }

    }
  }


  return (
    <div>
    <div className='login-container' style={{ backgroundImage: `url(${images[image]})` }}>
      <ToastContainer />
      <div className='login-overlay'>
        <div className='overlay-background'></div>
      </div>
      <div className='form-container-wrapper'>
        <div className='form-container'>
          <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div className='input-label'>Username:</div>
            <input type='text' placeholder='Username Or Email' name='username' value={formData.username} onChange={(e) => handleChanges(e)} />
            <label>{errorMessage.username}</label>
            <div className='input-label'>Password:</div>
            <input type='password' placeholder='Password' name='password' value={formData.password} onChange={(e) => handleChanges(e)} />
            <label>{errorMessage.password}</label>
            <button type='submit'>Login</button>
          </form>
        </div>
      </div>
    </div>

    <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Question Modal"
      >
        <div className='edit-model'>
              <h3>Update User</h3>
              <form className='form-container'>
          <h3>User Details</h3>
            <TextField className='text-line-type1' name='username' value={resetformData.username} onChange={handleInputChange} label="User Name" variant="outlined" />
            <label className='error-text'>{errorMessages.username}</label>
            <TextField className='text-line-type1' name='password' value={resetformData.password} onChange={handleInputChange} label=" Password" variant="outlined" />
            <label className='error-text'>{errorMessages.password}</label>
            <TextField className='text-line-type1' name='cnfPassword' value={resetformData.cnfPassword} onChange={handleInputChange} label="Confirm Password" variant="outlined" />
            <label className='error-text'>{errorMessages.cnfPassword}</label>

            <div className='button-container'>
                <button type='submit' class='submit-button' onClick={handlepasswordUpdate}>Submit</button>
                <button type='reset' class='reset-button' onClick={handleReset}>Skip</button>
            </div>

            </form>
            </div>
      </Modal>
      
    </div>
  )
}

export default Login