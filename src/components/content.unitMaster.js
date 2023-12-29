import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/ToasterMessage';
import validateUnit from '../services/validate.unit';
import unitServices from '../services/services.unit';
import TextField from '@mui/material/TextField';

function UnitMaster(){

    const navigate = useNavigate();
    
    const [formData , setFormData] = useState({
            Description:'',
            SI: ''
    });

    const [errorMessage , setErrorMessage] = useState({
            Description:'',
            SI: ''
    });

    const handleChanges = (e) => {
        const { name , value } = e.target;
        setFormData((prevdata) => ({...prevdata , [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateUnit(formData);
        setErrorMessage(validationErrors);

        if (Object.values(validationErrors).some((error) => error !== '')) {
            showErrorToast('Check the inputs again');
            return
        }
          
          try {
            const response = await unitServices.createUnit(formData );
            showSuccessToast('Unit successfully added');
            console.log('Unit created:', response);
            handleReset();
            

            setTimeout(() => {
              navigate('/home/unit-list');
            }, 2000);

           

          } catch(error){
            console.error('Error creating unit:', error.message);
            if (error.response && error.response.data && error.response.data.error) {
              showErrorToast('Error creating unit');
            } else {
              showErrorToast('Error Occured');
          }
          }
        };

        const handleReset = () =>{
            setFormData((prevdata) => ({
                Description:'',
                SI: ''
            }));
            setErrorMessage({
                Description:'',
                SI: ''
            });
        };

        return(
            <div>
                <ToastContainer />
                <div className='master-content' style={{height: '92vh'}}>
                    <form className='form-container' style={{marginTop:'22vh'}}>
                        <h3>Unit Details</h3>
                            <TextField className='text-line-type1' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant='outlined' />
                            <label className='error-text'>{errorMessage.Description}</label>
                            <TextField className='text-line-type1' name='SI' value={formData.SI} onChange={(e) => handleChanges(e)} label="SI" variant='outlined' />
                            <label className='error-text'>{errorMessage.SI}</label>
                            <div className='button-container'>
                                 <button type='submit' class='submit-button' onClick={handleSubmit}>Submit</button>
                                 <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
                            </div>
                    </form>
                    
                </div>
            </div>
        )
    
}

export default UnitMaster;