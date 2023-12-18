import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validateCategory from '../services/validate.category';
import categoryServices from '../services/services.category';
import TextField from '@mui/material/TextField';

function CategoryMaster(){

    const navigate = useNavigate();
    
    const [formData , setFormData] = useState({
            Description:''
    });

    const [errorMessage , setErrorMessage] = useState({
            Description:''
    });

    const handleChanges = (e) => {
        const { name , value } = e.target;
        setFormData((prevdata) => ({...prevdata , [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateCategory(formData);
        setErrorMessage(validationErrors);

        if (Object.values(validationErrors).some((error) => error !== '')) {
            toast.error(`Check the inputs again`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            return
        }
          
          try {
            const response = await categoryServices.createCategory({ Description: formData.Description });
            
            toast.success('Successfully Added', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              
              });
            console.log('Category created:', response);
            handleReset();
            

            setTimeout(() => {
              navigate('/home/category-list');
            }, 2000);

           

          } catch(error){
            console.error('Error creating category:', error.message);
            if (error.response && error.response.data && error.response.data.error) {
              toast.error(`Error Occured`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            } else {
              toast.error('Error Occured', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
          }
          }
        };

        const handleReset = () =>{
            setFormData((prevdata) => ({
                Description:''
            }));
            setErrorMessage({
                Description:''
            });
        };

        return(
            <div>
                <ToastContainer />
                <div className='master-content' style={{height: '100vh'}}>
                    <form className='form-container' style={{marginTop:'25vh'}}>
                        <h3>Category Details</h3>
                            <TextField className='text-line-type1' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant='outlined' />
                            <label className='error-text'>{errorMessage.Description}</label>
                            <div className='button-container'>
                                 <button type='submit' class='submit-button' onClick={handleSubmit}>Submit</button>
                                 <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
                            </div>
                    </form>
                    
                </div>
            </div>
        )











    
}

export default CategoryMaster;