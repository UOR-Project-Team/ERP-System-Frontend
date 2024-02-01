import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import invoiceServices from '../services/services.invoice';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function InvoiceView() {
    const { invoiceNo } = useParams();
    const [invoiceData, setInvoiceData] = useState(null);
    const [salesData, setsalesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigateTo = useNavigate();
  
    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const invoiceData = await invoiceServices.getInvoiceData(invoiceNo);
            setInvoiceData(invoiceData);
        } catch (error) {
            console.error('Error fetching invoices', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [invoiceNo]);

    useEffect(() => {
        const fetchSalesItems = async () => {
        try {
            setLoading(true);
            const SalesData = await invoiceServices.getSalesData(invoiceNo);
            setsalesData(SalesData);
        } catch (error) {
            console.error('Error fetching sales item', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
        };

        fetchSalesItems();
    }, [invoiceNo]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
   const displayInvoice = invoiceData && invoiceData.length > 0 ? invoiceData[0] : null;

    if (!displayInvoice) {
        return <div>No data available.</div>;
    }

   const dateTimeString = displayInvoice.Date_Time;
   const dateObject = new Date(dateTimeString);
   const formattedDate = dateObject.toISOString().split('T')[0];

   return (
        <div className="grn-container">
        <div className="grn-content">
            <span className="content1-left">
            <div className="content1-container">
                <span className="content-left">Customer Name:</span>
                <span className="content-right">{displayInvoice.CustomerName}</span>
            </div>
            <div className="content1-container">
                <span className="content-left">Customer Contact:</span>
                <span className="content-right">{displayInvoice.CustomerContact}</span>
            </div>
            </span>
            <span className="content1-right">
            <div className="content1-container">
                <span className="content-left">Invoice Number:</span>
                <span className="content-right">{displayInvoice.No}</span>
            </div>
            <div className="content1-container">
                <span className="content-left">Generated Date:</span>
                <span className="content-right">{formattedDate}</span>
            </div>
            </span>
            <span className="content1-right">
            <div className="content1-container">
                <span className="content-left">User Name:</span>
                <span className="content-right">{displayInvoice.UserName}</span>
            </div>
            </span>
        </div>
        {salesData ? (
    <div className="grn-content">
        <table>
        <thead>
            <tr>
            <th className="id">No</th>
            <th>Item Code</th>
            <th>Description</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
            </tr>
        </thead>
        <tbody>
            {salesData.map((salesitem, index) => (
            <tr key={salesitem.Code}>
                <td>{index + 1}</td>
                <td>{salesitem.Code}</td>
                <td>{salesitem.ProductName}</td>
                <td className="price">{'Rs' + salesitem.UnitPrice}</td>
                <td className="quantity">{salesitem.Quantity}</td>
                <td className="price">{'Rs' + salesitem.Quantity * salesitem.UnitPrice}</td>
            </tr>
            ))}
        </tbody>
        </table>
        
    </div>
  
   ) : (
    <div>Loading...</div>
   )}
      <div className='grn-content' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className='value-container' >
          <div className='value-content'>
            <span>Total Amount: </span>
            <span> {displayInvoice.Total_Amount}</span>
          </div>          
        </div>
        
      </div> 
      <div className='button-container-InvoiceView'>
            <Button variant="contained" color="success" onClick={() => {navigateTo(`/home/invoice-list`)}}>
             OK
            </Button>
      </div> 
      </div>   
  );
}

export default InvoiceView;