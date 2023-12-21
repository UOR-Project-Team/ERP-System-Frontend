const validateSupplier = (formData) => {
    const errors = {
      Fullname: '',
      RegistrationNo: '',
      Email: '',
      ContactNo: '',
      Fax: '',
      Address: '',
      City: '',
      Description: '',
      VatNo: '',
      
    };
  
    if (!formData.Fullname) {
        errors.Fullname = 'Full name is required *';
    }
    if (!formData.RegistrationNo) {
        errors.RegistrationNo = 'Registration number is required *';
    }
  
    if (!formData.Email) {
        errors.Email = 'Email is required *';
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


    if (!formData.Fax) {
        errors.Fax = 'Fax number is required *';
      } else if (!/^\+?\d+$/.test(formData.Fax)) {
        errors.Fax = 'FAX No must contain only numbers';
      } else if (formData.Fax.length < 10) {
        errors.Fax = 'FAX No must be at least 10 digits';
      } 
  
    if (!formData.Address) {
        errors.Address = 'Address is required *';
    }
  
    if (!formData.City) {
        errors.City = 'City is required *';
    }

    if (!formData.Description) {
        errors.Description = 'Description is required *';
    }

    if (!formData.VatNo) {
        errors.VatNo = 'VAT number is required *';
    }
  
    return errors;
  };
  
  export default validateSupplier;