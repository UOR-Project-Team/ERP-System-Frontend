import React , {useState , useEffect }from 'react';
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
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import AddLogo from './../assets/icons/add.png';
import PdfLogo from './../assets/icons/pdf.png';
import CsvLogo from './../assets/icons/csv.png';
import SearchLogo from './../assets/icons/search.png';
import ViewLogo from './../assets/icons/view.png';
import ActionLogo from './../assets/icons/action.png';
import reportsServices from '../services/services.reports';
import CompanyLogo from '../assets/logos/Uni_Mart.png';
import QRCode from 'qrcode-generator';
import { useUser } from '../services/services.UserContext';


function StockMovementReports() {

  const { userTokenData } = useUser();
  const [reportData , setReportData ] = useState([]);

  useEffect(() => {
    fetchReportsData();
  } ,[])

  const fetchReportsData = async () => {
    try {
      const reportData = await reportsServices.getStockMovement();
      console.log(reportData);
      setReportData([...reportData]);
    } catch (error) {
      console.error('Error fetching stock movement data', error.message);
    }
  }
  const renderTableByDescription = (description, data) => (
    <div key={description} className='table-container'>
      <div className='stock-report-category'>
        <h4 className='stock-report-category-name'>Category : {description}</h4>
      </div>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.Product_ID}>
              <td>{item.Product_ID}</td>
              <td>{item.Name}</td>
              <td>{item.Total_Quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderReports = () => {
    const groupedData = {};
    reportData.forEach((item) => {
      if (!groupedData[item.Description]) {
        groupedData[item.Description] = [];
      }
      groupedData[item.Description].push(item);
    });

    return Object.keys(groupedData).map((description) =>
      renderTableByDescription(description, groupedData[description])
    );
  };

  


  return (
    <div>
      <div className='list-container'>
        <div className='list-content'>
          <div className='features-panel'>
            <button><img src={PdfLogo} alt='pdf Logo' /></button>
            <button><img src={CsvLogo} alt='CSV Logo'/></button>
          </div>
          {renderReports()}
        </div>
      </div>
    </div>
  );
}

export default StockMovementReports;

