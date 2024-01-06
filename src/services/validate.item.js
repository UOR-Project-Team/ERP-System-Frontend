const validateItem = (formData) => {
    const errors = {
        code:'',
        itemName:'',
        categoryDescription:'',
        unitDescription:'',
        supplierName:''
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

    if (!formData.supplierName) {
        errors.supplierName = 'Supplier is required *';
    }
  

    return errors;
  };
  
  export default validateItem;