import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { ToastContainer } from 'react-toastify';
import itemServices from '../services/services.item';
import validateItem from '../services/validate.item';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import categoryServices from '../services/services.category';
import unitServices from '../services/services.unit';

function ItemMaster() {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [units, setUnit] = useState([]);
  const[values,setValues]=useState({
    code:'',
    itemName:'',
    categoryDescription:'',
    unitDescription:''
  })
  const [errorMessage, setErrorMessage] = useState({
    code: '',
    itemName: '',
    categoryDescription: '',
    unitDescription: '',
  })

  // Fetch categories from the server
  // useEffect(() => {
  //   axios.get('http://localhost:8081/category/') 
  //     .then(response => {
  //       setCategories(response.data.categories);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching category data:', error);
  //     });
  // }, []);
  //fetch categories for the update form's category options
  const fetchCategoryOptions = async () => {
    try {
      const Categories = await categoryServices.getAllCategories();
      // Set categoryOptions state with fetched data
      setCategories(Categories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  // Fetch units from the server
  // useEffect(() => {
  //   axios.get('http://localhost:8081/unit') 
  //     .then(response => {
  //       setUnit(response.data.units);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching units data:', error);
  //     });
  // }, []);


  const fetchUnitOptions = async () => {
    try {
      const Units = await unitServices.getAllUnits();
      // Set unitOptions state with fetched data
      setUnit(Units);
    } catch (error) {
      console.error('Error fetching units:', error.message);
    }
  };


  fetchCategoryOptions();
  fetchUnitOptions();


  const categoryOptions = categories.map(category => ({
    value: category.ID,
    label: category.Description,
  }));

  const unitOptions = units.map(unit => ({
    value: unit.ID,
    label: unit.Description,
  }));


  //handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues)=>({
      ...prevValues,
      [name]: value,
    }));

    setErrorMessage((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const getUnitIdFromDescription = (description) => {
    const unit = units.find((unit) => unit.Description === description);
    return unit ? unit.ID : null;
  }

  const getCategoryIdFromDescription = (description) => {
    const category = categories.find((category) => category.Description === description);
    return category ? category.ID : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unitId = getUnitIdFromDescription(values.unitDescription);
    const categoryId = getCategoryIdFromDescription(values.categoryDescription);
    
    const submitItemData = {
      code: values.code,
      itemName: values.itemName,
      categoryId: categoryId,
      unitId: unitId,
    }
    const validationErrors = validateItem(values);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      showErrorToast('Check the inputs again')
      return
    }
    
    try {
        const response = await itemServices.createItem(submitItemData)
        showSuccessToast('Item successfully added');
        console.log('item created:', response);
        handleReset();
      }

      catch (error) {
        //const {message} = error.response.data;
        showErrorToast('Error Occured');
  
        //console.error('Error:', message);
        console.error('Error:');
  
      }
      
      
  };

  //Handle Reset
  const handleReset = () => {
    setValues((prevValues) => ({
      code:'',
      itemName:'',
      categoryDescription:'',
      unitDescription:''
    }));
    
    setTimeout(()=>{
      navigate('/home/item-list');
    },2000);

    setErrorMessage({
      code: '',
      itemName: '',
      categoryDescription: '',
      unitDescription: '',
    });
  };


  return (
    <div className="master-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
      <ToastContainer />
      <div className='master-content'  >
        <form onSubmit={handleSubmit} className='form-container'  >

          <h3>Item Details</h3>
          <TextField className='text-line-type1' name='code' value={values.code} onChange={(e) => handleInputChange(e)} label="Item Code" variant="outlined"  />
          <label className='error-text'>{errorMessage.code}</label>       
          <TextField className='text-line-type1' name='itemName' value={values.itemName} onChange={(e) => handleInputChange(e)} label="Item Name" variant="outlined" />
          <label className='error-text'>{errorMessage.itemName}</label>

          <h3>Category Details</h3>
          <Autocomplete
            disablePortal
            className='text-line-type2'
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                name='categoryDescription' 
                value={values.categoryDescription}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            )}
            onChange={(_, newValue) => {
              setValues((prevData) => ({ ...prevData, categoryDescription: newValue?.label || '' }));
            }}
            value={values.categoryDescription}
          />
          <label className='error-text'>{errorMessage.categoryDescription}</label>

          <h3>Unit Details</h3>
          <Autocomplete
            disablePortal
            className='text-line-type2'
            options={unitOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Unit"
                name='unitDescription' 
                value={values.unitDescription}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            )}
            onChange={(_, newValue) => {
              setValues((prevData) => ({ ...prevData, unitDescription: newValue?.label || '' }));
            }}
            value={values.unitDescription}
          />
          <label className='error-text'>{errorMessage.unitDescription}</label>

          <div className='button-container'>
            <button type="submit" class='submit-button'>Save</button>
            <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemMaster;
