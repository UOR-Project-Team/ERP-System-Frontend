import React, { useState, useMemo , useEffect} from 'react';
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
import SupplierItemList from './lists.itemsBySupplierID';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';

function ItemList({updateHeaderText}) {

  const { userTokenData } = useUser();
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

  const navigateTo = useNavigate();

  const [fetchFlag, setFetchFlag] = useState({
    flag: '',
    id: 0
  });

  const [formData, setFormData] = useState({
    code: '',
    itemName: '',
    categoryDescription: '',
    unitDescription: '',
    supplierName: '',
    reorderLevel:'',
    reorderQuantity:''
  });

  const [formResetData, setFormResetData] = useState({
    code:'',
    itemName: '',
    categoryDescription:'',
    unitDescription:'',
    supplierName:'',
    reorderLevel:'',
    reorderQuantity:''
  });

  const [errorMessage, setErrorMessage] = useState({
    code: '',
    itemName: '',
    categoryDescription: '',
    unitDescription: '',
    supplierName:'',
    reorderLevel:'',
    reorderQuantity:''
  })

  useEffect(() => {
    updateHeaderText('Item List');
    fetchItems('all');
  }, [updateHeaderText]);
  
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
      } else if(flag === 'supplier') {
        itemData= await itemServices.getItemsBySupplierFilter(id);
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
        itemData = await itemServices.getItemsByUnitFilter(fetchFlag.id);
      } else if(fetchFlag.flag === 'category') {
        itemData = await itemServices.getItemsByCategoryFilter(fetchFlag.id);
      } else if(fetchFlag.flag === 'supplier') {
        itemData= await itemServices.getItemsBySupplierFilter(fetchFlag.id);
      } else {
        itemData = await itemServices.getAllItems();
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
    const pdf = new jsPDF(orientation, unit, size);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const qrCodeData = `Date: ${formattedDate}\nTime: ${formattedTime}\nUser: ${userTokenData.fullname}`;
    const qr = QRCode(0, 'L');
    qr.addData(qrCodeData);
    qr.make();
    const qrCodeImage = qr.createDataURL();

    const noteHeader = "ITEM LIST"

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

    const headers = [["ID", "Code","Item Name","Category","Unit"]];
    const data = Item.map(elt=> [elt.ID, elt.Code, elt.Name , elt.CategoryName, elt.UnitName,]);

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
      addPageContent: function(data) {
          headerRight(data);
          headerLeft(data);
          pdf.line(20, 120, pdf.internal.pageSize.width-20, 120);
          footer(data);
      }
    });
    setDialogOpen(false);
    pdf.save("ERP-item-report.pdf");
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
        supplierName: foundItem.SupplierName||'',
        reorderLevel: foundItem.Reorder_Level||'',
        reorderQuantity: foundItem.Reorder_Quantity||''
        
      });
      setFormResetData({
        code: foundItem.Code || '',
        itemName: foundItem.Name || '',
        categoryDescription: foundItem.CategoryName || '',
        unitDescription: foundItem.UnitName || '',
        supplierName: foundItem.SupplierName||'',
        reorderLevel: foundItem.Reorder_Level||'',
        reorderQuantity: foundItem.Reorder_Quantity||''
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
      supplierId: supplierId,
      reorderLevel: formData.reorderLevel,
      reorderQuantity: formData.reorderQuantity

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
      <div className='list-container'>
      <ToastContainer />
      <div className='list-content-top'>
        <div className='button-container'>
          <button onClick={() => {navigateTo(`/home/item-master`); updateHeaderText('Item Master');}}><img src={AddLogo} alt='Add Logo'/><span>Add Item</span></button>
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
          </div>
        </div>
        <div className='table-container'>
          <Routes>
            <Route path="/" element={<AllItemList Item={Item} fetchItems={fetchItems} handleActionClick={handleActionClick} />} />
            <Route path="/unit/:id" element={<UnitItemList Item={Item} fetchItems={fetchItems} handleActionClick={handleActionClick} />} />
            <Route path="/category/:id" element={<CategoryItemList Item={Item} fetchItems={fetchItems} handleActionClick={handleActionClick} />} />
            <Route path="/supplier/:id" element={<SupplierItemList Item={Item} fetchItems={fetchItems} handleActionClick={handleActionClick} />} />
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                name='categoryDescription' 
                value={formData.categoryDescription}

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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Unit"
                name='unitDescription' 
                value={formData.unitDescription}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier"
                name='supplierName' 
                value={formData.supplierName}

              />
            )}
            onChange={(_, newValue) => {
              setFormData((prevData) => ({ ...prevData, supplierName: newValue?.label || '' }));
            }}
            value={formData.supplierName}
          />
          <label className='error-text'>{errorMessage.supplierName}</label>



          <h3>Reorder Details</h3>
          <div className='line-type2-container'>
            <div className='line-type2-content'>
              <TextField type="number" error={errorMessage.code ? true : false} className='text-line-type1' name='reorderLevel' value={formData.reorderLevel} onChange={(e) => handleInputChange(e)} label="Reorder Level" variant="outlined"  />
              <label className='error-text'>{errorMessage.reorderLevel}</label>
            </div>
            <div className='line-type2-content'>
              <TextField type="number" error={errorMessage.itemName ? true : false} className='text-line-type1' name='reorderQuantity' value={formData.reorderQuantity} onChange={(e) => handleInputChange(e)} label="Reorder Quantity" variant="outlined" />
              <label className='error-text'>{errorMessage.reorderQuantity}</label>
            </div>
          </div>


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
