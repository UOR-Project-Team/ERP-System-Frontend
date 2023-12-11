import axios from 'axios';
import React, { useState } from 'react';

function ItemMaster() {

  const[values,setValues]=useState({
    code:'p01',
    itemName:'Lux Soap 100g',
    //Supplier_id:'',
    //Unit_price:'',
    categoryId:'1',
    unitId:'1'

  })


  const handleSubmit=(e)=>{
    e.preventDefault();
    axios.post('http://localhost:8081/item/create',values)
    .then(res=>{
        console.log(res);
        //navigate('/')
    })
    .catch(err=>console.log(err))
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues)=>({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
                <h2>Add Item</h2>

                <div className='mb-2'>
                    <label htmlFor="ItemCode">Item Code</label>
                    {/* <input type="text" placeholder='Enter Item Code' className='form-control'
                    onChange={e=>setValues({...values, code:e.target.value})} value={values.code}/> */}
                    <input 
                      type="text" 
                      name='code' 
                      placeholder='Enter Item Code' 
                      className='form-control'
                      onChange={handleInputChange} 
                      value={values.code}/>
                </div>

                <div className='mb-2'>
                    <label htmlFor="ItemName">Item name</label>
                    <input 
                      type="text" 
                      name='itemName' 
                      placeholder='Enter Item Name' 
                      className='form-control'
                      onChange={handleInputChange} 
                      value={values.itemName}/>
                </div>
                
                <div className='mb-2'>
                    <label htmlFor="CateogoryId">Category ID</label>
                    <input 
                      type="text" 
                      name='categoryId' 
                      placeholder='Enter Category ID' 
                      className='form-control'
                      onChange={handleInputChange} 
                      value={values.categoryId}/>
                </div>

                <div className='mb-2'>
                    <label htmlFor="UnitId">Unit ID</label>
                    <input 
                      type="text" 
                      name='unitId' 
                      placeholder='Enter Unit ID' 
                      className='form-control'
                      onChange={handleInputChange} 
                      value={values.unitId}/>
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
