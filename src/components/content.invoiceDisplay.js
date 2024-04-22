import React, { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import grnServices from '../services/services.grn';
import DeleteLogo from './../assets/icons/delete.png';
import { useUser } from '../services/services.UserContext';
import { showErrorToast, showSuccessToast } from "../services/services.toasterMessage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanyLogo from './../assets/logos/Uni_Mart.png';
import {generatePDFGRN} from "../services/generatePrint";


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
import AddLogo from './../assets/icons/add.png';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import SearchLogo from './../assets/icons/search.png';
import ViewLogo from './../assets/icons/view.png';
import ActionLogo from './../assets/icons/action.png';
import invoiceServices from '../services/services.invoice';


function InvoiceDisplay() {

  const [Invoices, setInvoices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentInvoice, setCurrentInvoice] = useState(0);

  const navigateTo = useNavigate();
  


  const handleClick = (event, invoiceId) => {
    // Logic to handle click event
    console.log('Button clicked for invoice ID:', invoiceId);
    // You can add more logic here as needed
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

      <div className='table-container'>

      <label>
        <table>
          <tr>
          <td width='700px'><br/>refg</td>
          <td>tfgh</td>
          </tr>
        </table>
      </label>

      </div>


      <div className='list-content'>
        
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Itemid</th>
                <th>Description</th>
                <th>price</th>
                <th>qty</th>
                <th>Total price</th>
                
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
      <div className='grn-content' style={{ display: 'flex', justifyContent: 'flex-end' }}>
  <div className='button-container button' >
    <button style={{ backgroundColor: '#2a6592', marginRight: '10px', borderRadius: '5px', padding: '5px 20px' }}>Print</button>
    <button style={{ backgroundColor: 'green', borderRadius: '5px', padding: '5px 20px' }}>Ok</button>
  </div>
</div>



      

      

    </div>


  );
}

export default InvoiceDisplay;
