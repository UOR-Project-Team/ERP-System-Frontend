import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function ItemUpdate() {

  const[values,setValues]=useState({
    code:'',
    itemName:'',
    categoryId:'',
    unitId:''

  })

  

  const { itemId, itemCode, itemName, categoryId, unitId } = useParams();
  const navigate = useNavigate();


  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [units, setUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({});

  const [loading, setLoading] = useState(true);


    // Fetch units from the database for the unit drop down
    useEffect(() => {
    
      axios.get('http://localhost:8081/unit/get') // Adjust the API endpoint based on your backend
        .then(response => {
          setUnit(response.data.units);
        })
        .catch(error => {
          console.error('Error fetching units data:', error);
        })
        .finally(()=>{
            setLoading(false);
        });
    }, []);
  
    // Fetch categories from the database for the category dropdown menu
    useEffect(() => {
      
      axios.get('http://localhost:8081/category/show') // Adjust the API endpoint based on your backend
        .then(response => {
          setCategories(response.data.categories);
  
        })
        .catch(error => {
          console.error('Error fetching category data:', error);
        })
        .finally(()=>{
          setLoading(false);
        });
    }, []);

  //const [defaultCategory, setdefaultCategory] = useState([]);
  //const [defaultUnit, setdefaultUnit] = useState([]);
  
  
  // useEffect(()=>{
  //   //Populating the fields with the information of the corresponding item
  //   setValues({
  //       code:itemCode,
  //       itemName:itemName,
  //       categoryId:categoryId,
  //       unitId:unitId
  //   });



  // },[]);


  // const categoryOptions = categories.map(category => ({
  //   value: category.ID,
  //   label: category.Description,
  // }));

  // const unitOptions = units.map(unit => ({
  //   value: unit.ID,
  //   label: unit.Description,
  // }));



  // Memoize categoryOptions and unitOptions
  const categoryOptions = useMemo(() => (
    categories.map(category => ({
      value: category.ID,
      label: category.Description,
    }))
  ), [categories]);

  const unitOptions = useMemo(() => (
    units.map(unit => ({
      value: unit.ID,
      label: unit.Description,
    }))
  ), [units]);


  useEffect(() => {
    // Populating the fields with the information of the corresponding item
    setValues({
      code: itemCode,
      itemName: itemName,
      categoryId: categoryId,
      unitId: unitId
    });
    console.log("unitOptions:", unitOptions);

    // Set default values for selectedCategory and selectedUnit based on item's category and unit
    const selectedCategoryOption = categoryOptions.find(option => option.value === 2) || { value: '', label: '' };
    const selectedUnitOption = unitOptions.find(option => option.value === 2) || { value: '', label: '' };
    console.log("unitId: ",unitId);
    console.log("cateogryId: ",categoryId);

    setSelectedCategory(selectedCategoryOption);
    setSelectedUnit(selectedUnitOption);
    console.log(selectedUnit.label );
  }, [categoryOptions, unitOptions]);




  

  // useEffect(() => {
  //   // Fetch unit description by the unitId
  //   axios.get(`http://localhost:8081/unit/get/${unitId}`)
  //     .then(response => {
  //       const unitDetails = response.data.unit;
  //       setSelectedUnit(unitDetails)
  //     })
  //     .catch(error => {
  //       console.error('Error fetching item details:', error);
  //     });  
  // }, [unitId]);

  //  useEffect(() => {
  //    if (unitId) {
  //      const selectedUnitOption = unitOptions.find(unit => unit.value === unitId);
  //     setSelectedUnit(selectedUnitOption || {}); // set default value if found
  //    }
  // }, []);

  

  


  // Handle category change
  const handleCategoryChange = selectedOption => {
    setSelectedCategory(selectedOption);
    setValues(prevValues => ({
      ...prevValues,
      categoryId: selectedOption.value
    }));
  };

  //handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues)=>({
      ...prevValues,
      [name]: value,
    }));
  };

  

   


  
  // Handle unit change
  const handleUnitChange = selectedOption => {
    setSelectedUnit(selectedOption);
    setValues(prevValues => ({
      ...prevValues,
      unitId: selectedOption.value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/item/update/${itemId}`, values)
      .then((res) => {
        console.log('Item Code:', values.code);
        console.log('Item Name:', values.itemName);
        console.log('Category ID:',{selectedCategory});
        console.log('Unit ID:', {selectedUnit});  


        // Reset the form fields
        setSelectedCategory('');
        setSelectedUnit('');
        setValues({
          code: '',
          itemName: '',
          
        });
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        // Navigate to 'Item-list' after the alert is closed
         //For the toast message
         Swal.fire({
          position: "center",
          icon: "success",
          title: "Item has been Updated",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate('/home/item-list');
      });
      
  };

  //Handle Cancel 
  const handleCancel = () => { 
    navigate(`/home/item-list`);
  };
  

  if (loading) {
    // You can render a loading indicator or a message here
    return <div>Loading...</div>;
  }
  
  else{
    return (
      <div>
        <form onSubmit={handleSubmit}>
                  <h2>Update Item</h2>
  
                  <div className='mb-2 col-md-3'>
                      <label htmlFor="ItemCode">Item Code</label>
                      
                      <input 
                        type="text" 
                        name='code' 
                        placeholder='Enter Item Code' 
                        className='form-control'
                        onChange={handleInputChange} 
                        value={values.code}
                        required/>
                        
                  </div>
  
                  <div className='mb-2 col-md-3'>
                      <label htmlFor="ItemName">Item name</label>
                      <input 
                        type="text" 
                        name='itemName' 
                        placeholder='Enter Item Name' 
                        className='form-control'
                        onChange={handleInputChange} 
                        value={values.itemName}
                        required/>
                        
                  </div>
                  
                  <div className='mb-2 col-md-3'>
                      <label htmlFor="Cateogory">Category</label>
                      <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        defaultValue={categoryOptions[2]}
                        onChange={handleCategoryChange}
                        placeholder="Select a category"
                        name= 'categoryId'
                        
                      />
                      
                  </div>
  
                  <div className='mb-2 col-md-3'>
                      <label htmlFor="UnitId">Unit ID</label>
                      <Select
                        options={unitOptions}
                        //value={{ value: selectedUnit.ID, label: selectedUnit.Description }}
                        value={selectedUnit}
                        //defaultValue={selectedUnit.Description}
                        //clearValue={!selectedUnit.value} // clear value if undefined
                        //defaultValue={{ value: defaultUnit.ID, label: defaultUnit.Description }}
                        onChange={handleUnitChange}
                        placeholder="Select a Unit"
                        name= 'unitId'
                        
                      />
  
                  </div>
                  
  
                  <button type="submit" className='btn btn-success' style={{ marginRight: '20px' }}>Update</button>
                  <button className='btn btn-danger' onClick={handleCancel}>Cancel</button>
  
              </form>
      </div>
    );

  }

  
}

export default ItemUpdate;
