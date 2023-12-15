import React, {useState, useEffect } from 'react';
import axios from 'axios';
import Toaster from '../services/ToasterMessage';

function SupplierList() {

  const [Supplier, setSupplier] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const showToastMessage = (msg, type) => {
    setMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  const fetchData = async() => {

    axios.get('http://localhost:8081/supplier/show')
      .then(response => {
        setSupplier(response.data.Supplier);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const handleDelete = async(id)=>{
    if (window.confirm('Are you sure you want to delete this row?')) {
      try {
        await axios.delete(`http://localhost:8081/supplier/delete/${id}`); 
        showToastMessage('Successfully Deleted!', 'success');
        setTimeout(() => {
          fetchData(); // Fetch data again to update the table after deletion
        }, 3000);
      } catch (error) {
        console.error('Error deleting row', error);
      }
    }
  }

  const handleUpdate = (id)=>{
    console.log(id)
  }


  useEffect(() => {
    fetchData(); // Fetch data initially when the component mounts
  }, []);

  return (
    <div>
      <h2>Supplier Information</h2>
      <table class="table table-striped table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>RegistrationNo</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>FAX</th>
            <th>Address</th>
            <th>City</th>
            <th>Description</th>
            <th>VAT NO</th>
            <th>Credit</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        
        {Array.isArray(Supplier) && Supplier.length > 0 ? (
          Supplier.map(user => (
            <tr key={user.ID}>
              <td>{user.ID}</td>
              <td>{user.Fullname}</td>
              <td>{user.RegistrationNo }</td>
              <td>{user.Email }</td>
              <td>{user.ContactNo }</td>
              <td>{user.FAX}</td>
              <td>{user.Address }</td>
              <td>{user.City}</td>
              <td>{user.Description }</td>
              <td>{user.VatNo}</td>
              <td>{user.Credit }</td>
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
            <td colSpan="11">No Supplier data available</td>
          </tr>
        )}
        
        </tbody>
      </table>

      <Toaster message={message} showToast={showToast} type={toastType} setShowToast={setShowToast} />
    </div>
  )
}

export default SupplierList;
