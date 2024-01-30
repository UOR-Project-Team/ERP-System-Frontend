import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from 'react-modal';
import "jspdf-autotable";
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { ToastContainer } from 'react-toastify';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import AddLogo from './../assets/icons/add.png';
import SearchLogo from './../assets/icons/search.png';
import EditLogo from './../assets/icons/edit.png';
import ActionLogo from './../assets/icons/action.png';
import DeleteLogo from './../assets/icons/delete.png';
import ItemLogo from './../assets/icons/item.png';
import categoryServices from '../services/services.category';
import TextField from '@mui/material/TextField';
import validateCategory from '../services/validate.category';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';

function CategoryList({updateHeaderText}) {

  const { userTokenData } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);


  const navigateTo = useNavigate();

  const [formData , setFormData] = useState({
    ID:'',
    Description:''
  });

  const [formResetData , setFormResetData] = useState({
    ID:'',
    Description:''
  });

  const [errorMessage , setErrorMessage] = useState({
    ID:'',
    Description:''
  });

  useEffect(() => {
    updateHeaderText('Category List');
    fetchCategories();
  }, [updateHeaderText]);

  const fetchCategories = async () => {
    try {
      const categoryData = await categoryServices.getAllCategories();
      setCategories(categoryData);
      setSearchInput('');
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const filterContent = (categories, searchTerm) => {
    const result = categories.filter((category) => {
      const values = Object.values(category).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
  
      return regex.test(values);
    });

    setCategories(result);
  };

  const handleSearchInputChange = async (e) => {
    e.preventDefault();
    try {
      if (searchInput === '') {
        await fetchCategories();
      } else {
        const res = await categoryServices.getAllCategories();
        if (res) {
          filterContent(res, searchInput);
        }
      }
    } catch (error) {
      console.error('Error handling search input', error.message);
    }
  };

  const handleDialogAction = async () => {
    if(dialogTitle === 'PDF Exporter') {
      exportPDF();
    } else if(dialogTitle === 'CSV Exporter') {
      exportCSV();
    } else if(dialogTitle === 'Delete Category') {
      try {
        await categoryServices.deleteCategory(currentCategory);
        fetchCategories();
        setDialogOpen(false);  
        showSuccessToast('Category successfully deleted');
      } catch (error) {
        console.error('Error deleting category:', error.message);
        showErrorToast('Error deleting category');
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


  const handleChanges = (e) => {
    const { name , value } = e.target;
    setFormData((prevdata) => ({...prevdata , [name]: value}));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCategory(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      showErrorToast('Check the inputs again');
      return
    }

    try {
      const response = await categoryServices.updateCategory(currentCategory, formData)
      fetchCategories();
      setIsModalOpen(false);
      showSuccessToast('Category successfully updted')
      console.log('Category updated:', response);
      handleUpdateReset();

    } catch(error) {
      console.error('Error Updating category:', error.message);
      showErrorToast('Error updating category');
    }

  };

  const fetchCategory = () => {
    const foundCategory = categories.find((category) => category.ID === currentCategory);
  
    if (foundCategory) {
      setFormData({
        Description: foundCategory.Description || '',
      });
      setFormResetData({
        Description: foundCategory.Description || '',
      })
    } else {
      console.log("Category not found");
      showErrorToast('Category not found')
    }
  }

  const handleUpdateReset = () => {
    setFormData(() => ({
      Description: formResetData.Description,
    }));
    setErrorMessage({
      Description: '',
    });
  };

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
    const pdf = new jsPDF(orientation, unit, size);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const qrCodeData = `Date: ${formattedDate}\nTime: ${formattedTime}\nUser: ${userTokenData.fullname}`;
    const qr = QRCode(0, 'L');
    qr.addData(qrCodeData);
    qr.make();
    const qrCodeImage = qr.createDataURL();

    const noteHeader = "CATEGORY LIST"

    function headerText(){
      pdf.setFont('helvetica', 'bold'); 
      pdf.setFontSize(20); 
      pdf.setTextColor(40);
      }

    function pdftext2(){
      pdf.setFont('times', 'regular');
      pdf.setFontSize(12); 
      pdf.setTextColor(40);
      } 

    function footerText(){
      pdf.setFont('crimson text', 'regular');
      pdf.setFontSize(10); 
      pdf.setTextColor(40);
  } 

         
    const headerLeft = function(data) {
      pdf.setFontSize(8);
      pdf.setTextColor(40);
      pdf.addImage(CompanyLogo, 'PNG' , 40,20,70,70);
      headerText();
      pdf.text('UNI MART' , 115 , 35);
      pdftext2();
      pdf.text('University Of Ruhuna' , 115 , 50);
      pdf.text('Wellamadama' , 115 , 63);
      pdf.text('Matara' , 115 , 76);
      pdf.text('0372222222' , 115 , 89);
    };

    const headerRight = function(data) {
      headerText();
      pdf.text(noteHeader , 638 , 35);
      pdf.addImage(qrCodeImage, 'JPEG', 635, 37, 60, 60);
      pdftext2();
      pdf.text(`${userTokenData.fullname}`, 700, 55);
      pdf.text(`${formattedDate}`, 700, 70);
      pdf.text(`${formattedTime}`, 700, 85);
     };

    const footer = function(data) {
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.line(20, pdf.internal.pageSize.height-30, pdf.internal.pageSize.width-20, pdf.internal.pageSize.height-30);
      footerText();
      pdf.text("©INNOVA ERP Solutions. All rights reserved.",320,pdf.internal.pageSize.height-20);
      pdf.text("Wellamadama, Matara , 0412223334",342,pdf.internal.pageSize.height-10)
      pdf.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, pdf.internal.pageSize.height - 15);
    };

    const headers = [[ "ID", "Description"]];
    const data = categories.map(elt=> [ elt.ID, elt.Description]);

    let content = {
      startY: 150,
      head: headers,
      body: data
    };

    pdf.autoTable({
      ...content,
      theme: 'striped',
      styles: {
        head: { fillColor: [38, 2, 97], textColor: [255, 255, 255] }, 
        body: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, 
      },
      columnStyles: {
        0: { columnWidth: 300 },      
      },
      addPageContent: function(data) {
          headerLeft(data);
          headerRight(data);
          pdf.line(20, 120, pdf.internal.pageSize.width-20, 120);
          footer(data);
      }
    });
  
    setDialogOpen(false);
    pdf.save("ERP-category-report.pdf");
  };

  const exportCSV = () => {
    const headers = ["ID", "Description"];
  
    const data = categories.map(elt => [
      elt.ID,
      elt.Description,
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

  return(
    <div>
      <div className='list-container'>
      <ToastContainer />
        <div className='list-content-top'>
          <div className='button-container'>
            <button onClick={() => {navigateTo(`/home/category-master`); updateHeaderText('Category Master');}}><img src={AddLogo} alt='Add Logo'/><span>Add Category</span></button>
          </div>
          <div className='search-container'>
            <form>
              <input
                type="text"
                placeholder='Explore the possibilities...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchInputChange(e);
                  }
                }}
              />
              <button onClick={(e) => handleSearchInputChange(e)}><img src={SearchLogo} alt="Search Logo"/></button>
            </form>
          </div>
        </div>
        <div className='list-content'>
          <div className='features-panel'>
            <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
            <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
          </div>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th className='action-column'></th>
                </tr>
              </thead>
              <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                </tr>
              ) : (
                  categories.map((category)  =>(
                    <tr key={category.ID}>
                      <td>{category.ID}</td>
                      <td>{category.Description}</td>
                      <td>
                        <button onClick={(event) => { handleClick(event); setCurrentCategory(category.ID); }}>
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
      </div>

      <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} >
        <MenuItem>
          <button onClick={() => {navigateTo(`/home/item-list/category/${currentCategory}`); updateHeaderText('Item List')}}>
            <img src={ItemLogo} alt='Item Logo' />
            <span>View Items</span>
          </button>         
        </MenuItem>
        <MenuItem>
          <button onClick={() => {fetchCategory(); handleRequest('edit');}}>
            <img src={EditLogo} alt='Edit Logo' />
            <span>Edit Category</span>
          </button>         
        </MenuItem>
        <MenuItem onClick={() => {setDialogTitle('Delete Category'); setDialogDescription('Do you want to delete this category record?'); setDialogOpen(true); setAnchorEl(null);}}>
          <button>
            <img src={DeleteLogo} alt="Delete Logo"/>
            <span>Delete Category</span>
          </button>
        </MenuItem>
      </Menu>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {setIsModalOpen(false)}}
        contentLabel="Header-Model"
        className="modal-contents"
        overlayClassName="modal-overlays"
      >
        {modelContent === "edit" ? (
            
            <div className='edit-model'>
              <h3>Update Category</h3>
              
              <form className='form-container'>
                <h3>Category Details</h3>
                
                    <TextField className='text-line-type1' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant='outlined' />
                    <label className='error-text'>{errorMessage.Description}</label>
                    <div className='button-container'>
                          <button type='submit' className='submit-button' onClick={handleUpdateSubmit}>Submit</button>
                          <button type='reset' className='reset-button' onClick={handleUpdateReset}>Reset</button>
                    </div>
                </form>
            </div>
                      
        ) : (
            <p>Error Occured while loading the component</p>
        ) 
      }   
      </Modal>

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

export default CategoryList;