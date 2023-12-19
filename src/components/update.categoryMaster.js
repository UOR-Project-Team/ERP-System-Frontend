import React, { useState , useEffect } from 'react';
import Swal from 'sweetalert2';
import axios  from 'axios';
import { useNavigate , useParams } from "react-router-dom";


function UpdateCategory() {

  const { id } = useParams();
  const navigate = useNavigate();  
  const [Description, setDescription] = useState('');
  const [errorMessage , setErrorMessage] = useState('');

 
useEffect(() => {
    
    axios.get(`http://localhost:8081/category/show/${id}`)
      .then(res => {
        if (res.data && res.data.category) {
          setDescription(res.data.category.Description);
        } else {
          
          navigate('/not-found'); 
        }
      })
      .catch(err => {
        console.error('Error fetching category:', err);
        
        navigate('/error'); 
      });
  }, [id, navigate]);
  
const handleSubmit = (event) => {
    event.preventDefault();

    if (!Description.trim()) {
      setErrorMessage('Category Name cannot be empty');
      return;
    }

    axios.put(`http://localhost:8081/category/update/${id}`, { Description: Description })
      .then(res => {
        console.log(res);

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Category Successfully Updated",
            showConfirmButton: false,
            timer: 1500,
          });
        
        navigate('/home/category-list');
      })
      .catch(err => {
        console.error('Error updating category:', err);
         navigate('/error'); 
      });
  };

  const handleCancel = () => {
    
    navigate('/home/category-list');
  };

  const handleInputChange = (e) => {
    setDescription(e.target.value);
    setErrorMessage('');
  };

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
        <h2>Update Category</h2>
       </div>
       <div>
       <form onSubmit={handleSubmit}>
                <div className='categoryMaster-input-container'>
                <label className='categoryMaster-label'>Category Name</label>
                <input className = 'categoryMaster-input' type="text" placeholder="Category Name" value = { Description } onChange = {handleInputChange} onBlur={handleInputBlur}required />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
                <div className='categoryMaster-buttons-container'>
                     <button className='categoryMaster-cancel-button' onClick={handleCancel}> Cancel</button>
                    <button className='categoryMaster-save-button' type="submit">Update</button>
                    
                </div>
                
            </form>
            </div>
    </div>
  );
}

export default UpdateCategory;
