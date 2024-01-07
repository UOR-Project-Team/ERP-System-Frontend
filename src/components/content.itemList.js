import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from 'react-modal';
import "jspdf-autotable";
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import AddLogo from './../assets/icons/add.png';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import SearchLogo from './../assets/icons/search.png';
import EditLogo from './../assets/icons/edit.png';
import DeleteLogo from './../assets/icons/delete.png';
import itemServices from '../services/services.item';
import validateItem from '../services/validate.item';
import categoryServices from '../services/services.category';
import unitServices from '../services/services.unit';
import supplierServices from '../services/services.supplier';
import AllItemList from './lists.allItems';
import UnitItemList from './lists.itemsByUnitID';
import CategoryItemList from './lists.itemsByCategoryID';

function ItemList() {

  const [Item, setItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [fetchFlag, setFetchFlag] = useState({
    flag: '',
    id: 0
  });

  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    code: '',
    itemName: '',
    categoryDescription: '',
    unitDescription: '',
    supplierName: ''
  });

  const [formResetData, setFormResetData] = useState({
    code:'',
    itemName: '',
    categoryDescription:'',
    unitDescription:'',
    supplierName:''
  });

  const [errorMessage, setErrorMessage] = useState({
    code: '',
    itemName: '',
    categoryDescription: '',
    unitDescription: '',
    supplierName:''
  })
  
  //fetch all items function
  const fetchItems = async (flag, id)=>{
    let itemData = [];
    setFetchFlag({
      flag: flag,
      id: id
    })
    try{
      if (flag === 'unit') {
        itemData= await itemServices.getItemsByUnitFilter(id);
      } else if(flag === 'category') {
        itemData= await itemServices.getItemsByCategoryFilter(id);
      } else {
        itemData= await itemServices.getAllItems();
      }
      setItems([...itemData]);
    }
    catch(error)
    {
      console.error('Error fetching items',error.message);
    }
  }

  const fetchUpdatedItems = async ()=>{
    let itemData = [];
    try{
      if (fetchFlag.flag === 'unit') {
        itemData= await itemServices.getItemsByUnitFilter(fetchFlag.id);
      } else if(fetchFlag.flag === 'category') {
        itemData= await itemServices.getItemsByCategoryFilter(fetchFlag.id);
      } else {
        itemData= await itemServices.getAllItems();
      }
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

  //fetch units for the update form's unit options
  const fetchSupplierOptions = async () => {
    try {
      const Suppliers = await supplierServices.getAllSuppliers();
      // Set unitOptions state with fetched data
      setSuppliers(Suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
    }
  };

  // Memoize categoryOptions, unitOptions, supplierOptions
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

  const supplierOptions = useMemo(() => (
    suppliers.map(supplier => ({
      value: supplier.ID,
      label: supplier.Fullname,
    }))
  ), [suppliers]);

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
        showSuccessToast('Item successfully deleted');

      } catch (error) {
        console.error('Error deleting item:', error.message);
        showErrorToast('Error deleting item')
      }
    }
  };

  const handleActionClick = (event, item) => {
    handleClick(event); 
    setCurrentItem(item.ID);
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
    fetchSupplierOptions();
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

  const fetchItem = () => {
    const foundItem = Item.find((item) => item.ID === currentItem);

    if (foundItem) {
      setFormData({
        code: foundItem.Code || '',
        itemName: foundItem.Name || '',
        categoryDescription: foundItem.CategoryName || '',
        unitDescription: foundItem.UnitName || '',
        supplierName: foundItem.SupplierName||''
      });
      setFormResetData({
        code: foundItem.Code || '',
        itemName: foundItem.Name || '',
        categoryDescription: foundItem.CategoryName || '',
        unitDescription: foundItem.UnitName || '',
        supplierName: foundItem.SupplierName||''
      });
    } else {
      console.log("Item not found");
      showErrorToast('Item not found');
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const unitId = getUnitIdFromDescription(formData.unitDescription);
    const categoryId = getCategoryIdFromDescription(formData.categoryDescription);
    const supplierId = getSupplierIdFromName(formData.supplierName);

    const submitItemData = {
      code: formData.code,
      itemName: formData.itemName,
      categoryId: categoryId,
      unitId: unitId,
      supplierId: supplierId

    }
    console.log(submitItemData);

    const validationErrors = validateItem(formData);
    setErrorMessage(validationErrors);
    console.log(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      showErrorToast('Check the inputs again');
      return
    }

    try {
      const response = await itemServices.updateItem(currentItem, submitItemData)
      fetchUpdatedItems();
      setIsModalOpen(false);
      showSuccessToast('Item successfully updated');
      console.log('Item updated:', response);
      handleReset();
    } catch(error) {
      console.error('Error Updating item:', error.message);
      showErrorToast('Error updating item')
    }

  };

  const handleReset = () => {
    setFormData((prevValues) => ({
      code: formResetData.code,
      itemName: formResetData.itemName,
      categoryDescription: formResetData.categoryDescription,
      unitDescription: formResetData.unitDescription,
      supplierName: formResetData.supplierName,
    }));
    setErrorMessage({
      code: '',
      itemName: '',
      categoryDescription: '',
      unitDescription: '',
      supplierName: ''
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

  const getSupplierIdFromName = (name) => {
    const supplier = suppliers.find((supplier) => supplier.Fullname === name);
    return supplier ? supplier.ID : null;
  };

  const filterContent = (items, searchTerm) => {
    const result = items.filter((item) => {
      const values = Object.values(item).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
      return regex.test(values);
    });
    setItems(result);
  };

  const handleSearchInputChange = async () => {
    try {
      if (searchInput === '') {
        await fetchUpdatedItems();
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
      <div className='list-container'>
      <ToastContainer />
      <div className='list-content-top'>
        <div className='button-container'>
          <button onClick={() => {navigateTo(`/home/item-master`)}}><img src={AddLogo} alt='Add Logo'/><span>Add Item</span></button>
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
              <button onClick={handleSearchInputChange}><img src={SearchLogo} alt="Search Logo"/></button>
            </form>
          </div>
      </div>
      <div className='list-content'>
        <div className='features-panel-item'>
          <div className='text-container'>
          {fetchFlag.flag === 'unit' && (
            <label>Items filtered by UnitId: {fetchFlag.id}</label>
          )}
          {fetchFlag.flag === 'category' && (
            <label>Items filtered by categoryId: {fetchFlag.id}</label>
          )}
          </div>
          <div className='button-container'>
            <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
            <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
            <button onClick={() => {setIsModalOpen(true); setModelContent('filter')}}><img src={FilterLogo} alt="Filter Logo" /></button>
          </div>
        </div>
        <div className='table-container'>
          <Routes>
            <Route path="/" element={<AllItemList Item={Item} fetchItems={fetchItems} handleActionClick={handleActionClick} />} />
            <Route path="/unit/:id" element={<UnitItemList Item={Item} fetchItems={fetchItems} handleActionClick={handleActionClick} />} />
            <Route path="/category/:id" element={<CategoryItemList Item={Item} fetchItems={fetchItems} handleActionClick={handleActionClick} />} />
          </Routes>   
        </div>
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

          <h3>Supplier Details</h3>
          <Autocomplete
            disablePortal
            className='text-line-type2'
            options={supplierOptions}
            //defaultValue={selectedUnit}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier"
                name='supplierName' 
                value={formData.supplierName}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            )}
            onChange={(_, newValue) => {
              setFormData((prevData) => ({ ...prevData, supplierName: newValue?.label || '' }));
            }}
            value={formData.supplierName}
          />
          <label className='error-text'>{errorMessage.supplierName}</label>





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
