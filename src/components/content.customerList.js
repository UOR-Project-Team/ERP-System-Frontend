import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import FilterLogo from './../assets/icons/filter.png';
import SearchLogo from './../assets/icons/search.png';
import ActionLogo from './../assets/icons/action.png';

function CustomerList() {

  const [removeClick, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogSescription, setDialogDescription] = useState('');

  return (
    <div>
      <div className='master-content'>
          <div className='search-container'>
            <input type="text" placeholder='Explore the possibilities...' />
            <button><img src={SearchLogo} alt="Search Logo"/></button>
          </div>
      </div>
      <div className='master-content'>
        <div className='features-panel'>
          <button onClick={() => {setDialogTitle('PDF Exporter'); setDialogDescription('Do you want to export this table as PDF?'); setDialogOpen(true);}}><img src={PdfLogo} alt="Pdf Logo" /></button>
          <button onClick={() => {setDialogTitle('CSV Exporter'); setDialogDescription('Do you want to export this table as CSV?'); setDialogOpen(true);}}><img src={CsvLogo} alt="Csv Logo" /></button>
          <button><img src={FilterLogo} alt="Filter Logo" /></button>
        </div>
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>OrderID</th>
                <th>ItemCode</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Advance</th>
                <th>City</th>
                <th>Country</th>
                <th className='action-column'></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td><button><img src={ActionLogo} alt='Action Logo'/></button></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
              <tr>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td>mmmmmm</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={removeClick} onClose={() => setDialogOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{width: '250px'}}>
            {dialogSescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary">
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
