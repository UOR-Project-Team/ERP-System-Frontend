import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toaster from '../services/ToasterMessage';

function UserList() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState();
  const navigate =useNavigate();
  
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');

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

  const handleDelete = async(id)=>{
    if (window.confirm('Are you sure you want to delete this user?')) {
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
  }

  const handleUpdate = async(id)=>{

    navigate(`/home/employee-master/${id}`);
  }

  useEffect(() => {
    fetchData(); // Fetch data initially when the component mounts
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
    <div>
      <h2>User Information</h2>
      <div>
        <input type='text' name='search' value={search} onChange={handleSearch} placeholder='Search'/>
      </div>
      <table class="table table-striped table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>NIC</th>
            <th>JobRole</th>
            <th>Mobile No</th>
            <th>Mobile No2</th>
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
              <td>{user.ID}</td>
              <td>{user.Fullname}</td>
              <td>{user.Email}</td>
              <td>{user.Username}</td>
              <td>{user.NIC}</td>
              <td>{user.JobRole}</td>
              <td>{user.MobileNo}</td>
              <td>{user.MobileNo2}</td>
              <td>{user.Address}</td>
              <td>{user.City}</td>
              <td>
              {user.Status === 0 ? (
                    <button type='button' className='btn btn-danger'>Inactive</button>
                  ) : (
                    <button type='button' className='btn btn-success'>Active</button>
                  )}
                </td>
              <td>
                <button type='button' className='btn btn-success' onClick={()=>handleUpdate(user.ID)}>update</button>
                <button type='button' className='btn btn-danger' onClick={()=>handleDelete(user.ID)}>Delete</button>
              </td>
              
            </tr>
          ))
        ):(
          <tr>
            <td colSpan="11">No user data available</td>
          </tr>
        )}
        
        </tbody>
      </table>
      <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} />
    </div>
  )
}

export default UserList;
