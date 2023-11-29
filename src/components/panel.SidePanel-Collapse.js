import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import CloseLogo from './../assets/icons/close.png';
import RightArrowLogo from './../assets/icons/right.png';
import DashboardLogo from './../assets/icons/dashboard.png';
import MasterFileLogo from './../assets/icons/customer.png';
import PurchasingLogo from './../assets/icons/purchase.png';
import SalesLogo from './../assets/icons/sales.png';
import ReportLogo from './../assets/icons/report.png';
import MasterListLogo from './../assets/icons/list.png';

Modal.setAppElement('#root');


const SidePanelCollapse = ({ onToggle }) => {
  
  const navigateTo = useNavigate();

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen5, setIsModalOpen5] = useState(false);

  const openModal1 = () => {setIsModalOpen1(true);};
  const openModal2 = () => {setIsModalOpen2(true);};
  const openModal3 = () => {setIsModalOpen3(true);};
  const openModal4 = () => {setIsModalOpen4(true);};
  const openModal5 = () => {setIsModalOpen5(true);};

  const closeModal1 = () => {setIsModalOpen1(false);};
  const closeModal2 = () => {setIsModalOpen2(false);};
  const closeModal3 = () => {setIsModalOpen3(false);};
  const closeModal4 = () => {setIsModalOpen4(false);};
  const closeModal5 = () => {setIsModalOpen5(false);};

  const navigateModal1 = (path) => {
    setIsModalOpen1(false);
    navigateTo(`/home/${path}-master`);
  };

  const navigateModal2 = (path) => {
    setIsModalOpen2(false);
    navigateTo(`/home/${path}`);
  };

  const navigateModal3 = (path) => {
    setIsModalOpen3(false);
    navigateTo(`/home/invoice-${path}`);
  };

  const navigateModal4 = (path) => {
    setIsModalOpen4(false);
    navigateTo(`/home/${path}-reports`);
  };

  const navigateModal5 = (path) => {
    setIsModalOpen5(false);
    navigateTo(`/home/${path}-list`);
  };
  

  return (
    <div>
      <div className='header'>
        <button><img src={RightArrowLogo} onClick={onToggle} alt="Left Arrow Logo" /></button>
      </div>
      <div className='body'>
        <button title="Dashboard" onClick={() => navigateTo('/home')}><img src={DashboardLogo} alt="Dashboard Logo" /></button>
        <button title="Master Files" onClick={openModal1}><img src={MasterFileLogo} alt="Master File Logo" /></button>
        <button title="Purchasing" onClick={openModal2}><img src={PurchasingLogo} alt="Purchasing Logo" /></button>
        <button title="Sales" onClick={openModal3}><img src={SalesLogo} alt="Sales Logo" /></button>
        <button title="Reports" onClick={openModal4}><img src={ReportLogo} alt="Report Logo" /></button>
        <button title="Master Lists" onClick={openModal5}><img src={MasterListLogo} alt="Master List Logo" /></button>
      </div>
      <Modal
        isOpen={isModalOpen1}
        onRequestClose={closeModal1}
        contentLabel="Example Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className='close' onClick={closeModal1}><img src={CloseLogo} alt="Close Logo" /></button>
        <h2>Master Files</h2>
        <button onClick={() => navigateModal1('category')}>Category Master</button>
        <button onClick={() => navigateModal1('unit')}>Unit Master</button>
        <button onClick={() => navigateModal1('item')}>Item Master</button>
        <button onClick={() => navigateModal1('supplier')}>Supplier Master</button>
        <button onClick={() => navigateModal1('employee')}>Employee Master</button>
        <button onClick={() => navigateModal1('customer')}>Customer Master</button>
      </Modal>
      <Modal
        isOpen={isModalOpen2}
        onRequestClose={closeModal2}
        contentLabel="Example Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className='close' onClick={closeModal2}><img src={CloseLogo} alt="Close Logo" /></button>
        <h2>Purchasing</h2>
        <button onClick={() => navigateModal2('good-received-note')}>Good Recieved Note</button>
      </Modal>
      <Modal
        isOpen={isModalOpen3}
        onRequestClose={closeModal3}
        contentLabel="Example Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className='close' onClick={closeModal3}><img src={CloseLogo} alt="Close Logo" /></button>
        <h2>Sales</h2>
        <button onClick={() => navigateModal3('add')}>Invoice Add</button>
        <button onClick={() => navigateModal3('display')}>Invoice Display</button>
      </Modal>
      <Modal
        isOpen={isModalOpen4}
        onRequestClose={closeModal4}
        contentLabel="Example Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className='close' onClick={closeModal4}><img src={CloseLogo} alt="Close Logo" /></button>
        <h2>Reports</h2>
        <button onClick={() => navigateModal4('stock-movement')}>Stock Movement Report</button>
        <button onClick={() => navigateModal4('profit-loss')}>Profit & Loss Report</button>
        <button onClick={() => navigateModal4('other')}>Other Reports</button>
      </Modal>
      <Modal
        isOpen={isModalOpen5}
        onRequestClose={closeModal5}
        contentLabel="Example Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className='close' onClick={closeModal5}><img src={CloseLogo} alt="Close Logo" /></button>
        <h2>Master Lists</h2>
        <button onClick={() => navigateModal5('category')}>Category List</button>
        <button onClick={() => navigateModal5('item')}>Item List</button>
        <button onClick={() => navigateModal5('supplier')}>Supplier List</button>
        <button onClick={() => navigateModal5('employee')}>Employee List</button>
        <button onClick={() => navigateModal5('customer')}>Customer List</button>
        <button onClick={() => navigateModal5('invoice')}>Invoice List</button>
      </Modal>
      </div>
  );
};

export default SidePanelCollapse;
