import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    axios.get('http://localhost:8081/user/show')
      .then(response => {
        setUsers(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures useEffect runs once on mount

  return (
    <div>
      <h2>User Information</h2>
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
            <tr key={user.id}>
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
                <button type='button' className='btn btn-success'>update</button>
                <button type='button' className='btn btn-danger'>Delete</button>
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
    </div>
  )
}

export default UserList;
