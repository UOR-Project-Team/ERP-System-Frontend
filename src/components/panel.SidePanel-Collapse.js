import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightArrowLogo from './../assets/icons/right.png';
import DashboardLogo from './../assets/icons/dashboard.png';
import MasterFileLogo from './../assets/icons/customer.png';
import PurchasingLogo from './../assets/icons/purchase.png';
import SalesLogo from './../assets/icons/sales.png';
import ReportLogo from './../assets/icons/report.png';
import MasterListLogo from './../assets/icons/list.png';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const SidePanelCollapse = ({ onToggle, updateHeaderText}) => {
  
  const navigateTo = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE4, setAnchorE4] = useState(null);
  const [anchorE5, setAnchorE5] = useState(null);


  const handleClose = () => {
      setAnchorEl(null);
      setAnchorE2(null);
      setAnchorE3(null);
      setAnchorE4(null);
      setAnchorE5(null);
  };

  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClick3 = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleClick4 = (event) => {
    setAnchorE4(event.currentTarget);
  };

  const handleClick5 = (event) => {
    setAnchorE5(event.currentTarget);
  };

  return (
    <div>
      <div className='header'>
        <button><img src={RightArrowLogo} onClick={onToggle} alt="Left Arrow Logo" /></button>
      </div>
      <div className='body'>
        <button title="Dashboard" onClick={() => {navigateTo('/home'); updateHeaderText('Dashboard');}}><img src={DashboardLogo} alt="Dashboard Logo" /></button>
        <button title="Master Files" onClick={handleClick1}><img src={MasterFileLogo} alt="Master File Logo" /></button>
        <button title="Purchasing" onClick={handleClick2}><img src={PurchasingLogo} alt="Purchasing Logo" /></button>
        <button title="Sales" onClick={handleClick3}><img src={SalesLogo} alt="Sales Logo" /></button>
        <button title="Reports" onClick={handleClick4}><img src={ReportLogo} alt="Report Logo" /></button>
        <button title="Master Lists" onClick={handleClick5}><img src={MasterListLogo} alt="Master List Logo" /></button>
      </div>

      <Menu className='side-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => {navigateTo(`/home/category-master`); setAnchorEl(null); updateHeaderText('Category Master')}}>
        <button>
            <span>Category Master</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/unit-master`); setAnchorEl(null); updateHeaderText('Unit Master')}}>
        <button>
            <span>Unit Master</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/item-master`); setAnchorEl(null); updateHeaderText('Item Master')}}>
        <button>
            <span>Item Master</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/supplier-master`); setAnchorEl(null); updateHeaderText('Supplier Master')}}>
        <button>
            <span>Supplier Master</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/user-master`); setAnchorEl(null); updateHeaderText('User Master')}}>
        <button>
            <span>User Master</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/customer-master`); setAnchorEl(null); updateHeaderText('Customer Master')}}>
        <button>
            <span>Customer Master</span>
          </button>
        </MenuItem>
      </Menu>

      <Menu className='side-menu' anchorEl={anchorE2} keepMounted open={Boolean(anchorE2)} onClose={handleClose}>
        <MenuItem onClick={() => {navigateTo(`/home/good-received-note`); setAnchorE2(null); updateHeaderText('Good Received Note')}}>
        <button>
            <span>Good Received Note</span>
          </button>
        </MenuItem>
      </Menu>

      <Menu className='side-menu' anchorEl={anchorE3} keepMounted open={Boolean(anchorE3)} onClose={handleClose}>
        <MenuItem onClick={() => {navigateTo(`/home/invoice-add`); setAnchorE3(null); updateHeaderText('Invoice Add')}}>
        <button>
            <span>Invoice Add</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/invoice-display`); setAnchorE3(null); updateHeaderText('Invoice Display')}}>
        <button>
            <span>Invoice Display</span>
          </button>
        </MenuItem>
      </Menu>

      <Menu className='side-menu' anchorEl={anchorE4} keepMounted open={Boolean(anchorE4)} onClose={handleClose}>
        <MenuItem onClick={() => {navigateTo(`/home/stock-movement-reports`); setAnchorE4(null); updateHeaderText('Stock Movement Reports')}}>
        <button>
            <span>Stock Movement Reports</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/profit-loss-reports`); setAnchorE4(null); updateHeaderText('Profit & Loss Reports')}}>
        <button>
            <span>Profit & Loss Reports</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/other-reports`); setAnchorE4(null); updateHeaderText('Other Reports')}}>
        <button>
            <span>Other Reports</span>
          </button>
        </MenuItem>
      </Menu>

      <Menu className='side-menu' anchorEl={anchorE5} keepMounted open={Boolean(anchorE5)} onClose={handleClose}>
        <MenuItem onClick={() => {navigateTo(`/home/category-list`); setAnchorE5(null); updateHeaderText('Category List')}}>
        <button>
            <span>Category List</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/unit-list`); setAnchorE5(null); updateHeaderText('Unit List')}}>
        <button>
            <span>Unit List</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/item-list`); setAnchorE5(null); updateHeaderText('Item List')}}>
        <button>
            <span>Item List</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/supplier-list`); setAnchorE5(null); updateHeaderText('Supplier List')}}>
        <button>
            <span>Supplier List</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/user-list`); setAnchorE5(null); updateHeaderText('User List')}}>
        <button>
            <span>User List</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/customer-list`); setAnchorE5(null); updateHeaderText('Customer List')}}>
        <button>
            <span>Customer List</span>
          </button>
        </MenuItem>
        <MenuItem onClick={() => {navigateTo(`/home/invoice-list`); setAnchorE5(null); updateHeaderText('Invoice List')}}>
        <button>
            <span>Invoice List</span>
          </button>
        </MenuItem>
      </Menu>

      </div>
  );
};

export default SidePanelCollapse;
