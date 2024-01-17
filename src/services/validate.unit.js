const validateUnit = (formData) => {
  const errors = {
    Description: '',
    SI: ''
  };

  if (!formData.Description) {
      errors.Description = 'Please insert Unit name *';
  }

  if (!formData.SI) {
      errors.SI = 'Please insert SI value *';
  }

  return errors;
};
  
export default validateUnit;