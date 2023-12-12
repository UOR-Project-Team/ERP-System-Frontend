import React, { useEffect, useState } from "react";
import './categoryList.css'
import axios from 'axios';
import { Link } from "react-router-dom";

function CategoryList() {

  const [categories , setCategories] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:8081/category/show')
        .then(res => setCategories(res.data.categories))
        .catch(err => console.log(err));

    },[])


  return (
    <div>
      <div className='master-content'>
        <h2>Category List</h2>
       </div>
      <div id="table-container">
           <table >
                <thead>
                <tr>
                    <th >No</th>
                    <th>Category Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
               
               {
                categories && categories.map((category , i)=>(
                    <tr key = {i}>
                        <td>{category.ID}</td>
                        <td>{category.Description}</td>
                        <td>
                            <button id = "update">Update</button>
                            <button id = "delete">Delete</button>
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
