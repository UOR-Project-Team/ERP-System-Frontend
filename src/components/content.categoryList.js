import React, { useEffect, useState } from 'react';
import './categoryList.css'
import axios from 'axios';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function CategoryList() {

  const [categories , setCategories] = useState([])
  const [isBlur , setIsBlur] = useState(false);


    useEffect(()=>{
        axios.get('http://localhost:8081/category/show')
        .then(res => setCategories(res.data.categories))
        .catch(err => console.log(err));

    },[]);

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
          resolve(result);
        });
      });
    };

    const handleDelete = (categoryId) => {
      toggleBlur(true);
      Alert().then((result) => {
        toggleBlur(false);
        if (result.isConfirmed) {

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Category Succesfully Deleted",
            showConfirmButton: false,
            timer: 1500
          });

          axios
            .delete(`http://localhost:8081/category/delete/${categoryId}`)
            .then((res) => {
              console.log(res.data);
              axios
                .get("http://localhost:8081/category/show")
                .then((res) => setCategories(res.data.categories))
                .catch((err) => console.log(err));
            })
            .catch((err) => console.error("Error deleting category:", err));
        }
      });
    };


  return (
    <div className={isBlur ? 'blur-background' : ''}>
      <div className='master-content'>
        <h2>Category List</h2>
       </div>
      <div id="table-container">
           <table id='table'>
                <thead>
                <tr>
                    <th id='tabel-head' >No</th>
                    <th id='tabel-head'>Category Name</th>
                    <th id='tabel-head'>Action</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
               
               {
                categories && categories.map((category , i)=>(
                    <tr id='tabel-row' key = {i}>
                        <td id='tabel-data'>{category.ID}</td>
                        <td id='tabel-data'>{category.Description}</td>
                        <td id='tabel-data'>
                            <button id = "update">Update</button>
                            <button id = "delete" onClick={()=> handleDelete(category.ID)}>Delete</button>
                        </td>
                    </tr>
                ))
               }
           </table>
      </div>
      <div id="button-container">
            <Link to = "/home/category-master">
                <button id="add" >Add Category</button>

            </Link>
      </div>
      

         
   </div>
  );
              }

export default CategoryList;
