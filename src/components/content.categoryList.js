import React, { useEffect, useState } from 'react';
import './categoryList.css'
import axios from 'axios';
import { Link } from "react-router-dom";

function CategoryList() {

  const [category , setcategory] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:8081/')
        .then(res => setcategory(res.data))
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

                </tbody>
               
               {
                category.map((data , i)=>(
                    <tr key = {i}>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td>
                            <button id = "update">Update</button>
                            <button id = "delete">Delete</button>
                        </td>
                    </tr>
                ))
               }
            </table>


           <Link to = "/Create">
            <button id="add" >Add Category</button>

            </Link>
    </div>
  );
}

export default CategoryList;
