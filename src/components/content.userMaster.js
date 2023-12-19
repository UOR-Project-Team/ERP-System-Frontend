import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Style.css';
import Toaster from '../services/ToasterMessage'
import { useNavigate, useParams } from 'react-router-dom';
import { FeaturedVideoRounded } from '@mui/icons-material';

function UserMaster() {

  const[registerbtn, setRegisterbtn] = useState(false)
  const[updatebtn, setUpdatebtn] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const navigate = useNavigate();
  const {master,id} =useParams();
  


  const [formData, setFormData] = useState({
    Fullname:'admintest',
    email: 'admintest@gmail.com',
    username: 'admintest',
    password: 'a22',
    confirmPassword: 'a22',
    NIC: '123',
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
           //alert("Succesfully user Addes")
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
      Fullname:'',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      NIC: '',
      jobrole: '',
      contactno: '',
      address: '',
      city: '',
        
  })
  };



  const [dataFetched, setDataFetched] = useState(false);

  // ... (other states and variables)

  const testflag = () => {
    if (!id) {
      setUpdatebtn(false);
      setRegisterbtn(true);
    } else {
      setUpdatebtn(true);
      setRegisterbtn(false);
      if (!dataFetched) {
        fetchUser();
      }
    }
  };

  useEffect(() => {
    testflag();
  }, [id, dataFetched]);
  
  


  const fetchUser = async () => {
    
    try {
      
      
      axios.get(`http://localhost:8081/user/getuser/${id}`)
      .then(response => {
        console.log(response.data)
        const userData = response.data.user[0];
        if (userData && userData.Fullname) {
          const { Fullname ,Email,Username,NIC,JobRole,ContactNo,Address,City} = userData; // Retrieve Fullname from the user data
          //console.log(Fullname); 
        
          setFormData(prevState => ({
            ...prevState,
            Fullname: Fullname, // Set Fullname in formData
            email : Email,
            username: Username,
            NIC: NIC,
            jobrole: JobRole,
            contactno: ContactNo,
            address: Address,
            city: City,
          }));}
          setDataFetched(true);
        })
        
        
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    } catch (error) {
      console.error('Error fetching user', error);
    }
  
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      
      const response = await axios.put(`http://localhost:8081/user/update/${id}`, formData);
      
      if(response.status ===200){
        //setPasswordError('');
          console.log("Suucesfully Updated")
          showToastMessage('Successful! Updated', 'success'); 
         setTimeout(() => {
          navigate('/home/employee-list'); // Navigate to '/home/employee-list' after 3 seconds
        }, 3000);
      }else{
        //alert("Error Adding user")
        showToastMessage('Error occurred. Please try again.', 'error');
    }
    } catch (error) {
      console.error('Error updating user', error);
    }
  };





  return (
    <div className="container mt-4">
      {/* <div><h2>Registration Form</h2></div> */}
      <form>
        


      <div className="mb-3">
          <label htmlFor="fullname" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="Fullname"
            name="Fullname"
            value={formData.Fullname}
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

        {registerbtn &&
        <button 
          type="submit" 
          className="btn btn-primary mt-3 mb-3"
          onClick={handleSubmit}
          >
          Register
        </button>
        }
        {updatebtn &&
        <button 
          type="submit" 
          className="btn btn-primary mt-3 mb-3"
          onClick={handleUpdate}
          >
          Update
        </button>
        }
      </form>

      <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} />

    </div>
  );
};

export default UserMaster;
