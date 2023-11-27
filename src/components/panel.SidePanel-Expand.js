import React, { useState } from 'react';
import RightArrowLogo from './../assets/icons/left.png';
import DashboardLogo from './../assets/icons/dashboard.png';
import MasterFileLogo from './../assets/icons/customer.png';
import PurchasingLogo from './../assets/icons/purchase.png';
import SalesLogo from './../assets/icons/sales.png';
import ReportLogo from './../assets/icons/report.png';
import MasterListLogo from './../assets/icons/list.png';
import SingleRightLogo from './../assets/icons/singleright.png';
import DoubleRightLogo from './../assets/icons/doubleright.png';

const SidePanelCollapse = ({ onToggle }) => {
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [rotatedButton, setRotatedButton] = useState([]);

  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategories((prevSubcategories) => {
      if (prevSubcategories.includes(subcategory)) {
        return prevSubcategories.filter((item) => item !== subcategory);
      } else {
        return [...prevSubcategories, subcategory];
      }
    });
  
    setRotatedButton((prevSubcategories) => {
      if (prevSubcategories.includes(subcategory)) {
        return prevSubcategories.filter((item) => item !== subcategory);
      } else {
        return [...prevSubcategories, subcategory];
      }
    });
  };

  return(
    <div className='expanded'>
      <div className='header'>
        <button><img src={RightArrowLogo} onClick={onToggle} alt="Left Arrow Logo"/></button>
      </div>
      <div className='body'>
        <button>
          <img src={DashboardLogo} alt="Dashboard Logo"/>
          <span>Dashboard</span>
          <img style={{width: '14px', height: '14px', visibility: 'hidden'}} src={SingleRightLogo} alt="SingleRight Logo"/>
        </button>
        <button onClick={() => handleSubcategoryClick('masterFiles')}>
          <img src={MasterFileLogo} alt="Master File Logo"/>
          <span>Master Files</span>
          <img className={`subCategoryIcon ${rotatedButton.includes('masterFiles') ? 'rotate' : ''}`} style={{width: '14px', height: '14px'}} src={SingleRightLogo} alt="SingleRight Logo"/>
        </button>
          <div className={`subCategory ${activeSubcategories.includes('masterFiles') ? 'visible' : ''}`}>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Category Master</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Unit Master</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Item Master</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Supplier Master</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Employee Master</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Customer Master</span>
            </button>
          </div>
        <button onClick={() => handleSubcategoryClick('purchasing')}>
          <img src={PurchasingLogo} alt="Purchasing Logo"/>
          <span>Purchasing</span>
          <img className={`subCategoryIcon ${rotatedButton.includes('purchasing') ? 'rotate' : ''}`} style={{width: '14px', height: '14px'}} src={SingleRightLogo} alt="SingleRight Logo"/>
        </button>
        <div className={`subCategory ${activeSubcategories.includes('purchasing') ? 'visible' : ''}`}>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Good Recieved Note</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Good Recieved Note Add</span>
            </button>
          </div>
        <button onClick={() => handleSubcategoryClick('sales')}>
          <img src={SalesLogo} alt="Sales Logo"/>
          <span>Sales</span>
          <img className={`subCategoryIcon ${rotatedButton.includes('sales') ? 'rotate' : ''}`} style={{width: '14px', height: '14px'}} src={SingleRightLogo} alt="SingleRight Logo" />
        </button>
        <div className={`subCategory ${activeSubcategories.includes('sales') ? 'visible' : ''}`}>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Invoice Add</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Invoice Display</span>
            </button>
          </div>
        <button onClick={() => handleSubcategoryClick('reports')}>
          <img src={ReportLogo} alt="Report Logo"/>
          <span>Reports</span>
          <img className={`subCategoryIcon ${rotatedButton.includes('reports') ? 'rotate' : ''}`} style={{width: '14px', height: '14px'}} src={SingleRightLogo} alt="SingleRight Logo" />
        </button>
          <div className={`subCategory ${activeSubcategories.includes('reports') ? 'visible' : ''}`}>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Stock Movement Report</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Profit & Loss Report</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Other Reports</span>
            </button>
          </div>
        <button onClick={() => handleSubcategoryClick('masterlists')}>
          <img src={MasterListLogo} alt="Master List Logo"/>
          <span>Master Lists</span>
          <img className={`subCategoryIcon ${rotatedButton.includes('masterlists') ? 'rotate' : ''}`} style={{width: '14px', height: '14px'}} src={SingleRightLogo} alt="SingleRight Logo" />
        </button>
          <div className={`subCategory ${activeSubcategories.includes('masterlists') ? 'visible' : ''}`}>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Category List</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Item List</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Supplier List</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Employee List</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Customer List</span>
            </button>
            <button>
              <img src={DoubleRightLogo} alt="Double RightLogo"/>
              <span>Invoice List</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default SidePanelCollapse;
