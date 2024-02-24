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
  const [searchInput, setSearchInput] = useState('');
  const [noResults, setNoResults] = useState(false);


  useEffect(() => {
    fetchReportsData();
  } ,[])

  const fetchReportsData = async () => {
    try {
      const reportData = await reportsServices.getStockMovement();
      console.log(reportData);
      setReportData([...reportData]);
      setNoResults(false);
    } catch (error) {
      console.error('Error fetching stock movement data', error.message);
    }
  }
  const filterContent = (reportData, searchTerm) => {
    const result = reportData.filter((data) => {
      const values = Object.values(data).join(' ').toLowerCase();
      const regex = new RegExp(`\\b${searchTerm.toLowerCase()}`);
  
      return regex.test(values);
    });

    if(result.length === 0){
      showErrorToast('No any matching item.Please check again')
    }else{
      setReportData(result);
    }

    
 
  };

  const handleSearchInputChange = async (e) => {
    e.preventDefault();
    try {
      if (searchInput === '') {
        await fetchReportsData();
      } else {
        const res = await reportsServices.getStockMovement();
        if (res) {
           filterContent(res, searchInput);
        }
      }
    } catch (error) {
      console.error('Error handling search input', error.message);
    }
  };

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
      <ToastContainer />
      <div className='list-content-top'>
          <div className='button-container'>
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
              <button onClick={(e) => handleSearchInputChange(e)}><img src={SearchLogo} alt="Search Logo"/></button>
            </form>
          </div>
        </div>
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

