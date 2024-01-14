import React, { useState, useEffect} from 'react';

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
import "jspdf-autotable";
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import AddLogo from './../assets/icons/add.png';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import SearchLogo from './../assets/icons/search.png';
import ViewLogo from './../assets/icons/view.png';
import ActionLogo from './../assets/icons/action.png';
import DeleteLogo from './../assets/icons/delete.png';
import invoiceServices from '../services/services.invoice';


function InvoiceList() {

  const [Invoices, setInvoices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentInvoice, setCurrentInvoice] = useState(0);

  const navigateTo = useNavigate();

  useEffect(()=>{
    fetchInvoices();
  }, []);

  //fetch all invoices function
  const fetchInvoices = async ()=>{
    try{
      const invoiceData= await invoiceServices.getAllInvoices();
      console.log(invoiceData)
      setInvoices([...invoiceData]);
    }
    catch(error)
    {
      console.error('Error fetching invoices',error.message);
    }
  }


  const handleDialogAction = async () => {
    if(dialogTitle === 'PDF Exporter') {
      exportPDF();
    } else if(dialogTitle === 'CSV Exporter') {
      exportCSV();
    } else if(dialogTitle === 'Delete Item') {
      
      try {
        await invoiceServices.deleteInvoice(currentInvoice);
        fetchInvoices();
        setDialogOpen(false);
        showSuccessToast('Invoice successfully deleted');
      } catch (error) {
        console.error('Error deleting invoice:', error.message);
        showErrorToast('Error deleting invoice')
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
    navigateTo(`/home/invoice-display`);
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

    const headers = [["ID", "No","Date/Time","Total Amount","User","Customer"]];

   
    const data = Invoices.map(elt=> [elt.ID, elt.No, elt.Date_Time , elt.Total_Amount, elt.UserName,elt.CustomerName]);

    
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
      const headers = ["ID", "No","Date/Time","Total Amount","User","Customer"];
    
      const data = Invoices.map(elt => [
        elt.ID,
        elt.No,
        elt.Date_Time ,
        elt.Total_Amount, 
        elt.UserName,
        elt.CustomerName
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



    
  const filterContent = (invoices, searchTerm) => {
    const result = invoices.filter((invoice) => {
      const values = Object.values(invoice).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
  
      return regex.test(values);
    });

    setInvoices(result);
  };


  const handleSearchInputChange = async (e) => {
    e.preventDefault();
  
    try {
  
      if (searchInput === '') {
        
        await fetchInvoices();
  
      } else {
        const res = await invoiceServices.getAllInvoices();
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
          <button onClick={() => {navigateTo(`/home/invoice-add`)}}><img src={AddLogo} alt='Add Logo'/><span>Add Invoice</span></button>
        </div>
        <div className='search-container'>
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
                <th>No.</th>
                <th>Date/Time</th>
                <th>Total Amount</th>
                <th>User</th>
                <th>Customer</th>
                
                <th className='action-column'></th>
              </tr>
            </thead>
            <tbody>
              {Invoices.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                </tr>
              ) : (
                Invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.ID}</td>
                    <td>{invoice.No}</td>
                    <td>{invoice.Date_Time }</td>
                    <td>{invoice.Total_Amount }</td>
                    <td>{invoice.UserName }</td>
                    <td>{invoice.CustomerName}</td>

                    <td>
                      <button onClick={(event) => { handleClick(event); setCurrentInvoice(invoice.ID); }}>
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
          <button onClick={() => {handleRequest('edit');}}>
            <img src={ViewLogo} alt='View Logo' />
            <span>View Invoice</span>
          </button>               
                
        </MenuItem>
        <MenuItem onClick={() => {setDialogTitle('Delete Item'); setDialogDescription('Do you want to delete this Item record?'); setDialogOpen(true); setAnchorEl(null);}}>
          <button>
            <img src={DeleteLogo} alt="Delete Logo"/>
            <span>Delete Invoice</span>
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
  );
}

export default InvoiceList;
