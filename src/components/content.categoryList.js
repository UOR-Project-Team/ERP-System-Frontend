import React, { useEffect, useState } from "react";
import './categoryList.css'
import axios from 'axios';
import { Link } from "react-router-dom";

function CategoryList() {

  const [Category , setcategory] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:8081/category/show')
        .then(res => setcategory(res.data.Category))
        .catch(err => console.log(err));

    },[])


  return (
    <div>
      <table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Category Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>

                {Array.isArray(Category) && Category.length > 0 ? (
                Category.map((data , i)=>(
                    <tr key = {i}>
                        <td>{data.ID}</td>
                        <td>{data.Description}</td>
                        <td>
                            <button id = "update">Update</button>
                            <button id = "delete">Delete</button>
                        </td>
                    </tr>
                ))
                ):(
                  <tr>
            <td colSpan="11">No Supplier data available</td>
          </tr>
                )
              }
                </tbody>
               
               
                
               
            </table>


           <Link to = "/Create">
            <button id="add" >Add Category</button>

            </Link>
    </div>
  );
}

export default CategoryList;
