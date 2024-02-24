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
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Modal from 'react-modal';
import "jspdf-autotable";
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import AddLogo from './../assets/icons/add.png';
import ItemLogo from './../assets/icons/item.png';
import SearchLogo from './../assets/icons/search.png';
import EditLogo from './../assets/icons/edit.png';
import ActionLogo from './../assets/icons/action.png';
import DeleteLogo from './../assets/icons/delete.png';
import unitServices from '../services/services.unit';
import TextField from '@mui/material/TextField';
import validateUnit from '../services/validate.category';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';

function UnitList({updateHeaderText}) {

  const { userTokenData } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [units, setUnits] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modelContent, setModelContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(0);

  const navigateTo = useNavigate();

  const [formData , setFormData] = useState({
    ID:'',
    Description:'',
    SI: ''
  });

  const [formResetData , setFormResetData] = useState({
    ID:'',
    Description:'',
    SI: ''
  });

  const [errorMessage , setErrorMessage] = useState({
    ID:'',
    Description:'',
    SI: ''
  });

  useEffect(() => {
    updateHeaderText('Unit List');
    fetchUnits('all');
  }, [updateHeaderText]);

  const fetchUnits = async () => {
    try {
      const unitData = await unitServices.getAllUnits();
      setUnits(unitData);
    } catch (error) {
      console.error('Error fetching units:', error.message);
    }
  };

  const filterContent = (units, searchTerm) => {
    const result = units.filter((unit) => {
      const values = Object.values(unit).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
  
      return regex.test(values);
    });
    setUnits(result);
  };

  const handleSearchInputChange = async (e) => {
    e.preventDefault();
    try {
      if (searchInput === '') {
        await fetchUnits();
      } else {
        const res = await unitServices.getAllUnits();
        if(res) {
          filterContent(res , searchInput);
        }
      }
    } catch(error) {
      console.error('Error handling search input',error.message)
    }
  };

  const handleDialogAction = async () => {
    if(dialogTitle === 'PDF Exporter') {
      exportPDF();
    } else if(dialogTitle === 'CSV Exporter') {
      exportCSV();
    } else if(dialogTitle === 'Delete Unit') {
      try {
        await unitServices.deleteUnit(currentUnit);
        setDialogOpen(false);
        fetchUnits();
        showSuccessToast('Unit successfully deleted');
      } catch (error) {
        console.error('Error deleting unit:', error.message);
        showErrorToast('Error deleting unit');
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

    const validationErrors = validateUnit(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      showSuccessToast('Check the inputs again');
      return
    }

    try {
      const response = await unitServices.updateUnit(currentUnit, formData)
      fetchUnits();
      setIsModalOpen(false);
      showSuccessToast('Unit successfully updated');
      console.log('Unit updated:', response);
      handleUpdateReset();
    } catch(error) {
      console.error('Error Updating unit:', error.message);
      showErrorToast('Error updating unit');
    }
  };

  const fetchUnit = () => {
    const foundUnit = units.find((unit) => unit.ID === currentUnit);

    if (foundUnit) {
      setFormData({
        Description: foundUnit.Description || '',
        SI: foundUnit.SI || '',
      });
      setFormResetData({
        Description: foundUnit.Description || '',
        SI: foundUnit.SI || '',
      });
    } else {
      console.log("Unit not found");
      showErrorToast('Unit not found');
    }
  }

  const handleUpdateReset = () => {
    setFormData(() => ({
      Description: formResetData.Description,
      SI: formResetData.SI
    }));
    setErrorMessage({
      Description: '',
      SI: ''
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

    const qrCodeData = `Date: ${formattedDate}\nTime: ${formattedTime}\nUser: ${userTokenData.fullname}`;
    const qr = QRCode(0, 'L');
    qr.addData(qrCodeData);
    qr.make();
    const qrCodeImage = qr.createDataURL();

    const noteHeader = "UNIT LIST"

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

    const headers = [["ID", "Description","SI"]];
    const data = units.map(elt=> [elt.ID, elt.Description , elt.SI]);

  
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
    pdf.save("ERP-unit-report.pdf");
  };

  const exportCSV = () => {
    const headers = ["ID", "Description" , "SI"];
  
    const data = units.map(elt => [
      elt.ID,
      elt.Description,
      elt.SI
    ]);
  
    const csvData = [headers, ...data];
  
    const csv = Papa.unparse(csvData);
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'ERP-unit-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDialogOpen(false);
  };

  return(
    <div>
      <div className='list-container'>
        <ToastContainer />
        <div className='list-content-top'>
          <div className='button-container'>
            <button onClick={() => {navigateTo(`/home/unit-master`); updateHeaderText('Unit Master');}}><img src={AddLogo} alt='Add Logo'/><span>Add Unit</span></button>
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
              <button onClick={handleSearchInputChange}><img src={SearchLogo} alt="Search Logo"/></button>
            </form>
          </div>
        </div>
        <div className='list-content'>
          {/* <div className='features-panel'>
            <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
            <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
          </div> */}
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>SI</th>
                  <th className='action-column'></th>
                </tr>
              </thead>
              <tbody>
              {units.length === 0 ?(
                <tr>
                      <td colSpan='4' style={{ padding: '12px 4px' }}>
                        No data to show
                      </td>
                </tr>
                  ) : (      
              units.map((unit)  =>(
                <tr key={unit.ID}>
                        <td>{unit.ID}</td>
                        <td>{unit.Description}</td>
                        <td>{unit.SI}</td>
                        <td>
                          <button onClick={(event) => { handleClick(event); setCurrentUnit(unit.ID); }}>
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
          <button onClick={() => {navigateTo(`/home/item-list/unit/${currentUnit}`); updateHeaderText(`Item List`)}}>
            <img src={ItemLogo} alt='Item Logo' />
            <span>View Items</span>
          </button>         
        </MenuItem>
        <MenuItem>
          <button onClick={() => {fetchUnit(); handleRequest('edit');}}>
          <img src={EditLogo} alt='Edit Logo' />
          <span>Edit Unit</span>
          </button>
                
        </MenuItem>
        <MenuItem onClick={() => {setDialogTitle('Delete Unit'); setDialogDescription('Do you want to delete this unit record?'); setDialogOpen(true); setAnchorEl(null);}}>
          <button>
          <img src={DeleteLogo} alt="Delete Logo"/>
          <span>Delete Unit</span>
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
              <h3>Update Unit</h3>
              <form className='form-container'>
                <h3>Unit Details</h3>
                  <TextField className='text-line-type1' name='Description' value={formData.Description} onChange={(e) => handleChanges(e)} label="Description" variant='outlined' />
                  <label className='error-text'>{errorMessage.Description}</label>
                  <TextField className='text-line-type1' name='SI' value={formData.SI} onChange={(e) => handleChanges(e)} label="SI" variant='outlined' />
                  <label className='error-text'>{errorMessage.SI}</label>
                  <div className='button-container'>
                    <button type='submit' className='submit-button' onClick={handleUpdateSubmit}>Update</button>
                    <button type='reset' className='reset-button' onClick={handleUpdateReset}>Reset</button>
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

export default UnitList;