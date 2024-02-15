import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import PdfLogo from './../assets/icons/pdf.png';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import Papa from 'papaparse';
import CsvLogo from './../assets/icons/csv.png';



function ProfitLossReports() {

  const { userTokenData } = useUser();
  const [fromDate, setfromDate] = useState();
  const [toDate, settoDate] = useState();
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [removeClick, setDialogOpen] = useState(false);


  const data ={

    total_sales:1000,
    total_purchase:500,
    profit_loss:500
  }


  const exportPDF = (data) => {

    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";

    // Create a new jsPDF instance
    const doc = new jsPDF(orientation, unit, size);
  
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();


    const qrCodeData = `Date: ${formattedDate}\nTime: ${formattedTime}\nUser: ${userTokenData.fullname}`;
    const qr = QRCode(0, 'L');
    qr.addData(qrCodeData);
    qr.make();
    const qrCodeImage = qr.createDataURL();

    const noteHeader = "Profit & Loss Report"

    function headerText(){
      doc.setFont('helvetica', 'bold'); 
      doc.setFontSize(20); 
      doc.setTextColor(40);
    }

    function pdftext2(){
      doc.setFont('times', 'regular');
      doc.setFontSize(12); 
      doc.setTextColor(40);
    } 

    function footerText(){
      doc.setFont('crimson text', 'regular');
      doc.setFontSize(10); 
      doc.setTextColor(40);
    } 

    const headerLeft = function(data) {
      doc.setFontSize(8);
      doc.setTextColor(40);
      doc.addImage(CompanyLogo, 'PNG' , 40,20,70,70);
      headerText();
      doc.text('UNI MART' , 115 , 35);
      pdftext2();
      doc.text('University Of Ruhuna' , 115 , 50);
      doc.text('Wellamadama' , 115 , 63);
      doc.text('Matara' , 115 , 76);
      doc.text('0372222222' , 115 , 89);
    };


    const headerRight = function(data) {
      headerText();
      doc.text(noteHeader , 638 , 35);
      doc.addImage(qrCodeImage, 'JPEG', 635, 37, 60, 60);
      pdftext2();
      doc.text(`${userTokenData.fullname}`, 700, 55);
      doc.text(`${formattedDate}`, 700, 70);
      doc.text(`${formattedTime}`, 700, 85);
   };

   const footer = function(data) {
    const pageCount = doc.internal.getNumberOfPages();
    doc.line(20, doc.internal.pageSize.height-30, doc.internal.pageSize.width-20, doc.internal.pageSize.height-30);
    footerText();
    doc.text("©INNOVA ERP Solutions. All rights reserved.",320,doc.internal.pageSize.height-20);
    doc.text("Wellamadama, Matara , 0412223334",342,doc.internal.pageSize.height-10)
    doc.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, doc.internal.pageSize.height - 15);
    };
   


    // Set document properties
    doc.setProperties({
      title: 'Profit and Loss Report'
    });
  
    // Set font size and style
    doc.setFontSize(12);
  
    // Define table columns and rows
    const columns = ['Category', 'Amount(Rs.)', 'Total(Rs.)'];
    const rows = [
      ['Income','',''],
      ['Sales', data.total_sales,''],
      ['Total Income','', data.total_sales],
  
      ['Expenses','',''],
      ['Cost of goods sold', data.total_purchase,''],
      ['Total Expenses','', data.total_purchase],
      ['Profit/Loss','', data.profit_loss]
    ];
  
    // Add the table using autoTable plugin
    doc.autoTable({
      startY: 150, 
      head: [columns],
      body: rows,
      theme: 'striped',
        styles: {
          head: { fillColor: [38, 2, 97], textColor: [255, 255, 255] }, 
          body: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, 
        },
  
      didParseCell: function(data) {
          if (data.row.index === 0) { // Check for first row (headings)
              if (data.cell.text === 'Expenses' || data.cell.text === 'Income') {
                  data.cell.styles.fillColor = '#ffffcc'; // Light yellow highlight
                  data.cell.styles.lineWidth = 2; // Thicker border
                  data.cell.styles.fontStyle = 'bold'; // Bold text
              }
          }
      },
      addPageContent: function(data) {
        headerRight(data);
        headerLeft(data);
        doc.line(20, 120, doc.internal.pageSize.width-20, 120);
        footer(data);
    }

    });
  
    // Save the PDF
    setDialogOpen(false);
    doc.save('profit_loss_report.pdf');
  }

  const exportCSV = () => {
    const headers = ['Category', 'Amount(Rs.)', 'Total(Rs.)'];
  
    const rows = [
      ['Income','',''],
      ['Sales', data.total_sales,''],
      ['Total Income','', data.total_sales],
  
      ['Expenses','',''],
      ['Cost of goods sold', data.total_purchase,''],
      ['Total Expenses','', data.total_purchase],
      ['Profit/Loss','', data.profit_loss]
    ];
    
  
    const csvData = [headers, ...rows];
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


  const handleDialogAction = async () => {
    if(dialogTitle === 'PDF Exporter') {
      exportPDF(data);
    } else if(dialogTitle === 'CSV Exporter') {
      exportCSV();
    } 
  };


  return (
    <div className='list-container'>
      <div className='list-content-top'>
          
          <div className='date-container'>
            <form>
              <span>From Date :</span>
              <input
                type="date"
                placeholder='From'
                value={fromDate}
                onChange={(e) => setfromDate(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key === 'Enter') {
                //     e.preventDefault();
                //     handleSearchInputChange(e);
                //   }
                // }}
              />
              
              <span>To Date :</span>
              <input
                type="date"
                placeholder='To'
                value={toDate}
                onChange={(e) => settoDate(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key === 'Enter') {
                //     e.preventDefault();
                //     handleSearchInputChange(e);
                //   }
                // }}
              />
              
              
              {/* <button onClick={handleSearchInputChange}><img src={SearchLogo} alt="Search Logo"/></button> */}
            </form>
          </div>
      </div>



      <div className='list-content'>

        <div className='features-panel'>
            <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this Profit & Loss report as a PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
            <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this Profit & Loss report as a CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
        </div>

        <div className='table-container'>
          <table>
            <table>
                  <thead>
                    <tr>
                      <th>Income</th>
                      <th>Amount Rs.</th>
                      <th>Total Rs.</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      <tr>
                        <td>Sales</td>
                        <td>{data.total_sales}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td><b>Total Income</b></td>
                        <td></td>
                        <td>{data.total_sales}</td>
                      </tr>
                    
                    <tr>
                      <th>Expenses</th>
                      <td></td> {/* Leave this column empty for expenses */}
                      <td></td>
                    </tr>
                    
                    <tr>
                        <td>Cost of goods sold</td>
                        <td>{data.total_purchase}</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td><b>Total Expenses</b></td>
                        <td></td>
                        <td>{data.total_purchase}</td>
                    </tr>

                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td><b>Profit/Loss</b></td>
                        <td></td>
                        <td>{data.profit_loss}</td>
                    </tr>
                    
                  </tbody>
                </table>
          </table>
        </div>
      </div>

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

export default ProfitLossReports;
