import React, { useState } from 'react';
import './categoryMaster.css'

import axios  from 'axios';

function CategoryMaster() {

  const [Category, setcategory] = useState('');
  // function handleSubmit(event) {
  //   event.preventDefault();
    
  // }
  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/category/create', { Category })
      .then(res =>{
          console.log(res);
          //navigate('/');
          alert("Success Fully Added")

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
                <input type="text" placeholder="Category Name" value={Category} onChange = {(e) => setcategory(e.target.value)} />

               
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
