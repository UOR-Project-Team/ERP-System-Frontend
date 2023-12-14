import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function UnitList() {

  const [Unit, setUnits] = useState([]);
  const [isBlur , setIsBlur] = useState(false);
  
  useEffect(() => {

    axios.get('http://localhost:8081/unit/get')
      .then(response => {
        setUnits(response.data.units);
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
  const handleDelete = (unitId) => {
    toggleBlur(true);
    Alert().then((result) => {
      toggleBlur(false);
      if (result.isConfirmed) {

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Unit is Succesfully Deleted",
          showConfirmButton: false,
          timer: 1500
        });

        axios
          .delete(`http://localhost:8081/unit/delete/${unitId}`)
          .then((res) => {
            console.log(res.data);
            axios
              .get("http://localhost:8081/unit/get")
              .then((res) => setUnits(res.data.Unit))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.error("Error deleting unit:", err));
      }
    });
  };



  return (
    <div>
      <h2>Unit Information</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>SI</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        
        {Array.isArray(Unit) && Unit.length > 0 ? (
          Unit.map((unit,index) => (
            <tr key={index}>
              <td>{unit.ID}</td>
              <td>{unit.Description}</td>
              <td>{unit.SI }</td>

              
              <td>
                <button 
                  type='button' 
                  className='btn btn-success' 
                  style={{ marginRight: '20px' }}>update   
                </button>

                <button type='button' className='btn btn-danger' onClick={()=> handleDelete(unit.ID)}>Delete</button>
              </td>
              
            </tr>
          ))
        ):(
          <tr>
            <td colSpan="11">No Unit data available</td>
          </tr>
        )}
        
        </tbody>
      </table>
    </div>
  )
}

export default UnitList;
