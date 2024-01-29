import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Modal from 'react-modal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useUser } from '../services/services.UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import KeyLogo from './../assets/icons/key.png';
import LogoutLogo from './../assets/icons/logout.png';
import SettingsLogo from './../assets/icons/settings.png';
import NotificationLogo from './../assets/icons/notification.png';
import WidgetLogo from './../assets/icons/widget.png';
import userServices from '../services/services.user';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import validatProfile from '../services/validate.profile';

Modal.setAppElement('#root');

const Header = ({ getHeaderText, toggleupdateAuthentication }) => {

  const navigate = useNavigate();

  const { userTokenData, setuserTokenData } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelContent, setModelContent] = useState('profile');
  const [removeClick, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullname: userTokenData.fullname,
    email: userTokenData.email,
    NIC: userTokenData.nic,
    contactno: userTokenData.contactno,
    address: userTokenData.address,
    city: userTokenData.city
  });

  const [errorMessage, setErrorMessage] = useState({
    fullname: '',
    email: '',
    NIC: '',
    contactno: '',
    address: '',
    city: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPW: '',
    newPW: '',
    confirmPW: ''
  });

  const [passwordError, setPasswordError] = useState({
    currentPW: '',
    newPW: '',
    confirmPW: ''
  });

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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validations
    const validationErrors = validatProfile(formData);
    setErrorMessage(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      showErrorToast('Check the inputs again');
      return
    }

    try {
      await userServices.updateProfile(userTokenData.userid, formData)
      const updatedFields = {
        fullname: formData.fullname,
        email: formData.email,
        nic: formData.NIC,
        contactno: formData.contactno,
        address: formData.address,
        city: formData.city
      };
      const newUserData = { ...userTokenData, ...updatedFields };
      setuserTokenData(newUserData);
      setIsModalOpen(false);
      showSuccessToast('Profile successfully updated')
    } catch(error) {
      const { message, attributeName } = error.response.data;
      showErrorToast(`${message}`);
    
      if (attributeName) {
        if(attributeName==='Email') {
          setErrorMessage({
            email: 'This Email already Exists',
          });
        } else if(attributeName==='NIC') {
          setErrorMessage({
            nic: 'This National ID/Passport already Exists',
          });
        } else if(attributeName==='ContactNo') {
          setErrorMessage({
            contactno: 'This Contact Number already Exists',
          });
        }
      }
      console.error('Error:', message);
    } 
  };

  const handleUpdateReset = () => {
    setFormData({
      fullname: userTokenData.fullname,
      email: userTokenData.email,
      NIC: userTokenData.nic,
      contactno: userTokenData.contactno,
      address: userTokenData.address,
      city: userTokenData.city
    });
    setErrorMessage({
      fullname:'',
      email: '',
      NIC: '',
      contactno: '',
      address: '',
      city: ''
    });
  };

  const handlePasswordChanges = (event) => {
    const { name, value } = event.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handlePasswordSubmit = async (e) =>  {
    e.preventDefault();

    if(passwordData.currentPW === '') {
      setPasswordError({
        currentPW: 'This field is required *'
      })
      return;
    } else {
      setPasswordError({
        currentPW: ''
      })
    }

    if(passwordData.newPW === '') {
      setPasswordError({
        newPW: 'This field is required *'
      })
      return;
    } else {
      setPasswordError({
        newPW: ''
      })
    }

    if(passwordData.confirmPW === '') {
      setPasswordError({
        confirmPW: 'This field is required *'
      })
      return;
    } else {
      setPasswordError({
        confirmPW: ''
      })
    }

    try {
      const response = await userServices.verifyPassword(userTokenData.userid,  {
        currentPW: passwordData.currentPW
      });

      if (response.status === 200) {
        console.log('Password verified');
        setPasswordError({
          currentPW: ''
        })
      }

    } catch (error) {
      console.error('[Error] :', error);
      if (error.response && error.response.status === 401) {
        setPasswordError({
          currentPW: 'Please check the password again.'
        })
        showErrorToast(`Invalid credentials`);
      } else {
        showErrorToast(`Internal Server Error`);
      }
      return;
    }

    if(passwordData.newPW !== passwordData.confirmPW) {
      setPasswordError({
        confirmPW: 'Password mismatch. Please check this field again.'
      })
      showErrorToast(`Password mismatch`);
      return;
    }

    try {
      await userServices.updatePassword(userTokenData.userid, {
        newPW: passwordData.newPW
      });
      setIsModalOpen(false);
      console.log('Password changed.');
      showSuccessToast('Password successfully updated!');
      handlePasswordReset();
    } catch (error) {
      console.error('[Error] :', error);
      handlePasswordReset();
      showErrorToast(`Error occured while updating`);
    }
    
  };

  const handlePasswordReset = () => {
    setPasswordData({
        currentPW: '',
        newPW: '',
        confirmPW: ''
    });
    setPasswordError({
        currentPW: '',
        newPW: '',
        confirmPW: ''
    });
  };

  return (
    <div className="header">
        <div className="left">
          <h2>{getHeaderText()}</h2>
        </div>
        <div className="right">
          <span>
          <button onClick={() => handleRequest('profile')}>
              <span className='text-container'>
                <div className='uname-text'>{userTokenData.fullname}</div>
                <div className='type-text'>{userTokenData.jobrole === 'admin' ? ('Administrator') : ('System User')}</div>
              </span>
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
            <button onClick={() => handleRequest('widget')}>
              <img src={WidgetLogo} alt="Widget Logo"/>
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
                  <button type='submit' className='submit-button' onClick={handleUpdateSubmit}>Submit</button>
                  <button type='reset' className='reset-button' onClick={handleUpdateReset}>Reset</button>
                </div>
              </form>
            </div>
          ) : modelContent === "updatePassword" ? (
            <div className='edit-model'>
              <h3>Change Password</h3>
              <form className='form-container'>
                <TextField  className='text-line-type1' name='currentPW' value={passwordData.currentPW} onChange={(e) => handlePasswordChanges(e)} label="Current Password" type="password" />
                <label className='error-text'>{passwordError.currentPW}</label>
                <TextField  className='text-line-type1' name='newPW' value={passwordData.newPW} onChange={(e) => handlePasswordChanges(e)} label="New Password" type="password" />
                <label className='error-text'>{passwordError.newPW}</label>
                <TextField  className='text-line-type1' name='confirmPW' value={passwordData.confirmPW} onChange={(e) => handlePasswordChanges(e)} label="Confirm Password" type="password" />
                <label className='error-text'>{passwordError.confirmPW}</label>
                <div className='button-container'>
                  <button type='submit' class='submit-button' onClick={handlePasswordSubmit}>Submit</button>
                  <button type='reset' class='reset-button' onClick={handlePasswordReset}>Reset</button>
                </div>
              </form>
            </div>
          ) : modelContent === "widget" ? (
            <p>Widget component</p>
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

        <ToastContainer/>

    </div>
  );
}
  
  export default Header;

