import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from '../components/panel.Header';
import SidePanelCollapse from '../components/panel.SidePanel-Collapse';
import SidePanelExpand from '../components/panel.SidePanel-Expand';
import Dashboard from '../components/content.dashboard';
import CustomerMaster from '../components/content.customerMaster';
import CategoryMaster from '../components/content.categoryMaster';
import UnitMaster from '../components/content.unitMaster';
import ItemMaster from '../components/content.itemMaster';
import SupplierMaster from '../components/content.supplierMaster';
import EmployeeMaster from '../components/content.employeeMaster';
import GRN from '../components/content.GRN';
import InvoiceAdd from '../components/content.invoiceAdd';
import InvoiceDisplay from '../components/content.invoiceDisplay';
import OtherReports from '../components/content.otherReports';
import ProfitLossReports from '../components/content.profitLossReports';
import StockMovementReports from '../components/content.stockMovementReports';
import CategoryList from '../components/content.categoryList';
import ItemList from '../components/content.itemList';
import SupplierList from '../components/content.supplierList';
import EmployeeList from '../components/content.employeeList';
import CustomerList from '../components/content.customerList';
import InvoiceList from '../components/content.invoiceList';

function Home() {
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePanel = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="master-container">
      <div className="sidepanel-container" style={{ width: isExpanded ? '20%' : '60px' }}>
        {isExpanded ? (
          <SidePanelExpand onToggle={togglePanel} />
        ) : (
          <SidePanelCollapse onToggle={togglePanel} />
        )}
      </div>
      <div className="main-container">
        <div className="header-container">
          <Header text={"Dashboard"} />
        </div>
        <div className="body-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="category-master" element={<CategoryMaster />} />
            <Route path="/unit-master" element={<UnitMaster />} />
            <Route path="item-master" element={<ItemMaster />} />
            <Route path="supplier-master" element={<SupplierMaster />} />
            <Route path="employee-master" element={<EmployeeMaster />} />
            <Route path="customer-master" element={<CustomerMaster />} />
            <Route path="good-received-note" element={<GRN />} />
            <Route path="invoice-add" element={<InvoiceAdd />} />
            <Route path="invoice-display" element={<InvoiceDisplay />} />
            <Route path="stock-movement-reports" element={<StockMovementReports />} />
            <Route path="profit-loss-reports" element={<ProfitLossReports />} />
            <Route path="other-reports" element={<OtherReports />} />
            <Route path="category-list" element={<CategoryList />} />
            <Route path="item-list" element={<ItemList />} />
            <Route path="supplier-list" element={<SupplierList />} />
            <Route path="employee-list" element={<EmployeeList />} />
            <Route path="customer-list" element={<CustomerList />} />
            <Route path="invoice-list" element={<InvoiceList />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;
