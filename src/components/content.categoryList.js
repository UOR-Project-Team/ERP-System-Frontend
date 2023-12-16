import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link , useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';

import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import SearchLogo from './../assets/icons/search.png';
import ActionLogo from './../assets/icons/action.png';



function CategoryList() {

  const [categories , setCategories] = useState([])
  const [isBlur , setIsBlur] = useState(false);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogSescription, setDialogDescription] = useState('');
  const navigate = useNavigate();


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
            timer: 1000
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

    const handleUpdate = (categoryId) => {
      
      navigate(`/home/update-category/${categoryId}`);
    };


  return (
    <div className={isBlur ? 'blur-background' : ''}>
      <div className='master-content'>
      <div className='search-container'>
            <input type="text" placeholder='Explore the possibilities...' />
            <button><img src={SearchLogo} alt="Search Logo"/></button>
          </div>
       </div>
       <div className='master-content'>
        <div className='features-panel'>
          <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
          <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
          <button><img src={FilterLogo} alt="Filter Logo" /></button>
        </div>
        
      <div className='table-container'>
           <table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Category Name</th>
                    <th>Action</th>
                    
                </tr>
                </thead>
                <tbody>

                
               
               {
                categories && categories.map((category , i)=>(
                    <tr key = {i}>
                        <td>{category.ID}</td>
                        <td>{category.Description}</td>
                        <td>
                            <button className='categorylist-updatebutton' onClick={()=> handleUpdate(category.ID)}>Update</button>
                            <button className='categorylist-deletebutton' onClick={()=> handleDelete(category.ID)}>Delete</button>
                        </td>
                       
                    </tr>
                ))
               }
               </tbody>
           </table>

      </div>
      
      </div>
      <div className='categorylist-addbutton-container'>
            <Link to = "/home/category-master">
                <button className='categorylist-addbutton'>Add Category</button>

            </Link>
      </div>
      <Dialog open={removeClick} onClose={() => setDialogOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{width: '250px'}}>
            {dialogSescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary">
            Yes
          </Button>
          <Button color="primary" autoFocus onClick={() => setDialogOpen(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>

         
   </div>

  );
 }

export default CategoryList;
