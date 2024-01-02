const validateItem = (formData) => {
    const errors = {
        code:'',
        itemName:'',
        categoryDescription:'',
        unitDescription:''
    };
  
    if (!formData.code) {
        errors.code = 'Item Code is required *';
    }
  
    if (!formData.itemName) {
      errors.itemName = 'Item Name is required *';
    }

    if (!formData.categoryDescription) {
        errors.categoryDescription = 'Cateogry is required *';
    }

    if (!formData.unitDescription) {
        errors.unitDescription = 'Unit is required *';
    }
  

    return errors;
  };
  
  export default validateItem;