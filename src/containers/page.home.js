import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from '../components/panel.Header';
import SidePanelCollapse from '../components/panel.SidePanel-Collapse';
import SidePanelExpand from '../components/panel.SidePanel-Expand';
import Dashboard from '../components/content.dashboard';
import CustomerMaster from '../components/content.customerMaster';
import CategoryMaster from '../components/content.categoryMaster';
import UnitMaster from '../components/content.unitMaster';
import ItemMaster from '../components/content.itemMaster';
import SupplierMaster from '../components/content.supplierMaster';
import UserMaster from '../components/content.userMaster';
import GRN from '../components/content.GRN';
import InvoiceAdd from '../components/content.invoiceAdd';
import InvoiceDisplay from '../components/content.invoiceDisplay';
import OtherReports from '../components/content.otherReports';
import ProfitLossReports from '../components/content.profitLossReports';
import StockMovementReports from '../components/content.stockMovementReports';
import CategoryList from '../components/content.categoryList';
import ItemList from '../components/content.itemList';
import SupplierList from '../components/content.supplierList';
import UserList from '../components/content.userList';
import CustomerList from '../components/content.customerList';
import InvoiceList from '../components/content.invoiceList';
import UnitList from '../components/content.unitList';
import InvoiceView from '../components/content.invoiceView';

function Home({ updateAuthentication }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headerText, setHeaderText] = useState("Control Panel");

  // Side Panel component changing funcion
  const togglePanel = () => {
    setIsExpanded((prev) => !prev);
  };

  // Header text changing funcion
  const updateHeaderText = (text) => {
    setHeaderText(text);
  };

  const getHeaderText = () => {
    return headerText;
  }

  // Logout funcion
  const toggleupdateAuthentication = () => {
    updateAuthentication(false)
  };

  const handleResize = () => {
    const deviceWidth = window.innerWidth;
    if(deviceWidth <= 890) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="master-container">
      <div className="sidepanel-container" style={{ width: isExpanded ? '20%' : '60px' }}>
        {isExpanded ? (
          <SidePanelExpand onToggle={togglePanel} updateHeaderText={updateHeaderText} />
        ) : (
          <SidePanelCollapse onToggle={togglePanel} updateHeaderText={updateHeaderText} />
        )}
      </div>
      <div className="main-container">
        <div className="header-container">
          <Header getHeaderText={getHeaderText} toggleupdateAuthentication={toggleupdateAuthentication} />
        </div>
        <div className="body-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="category-master" element={<CategoryMaster />} />
            <Route path="unit-master" element={<UnitMaster />} />
            <Route path="item-master" element={<ItemMaster />} />
            <Route path="supplier-master" element={<SupplierMaster />} />
            <Route path="user-master" element={<UserMaster />} />
            <Route path="user-master/:id" element={<UserMaster />} />
            <Route path="customer-master" element={<CustomerMaster />} />
            <Route path="good-received-note" element={<GRN />} />
            <Route path="invoice-add" element={<InvoiceAdd />} />
            <Route path="invoice-display" element={<InvoiceDisplay />} />
            <Route path="stock-movement-reports" element={<StockMovementReports />} />
            <Route path="profit-loss-reports" element={<ProfitLossReports />} />
            <Route path="other-reports" element={<OtherReports />} />
            <Route path="category-list" element={<CategoryList updateHeaderText={updateHeaderText} />} />
            <Route path="/item-list/*" element={<ItemList updateHeaderText={updateHeaderText} />} />
            <Route path="supplier-list" element={<SupplierList updateHeaderText={updateHeaderText} />} />
            <Route path="user-list" element={<UserList updateHeaderText={updateHeaderText} />} />
            <Route path="customer-list" element={<CustomerList updateHeaderText={updateHeaderText} />} />
            <Route path="invoice-view/:invoiceNo" element={<InvoiceView />} />
            <Route path="invoice-list" element={<InvoiceList updateHeaderText={updateHeaderText} />} />
            <Route path="unit-list" element={<UnitList updateHeaderText={updateHeaderText} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;
