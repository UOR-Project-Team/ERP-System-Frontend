import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function ItemList() {

  const [Item, setItems] = useState([]);
  const [isBlur , setIsBlur] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {

    axios.get('http://localhost:8081/item/show')
      .then(response => {
        setItems(response.data.Item);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures useEffect runs once on mount



  const toggleBlur = (shouldBlur) => {
    setIsBlur(shouldBlur);
  }

  const Alert = () => {
    return new Promise((resolve) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4AEF3C",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        resolve(result); // Resolve the result from Swal
      });
    });
  };


  //Handle delete 
  const handleDelete = (itemId) => {
    toggleBlur(true);
    Alert().then((result) => {
      toggleBlur(false);
      if (result.isConfirmed) {

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item is Succesfully Deleted",
          showConfirmButton: false,
          timer: 1500
        });

        axios
          .delete(`http://localhost:8081/item/delete/${itemId}`)
          .then((res) => {
            console.log(res.data);
            axios
              .get("http://localhost:8081/item/show")
              .then((res) => setItems(res.data.Item))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.error("Error deleting item:", err));
      }
    });
  };

   //Handle Update 
   const handleUpdate = (itemId, categoryId, unitId) => {
    
    navigate(`/item-update/${itemId}/${categoryId}/${unitId}`);
  };




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
                  style={{ marginRight: '20px' }}
                  onClick={()=> handleUpdate(item.ID, item.Category_ID, item.Unit_ID)}>update   
                </button>

                <button type='button' className='btn btn-danger' onClick={()=> handleDelete(item.ID)}>Delete</button>
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
