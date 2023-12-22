import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Style.css';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { showSuccessToast, showErrorToast } from '../services/ToasterMessage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserMaster() {

  const[registerbtn, setRegisterbtn] = useState(false);
  const[updatebtn, setUpdatebtn] = useState(false);
  const [errorMessage, setErrorMessage] =useState();

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const navigate = useNavigate();
  const {id} =useParams();
  


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

  const showToastMessage = (msg, type) => {
    setMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  


  
  const handleSubmit = async(event) => {
    event.preventDefault();
    

    try{
        const response = await axios.post('http://localhost:8081/user/create', formData)

        if(response.status ===200){
            console.log("Suucesfully Added")
           // showToastMessage('Operation successful!', 'success');
           showSuccessToast('User created successfully!');
           setTimeout(() => {
            navigate('/home/user-list'); // Navigate to '/home/employee-list' after 3 seconds
          }, 3000);
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



  const [dataFetched, setDataFetched] = useState(false);

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
          //showToastMessage('Successful! Updated', 'success'); 
          showSuccessToast('User Updated successfully!');
         setTimeout(() => {
          navigate('/home/user-list'); // Navigate to '/home/employee-list' after 3 seconds
        }, 1000);
      }else{
       // showToastMessage('Error occurred. Please try again.', 'error');
        showErrorToast('Failed to create user. Please try again.');
    }
    } catch (error) {
      console.error('Error updating user', error);
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
            {/* <label className='error-text'>{errorMessage.Fullname}</label> */}
            <TextField className='text-line-type1' name='username' value={formData.username} onChange={handleInputChange} label=" Username" variant="outlined" />
            {/* <label className='error-text'>{errorMessage.username}</label> */}
            <TextField className='text-line-type1' name='password' value={formData.password} onChange={handleInputChange} label=" Password" variant="outlined" />
            {/* <label className='error-text'>{errorMessage.password}</label> */}

            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='NIC' value={formData.NIC} onChange={handleInputChange} label="National ID / Passport" variant="outlined" />
                {/* <label className='error-text'>{errorMessage.NIC}</label> */}
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
                  {/* <label className='error-text'>{errorMessage.jobrole}</label> */}
              </div>
            </div>

            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='email' value={formData.email} onChange={handleInputChange} label="Email" variant="outlined"/>
                {/* <label className='error-text'>{errorMessage.email}</label> */}
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='contactno' value={formData.contactno} onChange={handleInputChange} label="Contact Number" variant="outlined" />
                {/* <label className='error-text'>{errorMessage.contactno}</label> */}
              </div>
            </div>

            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='address' value={formData.address} onChange={handleInputChange} label="Address" variant="outlined"/>
                {/* <label className='error-text'>{errorMessage.address}</label> */}
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='city' value={formData.city} onChange={handleInputChange} label="City" variant="outlined" />
                {/* <label className='error-text'>{errorMessage.city}</label> */}
              </div>
            </div>

            <div className='button-container'>
               {registerbtn &&
                <button 
                  type="submit" 
                  class='submit-button'
                  onClick={handleSubmit}>
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
              
              <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
            </div>

        </form>

        {/* <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} /> */}
        <ToastContainer/>
  </div>
      
  );
};

export default UserMaster;
