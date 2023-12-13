import React, { useState } from 'react';
import './categoryMaster.css'
import axios  from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function CategoryMaster() {

  const [Description, setDescription] = useState('');
  //const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  function handleSubmit(event) {
    event.preventDefault();
    //check whether the  field is empty
    // if (!Description.trim()) {
    //   setErrorMessage('Category Name cannot be empty');
    //   return;
    // }

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
       <div id='formcontainer'>
       <form onSubmit={handleSubmit}>
                <div id="input">
                <label>Category Name</label>
                <input type="text" placeholder="Category Name" onChange = {handleInputChange} onBlur={handleInputBlur}required ></input>

               
                </div>
                <div id="button-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <button id="cancel" onClick={handleCancel}> Cancel</button>
                    <button id = "save" type="submit">Save</button>
                    
                </div>
                
            </form>
            </div>
    </div>
  );
}

export default CategoryMaster;
