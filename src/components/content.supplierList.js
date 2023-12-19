import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
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
import supplierServices from '../services/services.supplier';
import validateSupplier from '../services/validate.supplier';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";

function SupplierList() {

  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(0);

  const [fields, setFields] = useState({
    ID:true,
    Fullname: true,
    RegistrationNo: true,
    Email: true,
    ContactNo: false,
    Fax: true,
    Address: false,
    City: false,
    Description: true,
    VatNo: true,
    Credit: true,
    Status: true
    
  });

  const [tempFields, setTempFields] = useState({
    ID:true,
    Fullname: true,
    RegistrationNo: true,
    Email: true,
    ContactNo: false,
    Fax: true,
    Address: false,
    City: false,
    Description: true,
    VatNo: true,
    Credit: true,
    Status: true
  });

  const [formData , setFormData] = useState({
    Fullname:'',
    RegistrationNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    Address: '',
    City: '',
    Description: '',
    VatNo: '',
  });
  const [errorMessage , setErrorMessage] = useState({
    Fullname:'',
    RegistrationNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    Address: '',
    City: '',
    Description: '',
    VatNo: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const supplierData = await supplierServices.getAllSuppliers();
      setSuppliers(supplierData);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
    }
  };

  const filterContent = (suppliers, searchTerm) => {
    const result = suppliers.filter((supplier) => {
      const values = Object.values(supplier).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
  
      return regex.test(values);
    });
  
    setSuppliers(result);
  };

  const handleSearchInputChange = async (e) => {
    e.preventDefault();

    try {

        if (searchInput === '') {
          
          await fetchSuppliers();
    
        } else {
          const res = await supplierServices.getAllSuppliers();
          if(res) {
            filterContent(res , searchInput);
          }
           
         
        }
      }catch(error){
        console.error('Error handling search input',error.message)
      }
  };

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    setTempFields((prevFields) => ({
      ...prevFields,
      [name]: !prevFields[name],
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setFields({
      Fullname: tempFields.Fullname,
      RegistrationNo: tempFields.RegistrationNo,
      Email: tempFields.Email,
      ContactNo: tempFields.ContactNo,
      FAX: tempFields.Fax,
      Address: tempFields.Address,
      City: tempFields.City,
      Description: tempFields.Description,
      VATNo: tempFields.VatNo,
      Credit:tempFields.Credit,
      Status:tempFields.Status
      
    });
  }

  const handleDialogAction = async () => {
    if(dialogTitle === 'PDF Exporter') {
      exportPDF();
    } else if(dialogTitle === 'CSV Exporter') {
      exportCSV();
    } else if(dialogTitle === 'Delete Supplier') {
      try {
        await supplierServices.deleteSupplier(currentSupplier);
        setDialogOpen(false);
        fetchSuppliers();

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
        console.error('Error deleting supplier:', error.message);
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

  const handleChanges = (e) => {
    const { name , value } = e.target;
    setFormData((prevdata) => ({...prevdata , [name]: value}));
   };

   const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSupplier(formData);
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
            const response = await supplierServices.updateSupplier(currentSupplier, formData)
            fetchSuppliers();
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
            console.log('Supplier updated:', response);
            handleUpdateReset();

        } catch(error) {
            console.error('Error Updating supplier:', error.message);
            toast.error('Error Occured', {
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

        const fetchSupplier = () => {
            const foundSupplier = suppliers.find((supplier) => supplier.ID === currentSupplier);
        
            if (foundSupplier) {
              setFormData({
                Fullname: foundSupplier.Fullname || '',
                RegistrationNo: foundSupplier.RegistrationNo || '',
                Email: foundSupplier.Email || '',
                ContactNo: foundSupplier.ContactNo || '',
                FAX: foundSupplier.Fax || '',
                Address: foundSupplier.Address || '',
                City: foundSupplier.City || '',
                Description: foundSupplier.Description || '',
                VATNo: foundSupplier.VatNo || ''

              });
            } else {
              console.log("Supplier not found");
              toast.error('Error Occured', {
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
        
          const handleUpdateReset = () => {
            setFormData(() => ({
                Fullname:'',
                RegistrationNo: '',
                Email: '',
                ContactNo: '',
                Fax: '',
                Address: '',
                City: '',
                Description: '',
                VatNo: '',
            }));
            setErrorMessage({
                Fullname:'',
                RegistrationNo: '',
                Email: '',
                ContactNo: '',
                Fax: '',
                Address: '',
                City: '',
                Description: '',
                VatNo: '',
            });
          };
        

       

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
    const doc = new jsPDF(orientation, unit, size);

    // Header function
    const header = function(data) {
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text("Innova ERP Solution - Supplier Report", data.settings.margin.left, 30);
    };

    // Footer function
    const footer = function(data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };

    // Set table headers
    const headers = [["ID","Full Name", "Registratoin No", "Email", "Contact Number", "FAX", "Address", "City", "Description","VAT No","Credit"]];

    // Map customer data
    const data = suppliers.map(elt=> [elt.Fullname, elt.RegistrationNo, elt.Email, elt.ContactNo, elt.FAX, elt.Address, elt.City, elt.Description, elt.VATNo, elt.Credit]);

    // Set table content
    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    // Generate PDF with header, footer, and enhanced styling
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
    doc.save("ERP-supplier-report.pdf");
  };

  const exportCSV = () => {
    const headers = ["ID", "Full Name", "RegistrationNo", "Email", "ContactNo", "FAX", "Address", "City", "Description" , "VATNo" , "Credit"];
  
    const data = suppliers.map(elt => [
      elt.ID,
      elt.Fullname,
      elt.RegistrationNo,
      elt.Email,
      elt.ContactNo,
      elt.Fax,
      elt.Address,
      elt.City,
      elt.Description,
      elt.VatNo,
      elt.Credit
    ]);
  
    const csvData = [headers, ...data];
  
    const csv = Papa.unparse(csvData);
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'ERP-supplier-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDialogOpen(false);
  };




  return (
    <div>
      <ToastContainer />
      <div className='master-content'>
          <div className='search-container'>
            <input type="text" placeholder='Explore the possibilities...' value={searchInput} onChange={(e) =>  setSearchInput(e.target.value)} />
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
                <th style={{ display: fields.ID ? 'table-cell' : 'none' }}>ID</th>
                <th style={{ display: fields.Fullname ? 'table-cell' : 'none' }}>Full name</th>
                <th style={{ display: fields.RegistrationNo ? 'table-cell' : 'none' }}>Registration No</th>
                <th style={{ display: fields.Email ? 'table-cell' : 'none' }}>Email</th>
                <th style={{ display: fields.ContactNo ? 'table-cell' : 'none' }}>Contact No</th>
                <th style={{ display: fields.Fax ? 'table-cell' : 'none' }}>FAX</th>
                <th style={{ display: fields.Address ? 'table-cell' : 'none' }}>Address</th>
                <th style={{ display: fields.City ? 'table-cell' : 'none' }}>City</th>
                <th style={{ display: fields.Description ? 'table-cell' : 'none' }}>Description</th>
                <th style={{ display: fields.VatNo ? 'table-cell' : 'none' }}>VAT  No</th>
                <th style={{ display: fields.Credit ? 'table-cell' : 'none' }}>Credit</th>
                <th style={{ display: fields.Status ? 'table-cell' : 'none' }}>Status</th>


                <th className='action-column'></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                </tr>
              ) : (
               suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td style={{ display: fields.ID ? 'table-cell' : 'none' }}>{supplier.ID}</td>
                    <td style={{ display: fields.Fullname ? 'table-cell' : 'none' }}>{supplier.Fullname}</td>
                    <td style={{ display: fields.RegistrationNo ? 'table-cell' : 'none' }}>{supplier.RegistrationNo}</td>
                    <td style={{ display: fields.Email ? 'table-cell' : 'none' }}>{supplier.Email}</td>
                    <td style={{ display: fields.ContactNo ? 'table-cell' : 'none' }}>{supplier.ContactNo}</td>
                    <td style={{ display: fields.Fax ? 'table-cell' : 'none' }}>{supplier.Fax}</td>
                    <td style={{ display: fields.Address ? 'table-cell' : 'none' }}>{supplier.Address}</td>
                    <td style={{ display: fields.City ? 'table-cell' : 'none' }}>{supplier.City}</td>
                    <td style={{ display: fields.Description ? 'table-cell' : 'none' }}>{supplier.Description}</td>
                    <td style={{ display: fields.VatNo ? 'table-cell' : 'none' }}>{supplier.VatNo}</td>
                    <td style={{ display: fields.Credit ? 'table-cell' : 'none' }}>{supplier.Credit}</td>
                    <td style={{ display: fields.Status ? 'table-cell' : 'none' }}>
                        {supplier.Status === 0 ?(
                            <button type='button' className='btn btn-danger'>Inactive</button>
                        ) : (
                            <button type='button' className='btn btn-success'>Active</button>
                        )}
                        
                        </td>


                    <td>
                      <button onClick={(event) => { handleClick(event); setCurrentSupplier(supplier.ID); }}>
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
            <Link to = "/home/supplier-master">
                <button className='categorylist-addbutton'>Add Category</button>

            </Link>
            </div>

      <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>
          <button onClick={() => {fetchSupplier(); handleRequest('edit');}}>
            <img src={EditLogo} alt="Edit Logo"/>
            <span>Edit Supplier</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {setDialogTitle('Delete Supplier'); setDialogDescription('Do you want to delete this supplier record?'); setDialogOpen(true); setAnchorEl(null);}}>
          <button>
            <img src={DeleteLogo} alt="Delete Logo"/>
            <span>Delete Supplier</span>
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
          {modelContent === "filter" ? (
            <div className='feature-modal'>
              <h3>Table Filter</h3>
              <form onSubmit={handleFilterSubmit}>
                <div className='checkbox-container'>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Fullname' checked={tempFields.Fullname} onChange={handleCheckboxChange} />
                    <label>Fullname</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='RegistrationNo' checked={tempFields.RegistrationNo} onChange={handleCheckboxChange} />
                    <label>RegistrationNo</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Email' checked={tempFields.Email} onChange={handleCheckboxChange} />
                    <label>Email</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='ContactNo' checked={tempFields.ContactNo} onChange={handleCheckboxChange} />
                    <label>Cuntact Number</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Fax' checked={tempFields.Fax} onChange={handleCheckboxChange} />
                    <label>FAX</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Address' checked={tempFields.Address} onChange={handleCheckboxChange} />
                    <label>Address</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='City' checked={tempFields.City} onChange={handleCheckboxChange} />
                    <label>City</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Description' checked={tempFields.Description} onChange={handleCheckboxChange} />
                    <label>Description</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='VatNo' checked={tempFields.VatNo} onChange={handleCheckboxChange} />
                    <label>VAT No</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Credit' checked={tempFields.Credit} onChange={handleCheckboxChange} />
                    <label>Credit</label>
                  </div>
                </div>
                <button type='submit'>Filter</button>
              </form>
            </div>
          ) : modelContent === "edit" ? (
            <div className='edit-model'>
                 <h3>Update Supplier</h3>
                 <div className='master-content'>
        <form className='form-container'>
          <h3>Supplier Details</h3>
            <TextField className='text-line-type1' name='Fullname' value={formData.Fullname} onChange={(e) => handleChanges(e)} label="Full name" variant="outlined" />
            <label className='error-text'>{errorMessage.Fullname}</label>
            <TextField className='text-line-type1' name='RegistrationNo' value={formData.RegistrationNo} onChange={(e) => handleChanges(e)} label="Registration Number" variant="outlined" />
            <label className='error-text'>{errorMessage.RegistrationNo}</label>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant="outlined" />
                <label className='error-text'>{errorMessage.Description}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='VatNo' value={formData.VatNo} onChange={(e) => handleChanges(e)} label="VAT Number" variant="outlined" />
                <label className='error-text'>{errorMessage.VatNo}</label>
              </div>
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Email' value={formData.Email} onChange={(e) => handleChanges(e)} label="Email Address" variant="outlined"/>
                <label className='error-text'>{errorMessage.Email}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='ContactNo' value={formData.ContactNo} onChange={(e) => handleChanges(e)} label="Contact Number" variant="outlined" />
                <label className='error-text'>{errorMessage.ContactNo}</label>
              </div>
              </div>
              <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Fax' value={formData.Fax} onChange={(e) => handleChanges(e)} label="FAX number" variant="outlined" />
                <label className='error-text'>{errorMessage.Fax}</label>
              </div>
            
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Address' value={formData.Address} onChange={(e) => handleChanges(e)} label="Address" variant="outlined"/>
                <label className='error-text'>{errorMessage.Address}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='City' value={formData.City} onChange={(e) => handleChanges(e)} label="City" variant="outlined" />
                <label className='error-text'>{errorMessage.City}</label>
              </div>
            </div>          
                 
            <div className='button-container'>
              <button type='submit' class='submit-button' onClick={handleUpdateSubmit}>Submit</button>
              <button type='reset' class='reset-button' onClick={handleUpdateReset}>Reset</button>
            </div>
        </form>
            </div>
            </div>
          ) : (
            <p>Error Occured While loading the component</p>
          )}
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
  );
}

export default SupplierList;
