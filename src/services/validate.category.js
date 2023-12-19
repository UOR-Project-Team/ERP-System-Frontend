const validateCategory = (formData) => {
    const errors = {
      Description: '',
   
    };
  
    if (!formData.Description) {
        errors.Description = 'Please insert category *';
    }
  
    return errors;
  };
  
  export default validateCategory;