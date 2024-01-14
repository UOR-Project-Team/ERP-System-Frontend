const validateUser = (formData) => {
    const errors = {
      Fullname: '',
      username: '',
      email: '',
      NIC: '',
      contactno: '',
      jobrole: '',
      address: '',
      city: '',
    };
  
    if (!formData.Fullname ) {
        errors.Fullname = 'FullName is required *';
    }

    if (!formData.username ) {
      errors.username = 'Username is required *';
  }

  
    if (!formData.email) {
        errors.email = 'Email is required *';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Invalid email address';
    }
  
    if (!formData.NIC) {
        errors.NIC = 'NIC/Passport is required *';
    } else if (!/^[A-Za-z0-9]+$/i.test(formData.NIC)) {
        errors.NIC = 'Invalid NIC/Passport format';
    }
  
    if (!formData.contactno) {
        errors.contactno = 'Contact number is required *';
      } else if (!/^\+?\d+$/.test(formData.contactno)) {
        errors.contactno = 'Contact No must contain only numbers';
      } else if (formData.contactno.length < 10) {
        errors.contactno = 'Contact No must be at least 10 digits';
      } 
  
    if (!formData.city) {
        errors.city = 'City is required *';
    }

    if (!formData.jobrole) {
        errors.jobrole = 'jobrole is required *';
    }
  
    if (!formData.address) {
        errors.address = 'Country is required *';
    }
  
    return errors;
  };
  
  export default validateUser;