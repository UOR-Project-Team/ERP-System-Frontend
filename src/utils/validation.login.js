const validateLogin = (formValues) => {
    
    const errors = {
        username: '',
        password: '',
    };
  
    if (!formValues.username) {
      errors.username = 'Username is required *';
    }
  
    if (!formValues.password) {
      errors.password = 'Password is required *';
    }

    return errors;

};

export default validateLogin;