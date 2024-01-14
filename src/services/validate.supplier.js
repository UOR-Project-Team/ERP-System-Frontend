const validateSupplier = (formData) => {
    const errors = {
      Title: '',
      Fullname:'',
      RegistrationNo: '',
      Email: '',
      ContactNo: '',
      Fax: '',
      City: '',
      Country: '',
    };

    if (!formData.Title) {
      errors.Title = 'Title is required *';
    }
  
    if (!formData.Fullname) {
        errors.Fullname = 'Fullname is required *';
    }

    if (!formData.RegistrationNo) {
      errors.RegistrationNo = 'Registration number is required *';
    }
  
    if (!formData.Email) {
        errors.Email = 'Email address is required *';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
        errors.Email = 'Invalid email address';
    }
  
    if (!formData.ContactNo) {
        errors.ContactNo = 'Contact number is required *';
    } else if (!/^\+?\d+$/.test(formData.ContactNo)) {
        errors.ContactNo = 'Contact No must contain only numbers';
    } else if (formData.ContactNo.length < 10) {
        errors.ContactNo = 'Contact No must be at least 10 digits';
    } 

    if(formData.Fax) {
        if (!/^\+?\d+$/.test(formData.Fax)) {
            errors.Fax = 'FAX No must contain only numbers';
        } else if (formData.Fax.length < 10) {
            errors.Fax = 'FAX No must be at least 10 digits';
        }
    }

    if (!formData.City) {
      errors.City = 'City is required *';
    }
  
    if (!formData.Country) {
        errors.Country = 'Country is required *';
    }

    return errors;

  };
  
  export default validateSupplier;