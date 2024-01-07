import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Dialogbox from '../services/Dialogbox'
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validateUser from '../services/validate.user';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import AddLogo from './../assets/icons/add.png';
import SearchLogo from './../assets/icons/search.png';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import EditLogo from './../assets/icons/edit.png';
import DeleteLogo from './../assets/icons/delete.png';
import GreenCircle from '../assets/icons/green-circle.png'
import GreyCircle from '../assets/icons/Grey-circle.png'
import ActionLogo from './../assets/icons/action.png';

function UserList() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState();
  const [userID, setUserId] = useState();

  const [anchorEl, setAnchorEl] = useState(null);
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openDialog, setOpenDialog] = useState(false)

  const navigateTo = useNavigate();

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

  const handleReset = ()=>{
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
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  

  const handleOpenDialog = () => {
    // Open the confirmation dialog
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    // Close the dialog
    setOpenDialog(false);
  };



  const fetchData =async() => {

    axios.get('http://localhost:8081/user/show')
      .then(response => {
        setUsers(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  } // Empty dependency array ensures useEffect runs once on mount

  const handleDeleteUser = (userId) => {
    setUserId(userId); // Set the user ID to delete
    handleOpenDialog(); // Open the dialog
  };

  const handleDelete = async()=>{
    setOpenDialog(false);
    const id =userID;
    if(id){
      try {
         await axios.delete(`http://localhost:8081/user/delete/${id}`); 
        //showToastMessage('Successfully Deleted!', 'success');
        showSuccessToast('User Deleted successfully!');
        setTimeout(() => {
          fetchData(); // Fetch data again to update the table after deletion
        }, 3000);
      
      } catch (error) {
        //showToastMessage('Error deleting row!', 'error');
        showErrorToast('Failed to Delete User. Please try again.');
        console.error('Error deleting row', error);
      }
    }
    
  }


  useEffect(() => {
    fetchData(); // Fetch data initially when the Page load
  }, []);

  const handleSearch = async(e)=>{
    const searchvalue = e.target.value;

    setSearch(searchvalue);
    try {
      const response = await axios.get(`http://localhost:8081/user/search?term=${searchvalue}`);
      setUsers(response.data.user);
    } catch (error) {
      console.error('Error searching users:', error);
    }

  }


  const fetchUser = async () => {
    const id =userID;
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
          //setDataFetched(true);
        })
        
        
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    } catch (error) {
      console.error('Error fetching user', error);
    }
  
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const handleRequest = (type) => {
    setAnchorEl(null);
    setModelContent(type);
    setIsModalOpen(true);
  };

  


  const handleUpdate = async (event) => {
    event.preventDefault();

    const validationErrors = validateUser(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      console.log(validationErrors)
      showErrorToast('Enter valid Input');
      return
    }

    const id =userID;
    try {
      
      const response = await axios.put(`http://localhost:8081/user/update/${id}`, formData);
      
      if(response.status ===200){
        //setPasswordError('');
          console.log("Suucesfully Updated")
          //showToastMessage('Successful! Updated', 'success'); 
          
          setIsModalOpen(false);
          showSuccessToast('User Updated successfully!');
          fetchData();
        
      }else{
       // showToastMessage('Error occurred. Please try again.', 'error');
        showErrorToast('Failed to create user. Please try again.');
    }
    } catch (error) {
      console.error('Error updating user', error);
    }
  };

  return (
    <div className='list-container'>

      <div className='list-content-top'>
        <div className='button-container'>
          <button onClick={() => {navigateTo(`/home/user-master`)}}><img src={AddLogo} alt='Add Logo'/><span>Add User</span></button>
        </div>
        <div className='search-container'>
          <input type="text" placeholder='Explore the possibilities...' value={search} onChange={(e) =>  setSearch(e.target.value)} />
          <button onClick={handleSearch}><img src={SearchLogo} alt="Search Logo"/></button>
        </div>
      </div>
     

      <div className='list-content'>

      <div className='features-panel'>
          <button ><img src={PdfLogo} alt="Pdf Logo" /></button>
          <button ><img src={CsvLogo} alt="Csv Logo" /></button>
          <button onClick={() => {setIsModalOpen(true); setModelContent('filter')}}><img src={FilterLogo} alt="Filter Logo" /></button>
        </div>


      <div className='table-container'>

        <table>
        <thead>
            <tr>
                {/* <th>ID</th> */}
                <th>Full Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>NIC</th>
                <th>Job Role</th>
                <th>Contact No</th>
                <th>Address</th>
                <th>City</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
        
        {Array.isArray(users) && users.length > 0 ? (
          users.map(user => (
            <tr key={user.ID}>
              {/* <td>{user.ID}</td> */}
              <td>{user.Fullname}</td>
              <td>{user.Email}</td>
              <td>{user.Username}</td>
              <td>{user.NIC}</td>
              <td>{user.JobRole}</td>
              <td>{user.ContactNo}</td>
              <td>{user.Address}</td>
              <td>{user.City}</td>
              <td>
              <div className='Statusbutton-container'>
                      {user.Status === 0 ? (
                        <button type='button'><img src={GreyCircle} alt='Inactive'/></button>
                      ) : (
                        <button type='button' ><img src ={GreenCircle} alt='Active'/></button>
                     )}
                      </div>
                </td>
                <td>
                      <button onClick={(event) => { handleClick(event); setUserId(user.ID); }}>
                        <img src={ActionLogo} alt='Action Logo' />
                      </button>
                    </td>
            </tr>

            
          ))
        ):(
          <tr>
            <td colSpan="11">No user data available</td>
          </tr>
        )}

              <Dialogbox
                open={openDialog}
                handleClose={handleCloseDialog}
                handleConfirm={handleDelete}
                title="Confirm Operation"
                confirmText="Ok"
              />
        
        </tbody>
        </table>
      </div>
      </div>

      <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => {fetchUser(); handleRequest('edit');}}>
          <button >
            <img src={EditLogo} alt="Edit Logo"/>
            <span>Edit Customer</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteUser(userID)}>
          <button>
            <img src={DeleteLogo} alt="Delete Logo"/>
            <span>Delete Customer</span>
          </button>
        </MenuItem>
      </Menu>

      {/* <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} /> */}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {setIsModalOpen(false)}}
        contentLabel="Header-Model"
        className="modal-content"
        overlayClassName="modal-overlay"
        >
          {modelContent === "filter" ? (
            <div className='feature-modal'>
              <h3>Table Filter</h3>
              <form >
                <div className='checkbox-container'>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Fullname'   />
                    <label>Fullname</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='username'  />
                    <label>Username</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='email' />
                    <label>Email</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='NIC' />
                    <label>National Id</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='contactno'  />
                    <label>Contact Number</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='address'  />
                    <label>Address</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='jobrole'  />
                    <label>Job Role</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='city'  />
                    <label>City</label>
                  </div>
                </div>
                <button type='submit'>Filter</button>
              </form>
            </div>
          ) : modelContent === "edit" ? (
            <div className='edit-model'>
              <h3>Update User</h3>
              <form className='form-container'>
          <h3>User Details</h3>
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
                    <button type='submit' class='submit-button' onClick={handleUpdate}>Submit</button>
                    <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
                  </div>

        </form>
            </div>
          ) : (
            <p>Error Occured While loading the component</p>
          )}
      </Modal>

      <ToastContainer/>
              
    </div>
  )
}

export default UserList;
