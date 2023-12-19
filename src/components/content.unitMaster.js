import React, { useState } from 'react';
import {ValidateInput} from '../services/validation.login';
import axios from 'axios';

function UnitMaster() {

  const [unitDescription, setUnitDescription] = useState('');
  const [unitSI, setUnitSI] = useState('');

  const unitDescriptionError = ValidateInput(unitDescription);
    const unitSIError = ValidateInput(unitSI);

    const [Errormessage, setErrormessage] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Add your form submission logic here

    if(unitDescriptionError || unitSIError){
      console.log("No inputs")
      setErrormessage(true)
      return
    }

    try{
      const response =await axios.post('http://localhost:8081/unit/create', {
        //paasing username & password
        unitDescription: unitDescription, 
        unitSI: unitSI,
      });
      
      //checking the responese
      if (response.status === 200) {
          console.log('Successfully unit Added');
          setErrormessage(false)
          //navigate('/home');
        } else {
          alert('Error logging in');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrormessage(true)
        // Handle error 
      }


    console.log('Unit Description:', unitDescription);
    console.log('Unit SI:', unitSI);
    // Reset the form fields
    setUnitDescription('');
    setUnitSI('');
  };

  return (
    <div className="container mt-4">
      {/* <h2>Unit Form</h2> */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="unitDescription" className="form-label">
            Unit Description
          </label>
          <input
            type="text"
            className="form-control"
            id="unitDescription"
            value={unitDescription}
            onChange={(e) => setUnitDescription(e.target.value)}
          />
          {Errormessage && <span className='text-danger'>{unitDescriptionError} </span>}
        </div>
        <div className="mb-3">
          <label htmlFor="unitSI" className="form-label">
            Unit SI
          </label>
          <input
            type="text"
            className="form-control"
            id="unitSI"
            value={unitSI}
            onChange={(e) => setUnitSI(e.target.value)}
          />
          {Errormessage && <span className='text-danger'>{unitSIError} </span>}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UnitMaster;
