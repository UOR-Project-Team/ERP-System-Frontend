import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function ItemMaster() {

  const[values,setValues]=useState({
    code:'p01',
    itemName:'Lux Soap 100g',
    //Supplier_id:'',
    //Unit_price:'',
    categoryId:'1',
    unitId:'1'

  })

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  


  // Fetch categories from the server
  useEffect(() => {
    
    axios.get('http://localhost:8081/category/show') // Adjust the API endpoint based on your backend
      .then(response => {
        setCategories(response.data.categories);

      })
      .catch(error => {
        console.error('Error fetching category data:', error);
      });
  }, []);

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

  const [units, setUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

   // Fetch units from the server
   useEffect(() => {
    
    axios.get('http://localhost:8081/unit/get') // Adjust the API endpoint based on your backend
      .then(response => {
        setUnit(response.data.units);
      })
      .catch(error => {
        console.error('Error fetching units data:', error);
      });
  }, []);


  
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
    axios.post('http://localhost:8081/item/create', values)
      .then((res) => {
        console.log('Item Code:', values.code);
        console.log('Item Name:', values.itemName);
        console.log('Category ID:',{selectedCategory});
        console.log('Unit ID:', {selectedUnit});

        //For the toast message
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item has been saved",
          showConfirmButton: false,
          timer: 1000,
        });  


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
        navigate('/home/item-list');
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
                <h2>Add Item</h2>

                <div className='mb-2 col-md-3'>
                    <label htmlFor="ItemCode">Item Code</label>
                    {/* <input type="text" placeholder='Enter Item Code' className='form-control'
                    onChange={e=>setValues({...values, code:e.target.value})} value={values.code}/> */}
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
                      onChange={handleCategoryChange}
                      placeholder="Select a category"
                      name= 'categoryId'
                      
                    />
                    
                    {/* <input 
                      type="text" 
                      name='categoryId' 
                      placeholder='Enter Category ID' 
                      className='form-control'
                      onChange={handleInputChange} 
                      value={values.categoryId}/> */}
                </div>

                <div className='mb-2 col-md-3'>
                    <label htmlFor="UnitId">Unit ID</label>
                    <Select
                      options={unitOptions}
                      value={selectedUnit}
                      onChange={handleUnitChange}
                      placeholder="Select a Unit"
                      name= 'unitId'
                      
                    />


                    {/* <input 
                      type="text" 
                      name='unitId' 
                      placeholder='Enter Unit ID' 
                      className='form-control'
                      onChange={handleInputChange} 
                      value={values.unitId}/> */}
                </div>


                {/* <div className='mb-2'>
                    <label htmlFor="">Supplier</label>
                    <input type="text" placeholder='Enter Supplier' className='form-control'
                    onChange={e=>setValues({...values, Supplier_id:e.target.value})}/>
                </div> */}

                {/* <div className='mb-2'>
                    <label htmlFor="">Unit Price</label>
                    <input type="text" placeholder='Enter unit price ' className='form-control'
                    onChange={e=>setValues({...values, Unit_price:e.target.value})}/>
                </div> */}

                

                <button className='btn btn-success'>Save</button>

            </form>
    </div>
  );
}

export default ItemMaster;
