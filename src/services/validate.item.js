const validateItem = (formData) => {
    const errors = {
        code:'',
        itemName:'',
        categoryDescription:'',
        unitDescription:'',
        supplierName:'',
        reorderLevel:'',
        reorderQuantity:''
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


    //validation for reorderLevel
    if (!formData.reorderLevel) {
        errors.reorderLevel = 'Reorder Level is required *';
    } 
    // else if (!Number.isInteger(formData.reorderLevel)) {
    //     errors.reorderLevel = 'Reorder Level must be a whole number';
    // }

    //validation for reorderQuantity
    if (!formData.reorderQuantity) {
        errors.reorderQuantity = 'Reorder Quantity is required *';
    } 
    // else if (!Number.isInteger(formData.reorderQuantity)) {
    //     errors.reorderQuantity = 'Reorder Quantity must be a whole number';
    // }
  

    return errors;
  };
  
  export default validateItem;