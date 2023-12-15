import React, { useState } from 'react';
import axios from 'axios';
import './Style.css';
import Toaster from '../services/ToasterMessage'
import { useNavigate } from 'react-router-dom';

function UserMaster() {


  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    fullname:'admintest',
    email: 'admintest@gmail.com',
    username: 'admintest',
    password: 'a22',
    confirmPassword: 'a22',
    NIC: '54321',
    jobrole: 'admin',
    contactno: '89765421',
    mobileno2: '987654321',
    address: '10,Galle',
    city: 'matara',
  });

  const showToastMessage = (msg, type) => {
    setMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      //setPasswordError('Passwords do not match');
      return;
    }

    

    try{
        const response = await axios.post('http://localhost:8081/user/create', formData)

        if(response.status ===200){
          //setPasswordError('');
            console.log("Suucesfully Added")
            showToastMessage('Operation successful!', 'success');
           // alert("Succesfully user Addes")
           setTimeout(() => {
            navigate('/home/employee-list'); // Navigate to '/home/employee-list' after 3 seconds
          }, 3000);
        }else{
            //alert("Error Adding user")
            showToastMessage('Error occurred. Please try again.', 'error');
        }

    }catch(error){
        console.error('Error:', error);
    }
    //reset the form
    setFormData({
      fullname:'',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      NIC: '',
      jobrole: '',
      contactno: '',
      mobileno2: '',
      address: '',
      city: '',
        
  })
  };

  return (
    <div className="container mt-4">
      {/* <div><h2>Registration Form</h2></div> */}
      <form onSubmit={handleSubmit}>
        


      <div className="mb-3">
          <label htmlFor="fullname" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            style={{ width: '850px' }}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ width: '850px' }}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            style={{ width: '850px' }}
            required
          />
        </div>

        {/* ========================================================================== */}


        <div className="side-by-side">
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ width: '400px' }}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="NIC" className="form-label">
          NIC
          </label>
          <input
            type="text"
            className="form-control"
            id="NIC"
            name="NIC"
            value={formData.NIC}
            onChange={handleInputChange}
            style={{ width: '400px' }}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="contactno" className="form-label">
          Mobile No
          </label>
          <input
            type="tex"
            className="form-control"
            id="contactno"
            name="contactno"
            value={formData.contactno}
            onChange={handleInputChange}
            style={{ width: '400px' }}
            required
          />
        </div>

        </div>

{/* ================================================================== */}
        
      
      <div className="side-by-side">


      <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            style={{ width: '420px' }}
            required
          />
        </div>

        <div className="mt-2 mb-3">
      <label htmlFor="jobrole">
        Job Role
      </label>
      <select
        className="form-control"
        id="jobrole"
        name="jobrole"
        value={formData.jobrole}
        onChange={handleInputChange}
        style={{ width: '420px' }}
      >
        <option value="">Select a job Role</option>
        <option value="admin">Admin</option>
        <option value="user">Staff</option>
        {/* Add more options as needed */}
      </select>
    </div>


    <div className="mb-3">
          <label htmlFor="mobileno2" className="form-label">
            Tel
          </label>
          <input
            type="tel"
            className="form-control"
            id="mobileno2"
            name="mobileno2"
            value={formData.mobileno2}
            onChange={handleInputChange}
            style={{ width: '420px' }}
            
          />
        </div>

        </div>

        {/* ================================================== */}
        <div></div>
        <div className="mt-5 mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            style={{ width: '850px'}}
          />
        </div>

        <div className="mt-5 mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            style={{ width: '850px'}}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-3 mb-3"
          
          >
          Register
        </button>
      </form>

      <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} />

    </div>
  );
};

export default UserMaster;
