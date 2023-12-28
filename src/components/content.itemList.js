import React, { useState, useEffect, useMemo } from 'react';
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
import validateItem from '../services/validate.item';
import categoryServices from '../services/services.category';
import unitServices from '../services/services.unit';

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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});//to set default value in category dropdown

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({});//to set default value in unit dropdown


  const navigate = useNavigate();


  useEffect(()=>{
    fetchItems();
  }, []);



  const [formData, setFormData] = useState({
    code:'',
    itemName: '',
    categoryDescription:'',
    unitDescription:''
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

  //fetch categories for the update form's category options
  const fetchCategoryOptions = async () => {
    try {
      const Categories = await categoryServices.getAllCategories();
      // Set categoryOptions state with fetched data
      setCategories(Categories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };


  //fetch units for the update form's unit options
  const fetchUnitOptions = async () => {
    try {
      const Units = await unitServices.getAllUnits();
      // Set unitOptions state with fetched data
      setUnits(Units);
    } catch (error) {
      console.error('Error fetching units:', error.message);
    }
  };


  // Memoize categoryOptions and unitOptions
  const categoryOptions = useMemo(() => (
    categories.map(category => ({
      value: category.ID,
      label: category.Description,
    }))
  ), [categories]);

  const unitOptions = useMemo(() => (
    units.map(unit => ({
      value: unit.ID,
      label: unit.Description,
    }))
  ), [units]);



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

        fetchItem(currentItem);
        fetchCategoryOptions();
        fetchUnitOptions();
        console.log(formData.Description);
        console.log(getCategoryIdFromDescription(formData.categoryDescription));
        
      };

    const exportPDF = () => {
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";
        const doc = new jsPDF(orientation, unit, size);

      const header = function(data) {
            doc.setFontSize(8);
            doc.setTextColor(40);
            doc.text("Innova ERP Solution - Item Report", data.settings.margin.left, 30);
      };

      const footer = function(data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };

    const headers = [["ID", "Code","Item Name","Category","Unit"]];

   
    const data = Item.map(elt=> [elt.ID, elt.Code, elt.Name , elt.CategoryName, elt.UnitName,]);

    
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
      doc.save("ERP-item-report.pdf");
    };
  
  const exportCSV = () => {
      const headers = ["ID", "Code","Item Name","Category","Unit"];
    
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
      link.setAttribute('download', 'ERP-Item-report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDialogOpen(false);
    };


  const toggleBlur = (shouldBlur) => {
    setIsBlur(shouldBlur);
  }


  const fetchItem = () => {
    const foundItem = Item.find((item) => item.ID === currentItem);
    console.log(foundItem);

    if (foundItem) {
      setFormData({
        code: foundItem.Code || '',
        itemName: foundItem.Name || '',
        categoryDescription: foundItem.CategoryName || '',
        unitDescription: foundItem.UnitName || '',
        
      });
      
      //for setting the default selected category and unit for update form Autocomplete dropdown menu
      //const selectedCategoryOption = categoryOptions.find(option => option.label === foundItem.CategoryName) || { value: '', label: '' };
      //const selectedUnitOption = unitOptions.find(option => option.label === foundItem.UnitName ) || { value: '', label: '' };
      //console.log('Selected Category: ',selectedCategoryOption);

      //setSelectedCategory(selectedCategoryOption);
      //setSelectedUnit(selectedUnitOption);
      

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


  //handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevValues)=>({
      ...prevValues,
      [name]: value,
    }));
  };

  //For validation error messages
  const [errorMessage, setErrorMessage] = useState({
    code: '',
    itemName: '',
    categoryDescription: '',
    unitDescription: '',
  })



  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateItem(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      toast.error(`Check the inputs again`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return
    }

    try {
      const unitId = getUnitIdFromDescription(formData.unitDescription);
      const categoryId = getCategoryIdFromDescription(formData.categoryDescription);
    
      const submitItemData = {
        code: formData.code,
        itemName: formData.itemName,
        categoryId: categoryId,
        unitId: unitId,
      }

      const response = await itemServices.updateItem(currentItem, submitItemData)
      fetchItems();
      setIsModalOpen(false);
      toast.success('Successfully Updated', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      
      console.log('Item updated:', response);
      handleReset();

    } catch(error) {
      console.error('Error Updating item:', error.message);
      toast.error('Error Updating item', {
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

  };



  const handleReset = () => {
    setFormData((prevValues) => ({
      code:'',
      itemName:'',
      categoryDescription:'',
      unitDescription:''
    }));

    setErrorMessage({
      code: '',
      itemName: '',
      categoryDescription: '',
      unitDescription: '',
    });
  };


  const getUnitIdFromDescription = (description) => {
    const unit = units.find((unit) => unit.Description === description);
    return unit ? unit.ID : null;
  }

  const getCategoryIdFromDescription = (description) => {
    const category = categories.find((category) => category.Description === description);
    return category ? category.ID : null;
  };




  const filterContent = (items, searchTerm) => {
    const result = items.filter((item) => {
      const values = Object.values(item).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
  
      return regex.test(values);
    });

    setItems(result);
  };


  const handleSearchInputChange = async (e) => {
    e.preventDefault();
  
    try {
  
      if (searchInput === '') {
        
        await fetchItems();
  
      } else {
        const res = await itemServices.getAllItems();
        if(res) {
          filterContent(res , searchInput);
        }
         
       
      }
    }catch(error){
      console.error('Error handling search input',error.message)
    }
    };
  


  return (
    <div>
      
      <ToastContainer />
      <div className='master-content'>
          <div className='search-container'>
            <input type="text" placeholder='Explore the possibilities...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button onClick={handleSearchInputChange}><img src={SearchLogo} alt="Search Logo"/></button>
          </div>
      </div> 
      <div className='master-content'>
        <div className='features-panel'>
          <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
          <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
          <button onClick={() => {setIsModalOpen(true); setModelContent('filter')}}><img src={FilterLogo} alt="Filter Logo" /></button>
        </div>
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

      <div className='categorylist-addbutton-container'>
            <Link to = "/home/item-master">
                <button className='categorylist-addbutton'>Add Item</button>

            </Link>
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


      <Modal
                 isOpen={isModalOpen}
                 onRequestClose={() => {setIsModalOpen(false)}}
                 contentLabel="Header-Model"
                 className="modal-contents"
                 overlayClassName="modal-overlays"
            >
                {modelContent === "edit" ? (
                    
                    <div className='edit-model'>
                      <h3>Update Item</h3>
                     
                      <form className='form-container'>
                      <h3>Item Details</h3>
          <TextField className='text-line-type1' name='code' value={formData.code} onChange={(e) => handleInputChange(e)} label="Item Code" variant="outlined"  />
          <label className='error-text'>{errorMessage.code}</label>       
          <TextField className='text-line-type1' name='itemName' value={formData.itemName} onChange={(e) => handleInputChange(e)} label="Item Name" variant="outlined" />
          <label className='error-text'>{errorMessage.itemName}</label>

          <h3>Category Details</h3>
          <Autocomplete
            disablePortal
            className='text-line-type2'
            options={categoryOptions}
            //defaultValue={{value: getCategoryIdFromDescription(formData.categoryDescription), label: formData.categoryDescription}}
            //defaultValue={selectedCategory}
            
            //defaultValue={itemInfo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                name='categoryDescription' 
                value={formData.categoryDescription}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            )}
            onChange={(_, newValue) => {
              setFormData((prevData) => ({ ...prevData, categoryDescription: newValue?.label || '' }));
            }}
            value={formData.categoryDescription}
          />
          <label className='error-text'>{errorMessage.categoryDescription}</label>

          <h3>Unit Details</h3>
          <Autocomplete
            disablePortal
            className='text-line-type2'
            options={unitOptions}
            //defaultValue={selectedUnit}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Unit"
                name='unitDescription' 
                value={formData.unitDescription}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            )}
            onChange={(_, newValue) => {
              setFormData((prevData) => ({ ...prevData, unitDescription: newValue?.label || '' }));
            }}
            value={formData.unitDescription}
          />
          <label className='error-text'>{errorMessage.unitDescription}</label>

          <div className='button-container'>
          <button type='submit' class='submit-button' onClick={handleUpdateSubmit}>Update</button>
            <button type='reset' class='reset-button' onClick={handleReset}>Reset</button>
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

export default ItemList;
