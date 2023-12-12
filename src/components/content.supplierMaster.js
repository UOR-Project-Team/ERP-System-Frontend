import React, { useState } from 'react';
import axios from 'axios';
import './Style.css';


function SupplierMaster() {

  const [formData, setFormData] = useState({
    Fullname:'Atlas',
    RegistrationNo: '12345',
    Email: 'admintest@gmail.com',
    ContactNo: '1234564321',
    FAX: '1234567',
    Address: '10 Colombo 5',
    City: 'Colombo',
    Description: 'Atlas Pvt ltd in Srilanka',
    VatNo: '0001',

  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
  
    try{
        const response = await axios.post('http://localhost:8081/supplier/create', formData)

        if(response.status === 200){
          //setPasswordError('');
            console.log("Suucesfully Added")
            alert("Succesfully Supplier Addes")
           // navigate('/home')
        }else{
            alert("Error Adding Supplier")
        }

    }catch(error){
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          
          alert(`Server Error : ${error.response.data.error}`);
        }
      } else {
        
        alert('Error: Request setup failed');
      }
      console.error('Error:', error);
    }
    //reset the form
    setFormData({
    Fullname:'',
    RegistrationNo: '',
    Email: '',
    ContactNo: '',
    FAX: '',
    Address: '',
    City: '',
    Description: '',
    VatNo: '',
        
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
            value={formData.Fullname}
            onChange={handleInputChange}
            style={{ width: '850px' }}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="RegistrationNo" className="form-label">
            Registration NO
          </label>
          <input
            type="text"
            className="form-control"
            id="RegistrationNo"
            name="RegistrationNo"
            value={formData.RegistrationNo}
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
            value={formData.Email}
            onChange={handleInputChange}
            style={{ width: '850px' }}
            required
          />
        </div>

        

        {/* ========================================================================== */}


        <div className="side-by-side">
        <div className="mb-3">
          <label htmlFor="ContactNo" className="form-label">
            Contact NO
          </label>
          <input
            type="text"
            className="form-control"
            id="ContactNo"
            name="ContactNo"
            value={formData.ContactNo}
            onChange={handleInputChange}
            style={{ width: '400px' }}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="FAX" className="form-label">
          FAX
          </label>
          <input
            type="text"
            className="form-control"
            id="FAX"
            name="FAX"
            value={formData.FAX}
            onChange={handleInputChange}
            style={{ width: '400px' }}
            required
          />
        </div>
        
        {/* <div className="mb-3">
          <label htmlFor="City" className="form-label">
          City
          </label>
          <input
            type="text"
            className="form-control"
            id="City"
            name="City"
            value={formData.City}
            onChange={handleInputChange}
            style={{ width: '400px' }}
            required
          />
        </div> */}

        </div>

{/* ================================================================== */}
        
      
      <div className="side-by-side">


      {/* <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
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
        </div> */}

        <div className="mb-3">
          <label htmlFor="VatNo" className="form-label">
            VAT NO
          </label>
          <input
            type="text"
            className="form-control"
            id="VatNo"
            name="VatNo"
            value={formData.VatNo}
            onChange={handleInputChange}
            style={{ width: '420px' }}
            
          />
        </div>


        <div className="mb-3">
          <label htmlFor="City" className="form-label">
          City
          </label>
          <input
            type="text"
            className="form-control"
            id="City"
            name="City"
            value={formData.City}
            onChange={handleInputChange}
            style={{ width: '400px' }}
            required
          />
        </div>

        </div>

        {/* ================================================== */}
        <br/>
        <div className="mt-5 mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.Address}
            onChange={handleInputChange}
            style={{ width: '850px'}}
          />
        </div>

        <div className="mt-5 mb-3">
          <label htmlFor="Description" className="form-label">
          Description
          </label>
          <input
            type="text"
            className="form-control"
            id="Description"
            name="Description"
            value={formData.Description}
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
    </div>
  );
}

export default SupplierMaster;
