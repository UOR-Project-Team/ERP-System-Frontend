import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from '../components/panel.Header';
import SidePanelCollapse from '../components/panel.SidePanel-Collapse';
import SidePanelExpand from '../components/panel.SidePanel-Expand';
import Dashboard from '../components/content.dashboard';
import CustomerMaster from '../components/content.customerMaster';

function Home() {
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePanel = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="container">
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
            <Route path="customer-master" element={<CustomerMaster />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;
