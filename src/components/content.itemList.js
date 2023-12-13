import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ItemList() {

  const [Item, setItem] = useState([]);
  
  useEffect(() => {

    axios.get('http://localhost:8081/item/show')
      .then(response => {
        setItem(response.data.Item);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures useEffect runs once on mount


  return (
    <div>
      <h2>Item Information</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Category ID</th>
            <th>Unit ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        
        {Array.isArray(Item) && Item.length > 0 ? (
          Item.map((item,index) => (
            <tr key={index}>
              <td>{item.ID}</td>
              <td>{item.Code}</td>
              <td>{item.Name }</td>
              <td>{item.Category_ID }</td>
              <td>{item.Unit_ID }</td>
              
              <td>
                <button 
                  type='button' 
                  className='btn btn-success' 
                  style={{ marginRight: '20px' }}>update   
                </button>

                <button type='button' className='btn btn-danger'>Delete</button>
              </td>
              
            </tr>
          ))
        ):(
          <tr>
            <td colSpan="11">No Item data available</td>
          </tr>
        )}
        
        </tbody>
      </table>
    </div>
  )
}

export default ItemList;
