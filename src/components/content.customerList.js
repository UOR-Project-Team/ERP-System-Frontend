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
import customerServices from '../services/services.customer';

function CustomerList() {

  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(0);

  const [fields, setFields] = useState({
    firstname: true,
    lastname: true,
    email: true,
    nic: false,
    contactno: true,
    street1: false,
    street2: false,
    city: true,
    country: true,
    vatno: false,
  });

  const [tempFields, setTempFields] = useState({
    firstname: true,
    lastname: true,
    email: true,
    nic: false,
    contactno: true,
    street1: false,
    street2: false,
    city: true,
    country: true,
    vatno: false,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

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
    setSearchInput(e.target.value);

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
      firstname: tempFields.firstname,
      lastname: tempFields.lastname,
      email: tempFields.email,
      nic: tempFields.nic,
      contactno: tempFields.contactno,
      street1: tempFields.street1,
      street2: tempFields.street2,
      city: tempFields.city,
      country: tempFields.country,
      vatno: tempFields.vatno,
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

        toast.success('Successfully Added', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });

      } catch (error) {
        console.error('Error deleting customer:', error.message);
        toast.error('Error Occured', {
          position: "top-center",
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

    // Header function
    const header = function(data) {
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text("Innova ERP Solution - Customer Report", data.settings.margin.left, 30);
    };

    // Footer function
    const footer = function(data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };

    // Set table headers
    const headers = [["FirstName", "LastName", "Email", "Mobile", "Street1", "Street2", "City", "Country"]];

    // Map customer data
    const data = customers.map(elt=> [elt.Firstname, elt.Lastname, elt.Email, elt.ContactNo, elt.Street1, elt.Street2, elt.City, elt.Country]);

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
    doc.save("ERP-customer-report.pdf");
  };

  const exportCSV = () => {
    const headers = ["FirstName", "LastName", "Email", "Mobile", "Street1", "Street2", "City", "Country"];
  
    const data = customers.map(elt => [
      elt.Firstname,
      elt.Lastname,
      elt.Email,
      elt.ContactNo,
      elt.Street1,
      elt.Street2,
      elt.City,
      elt.Country
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




  return (
    <div>
      <ToastContainer />
      <div className='master-content'>
          <div className='search-container'>
            <input type="text" placeholder='Explore the possibilities...' onChange={handleSearchInputChange} />
            <button><img src={SearchLogo} alt="Search Logo"/></button>
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
                <th style={{ display: fields.firstname ? 'table-cell' : 'none' }}>Firstname</th>
                <th style={{ display: fields.lastname ? 'table-cell' : 'none' }}>Lastname</th>
                <th style={{ display: fields.email ? 'table-cell' : 'none' }}>Email</th>
                <th style={{ display: fields.nic ? 'table-cell' : 'none' }}>NIC</th>
                <th style={{ display: fields.contactno ? 'table-cell' : 'none' }}>Contact No</th>
                <th style={{ display: fields.street1 ? 'table-cell' : 'none' }}>Street 1</th>
                <th style={{ display: fields.street2 ? 'table-cell' : 'none' }}>Street2</th>
                <th style={{ display: fields.city ? 'table-cell' : 'none' }}>City</th>
                <th style={{ display: fields.country ? 'table-cell' : 'none' }}>Country</th>
                <th style={{ display: fields.vatno ? 'table-cell' : 'none' }}>VAT  No</th>
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
                  <tr key={customer.id}>
                    <td style={{ display: fields.firstname ? 'table-cell' : 'none' }}>{customer.Firstname}</td>
                    <td style={{ display: fields.lastname ? 'table-cell' : 'none' }}>{customer.Lastname}</td>
                    <td style={{ display: fields.email ? 'table-cell' : 'none' }}>{customer.Email}</td>
                    <td style={{ display: fields.nic ? 'table-cell' : 'none' }}>{customer.NIC}</td>
                    <td style={{ display: fields.contactno ? 'table-cell' : 'none' }}>{customer.ContactNo}</td>
                    <td style={{ display: fields.street1 ? 'table-cell' : 'none' }}>{customer.Street1}</td>
                    <td style={{ display: fields.street2 ? 'table-cell' : 'none' }}>{customer.Street2}</td>
                    <td style={{ display: fields.city ? 'table-cell' : 'none' }}>{customer.City}</td>
                    <td style={{ display: fields.country ? 'table-cell' : 'none' }}>{customer.Country}</td>
                    <td style={{ display: fields.vatno ? 'table-cell' : 'none' }}>{customer.VatNo}</td>
                    <td>
                      <button onClick={(event) => { handleClick(event); setCurrentCustomer(customer.ID); }}>
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

      <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>
          <button onClick={() => handleRequest('edit')}>
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
                    <input type='checkbox' name='firstname' checked={tempFields.firstname} onChange={handleCheckboxChange} />
                    <label>Firstname</label>
                  </div>
                  <div className='checkbox-content'>
                    <input type='checkbox' name='lastname' checked={tempFields.lastname} onChange={handleCheckboxChange} />
                    <label>Lastname</label>
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
                </div>
                <button type='submit'>Filter</button>
              </form>
            </div>
          ) : modelContent === "edit" ? (
            <p>Load update Customer</p>
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
