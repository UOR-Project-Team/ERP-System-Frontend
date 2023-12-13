import React, {useState, useEffect} from 'react'
import {validateusername,validatepassword} from  '../services/validation.login';
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import img1 from '../assets/images/login-background-1.jpg'
import img2 from '../assets/images/login-background-2.jpg'
import img3 from '../assets/images/login-background-3.jpg'

const images = [
  img1,
  img2,
  img3
];

function Login() {
    
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const usernameError = validateusername(username)
  const passwordError = validatepassword(password)
  const [ErrorMessage, setErrorMessage]= useState(false)
  const [image, setImage] = useState(0);

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
  }, [image])

    const handleSubmit= async(event)=>{
        event.preventDefault();
        
        if (usernameError || passwordError) {
            // Handle validation errors
            console.error('Validation Error:', usernameError, passwordError);
            return;
          }
  
  
          try{
          const response =await axios.post('http://localhost:8081/login', {
            //paasing username & password
              username: username, 
              password: password,
          });
          
          //checking the responese
          if (response.status === 200) {
              console.log('Successfully logged in');
              setErrorMessage(false)
              
            } else {
              alert('Error logging in');
            }
          } catch (error) {
            console.error('Error:', error);
            setErrorMessage(true)
            navigate('/home');
            // Handle error 
          }

    try{
    const response =await axios.post('http://localhost:8081/login', {
      //paasing username & password
        username: username, 
        password: password,
    });
    
    //checking the responese
    if (response.status === 200) {
        console.log('Successfully logged in');
        setErrorMessage(false)
        navigate('/home');
      } else {
        alert('Error logging in');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(true)
      // Handle error 
    }
  }

  return (
    <div className='login-container' style={{ backgroundImage: `url(${images[image]})` }}>
      <div className='login-overlay'>
        <div className='overlay-background'></div>
      </div>
      <div className='form-container-wrapper'>
        <div className='form-container'>
          <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div className='input-label'>Username:</div>
            <input type='text' value={username} placeholder='Enter your Username Here' onChange={(e) => setUsername(e.target.value)} />
            <div className='input-label'>Password:</div>
            <input type='password' value={password} placeholder='Enter your Password Here'  onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login