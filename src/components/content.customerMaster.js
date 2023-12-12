import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function CustomerMaster({ formValues, updateFormValues, updateCountry }) {

  const {
    firstName,
    lastName,
    nationalId,
    vatNumber,
    email,
    mobile,
    street1,
    street2,
    city,
    country,
  } = formValues;

  const handleSubmit = () => {
    updateFormValues({
      firstName: '',
      lastName: '',
      nationalId: '',
      vatNumber: '',
      email: '',
      mobile: '',
      street1: '',
      street2: '',
      city: '',
      country: null,
    });
  };

  const handleReset = () => {
    updateFormValues({
      firstName: '',
      lastName: '',
      nationalId: '',
      vatNumber: '',
      email: '',
      mobile: '',
      street1: '',
      street2: '',
      city: '',
      country: null,
    });
  };

  return (
    <div>
      <div className='master-content'>
        <form className='form-container'>
          <h3>Customer Details</h3>
            <TextField className='text-line-type1' value={firstName} onChange={(e) => updateFormValues({ firstName: e.target.value })} label="First Name" variant="outlined" />
            <TextField className='text-line-type1' value={lastName} onChange={(e) => updateFormValues({ lastName: e.target.value })} label="Last Name" variant="outlined" />
            <div className='line-type2-container'>
              <TextField className='text-line-type2' value={nationalId} onChange={(e) => updateFormValues({ nationalId: e.target.value })} label="National ID / Passport" variant="outlined" />
              <TextField className='text-line-type2' value={vatNumber} onChange={(e) => updateFormValues({ vatNumber: e.target.value })} label="VAT Number" variant="outlined" />
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <TextField className='text-line-type2' value={email} onChange={(e) => updateFormValues({ email: e.target.value })} label="Email" variant="outlined"/>
              <TextField className='text-line-type2' value={mobile} onChange={(e) => updateFormValues({ mobile: e.target.value })} label="Mobile" variant="outlined" />
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <TextField className='text-line-type2' value={street1} onChange={(e) => updateFormValues({ street1: e.target.value })} label="Street 1" variant="outlined"/>
              <TextField className='text-line-type2' value={street2} onChange={(e) => updateFormValues({ street2: e.target.value })} label="Street 2" variant="outlined" />
            </div>
            <div className='line-type2-container'>
              <TextField className='text-line-type2' value={city} onChange={(e) => updateFormValues({ city: e.target.value })} label="City" variant="outlined"/>
              <Autocomplete disablePortal className='text-line-type2' options={[{ label: 'Sri Lanka' }, { label: 'India' }]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    value={country}
                    onChange={(_, newValue) => {
                      updateFormValues({ country: newValue });
                      updateCountry(newValue);
                    }}
                  />
                )}
              />
            </div>
            <div className='button-container'>
              <button type='submit' class='submit-button' onClick={handleSubmit}>Submit</button>
              <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerMaster;
