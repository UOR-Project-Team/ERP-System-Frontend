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
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/ToasterMessage';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import SearchLogo from './../assets/icons/search.png';
import EditLogo from './../assets/icons/edit.png';
import ActionLogo from './../assets/icons/action.png';
import DeleteLogo from './../assets/icons/delete.png';
import unitServices from '../services/services.unit';
import TextField from '@mui/material/TextField';
import validateUnit from '../services/validate.category';
import { Link } from "react-router-dom";

function UnitList() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [removeClick, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogDescription, setDialogDescription] = useState('');
    const [units, setUnits] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [modelContent, setModelContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUnit, setCurrentUnit] = useState(0);
  

   



const [fields ] = useState({
    ID: true,
    Description: true,
    SI: true
  
  });

  

  const [formData , setFormData] = useState({
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
    fetchUnits();
  }, []);

 

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
  }catch(error){
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
        } else {
          console.log("Unit not found");
          showErrorToast('Unit not found');
        }
      }

      const handleUpdateReset = () => {
        setFormData(() => ({
          Description: '',
          SI: ''
          
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
        const doc = new jsPDF(orientation, unit, size);

      const header = function(data) {
            doc.setFontSize(8);
            doc.setTextColor(40);
            doc.text("Innova ERP Solution - Unit Report", data.settings.margin.left, 30);
      };

      const footer = function(data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };

    const headers = [["ID", "Description","SI"]];

   
    const data = units.map(elt=> [elt.ID, elt.Description , elt.SI]);

    
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
      doc.save("ERP-unit-report.pdf");
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
                </div>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                               <th style={{ display: fields.ID ? 'table-cell' : 'none' }}>ID</th>
                               <th style={{ display: fields.Description ? 'table-cell' : 'none' }}>Description</th>
                               <th style={{ display: fields.SI ? 'table-cell' : 'none' }}>SI</th>
                               <th className='action-column'></th>
                            </tr>
                        </thead>
                        <tbody>
                        {units.length === 0 ?(
                          <tr>
                                <td colSpan='3' style={{ padding: '12px 4px' }}>
                                 No data to show
                                </td>
                          </tr>
                            ) : (      
                        units.map((unit)  =>(
                          <tr key={unit.id}>
                                  <td style={{ display: fields.ID ? 'table-cell' : 'none' }}>{unit.ID}</td>
                                  <td style={{ display: fields.Description ? 'table-cell' : 'none' }}>{unit.Description}</td>
                                   <td style={{ display: fields.SI ? 'table-cell' : 'none' }}>{unit.SI}</td>
                                   <td>
                                      <button onClick={(event) => { handleClick(event); setCurrentUnit(unit.ID); }}>
                                        <img src={ActionLogo} alt='Action Logo' />
                                      </button>
                                    </td>
                            </tr>
                                ))
                                
                                ) }     
                         </tbody>
                     </table>
                   </div>
                 </div>
            <div className='list-addbutton-container'>
            <Link to = "/home/unit-master">
                <button className='list-addbutton'>Add Unit</button>

            </Link>
            </div>

            <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} >
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
                                 <button type='submit' class='submit-button' onClick={handleUpdateSubmit}>Update</button>
                                 <button type='reset' class='reset-button' onClick={handleUpdateReset}>Reset</button>
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