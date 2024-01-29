import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import validateCategory from '../services/validate.category';
import categoryServices from '../services/services.category';
import TextField from '@mui/material/TextField';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';

function CategoryMaster(){

    const navigate = useNavigate();
    
    const [formData , setFormData] = useState({
            Description:''
    });

    const [errorMessage , setErrorMessage] = useState({
            Description:''
    });

    const styles = theme => ({
        textField: {
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto',            
            paddingBottom: 0,
            marginTop: 0,
            fontWeight: 500
        },
        input: {
            color: 'white'
        }
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
            showErrorToast('Check the inputs again');
            return
        }
          
        try {
            const response = await categoryServices.createCategory({ Description: formData.Description });
            showSuccessToast('Category successfully added');
            
            console.log('Category created:', response);
            handleReset();

            setTimeout(() => {
                navigate('/home/category-list');
            }, 2000);

        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                showErrorToast(`${message}`);
                console.error('Error:', message);
                setErrorMessage({
                    Description: 'This category Already Exists'
                });
            } else {
                showErrorToast('An error occurred while creating.');
                console.error('Error:', error);
            }
        };
    }

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
            <div className='master-content' style={{height: '92vh'}}>
                <form className='form-container' style={{marginTop:'25vh'}}>
                    <h3>Category Details</h3>
                        <TextField
                            // className={classes.textField}
                            error={errorMessage.Description ? true : false}
                            name='Description' value={formData.Description}
                            onChange={(e) => handleChanges(e)}
                            label="Description"
                            variant='outlined'
                            // InputProps={{
                            //     className: classes.input,
                            // }}
                            />
                        <label className='error-text'>{errorMessage.Description}</label>
                        <div className='button-container'>
                                <button type='submit' className='submit-button' onClick={handleSubmit}>Submit</button>
                                <button type='reset' className='reset-button' onClick={handleReset}>Reset</button>
                        </div>
                </form>
                
            </div>
        </div>
    )
    
}

export default CategoryMaster;