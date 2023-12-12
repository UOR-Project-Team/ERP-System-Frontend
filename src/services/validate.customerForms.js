const validateCustomerForm = (formValues) => {
    const errors = {};
  
    if (!formValues.firstName) {
      errors.firstName = 'First Name is required';
    }
  
    if (!formValues.lastName) {
      errors.lastName = 'Last Name is required';
    }
  
    
  
    return errors;
  };

  export default validateCustomerForm;
