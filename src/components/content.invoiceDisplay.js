import React from 'react';
import React , {useEffect , useState , useRef , useCallback } from "react";
import Select from "react-select";
import invoiceServices from "../services/services.invoice";
import DeleteLogo from './../assets/icons/delete.png';
import CompanyLogo from './../assets/logos/Uni_Mart.png';
import jsPDF from 'jspdf';
import { ToastContainer  } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import QRCode from 'qrcode-generator';
import { FunctionsSharp } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";


function InvoiceDisplay() {

  return (
    
      <div className=''>
        <table>
          <thead>
            <tr>
              <th className='id'>No</th>
              <th>Item ID</th>
              <th>Description</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total Price</th>
            
            </tr>
          </thead>
          <tbody>
              {SelectedItems.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{padding: '12px 4px'}}>No data to show</td>
                </tr>
              ) : (
                SelectedItems.map((selectedItem, index) => (
                  <tr key={selectedItem.index}>
                    <td>{index + 1}</td>
                    {items.map((item) => {
                      if (item.ID === selectedItem.itemId) {
                        return (
                          <React.Fragment key={item.ID}>
                            <td>{item.Code}</td>
                            <td>{item.Name}</td>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                    <td className='price'>{'Rs ' + selectedItem.purchasePrice}</td>
                    <td className='quantity'>{selectedItem.quantity}</td>
                    <td className='price'>{'Rs ' + selectedItem.quantity * selectedItem.purchasePrice}</td>
                    <td>
                      <button onClick={() => handleRemoveItem(index, selectedItem.purchasePrice, selectedItem.quantity)}>
                        <img src={DeleteLogo} alt='Action Logo'/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>

      <div className='' style={{ display: 'flex', justifyContent: 'flex-end' }} >
          <div className='button-container' >
              <button style={{ backgroundColor: 'crimson' }} onClick={handlecancel}>Cancel</button>
              <button style={{ backgroundColor: '#2a6592' }}>Save & Print</button>
              <button style={{ backgroundColor: 'green' }} onClick={handlesavegrn}>Save</button>
          </div>
          </div>
          <ToastContainer/>
      </div>
);

        
    
  );
}

export default InvoiceDisplay;
