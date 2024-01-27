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
import { ToastContainer, } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import AddLogo from './../assets/icons/add.png';
import FilterLogo from './../assets/icons/filter.png';
import SearchLogo from './../assets/icons/search.png';
import EditLogo from './../assets/icons/edit.png';
import ActionLogo from './../assets/icons/action.png';
import DeleteLogo from './../assets/icons/delete.png';
import supplierServices from '../services/services.supplier';
import validateSupplier from '../services/validate.supplier';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import GreenCircle from '../assets/icons/green-circle.png'
import GreyCircle from '../assets/icons/Grey-circle.png'
import ActivateLogo from './../assets/icons/activate.png';
import DeactivateLogo from './../assets/icons/deactivate.png';
import ItemLogo from './../assets/icons/item.png';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';

function SupplierList({ updateHeaderText }) {

  const { userData } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(0);
  const [activeSupplier, setactiveSupplier] = useState(true);

  const navigateTo = useNavigate();

  const [fields, setFields] = useState(() => {
    const storedFields = localStorage.getItem('supplier-fields');
    return storedFields ? JSON.parse(storedFields) : {
      Title: true,
      Fullname: true,
      RegistrationNo: true,
      Email: true,
      ContactNo: true,
      Fax: false,
      Street1: false,
      Street2: false,
      City: true,
      Country: true,
      Description: true,
      VatNo: false,
      Credit: false,
      Status: true
    };
  });

  const [tempFields, setTempFields] = useState(() => {
    const storedFields = localStorage.getItem('supplier-fields');
    return storedFields ? JSON.parse(storedFields) : {
      Title: true,
      Fullname: true,
      RegistrationNo: true,
      Email: true,
      ContactNo: true,
      Fax: false,
      Street1: false,
      Street2: false,
      City: true,
      Country: true,
      Description: true,
      VatNo: false,
      Credit: false,
      Status: true
    };
  });

  const [formData , setFormData] = useState({
    Title: '',
    Fullname:'',
    RegistrationNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    Street1: '',
    Street2: '',
    City: '',
    Country: '',
    Description: '',
    VatNo: '',
  });

  const [errorMessage , setErrorMessage] = useState({
    Title: '',
    Fullname:'',
    RegistrationNo: '',
    Email: '',
    ContactNo: '',
    Fax: '',
    Street1: '',
    Street2: '',
    City: '',
    Country: '',
    Description: '',
    VatNo: '',
  });

  useEffect(() => {
    localStorage.setItem('supplier-fields', JSON.stringify(fields));
    fetchSuppliers();
    updateHeaderText('Supplier List')
  }, [updateHeaderText, fields]);

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
    } catch(error) {
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
      Title: tempFields.title || true,
      Fullname: tempFields.Fullname || true,
      RegistrationNo: tempFields.RegistrationNo || true,
      Email: tempFields.Email || true,
      ContactNo: tempFields.ContactNo || true,
      Fax: tempFields.Fax || false,
      Street1: tempFields.Street1 || false,
      Street2: tempFields.Street2 || false,
      City: tempFields.City || true,
      Country: tempFields.Country || true,
      Description: tempFields.Description || true,
      VatNo: tempFields.VatNo || false,
      Credit: tempFields.Credit || false,
      Status: tempFields.Status || true
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
        showSuccessToast('Suppplier successfully deleted')

      } catch (error) {
        console.error('Error deleting supplier:', error.message);
        showErrorToast('Error deleting supplier');
      }
    }
  };

  const handleActionClick = (event, supplier) => {
    handleClick(event); 
    setCurrentSupplier(supplier.ID);
    setactiveSupplier(supplier.Status);
  };

  const handleActivationChanges = async (e) => {
    try {
      if(activeSupplier) {
        const response = await supplierServices.deactivateSupplier(currentSupplier)
        console.log('Supplier deactivate:', response);
      } else {
        const response = await supplierServices.activateSupplier(currentSupplier)
        console.log('Supplier activate:', response);
      }
      fetchSuppliers();
      handleClose();
      showSuccessToast('Activation successfully changed')    
    } catch(error) {
      console.error('Error activation changes:', error.message);
      showErrorToast(`Error Occured!`);
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
            showErrorToast('Check the inputs again');
            return
          }

          try {
            const response = await supplierServices.updateSupplier(currentSupplier, formData)
            fetchSuppliers();
            setIsModalOpen(false);
            showSuccessToast('Supplier successfully updated')
            console.log('Supplier updated:', response);
            handleUpdateReset();

        } catch(error) {
            console.error('Error Updating supplier:', error.message);
            showErrorToast('Error updating supplier');
          }
      
        };

        const fetchSupplier = () => {
            const foundSupplier = suppliers.find((supplier) => supplier.ID === currentSupplier);
        
            if (foundSupplier) {
              setFormData({
                Title: foundSupplier.Title || '',
                Fullname: foundSupplier.Fullname || '',
                RegistrationNo: foundSupplier.RegistrationNo || '',
                Email: foundSupplier.Email || '',
                ContactNo: foundSupplier.ContactNo || '',
                Fax: foundSupplier.Fax || '',
                Street1: foundSupplier.Street1 || '',
                Street2: foundSupplier.Street2 || '',
                City: foundSupplier.City || '',
                Country: foundSupplier.Country || '',
                Description: foundSupplier.Description || '',
                VatNo: foundSupplier.VatNo || ''

              });
            } else {
              console.log("Supplier not found");
              showErrorToast('Supplier not found');
            }
          }
        
          const handleUpdateReset = () => {
            setFormData(() => ({
                Title: '',
                Fullname:'',
                RegistrationNo: '',
                Email: '',
                ContactNo: '',
                Fax: '',
                Street1: '',
                Street2: '',
                City: '',
                Country: '',
                Description: '',
                VatNo: '',
            }));
            setErrorMessage({
                Title: '',
                Fullname:'',
                RegistrationNo: '',
                Email: '',
                ContactNo: '',
                Fax: '',
                Street1: '',
                Street2: '',
                City: '',
                Country: '',
                Description: '',
                VatNo: '',
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

    const qrCodeData = `Date: ${formattedDate}\nTime: ${formattedTime}\nUser: ${userData.fullname}`;
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
      pdf.text(`${userData.fullname}`, 700, 55);
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

    // Set table headers
    let headers = [];
    let tempHeader = []
    let data = [];

    if(fields.Title) {
      tempHeader.push("Title");
    }
    if(fields.Fullname) {
      tempHeader.push("Fullname");
    }
    if(fields.RegistrationNo) {
      tempHeader.push("Registratio No");
    }
    if(fields.Email) {
      tempHeader.push("Email");
    }
    if(fields.ContactNo) {
      tempHeader.push("Contact No");
    }
    if(fields.Fax) {
      tempHeader.push("Fax");
    }
    if(fields.Street1) {
      tempHeader.push("Street1");
    }
    if(fields.Street2) {
      tempHeader.push("Street2");
    }
    if(fields.City) {
      tempHeader.push("City");
    }
    if(fields.Country) {
      tempHeader.push("Country");
    }
    if(fields.Description) {
      tempHeader.push("Description");
    }
    if(fields.VatNo) {
      tempHeader.push("VAT No");
    }
    if(fields.Credit) {
      tempHeader.push("Credit");
    }

    headers.push(tempHeader);

    suppliers.map(elt => {
      let tempdata = []
      if(fields.title) {
        tempdata.push(elt.Title);
      }
      if(fields.Fullname) {
        tempdata.push(elt.Fullname);
      }
      if(fields.RegistrationNo) {
        tempdata.push(elt.RegistrationNo);
      }
      if(fields.Email) {
        tempdata.push(elt.Email);
      }
      if(fields.ContactNo) {
        tempdata.push(elt.ContactNo);
      }
      if(fields.Fax) {
        tempdata.push(elt.Fax);
      }
      if(fields.Street1) {
        tempdata.push(elt.Street1);
      }
      if(fields.Street2) {
        tempdata.push(elt.Street2);
      }
      if(fields.City) {
        tempdata.push(elt.City);
      }
      if(fields.Country) {
        tempdata.push(elt.Country);
      }
      if(fields.Description) {
        tempdata.push(elt.Description);
      }
      if(fields.VatNo) {
        tempdata.push(elt.VatNo);
      }
      if(fields.Credit) {
        tempdata.push(elt.Credit);
      }
      data.push(tempdata);
      return null;
    });

    // Set table content
    let content = {
      startY: 150,
      head: headers,
      body: data
    };

    // Generate PDF with header, footer, and enhanced styling
    pdf.autoTable({
      ...content,
      theme: 'striped',
      styles: {
        head: { fillColor: [38, 2, 97], textColor: [255, 255, 255] }, 
        body: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, 
      },
      addPageContent: function(data) {
          headerLeft(data);
          headerRight(data);
          pdf.line(20, 120, pdf.internal.pageSize.width-20, 120);
          footer(data);
      }
    });

    setDialogOpen(false);
    pdf.save("ERP-supplier-report.pdf");
  };

  const exportCSV = () => {

    let headers = [];
    let data = [];

    if(fields.Title) {
      headers.push("Title");
    }
    if(fields.Fullname) {
      headers.push("Fullname");
    }
    if(fields.RegistrationNo) {
      headers.push("Registratio No");
    }
    if(fields.Email) {
      headers.push("Email");
    }
    if(fields.ContactNo) {
      headers.push("Contact No");
    }
    if(fields.Fax) {
      headers.push("Fax");
    }
    if(fields.Street1) {
      headers.push("Street1");
    }
    if(fields.Street2) {
      headers.push("Street2");
    }
    if(fields.City) {
      headers.push("City");
    }
    if(fields.Country) {
      headers.push("Country");
    }
    if(fields.Description) {
      headers.push("Description");
    }
    if(fields.VatNo) {
      headers.push("VAT No");
    }
    if(fields.Credit) {
      headers.push("Credit");
    }

    suppliers.map(elt => {
      let tempdata = []
      if(fields.title) {
        tempdata.push(elt.Title);
      }
      if(fields.Fullname) {
        tempdata.push(elt.Fullname);
      }
      if(fields.RegistrationNo) {
        tempdata.push(elt.RegistrationNo);
      }
      if(fields.Email) {
        tempdata.push(elt.Email);
      }
      if(fields.ContactNo) {
        tempdata.push(elt.ContactNo);
      }
      if(fields.Fax) {
        tempdata.push(elt.Fax);
      }
      if(fields.Street1) {
        tempdata.push(elt.Street1);
      }
      if(fields.Street2) {
        tempdata.push(elt.Street2);
      }
      if(fields.City) {
        tempdata.push(elt.City);
      }
      if(fields.Country) {
        tempdata.push(elt.Country);
      }
      if(fields.Description) {
        tempdata.push(elt.Description);
      }
      if(fields.VatNo) {
        tempdata.push(elt.VatNo);
      }
      if(fields.Credit) {
        tempdata.push(elt.Credit);
      }
      data.push(tempdata);
      return null;
    });
  
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
      <div className='list-container'>
      <ToastContainer />
      <div className='list-content-top'>
        <div className='button-container'>
          <button onClick={() => {navigateTo(`/home/supplier-master`)}}><img src={AddLogo} alt='Add Logo'/><span>Add Supplier</span></button>
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
          <button onClick={() => {setIsModalOpen(true); setModelContent('filter')}}><img src={FilterLogo} alt="Filter Logo" /></button>
        </div>
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th style={{ display: fields.Title ? 'table-cell' : 'none' }}>Title</th>
                <th style={{ display: fields.Fullname ? 'table-cell' : 'none' }}>Full name</th>
                <th style={{ display: fields.RegistrationNo ? 'table-cell' : 'none' }}>Registration No</th>
                <th style={{ display: fields.Email ? 'table-cell' : 'none' }}>Email</th>
                <th style={{ display: fields.ContactNo ? 'table-cell' : 'none' }}>Contact No</th>
                <th style={{ display: fields.Fax ? 'table-cell' : 'none' }}>FAX</th>
                <th style={{ display: fields.Street1 ? 'table-cell' : 'none' }}>Street1</th>
                <th style={{ display: fields.Street2 ? 'table-cell' : 'none' }}>Street2</th>
                <th style={{ display: fields.City ? 'table-cell' : 'none' }}>City</th>
                <th style={{ display: fields.Country ? 'table-cell' : 'none' }}>Country</th>
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
                  <tr key={supplier.ID}>
                    <td style={{ display: fields.Title ? 'table-cell' : 'none' }}>{supplier.Title}</td>
                    <td style={{ display: fields.Fullname ? 'table-cell' : 'none' }}>{supplier.Fullname}</td>
                    <td style={{ display: fields.RegistrationNo ? 'table-cell' : 'none' }}>{supplier.RegistrationNo}</td>
                    <td style={{ display: fields.Email ? 'table-cell' : 'none' }}>{supplier.Email}</td>
                    <td style={{ display: fields.ContactNo ? 'table-cell' : 'none' }}>{supplier.ContactNo}</td>
                    <td style={{ display: fields.Fax ? 'table-cell' : 'none' }}>{supplier.Fax}</td>
                    <td style={{ display: fields.Street1 ? 'table-cell' : 'none' }}>{supplier.Street1}</td>
                    <td style={{ display: fields.Street2 ? 'table-cell' : 'none' }}>{supplier.Street2}</td>
                    <td style={{ display: fields.City ? 'table-cell' : 'none' }}>{supplier.City}</td>
                    <td style={{ display: fields.Country ? 'table-cell' : 'none' }}>{supplier.Country}</td>
                    <td style={{ display: fields.Description ? 'table-cell' : 'none' }}>{supplier.Description}</td>
                    <td style={{ display: fields.VatNo ? 'table-cell' : 'none' }}>{supplier.VatNo}</td>
                    <td style={{ display: fields.Credit ? 'table-cell' : 'none' }}>{supplier.Credit}</td>
                    <td style={{ display: fields.Status ? 'table-cell' : 'none' }}>
                      <div className='Statusbutton-container'>
                      {supplier.Status === 0 ? (
                        <button type='button'><img src={GreyCircle} alt='Inactive'/></button>
                      ) : (
                        <button type='button' ><img src ={GreenCircle} alt='Active'/></button>
                     )}
                      </div>
                    </td>
                    <td>
                      <button onClick={(event) => {handleActionClick(event, supplier)}}>
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
      
      <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>
          <button onClick={() => {navigateTo(`/home/item-list/supplier/${currentSupplier}`); updateHeaderText('Item List')}}>
            <img src={ItemLogo} alt='Item Logo' />
            <span>View Items</span>
          </button>         
        </MenuItem>
        {activeSupplier ? (
          <MenuItem>
            <button onClick={handleActivationChanges}>
              <img src={DeactivateLogo} alt='Deactivate Logo' />
              <span>Deactivate Supplier</span>
            </button>         
          </MenuItem>
          ) : (
          <MenuItem>
            <button onClick={handleActivationChanges}>
              <img src={ActivateLogo} alt='Activate Logo' />
              <span>Activate Supplier</span>
            </button>         
          </MenuItem>
        )}
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
                    <input type='checkbox' name='Title' checked={tempFields.Title} onChange={handleCheckboxChange} />
                    <label>Title</label>
                  </div>
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
                    <label>Contact Number</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Fax' checked={tempFields.Fax} onChange={handleCheckboxChange} />
                    <label>FAX</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Street1' checked={tempFields.Street1} onChange={handleCheckboxChange} />
                    <label>Street1</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Street2' checked={tempFields.Street2} onChange={handleCheckboxChange} />
                    <label>Street2</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='City' checked={tempFields.City} onChange={handleCheckboxChange} />
                    <label>City</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Country' checked={tempFields.Country} onChange={handleCheckboxChange} />
                    <label>Country</label>
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
                  <div className='checkbox-content'>
                    <input type='checkbox' name='Status' checked={tempFields.Status} onChange={handleCheckboxChange} />
                    <label>Status</label>
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
          <div className='line-type3-container'>
              <div className='line-type3-left-content'>
                <Autocomplete
                  disablePortal
                  className='text-line-type2'
                  options={[{ label: 'Mr.' }, { label: 'Mrs.' }, { label: 'Mrs.' }, { label: 'Ms.' }, { label: 'Dr.' }, { label: 'Company' }]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Title"
                      name='title' 
                      value={formData.Title}
                      onChange={(e) => {
                        handleChanges(e);
                      }}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prevData) => ({ ...prevData, Title: newValue?.label || '' }));
                  }}
                  value={formData.Title}
                />
                <label className='error-text'>{errorMessage.Title}</label>
              </div>
              <div className='line-type3-right-content'>
                <TextField className='text-line-type2' name='Fullname' value={formData.Fullname} onChange={(e) => handleChanges(e)} label="Full Name" variant="outlined" />
                <label className='error-text'>{errorMessage.Fullname}</label>
              </div>
            </div>
            <TextField className='text-line-type2' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant="outlined" />
            <label className='error-text'>{errorMessage.Description}</label>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type1' name='RegistrationNo' value={formData.RegistrationNo} onChange={(e) => handleChanges(e)} label="Registration Number" variant="outlined" />
                <label className='error-text'>{errorMessage.RegistrationNo}</label>  
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='VatNo' value={formData.VatNo} onChange={(e) => handleChanges(e)} label="VAT Number" variant="outlined" />
                <label className='error-text'>{errorMessage.VatNo}</label>
              </div>
            </div>
            <h3>Contact Details</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Email' value={formData.Email} onChange={(e) => handleChanges(e)} label="Email" variant="outlined"/>
                <label className='error-text'>{errorMessage.Email}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='ContactNo' value={formData.ContactNo} onChange={(e) => handleChanges(e)} label="Contact Number" variant="outlined" />
                <label className='error-text'>{errorMessage.ContactNo}</label>
              </div>
              </div>
              <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Fax' value={formData.Fax} onChange={(e) => handleChanges(e)} label="Fax Number" variant="outlined" />
                <label className='error-text'>{errorMessage.Fax}</label>
              </div>
            
            </div>
            <h3>Address</h3>
            <div className='line-type2-container'>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Street1' value={formData.Street1} onChange={(e) => handleChanges(e)} label="Street 1" variant="outlined"/>
                <label className='error-text'>{errorMessage.Street1}</label>
              </div>
              <div className='line-type2-content'>
                <TextField className='text-line-type2' name='Street2' value={formData.Street2} onChange={(e) => handleChanges(e)} label="Street 2" variant="outlined" />
                <label className='error-text'>{errorMessage.Street2}</label>
              </div>
            </div>
            <div className='line-type2-container'>
            <div className='line-type2-content'>
              <TextField className='text-line-type2' name='City' value={formData.City} onChange={(e) => handleChanges(e)} label="City" variant="outlined"/>
              <label className='error-text'>{errorMessage.City}</label>
            </div>
            <div className='line-type2-content'>
              <Autocomplete
                disablePortal
                className='text-line-type2'
                options={[{ label: 'Sri Lanka' }, { label: 'India' }]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    name='country' 
                    value={formData.Country}
                    onChange={(e) => {
                      handleChanges(e);
                    }}
                  />
                )}
                onChange={(_, newValue) => {
                  setFormData((prevData) => ({ ...prevData, Country: newValue?.label || '' }));
                }}
                value={formData.Country}
              />
              <label className='error-text'>{errorMessage.Country}</label>
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
