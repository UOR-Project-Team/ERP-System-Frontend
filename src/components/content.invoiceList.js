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
import { subDays, startOfToday , addDays } from 'date-fns';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';


function InvoiceList() {

  const { userData } = useUser();
  const [Invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentInvoice, setCurrentInvoice] = useState(0);
  const [selectedInterval, setSelectedInterval] = useState(null); 

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
      setFilteredInvoices([...invoiceData]);
    }
    catch(error)
    {
      console.error('Error fetching invoices',error.message);
    }
  }
  const filterInvoicesByDate = (invoices, daysAgo) => {
    const currentDate = startOfToday();
    const useDate = addDays(currentDate, 1);
    const startDate = subDays(useDate, daysAgo);
  
    console.log('Current Date:', currentDate);
    console.log('Used Date:', useDate);
    console.log('Start Date:', startDate);
  
    const filteredInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.Date_Time);
  
      console.log('Invoice Date:', invoiceDate);
  
      // Ensure the date is valid before comparison
      if (!isNaN(invoiceDate.getTime())) {
        return invoiceDate >= startDate && invoiceDate <= useDate;
      }
  
      return false;
    });
  
    console.log('Filtered Invoices:', filteredInvoices);
  
    setFilteredInvoices(filteredInvoices);
  };
  
  const handleIntervalChange = (event) => {
    const selectedDays = event.target.value;
    setSelectedInterval(selectedDays || ''); // Set an empty string when "All" is selected
    if (selectedDays !== null && selectedDays !== '') {
      filterInvoicesByDate(Invoices, selectedDays);
      //setFilteredInvoices([...Invoices]);
    } else {
      setFilteredInvoices([...Invoices]);
    }
  };
  
  useEffect(() => {
    if (selectedInterval !== '' && selectedInterval !== null) {
      filterInvoicesByDate(Invoices, selectedInterval);
      //setFilteredInvoices([...Invoices]);
    } else {
      setFilteredInvoices([...Invoices]);
    }
  }, [selectedInterval, Invoices]);

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


  const handleRequest = (type, invoiceNo) => {
    if (type === 'view') {
      navigateTo(`/home/invoice-view/${invoiceNo}`);
      console.log(invoiceNo);
    } else if (type === 'delete') {
      setDialogTitle('Delete Item');
      setDialogDescription('Do you want to delete this Item record?');
      setDialogOpen(true);
      setAnchorEl(null);
    }
  };

  const exportPDF = async () => {
    try {
      const unit = "pt";
      const size = "A4";
      const orientation = "landscape";
      const pdf = new jsPDF(orientation, unit, size);
  
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();
  
      let qrCodeImage;
      const qrCodeData = `GeneratedDate: ${formattedDate}\nGeneratedTime: ${formattedTime}\nUser: ${userData.fullname}`;
      const qr = QRCode(0, 'L');
      qr.addData(qrCodeData);
      qr.make();
      qrCodeImage = qr.createDataURL();
      
  
      const noteHeader = "INVOICE LIST";
  
      function headerText() {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.setTextColor(40);
      }
  
      function pdftext2() {
        pdf.setFont('times', 'regular');
        pdf.setFontSize(12);
        pdf.setTextColor(40);
      }
  
      function footerText() {
        pdf.setFont('crimson text', 'regular');
        pdf.setFontSize(10);
        pdf.setTextColor(40);
      }
  
      const headerLeft = function(data) {
        pdf.setFontSize(8);
        pdf.setTextColor(40);
        pdf.addImage(CompanyLogo, 'PNG', 40,20,70,70);
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
  
      const headers = [["ID", "No","Date/Time","Total Amount","User","Customer"]]; 
      const data = filteredInvoices.map(elt => [elt.ID, elt.No, elt.Date_Time , elt.Total_Amount, elt.UserName,elt.CustomerName]);
  
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
          headerLeft(data);
          headerRight(data);
          pdf.line(20, 120, pdf.internal.pageSize.width-20, 120);
          footer(data);
        }
      });
  
      setDialogOpen(false);
      pdf.save("ERP-invoice-report.pdf");
    } catch (error) {
      console.error('Error exporting PDF:', error.message);
      showErrorToast('Error exporting PDF');
    }
  };
  


    const exportCSV = () => {
      const headers = ["ID", "No","Date/Time","Total Amount","User","Customer"];
    
      const data = filteredInvoices.map(elt => [
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
      link.setAttribute('download', 'ERP-invoice-report.csv');
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
          <select className= 'invoice-Filter' value={selectedInterval} onChange={handleIntervalChange}>
            <option value={730}>All</option>
            <option value={5}>Last 5 days</option>
            <option value={10}>Last 10 days</option>
            <option value={20}>Last 20 days</option>
            <option value={30}>Last 30 days</option>
          </select>
       
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
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.ID}</td>
                    <td>{invoice.No}</td>
                    <td>{invoice.Date_Time }</td>
                    <td>{invoice.Total_Amount }</td>
                    <td>{invoice.UserName }</td>
                    <td>{invoice.CustomerName}</td>

                    <td>
                      <button onClick={(event) => { handleClick(event); setCurrentInvoice(invoice.No); }}>
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
          <button onClick={() => handleRequest('view', currentInvoice)}>
            <img src={ViewLogo} alt='View Logo' />
            <span>View Invoice</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => handleRequest('delete')}>
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
