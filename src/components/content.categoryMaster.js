import React, { useState } from 'react';
import axios  from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function CategoryMaster() {

  const [Description, setDescription] = useState('');

  //const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  function handleSubmit(event) {
    event.preventDefault();
   

    axios.post('http://localhost:8081/category/create', { Description })
      .then(res =>{
          console.log(res);

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Category has been saved",
            showConfirmButton: false,
            timer: 1000,
          });

          //navigate('/home/category-list');


      }).catch (err => {
          console.log(err);
      })
      .finally(() => {
        // Navigate to 'category-list' after the alert is closed
        navigate('/home/category-list');
      });
  
  }

  function handleCancel() {
    
    navigate('/home');
  }

  function handleInputChange(e){
    setDescription(e.target.value);
   // setErrorMessage('');
   e.target.setCustomValidity('');
  
   
    
  }
  function handleInputBlur(e) {
    if (!e.target.value.trim()) {
      e.target.setCustomValidity('Category Name cannot be empty');
    } else {
      e.target.setCustomValidity('');
    }
  }





  return (
    
     
    <div>
       <div className='master-content'>
        <h2>Category Master</h2>
       </div>
       <div>
       <form onSubmit={handleSubmit}>
                <div className='categoryMaster-input-container'>

                <label className='categoryMaster-label'>Category Name</label>
                <input className='categoryMaster-input' type="text" placeholder="Category Name" onChange = {handleInputChange} onBlur={handleInputBlur}required ></input>


                </div>
                <div className='categoryMaster-buttons-container'>
                     <button className='categoryMaster-cancel-button' onClick={handleCancel}> Cancel</button>
                    <button className='categoryMaster-save-button' type="submit">Save</button>
                    
                </div>
                
            </form>
            </div>
    </div>
  );
}

export default CategoryMaster;
