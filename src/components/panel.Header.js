import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Modal from 'react-modal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useUser } from '../services/services.UserContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import DownLogo from './../assets/icons/down.png';
import KeyLogo from './../assets/icons/key.png';
import LogoutLogo from './../assets/icons/logout.png';
import SettingsLogo from './../assets/icons/settings.png';
import NotificationLogo from './../assets/icons/notification.png';
import WidgetLogo from './../assets/icons/widget.png';

Modal.setAppElement('#root');

const Header = ({ getHeaderText, toggleupdateAuthentication }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelContent, setModelContent] = useState('profile');
  const [removeClick, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullname:'',
    email: '',
    username: '',
    password: '',
    NIC: '',
    jobrole: '',
    contactno: '',
    address: '',
    city: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    fullname:'',
    email: '',
    username: '',
    password: '',
    NIC: '',
    jobrole: '',
    contactno: '',
    address: '',
    city: '',
  })

  const navigate = useNavigate();
  const {fullname, jobrole } = useUser();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRequest = (type) => {
    setAnchorEl(null);
    setModelContent(type);
    setIsModalOpen(true);
  }

  const handleLogout = () => {
    setAnchorEl(null);
    toggleupdateAuthentication()
    localStorage.removeItem('token');
    navigate('/');
  }

  const handleChanges = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData({
      fullname:'',
      email: '',
      username: '',
      password: '',
      NIC: '',
      jobrole: '',
      contactno: '',
      address: '',
      city: '',
        
  });
    setErrorMessage({
      fullname:'',
      email: '',
      username: '',
      password: '',
      NIC: '',
      jobrole: '',
      contactno: '',
      address: '',
      city: '',
    });
  };

    return (
      <div className="header">
          <div className="left">
            <h2>{getHeaderText()}</h2>
          </div>
          <div className="middle">
          </div>
          <div className="right">
            <span>
            <button onClick={() => handleRequest('profile')}>
                <span className='text-container'>
                  <div className='uname-text'>{fullname}</div>
                  <div className='type-text'>{jobrole === 'admin' ? ('Administrator') : ('System User')}</div>
                </span>
                <span><img src={DownLogo} alt="Down Logo"/></span>
              </button>
            </span>
              <img title='Notification' src={NotificationLogo} alt="Notification Logo"/>
              <img title='Settings' src={SettingsLogo} alt="Settings Logo" onClick={handleClick}/>
          </div>

          <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => handleRequest('updatePassword')}>
              <button>
                <img src={KeyLogo} alt="Key Logo"/>
                <span>Change Password</span>
              </button>
            </MenuItem>
            <MenuItem>
              <button>
                <img src={WidgetLogo} alt="Key Logo"/>
                <span>Widgets</span>
              </button>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <button onClick={() => setDialogOpen(true)}>
                <img src={LogoutLogo} alt="Logout Logo"/>
                <span>Logout</span>
              </button>
            </MenuItem>
          </Menu>
          <Modal
          isOpen={isModalOpen}
          onRequestClose={() => {setIsModalOpen(false)}}
          contentLabel="Header-Model"
          className="modal-content"
          overlayClassName="modal-overlay"
          >
            {modelContent === "profile" ? (
              <div className='edit-model'>
                <h3>Update Profile</h3>
                <form className='form-container'>
                  <TextField className='text-line-type1' name='fullname' value={formData.fullname} onChange={(e) => handleChanges(e)} label="Full Name" variant="outlined" />
                  <label className='error-text'>{errorMessage.fullname}</label>
                  <TextField className='text-line-type1' name='NIC' value={formData.NIC} onChange={(e) => handleChanges(e)} label="National ID / Passport" variant="outlined" />
                  <label className='error-text'>{errorMessage.NIC}</label>

                  <h3>Contact Details</h3>
                  <div className='line-type2-container'>
                    <div className='line-type2-content'>
                      <TextField className='text-line-type2' name='email' value={formData.email} onChange={(e) => handleChanges(e)} label="Email" variant="outlined"/>
                      <label className='error-text'>{errorMessage.email}</label> 
                    </div>
                    <div className='line-type2-content'>
                      <TextField className='text-line-type2' name='contactno' value={formData.contactno} onChange={(e) => handleChanges(e)} label="Contact Number" variant="outlined" />
                      <label className='error-text'>{errorMessage.contactno}</label> 
                    </div>
                  </div>

                  <h3>Address</h3>
                  <div className='line-type2-container'>
                    <div className='line-type2-content'>
                      <TextField className='text-line-type2' name='address' value={formData.address} onChange={(e) => handleChanges(e)} label="Address" variant="outlined"/>
                      <label className='error-text'>{errorMessage.address}</label> 
                    </div>
                    <div className='line-type2-content'>
                      <TextField className='text-line-type2' name='city' value={formData.city} onChange={(e) => handleChanges(e)} label="City" variant="outlined" />
                      <label className='error-text'>{errorMessage.city}</label> 
                    </div>
                  </div>

                  <div className='button-container'>
                    <button type='submit' className='submit-button' >Submit</button>
                    <button type='reset' className='reset-button' onClick={handleReset}>Reset</button>
                  </div>
                </form>
              </div>
            ) : modelContent === "updatePassword" ? (
              <div className='edit-model'>
                <h3>Change Password</h3>
                <form className='form-container'>
                  <TextField className='text-line-type1' name='current-password'  label="Current Password" variant='outlined' />
                  <label className='error-text'></label>
                  <TextField className='text-line-type1' name='new-password'  label="New Password" variant='outlined' />
                  <label className='error-text'></label>
                  <TextField className='text-line-type1' name='confirm-password'  label="Confirm Password" variant='outlined' />
                  <label className='error-text'></label>
                  <div className='button-container'>
                    <button type='submit' class='submit-button'>Submit</button>
                    <button type='reset' class='reset-button'>Reset</button>
                  </div>
                </form>
              </div>
            ) : (
              <p>Error Occured While loading the component</p>
            )}
          </Modal>

        <Dialog open={removeClick} onClose={() => setDialogOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Logout"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" style={{width: '250px'}}>
                Are you sure?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleLogout}>
                Yes
              </Button>
              <Button color="primary" autoFocus onClick={() => setDialogOpen(false)}>
                No
              </Button>
            </DialogActions>
        </Dialog>

    </div>
  );
}
  
  export default Header;

