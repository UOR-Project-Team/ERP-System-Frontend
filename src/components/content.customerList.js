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
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from 'react-modal';
import "jspdf-autotable";
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { ToastContainer } from 'react-toastify';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import AddLogo from './../assets/icons/add.png';
import SearchLogo from './../assets/icons/search.png';
import EditLogo from './../assets/icons/edit.png';
import ActionLogo from './../assets/icons/action.png';
import DeleteLogo from './../assets/icons/delete.png';
import SortLogo from './../assets/icons/sort.png';
import ActivateLogo from './../assets/icons/activate.png';
import DeactivateLogo from './../assets/icons/deactivate.png';
import GreenCircle from '../assets/icons/green-circle.png'
import GreyCircle from '../assets/icons/Grey-circle.png'
import customerServices from '../services/services.customer';
import validateCustomer from '../services/validate.customer';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';

function CustomerList() {
  const { userData } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(0);
  const [activeCustomer, setactiveCustomer] = useState(true);

  const navigateTo = useNavigate();

  const [fields, setFields] = useState(() => {
    const storedFields = localStorage.getItem('customer-fields');
    return storedFields ? JSON.parse(storedFields) : {
      title: true,
      fullname: true,
      email: true,
      nic: false,
      contactno: true,
      street1: false,
      street2: false,
      city: true,
      country: true,
      vatno: false,
      debit: false,
      status: true
    };
  });

  const [tempFields, setTempFields] = useState(() => {
    const storedFields = localStorage.getItem('customer-fields');
    return storedFields ? JSON.parse(storedFields) : {
      title: true,
      fullname: true,
      email: true,
      nic: false,
      contactno: true,
      street1: false,
      street2: false,
      city: true,
      country: true,
      vatno: false,
      debit: false,
      status: true
    };
  });

  const [formData, setFormData] = useState({
    title: '',
    fullname: '',
    email: '',
    nic: '',
    contactno: '',
    street1: '',
    street2: '',
    city: '',
    country: '',
    vatno: '',
  });

  const [formResetData, setFormResetData] = useState({
    title: '',
    fullname: '',
    email: '',
    nic: '',
    contactno: '',
    street1: '',
    street2: '',
    city: '',
    country: '',
    vatno: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    title: '',
    fullname: '',
    email: '',
    nic: '',
    contactno: '',
    street1: '',
    street2: '',
    city: '',
    country: '',
    vatno: '',
  });

  useEffect(() => {
    localStorage.setItem('customer-fields', JSON.stringify(fields));
    fetchCustomers();
  }, [fields]);

  const fetchCustomers = async () => {
    try {
      const customerData = await customerServices.getAllCustomers();
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  };

  const filterContent = (customers, searchTerm) => {
    const result = customers.filter((customer) => {
      const values = Object.values(customer).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
      return regex.test(values);
    });
    setCustomers(result);
  };

  const handleSearchInputChange = (e) => {
    e.preventDefault();
    if (searchInput === '') {
      fetchCustomers();
    } else {
      customerServices.getAllCustomers().then((res) => {
        if (res) {
          filterContent(res, searchInput);
        }
      });
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
      title: tempFields.title || false,
      fullname: tempFields.fullname || false,
      email: tempFields.email || false,
      nic: tempFields.nic || false,
      contactno: tempFields.contactno || false,
      street1: tempFields.street1 || false,
      street2: tempFields.street2 || false,
      city: tempFields.city || false,
      country: tempFields.country || false,
      vatno: tempFields.vatno || false,
      debit: tempFields.debit || false,
      status: tempFields.status || false,
    });    
  }

  const handleDialogAction = async () => {
    if(dialogTitle === 'PDF Exporter') {
      exportPDF();
    } else if(dialogTitle === 'CSV Exporter') {
      exportCSV();
    } else if(dialogTitle === 'Delete Customer') {
      try {
        await customerServices.deleteCustomer(currentCustomer);
        setDialogOpen(false);
        fetchCustomers();
        showSuccessToast('Customer successfully deleted');

      } catch (error) {
        console.error('Error deleting customer:', error.message);  
        showErrorToast('Error deleting customer');
      }
    }
  };

  const handleActionClick = (event, customer) => {
    handleClick(event); 
    setCurrentCustomer(customer.ID);
    setactiveCustomer(customer.Status);
  };

  const handleActivationChanges = async (e) => {
    try {
      if(activeCustomer) {
        const response = await customerServices.deactivateCustomer(currentCustomer);
        console.log('Customer deactivate:', response);
        showSuccessToast('Deactivated successfully');
      } else {
        const response = await customerServices.activateCustomer(currentCustomer);
        console.log('Customer activate:', response);
        showSuccessToast('Activated successfully');
      }
      fetchCustomers();
      handleClose();
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
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  // OnSubmit Update Form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validations
    const validationErrors = validateCustomer(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      showErrorToast('Check the inputs again');
      return
    }
    
    try {
      const response = await customerServices.updateCustomer(currentCustomer, formData)
      customers.find((customer) => customer.ID === currentCustomer)
      fetchCustomers();
      setIsModalOpen(false);
      showSuccessToast('Customer successfully updated')
      console.log('Customer updated:', response);
    } catch(error) {
      const { message, attributeName } = error.response.data;
      showErrorToast(`${message}`);
    
      if (attributeName) {
        if(attributeName==='Email') {
          setErrorMessage({
            email: 'This Email already Exists',
          });
        } else if(attributeName==='NIC') {
          setErrorMessage({
            nic: 'This National ID/Passport already Exists',
          });
        } else if(attributeName==='ContactNo') {
          setErrorMessage({
            contactno: 'This Contact Number already Exists',
          });
        } else if(attributeName==='VatNo') {
          setErrorMessage({
            vatno: 'This VAT Number already Exists',
          });
        }
      }
      console.error('Error:', message);
    }
  };

  const fetchCustomer = () => {
    const foundCustomer = customers.find((customer) => customer.ID === currentCustomer);

    if (foundCustomer) {
      setFormData({
        title: foundCustomer.Title || '',
        fullname: foundCustomer.Fullname || '',
        email: foundCustomer.Email || '',
        nic: foundCustomer.NIC || '',
        contactno: foundCustomer.ContactNo || '',
        street1: foundCustomer.Street1 || '',
        street2: foundCustomer.Street2 || '',
        city: foundCustomer.City || '',
        country: foundCustomer.Country || '',
        vatno: foundCustomer.VatNo || '',
      });
      setFormResetData({
        title: foundCustomer.Title || '',
        fullname: foundCustomer.Fullname || '',
        email: foundCustomer.Email || '',
        nic: foundCustomer.NIC || '',
        contactno: foundCustomer.ContactNo || '',
        street1: foundCustomer.Street1 || '',
        street2: foundCustomer.Street2 || '',
        city: foundCustomer.City || '',
        country: foundCustomer.Country || '',
        vatno: foundCustomer.VatNo || '',
      });
    } else {
      console.log("Customer not found");
      showErrorToast('Customer not found');
    }
  }

  const handleUpdateReset = () => {
    setFormData(() => ({
      title: formResetData.title,
      fullname: formResetData.fullname,
      nic: formResetData.nic,
      vatno: formResetData.vatno,
      email: formResetData.email,
      contactno: formResetData.contactno,
      street1: formResetData.street1,
      street2: formResetData.street2,
      city: formResetData.city,
      country: formResetData.country
    }));
    setErrorMessage({
      title: '',
      fullname: '',
      nic: '',
      vatno: '',
      email: '',
      contactno: '',
      street1: '',
      street2: '',
      city: '',
      country: '',
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

    const noteHeader = "CUSTOMER LIST"

    // Header function
    // const header = function(data) {
    //     doc.setFontSize(8);
    //     doc.setTextColor(40);
    //     doc.text("Innova ERP Solution - Customer Report", data.settings.margin.left, 30);
    // };

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

    // Footer function
    const footer = function(data) {
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.line(20, pdf.internal.pageSize.height-30, pdf.internal.pageSize.width-20, pdf.internal.pageSize.height-30);
        footerText();
        pdf.text("©INNOVA ERP Solutions. All rights reserved.",320,pdf.internal.pageSize.height-20);
        pdf.text("Wellamadama, Matara , 0412223334",342,pdf.internal.pageSize.height-10)
        pdf.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, pdf.internal.pageSize.height - 15);
    };

    let headers = [];
    let tempHeader = []
    let data = [];
    

    if(fields.title) {
      tempHeader.push("Title");
    }
    if(fields.fullname) {
      tempHeader.push("Fullname");
    }
    if(fields.email) {
      tempHeader.push("Email");
    }
    if(fields.nic) {
      tempHeader.push("National Id");
    }
    if(fields.contactno) {
      tempHeader.push("Contact No");
    }
    if(fields.street1) {
      tempHeader.push("Street1");
    }
    if(fields.street2) {
      tempHeader.push("Street2");
    }
    if(fields.city) {
      tempHeader.push("City");
    }
    if(fields.country) {
      tempHeader.push("Country");
    }
    if(fields.vatno) {
      tempHeader.push("VAT No");
    }

    headers.push(tempHeader);

    customers.map(elt => {
      let tempdata = []
      if(fields.title) {
        tempdata.push(elt.Title);
      }
      if(fields.fullname) {
        tempdata.push(elt.Fullname);
      }
      if(fields.email) {
        tempdata.push(elt.Email);
      }
      if(fields.nic) {
        tempdata.push(elt.NIC);
      }
      if(fields.contactno) {
        tempdata.push(elt.ContactNo);
      }
      if(fields.street1) {
        tempdata.push(elt.Street1);
      }
      if(fields.street2) {
        tempdata.push(elt.Street2);
      }
      if(fields.city) {
        tempdata.push(elt.City);
      }
      if(fields.country) {
        tempdata.push(elt.Country);
      }
      if(fields.vatno) {
        tempdata.push(elt.VATNo);
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
          headerRight(data);
          headerLeft(data);
          pdf.line(20, 120, pdf.internal.pageSize.width-20, 120);
          footer(data);
      }
    });

    setDialogOpen(false);
    pdf.save("ERP-customer-report.pdf");
  };

  const exportCSV = () => {

    let headers = [];
    let data = [];

    if(fields.title) {
      headers.push("Title");
    }
    if(fields.fullname) {
      headers.push("Fullname");
    }
    if(fields.email) {
      headers.push("Email");
    }
    if(fields.nic) {
      headers.push("National Id");
    }
    if(fields.contactno) {
      headers.push("Contact No");
    }
    if(fields.street1) {
      headers.push("Street1");
    }
    if(fields.street2) {
      headers.push("Street2");
    }
    if(fields.city) {
      headers.push("City");
    }
    if(fields.country) {
      headers.push("Country");
    }
    if(fields.vatno) {
      headers.push("VAT No");
    }

    customers.map(elt => {
      let tempdata = []
      if(fields.title) {
        tempdata.push(elt.Title);
      }
      if(fields.fullname) {
        tempdata.push(elt.Fullname);
      }
      if(fields.email) {
        tempdata.push(elt.Email);
      }
      if(fields.nic) {
        tempdata.push(elt.NIC);
      }
      if(fields.contactno) {
        tempdata.push(elt.ContactNo);
      }
      if(fields.street1) {
        tempdata.push(elt.Street1);
      }
      if(fields.street2) {
        tempdata.push(elt.Street2);
      }
      if(fields.city) {
        tempdata.push(elt.City);
      }
      if(fields.country) {
        tempdata.push(elt.Country);
      }
      if(fields.vatno) {
        tempdata.push(elt.VATNo);
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
    link.setAttribute('download', 'ERP-customer-report.csv');
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
            <button onClick={() => {navigateTo(`/home/customer-master`)}}><img src={AddLogo} alt='Add Logo'/><span>Add Customer</span></button>
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
            <button title="PDF Exporter" onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
            <button title="CSV Exporter" onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
            <button title="Filter" onClick={() => {setIsModalOpen(true); setModelContent('filter')}}><img src={FilterLogo} alt="Filter Logo" /></button>
          </div>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th style={{ display: fields.title ? 'table-cell' : 'none' }}><div className='th-container'><img src={SortLogo} alt="Sort Logo" /><span>Title</span></div></th>
                  <th style={{ display: fields.fullname ? 'table-cell' : 'none' }}>Fullname</th>
                  <th style={{ display: fields.email ? 'table-cell' : 'none' }}>Email</th>
                  <th style={{ display: fields.nic ? 'table-cell' : 'none' }}>NIC</th>
                  <th style={{ display: fields.contactno ? 'table-cell' : 'none' }}>Contact No</th>
                  <th style={{ display: fields.street1 ? 'table-cell' : 'none' }}>Street 1</th>
                  <th style={{ display: fields.street2 ? 'table-cell' : 'none' }}>Street2</th>
                  <th style={{ display: fields.city ? 'table-cell' : 'none' }}>City</th>
                  <th style={{ display: fields.country ? 'table-cell' : 'none' }}>Country</th>
                  <th style={{ display: fields.vatno ? 'table-cell' : 'none' }}>VAT  No</th>
                  <th style={{ display: fields.debit ? 'table-cell' : 'none' }}>Debit</th>
                  <th style={{ display: fields.status ? 'table-cell' : 'none' }}>Status</th>
                  <th className='action-column'></th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.ID}>
                      <td className='title' style={{ display: fields.title ? 'table-cell' : 'none' }}>{customer.Title}</td>
                      <td style={{ display: fields.fullname ? 'table-cell' : 'none' }}>{customer.Fullname}</td>
                      <td style={{ display: fields.email ? 'table-cell' : 'none' }}>{customer.Email}</td>
                      <td style={{ display: fields.nic ? 'table-cell' : 'none' }}>{customer.NIC}</td>
                      <td className='mobile' style={{ display: fields.contactno ? 'table-cell' : 'none' }}>{customer.ContactNo}</td>
                      <td style={{ display: fields.street1 ? 'table-cell' : 'none' }}>{customer.Street1}</td>
                      <td style={{ display: fields.street2 ? 'table-cell' : 'none' }}>{customer.Street2}</td>
                      <td style={{ display: fields.city ? 'table-cell' : 'none' }}>{customer.City}</td>
                      <td style={{ display: fields.country ? 'table-cell' : 'none' }}>{customer.Country}</td>
                      <td style={{ display: fields.vatno ? 'table-cell' : 'none' }}>{customer.VatNo}</td>
                      <td style={{ display: fields.debit ? 'table-cell' : 'none' }}>{customer.Debit}</td>
                      <td className='status' style={{ display: fields.status ? 'table-cell' : 'none' }}>
                        <div className='Statusbutton-container'>
                          {customer.Status === 0 ? (
                            <img src={GreyCircle} alt='Inactive'/>
                          ) : (
                            <img src ={GreenCircle} alt='Active'/>
                        )}
                        </div>
                      </td>
                      <td>
                      <button onClick={(event) => {handleActionClick(event, customer)}}>
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
        {activeCustomer ? (
          <MenuItem>
            <button onClick={handleActivationChanges}>
              <img src={DeactivateLogo} alt='Deactivate Logo' />
              <span>Deactivate Customer</span>
            </button>         
          </MenuItem>
          ) : (
          <MenuItem>
            <button onClick={handleActivationChanges}>
              <img src={ActivateLogo} alt='Activate Logo' />
              <span>Activate Customer</span>
            </button>         
          </MenuItem>
        )}
        <MenuItem>
          <button onClick={() => {fetchCustomer(); handleRequest('edit');}}>
            <img src={EditLogo} alt="Edit Logo"/>
            <span>Edit Customer</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {setDialogTitle('Delete Customer'); setDialogDescription('Do you want to delete this customer record?'); setDialogOpen(true); setAnchorEl(null);}}>
          <button>
            <img src={DeleteLogo} alt="Delete Logo"/>
            <span>Delete Customer</span>
          </button>
        </MenuItem>
      </Menu>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {setIsModalOpen(false)}}
        contentLabel="Header-Model"
        className="modal-content"
        overlayClassName="modal-overlay"
        >
          {modelContent === "filter" ? (
            <div className='feature-modal'>
              <h3>Table Filter</h3>
              <form onSubmit={handleFilterSubmit}>
                <div className='checkbox-container'>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='title' checked={tempFields.title} onChange={handleCheckboxChange} />
                    <label>Title</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='fullname' checked={tempFields.fullname} onChange={handleCheckboxChange} />
                    <label>Fullname</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='email' checked={tempFields.email} onChange={handleCheckboxChange} />
                    <label>Email</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='nic' checked={tempFields.nic} onChange={handleCheckboxChange} />
                    <label>National Id</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='contactno' checked={tempFields.contactno} onChange={handleCheckboxChange} />
                    <label>Contact Number</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='street1' checked={tempFields.street1} onChange={handleCheckboxChange} />
                    <label>Street 1</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='street2' checked={tempFields.street2} onChange={handleCheckboxChange} />
                    <label>Street 2</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='city' checked={tempFields.city} onChange={handleCheckboxChange} />
                    <label>City</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='country' checked={tempFields.country} onChange={handleCheckboxChange} />
                    <label>Country</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='vatno' checked={tempFields.vatno} onChange={handleCheckboxChange} />
                    <label>VAT No</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='debit' checked={tempFields.debit} onChange={handleCheckboxChange} />
                    <label>Debit</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='status' checked={tempFields.status} onChange={handleCheckboxChange} />
                    <label>Status</label>
                  </div>
                </div>
                <button type='submit'>Filter</button>
              </form>
            </div>
          ) : modelContent === "edit" ? (
            <div className='edit-model'>
              <h3>Update Customer</h3>
              <form className='form-container'>
                <h3>Customer Details</h3>
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
                          value={formData.title}
                          onChange={(e) => {
                            handleChanges(e);
                          }}
                        />
                      )}
                      onChange={(_, newValue) => {
                        setFormData((prevData) => ({ ...prevData, title: newValue?.label || '' }));
                      }}
                      value={formData.title}
                    />
                    <label className='error-text'>{errorMessage.title}</label>
                  </div>
                  <div className='line-type3-right-content'>
                    <TextField className='text-line-type2' name='fullname' value={formData.fullname} onChange={(e) => handleChanges(e)} label="Full Name" variant="outlined" />
                    <label className='error-text'>{errorMessage.fullname}</label>
                  </div>
                </div>
                <div className='line-type2-container'>
                  <div className='line-type2-content'>
                    <TextField className='text-line-type2' name='nic' value={formData.nic} onChange={(e) => handleChanges(e)} label="National ID / Passport" variant="outlined" />
                    <label className='error-text'>{errorMessage.nic}</label>
                  </div>
                  <div className='line-type2-content'>
                    <TextField className='text-line-type2' name='vatno' value={formData.vatno} onChange={(e) => handleChanges(e)} label="VAT Number" variant="outlined" />
                    <label className='error-text'>{errorMessage.vatno}</label>
                  </div>
                </div>
                <h3>Contact Details</h3>
                <div className='line-type2-container'>
                  <div className='line-type2-content'>
                    <TextField className='text-line-type2' name='email' value={formData.email} onChange={(e) => handleChanges(e)} label="Email" variant="outlined"/>
                    <label className='error-text'>{errorMessage.email}</label>
                  </div>
                  <div className='line-type2-content'>
                    <TextField className='text-line-type2' name='contactno' value={formData.contactno} onChange={(e) => handleChanges(e)} label="Contact Number" variant="outlined" />
                    <label className='error-text'>{errorMessage.contactno}</label>
                  </div>
                </div>
                <h3>Address</h3>
                <div className='line-type2-container'>
                  <div className='line-type2-content'>
                    <TextField className='text-line-type2' name='street1' value={formData.street1} onChange={(e) => handleChanges(e)} label="Street 1" variant="outlined"/>
                    <label className='error-text'>{errorMessage.street1}</label>
                  </div>
                  <div className='line-type2-content'>
                    <TextField className='text-line-type2' name='street2' value={formData.street2} onChange={(e) => handleChanges(e)} label="Street 2" variant="outlined" />
                    <label className='error-text'>{errorMessage.street2}</label>
                  </div>
                </div>
                <div className='line-type2-container'>
                <div className='line-type2-content'>
                    <TextField className='text-line-type2' name='city' value={formData.city} onChange={(e) => handleChanges(e)} label="City" variant="outlined"/>
                    <label className='error-text'>{errorMessage.city}</label>
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
                          value={formData.country}
                          onChange={(e) => {
                            handleChanges(e);
                          }}
                        />
                      )}
                      onChange={(_, newValue) => {
                        setFormData((prevData) => ({ ...prevData, country: newValue?.label || '' }));
                      }}
                      value={formData.country}
                    />
                    <label className='error-text'>{errorMessage.country}</label>
                  </div>
                </div>
                <div className='button-container'>
                  <button type='submit' class='submit-button' onClick={handleUpdateSubmit}>Submit</button>
                  <button type='reset' class='reset-button' onClick={handleUpdateReset}>Reset</button>
                </div>
              </form>
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

export default CustomerList;
