import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from '@mui/material/Autocomplete';




function ItemMaster() {

  const[values,setValues]=useState({
    code:'p01',
    itemName:'Lux Soap 100g',
    categoryId:'1',
    unitId:'1'

  })

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [units, setUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  const [errorMessage, setErrorMessage] = useState({
    code: '',
    itemName: '',
    categoryId: '',
    unitId: '',
  })

  //Error message style
  const errorLabelStyle = {
    color: 'red',
    fontSize: '0.8em', // Optional: adjust the font size
  };


  // Fetch categories from the server
  useEffect(() => {
    
    axios.get('http://localhost:8081/category') 
      .then(response => {
        setCategories(response.data.categories);

      })
      .catch(error => {
        console.error('Error fetching category data:', error);
      });
  }, []);

  // Fetch units from the server
  useEffect(() => {
    
    axios.get('http://localhost:8081/unit') 
      .then(response => {
        setUnit(response.data.units);
      })
      .catch(error => {
        console.error('Error fetching units data:', error);
      });
  }, []);


  // Handle category change
  const handleCategoryChange = selectedOption => {
    setSelectedCategory(selectedOption);

    
    setValues(prevValues => ({
      ...prevValues,
      categoryId: selectedOption?.value||''
    }));

    setErrorMessage((prevErrors) => ({
      ...prevErrors,
      categoryId: '',
    }));
  };

    //Handle unit change
    const handleUnitChange = selectedOption => {
      setSelectedUnit(selectedOption);
      //const selectedValue = selectedOption ? selectedOption.value : ''; // Handle null case
      console.log(selectedOption.value);
      
      
      setValues(prevValues => ({
        ...prevValues,
        unitId: selectedOption.value || ''
      }));

      setErrorMessage((prevErrors) => ({
        ...prevErrors,
        unitId: '',
      }));
      
    };



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



  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    let isValid = true;
    const newErrors = {};

    if (!values.code.trim()) {
      isValid = false;
      newErrors.code = 'Item Code is required *';
    }

    if (!values.itemName.trim()) {
      isValid = false;
      newErrors.itemName = 'Item Name is required *';
    }

    if (!selectedCategory) {
      isValid = false;
      newErrors.categoryId = 'Category is required *';
    }

    if (!selectedUnit) {
      isValid = false;
      newErrors.unitId = 'Unit is required *';
    }

    if (!isValid) {
      setErrorMessage(newErrors);
      toast.error(`Check the inputs again`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    
    axios.post('http://localhost:8081/item/create', values)
      .then((res) => {
        console.log('Item Code:', values.code);
        console.log('Item Name:', values.itemName);
        console.log('Category ID:',{selectedCategory});
        console.log('Unit ID:', {selectedUnit});

        //For the toast message
        toast.success('Successfully Added', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  


        // Reset the form fields
        setSelectedCategory('');
        setSelectedUnit('');
        setValues({
          code: '',
          itemName: '',
          categoryId: '',
          unitId: ''
          
        });
      })
      
      .catch(err => {
        console.error(err);
        if (err) {
          toast.error(`Error Occured`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .finally(() => {
        // Navigate to 'Item-list' after two seconds
        setTimeout(()=>{
          navigate('/home/item-list');
        },2000); 
      });
      
  };

  


  const categoryOptions = categories.map(category => ({
    value: category.ID,
    label: category.Description,
  }));

  const unitOptions = units.map(unit => ({
    value: unit.ID,
    label: unit.Description,
  }));


  //Handle Reset
  const handleReset = () => {
    setValues((prevValues) => ({
      code:'',
      itemName:'',
      categoryId:'',
      unitId:''
    }));
    setErrorMessage({
      code: '',
      itemName: '',
      categoryId: '',
      unitId: '',
    });
  };


  return (
    <div className="master-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
      <ToastContainer />
      <div className='master-content'  >
      
  

        <form onSubmit={handleSubmit} className='form-container'  >
                  
                  <h2>Add Item</h2>

                  <div className='mb-2 col-md-3'>
                      <TextField className='text-line-type1' name='code' value={values.code} onChange={(e) => handleInputChange(e)} label="Item Code" variant="outlined"  />
                      <label style={errorLabelStyle}>{errorMessage.code}</label>       
                      
                  </div>

                  <div className='mb-2 col-md-3'>

                      <TextField className='text-line-type1' name='itemName' value={values.itemName} onChange={(e) => handleInputChange(e)} label="Item Name" variant="outlined" />
                      <label style={errorLabelStyle}>{errorMessage.itemName}</label>
                        
                  </div>
                  
                  <div className='mb-2 col-md-3'>
                      {/* <label htmlFor="Cateogory">Category</label> */}
                      <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        placeholder="Category"
                        name= 'categoryId'
                        
                      />
                      
                      
                      {/* <Autocomplete
                        disablePortal
                        className='text-line-type2'
                        options={categoryOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category"
                            name='categoryId' 
                            value={selectedCategory ? selectedCategory.label || '' : ''} //Check null before accessing label
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                          />
                        )}
                        onChange={(_, newValue) => {
                          setValues(newValue);
                        }}

                        // onClear={() => {
                        //   setSelectedCategory({ label: '', value: '' });
                        //   setValues((prevValues) => ({
                        //     ...prevValues,
                        //     categoryId: '',
                        //   }));
                        // }}
                        
                        
                      /> */}
                      <label style={errorLabelStyle}>{errorMessage.categoryId}</label>
                  </div>

                  <div className='mb-2 col-md-3'>
                      {/* <label htmlFor="UnitId">Unit ID</label> */}
                      <Select
                        
                        className='text-line-type2'
                        options={unitOptions}
                        value={selectedUnit}
                        onChange={handleUnitChange}
                        placeholder="Unit"
                        name= 'unitId'
                        
                      />  
                      

                       {/* <Autocomplete
                        disablePortal
                        className='text-line-type2'
                        options={unitOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Unit"
                            name='unitId' 
                            value={selectedUnit ? selectedUnit.label || '' : ''} // Check for null before accessing label
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                          />
                        )}
                        onChange={(_, newValue) => {
                          setValues(newValue);
                        }}

                        // onClear={() => {
                        //   setSelectedUnit({ label: '', value: '' });
                        //   setValues((prevValues) => ({
                        //     ...prevValues,
                        //     unitId: '',
                        //   }));
                        // }}
                        
                      />  */}
                      <label style={errorLabelStyle}>{errorMessage.unitId}</label>

                  </div>
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
