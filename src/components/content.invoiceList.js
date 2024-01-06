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
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentInvoice, setCurrentInvoice] = useState(0);
  


  useEffect(()=>{
    fetchInvoices();
  }, []);









  //fetch all invoices function
  const fetchInvoices = async ()=>{
    try{
      const invoiceData= await invoiceServices.getAllInvoices();
      console.log(invoiceData)
      //setItems(itemData);
      setInvoices([...Invoices]);
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
        setAnchorEl(null);
        setModelContent(type);
        setIsModalOpen(true);

        //fetchItem(currentItem);
        // fetchCategoryOptions();
        // fetchUnitOptions();
        // fetchSupplierOptions();
  
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

   
    const data = Invoices.map(elt=> [elt.ID, elt.Code, elt.Name , elt.CategoryName, elt.UnitName,]);

    
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
    
      const data = Invoices.map(elt => [
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

  return (
    <div>
      Invoice List
    </div>
  );
}

export default InvoiceList;
