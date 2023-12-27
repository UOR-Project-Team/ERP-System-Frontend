import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from 'react-modal';
import "jspdf-autotable";
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import SearchLogo from './../assets/icons/search.png';
import EditLogo from './../assets/icons/edit.png';
import ActionLogo from './../assets/icons/action.png';
import DeleteLogo from './../assets/icons/delete.png';
import itemServices from '../services/services.item';

function ItemList() {

  const [Item, setItems] = useState([]);
  const [isBlur , setIsBlur] = useState(false);


  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');

  const [searchInput, setSearchInput] = useState('');
    const [modelContent, setModelContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(0);

  const navigate = useNavigate();


  useEffect(()=>{
    fetchItems();
  }, []); // Empty dependency array ensures useEffect runs once on mount



  const [formData, setFormData] = useState({
    ID:'',
    Code:'',
    Name: '',
    CategoryName:'',
    UnitName:''
  });


  
  //fetch all items function
  const fetchItems = async ()=>{
    try{
      const itemData= await itemServices.getAllItems();
      console.log(itemData)
      //setItems(itemData);
      setItems([...itemData]);
    }
    catch(error)
    {
      console.error('Error fetching items',error.message);
    }
  }

  //delete item function
  const deleteItem = async (ItemId)=>{
    try{
      await itemServices.deleteItem(ItemId);

    }
    catch(error)
    {
      console.error('Error Deleting item',error.message);
    }

  }



  const handleDialogAction = async () => {
    if(dialogTitle === 'PDF Exporter') {
      exportPDF();
    } else if(dialogTitle === 'CSV Exporter') {
      exportCSV();
    } else if(dialogTitle === 'Delete Item') {
      try {
        await itemServices.deleteItem(currentItem);
        fetchItems();
        setDialogOpen(false);
        toast.success('Successfully Deleted', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });

        } catch (error) {
            console.error('Error deleting category:', error.message);
            toast.error('Error Occured', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        }
      };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

    const handleClose = () => {
        setAnchorEl(null);
      };

    const handleRequest = (type) => {
        setAnchorEl(null);
        setModelContent(type);
        setIsModalOpen(true);
      };

    const exportPDF = () => {
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";
        const doc = new jsPDF(orientation, unit, size);

      const header = function(data) {
            doc.setFontSize(8);
            doc.setTextColor(40);
            doc.text("Innova ERP Solution - Category Report", data.settings.margin.left, 30);
      };

      const footer = function(data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };

    const headers = [["ID", "Description"]];

   
    const data = Item.map(elt=> [elt.ID, elt.Description]);

    
    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.autoTable({
        ...content,
        theme: 'striped',
        headerStyles: { fillColor: [38, 2, 97], textColor: [255, 255, 255] },
        addPageContent: function(data) {
            header(data);
            footer(data);
        }
      });
  
      setDialogOpen(false);
      doc.save("ERP-category-report.pdf");
    };
  
  const exportCSV = () => {
      const headers = ["ID", "Description"];
    
      const data = Item.map(elt => [
        elt.ID,
        elt.Code,
        elt.Name ,
        elt.CategoryName, 
        elt.UnitName,
      ]);
    
      const csvData = [headers, ...data];
    
      const csv = Papa.unparse(csvData);
    
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', 'ERP-customer-report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDialogOpen(false);
    };





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



  //handle delete button click
  const handleDelete = async (itemId) => {
    toggleBlur(true);
  
    try {
      const result = await Alert();
      toggleBlur(false);
  
      if (result.isConfirmed) {
        await itemServices.deleteItem(itemId);
  
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item is Succesfully Deleted",
          showConfirmButton: false,
          timer: 1500
        });
  
        // Wait for the deletion to complete before fetching items
        await fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item', error.message);
      toggleBlur(false);
    }
  };
  

   //Handle Update 
   const handleUpdate = (itemId,itemCode,itemName, categoryId, unitId) => {
    
    console.log('Updating item:', itemId, itemCode, itemName, categoryId, unitId);
    navigate(`/home/item-update/${itemId}/${itemCode}/${itemName}/${categoryId}/${unitId}`);
    //navigate(`/home/item-update/${itemId,itemCode,itemName,categoryId,unitId}`);
    //navigate(`/home/item-update`);
  };

  const fetchItem = () => {
    const foundItem = Item.find((item) => item.ID === currentItem);
    

    if (foundItem) {
      setFormData({
        code: foundItem.Code || '',
        itemName: foundItem.Name || '',
        categoryId: foundItem.CategoryName || '',
        unitId: foundItem.UnitName || '',
        
      });
    } else {
      console.log("Item not found");
      toast.error('Item not found', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }



  return (
    <div>
      
      <ToastContainer />
      {/* <div className='master-content'>
          <div className='search-container'>
            <input type="text" placeholder='Explore the possibilities...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button onClick={handleSearchInputChange}><img src={SearchLogo} alt="Search Logo"/></button>
          </div>
      </div> */}
      <div className='master-content'>
        {/* <div className='features-panel'>
          <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
          <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
          <button onClick={() => {setIsModalOpen(true); setModelContent('filter')}}><img src={FilterLogo} alt="Filter Logo" /></button>
        </div> */}
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                
                <th className='action-column'></th>
              </tr>
            </thead>
            <tbody>
              {Item.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                </tr>
              ) : (
                Item.map((item) => (
                  <tr key={item.id}>
                    <td>{item.ID}</td>
                    <td>{item.Code}</td>
                    <td>{item.Name }</td>
                    <td>{item.CategoryName }</td>
                    <td>{item.UnitName }</td>

                    {/* <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                        onClick={()=> handleUpdate(item.ID, item.Code, item.Name, item.Category_ID, item.Unit_ID)}>
                          <img src={EditLogo} alt='Edit Logo' />
                        </button>

                        <button 
                          onClick={()=> handleDelete(item.ID)}>
                          <img src={DeleteLogo} alt='Delete Logo' />
                        </button>
                      </div>
                    </td> */}

                    <td>
                      <button onClick={(event) => { handleClick(event); setCurrentItem(item.ID); }}>
                        <img src={ActionLogo} alt='Action Logo' />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>



      <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} >
                <MenuItem>
                            <button onClick={() => {fetchItem(); handleRequest('edit');}}>
                            <img src={EditLogo} alt='Edit Logo' />
                            <span>Edit Item</span>
                            

                        </button>
                        
                </MenuItem>
                <MenuItem onClick={() => {setDialogTitle('Delete Item'); setDialogDescription('Do you want to delete this Item record?'); setDialogOpen(true); setAnchorEl(null);}}>
                <button>
                <img src={DeleteLogo} alt="Delete Logo"/>
                <span>Delete Item</span>
               </button>
                </MenuItem>
      </Menu>
        
      <Dialog open={removeClick} onClose={() => setDialogOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description" style={{width: '250px'}}>
              {dialogDescription}
              </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button color="primary" onClick={handleDialogAction}>
              Yes
              </Button>
              <Button color="primary" autoFocus onClick={() => setDialogOpen(false)}>
              No
              </Button>
              </DialogActions>
      </Dialog>
                      


    </div>
  )
}

export default ItemList;
