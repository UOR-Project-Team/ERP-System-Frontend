import React, { useState } from 'react';
import './categoryMaster.css'

import axios  from 'axios';

function CategoryMaster() {

  const [Description, setDescription] = useState('');
  // function handleSubmit(event) {
    
  // }
  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/category/create', { Description })
      .then(res =>{
          console.log(res);
          //navigate('/');

      }).catch (err => {
          console.log(err);
      })
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
                <input type="text" placeholder="Category Name" onChange = {e => setDescription(e.target.value)} ></input>
                </div>
                <div id="buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <button id="cancel"> Cancel</button>
                    <button id = "save" type="submit">Save</button>
                    
                </div>
                
            </form>
            </div>
    </div>
  );
}

export default CategoryMaster;
