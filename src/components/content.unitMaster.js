import React, { useState } from 'react';
import {ValidateInput} from '../services/validation.login';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';


const handleChanges = () => {
  // Handle changes here
};



function UnitMaster() {

  //const [unitDescription, setUnitDescription] = useState('');
  //const [unitSI, setUnitSI] = useState('');
  const[values,setValues]=useState({
    Description:'',
    SI:''
    

  })
  const navigate = useNavigate();

  const unitDescriptionError = ValidateInput(values.Description);
  const unitSIError = ValidateInput(values.SI);

  const [Errormessage, setErrormessage] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(unitDescriptionError || unitSIError){
      console.log("No inputs")
      setErrormessage(true)
      return
    }
    else 
    {
      //Making axios http request to insert values into db
      axios.post('http://localhost:8081/unit/create', values)
      .then((res) => {
        console.log('Unit Description:', values.Description);
        console.log('Unit SI:', values.SI);

        //For the toast message
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Unit has been saved",
          showConfirmButton: false,
          timer: 1000,
        });
        
        // Reset the form fields
        setValues({
        Description: '',
        SI: '',
        
        });
      })
      .catch (err => {
        console.log(err);
      })
      .finally(() => {
        // Navigate to 'Unit-list' after the alert is closed
        navigate('/home/unit-list');
      });
      
    }

    
   
  };

  

  return (
    <div className="container mt-4">
      {/* <h2>Unit Form</h2> */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="unitDescription" className="form-label">
            Unit Description
          </label>
          

          <TextField className='form-control' type="text" name='Description' id="unitDescription" value={values.Description}  onchange={(e) => handleChanges(e)} label="Description" variant="outlined" required/>

          {Errormessage && <span className='text-danger'>{unitDescriptionError} </span>}
          
            

        </div>

            
        <div className="mb-3">
          <label htmlFor="unitSI" className="form-label">
            Unit SI
          </label>
          <TextField className='form-control'  name='SI' id="unitSI" value={values.SI}  onchange={(e) => handleChanges(e)} label="SI" variant="outlined" />

          {Errormessage && <span className='text-danger'>{unitSIError} </span>}
        </div>
        <button type="submit" className="btn btn-success">
          Save
        </button>
        
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        
        <button type="reset" className="btn btn-success">
          Reset
        </button>
      </form>
    </div>
  );
}

export default UnitMaster;
