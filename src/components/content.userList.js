import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import Toaster from '../services/ToasterMessage';
import Dialogbox from '../services/Dialogbox'

import SearchLogo from './../assets/icons/search.png';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import EditLogo from './../assets/icons/edit.png';
import DeleteLogo from './../assets/icons/delete.png';
import GreenCircle from '../assets/icons/green-circle.png'
import GreyCircle from '../assets/icons/Grey-circle.png'

function UserList() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState();
  const [userID, setUserId] = useState();
  const navigate =useNavigate();
  
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const [openDialog, setOpenDialog] = useState(false)  //Dialog box

  const handleOpenDialog = () => {
    // Open the confirmation dialog
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    // Close the dialog
    setOpenDialog(false);
  };


  const showToastMessage = (msg, type) => {
    setMessage(msg);
    setToastType(type);
    setShowToast(true);
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
    const id =userID;
    if(id){
      try {
         await axios.delete(`http://localhost:8081/user/delete/${id}`); 
        showToastMessage('Successfully Deleted!', 'success');
        setTimeout(() => {
          fetchData(); // Fetch data again to update the table after deletion
        }, 3000);
      
      } catch (error) {
        showToastMessage('Error deleting row!', 'error');
        console.error('Error deleting row', error);
      }
    }
    setOpenDialog(false);
  }



  const handleUpdate = async(id)=>{

    navigate(`/home/user-master/${id}`);
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

  return (
    <div className='body-container'>
      <div className='master-content'>
          <div className='search-container'>
            <input type="text" placeholder='Explore the possibilities...' value={search} onChange={handleSearch} />
            <button ><img src={SearchLogo} alt="Search Logo"/></button>
          </div>
      </div>
     

      <div className='master-content'>

      <div className='features-panel'>
          <button ><img src={PdfLogo} alt="Pdf Logo" /></button>
          <button ><img src={CsvLogo} alt="Csv Logo" /></button>
          <button ><img src={FilterLogo} alt="Filter Logo" /></button>
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
                <th>Action</th>
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
              {user.Status === 0 ? (
                    <button type='button'><img src={GreyCircle} alt='Inactive'/></button>
                  ) : (
                    <button type='button' ><img src ={GreenCircle} alt='Active'/></button>
                  )}
                </td>
              <td style={{ display: 'flex', gap: '5px' }}>
                <button type='button' onClick={()=>handleUpdate(user.ID)}><img src={EditLogo} alt='Update'/></button>
                <button type='button' onClick={() => handleDeleteUser(user.ID)}><img src ={DeleteLogo} alt='Delete' /></button>
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
                confirmText="Perform"
              />
        
        </tbody>
        </table>

        <div className='categorylist-addbutton-container'>
            <Link to = "/home/user-master">
                <button className='categorylist-addbutton'>Add User</button>

            </Link>
            </div>
      </div>
      </div>

      <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} />
              
    </div>
  )
}

export default UserList;
