import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import validateUser from '../services/validate.userLoginForms';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img1 from '../assets/images/login-background-1.jpg'
import img2 from '../assets/images/login-background-2.jpg'
import img3 from '../assets/images/login-background-3.jpg'

const images = [
  img1,
  img2,
  img3
];

function Login({ updateAuthentication }) {
  
  const navigate = useNavigate()
  const [image, setImage] = useState(0)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
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
      toast.error(`Please try again`, {
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
      const response =await axios.post('http://localhost:8081/login', {
          username: formData.username, 
          password: formData.password,
      });

      if (response.status === 200) {
        console.log('Successfully logged in');
        const { token } = response.data;
        localStorage.setItem('token', token);
        updateAuthentication(true)
        navigate('/home');
      } else {
        toast.error(`Please try again later`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        toast.error(`Invalid Credentials`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error(`Internal Server Error`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  }

  return (
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
  )
}

export default Login