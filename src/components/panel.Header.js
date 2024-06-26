import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Modal from 'react-modal';
import Menu from '@mui/material/Menu';
import CustomMenuItem from './custom.muiMenuItem';
import CustomTextfield from './custom.muiTextfield';
import CustomPasswordfield from './custom.muiPasswordField';
import { useUser } from '../services/services.UserContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccessToast, showErrorToast } from '../services/services.toasterMessage';
import userServices from '../services/services.user';
import validatProfile from '../services/validate.profile';
import SidePanelCollapse from './panel.sidePanel-collapsed';
import ProfileLogo from './../assets/icons/profile.png';
import KeyLogo from './../assets/icons/key.png';
import LogoutLogo from './../assets/icons/logout.png';
import SettingsLogo from './../assets/icons/settings.png';
import NotificationLogo from './../assets/icons/notification.png';
import WidgetLogo from './../assets/icons/widget.png';
import UploadLogo from './../assets/icons/upload.png';
import DeleteLogo from './../assets/icons/delete-light.png';
import MenuLightLogo from './../assets/icons/menu-light.png';
import MenuDarkLogo from './../assets/icons/menu-dark.png';
import DefaultProfile from './../assets/images/default-user-profile.png';

Modal.setAppElement('#root');

const Header = ({ getHeaderText, toggleupdateAuthentication }) => {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

  const { userTokenData, updateUserToken } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelContent, setModelContent] = useState('profile');
  const [removeClick, setDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullname: userTokenData.fullname,
    email: userTokenData.email,
    NIC: userTokenData.nic,
    contactno: userTokenData.contactno,
    address: userTokenData.address,
    city: userTokenData.city,
    file: null
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

  useEffect(() => {
    if(!userTokenData.loginflag) {
      handleRequest('updatePassword')
      updateUserLoginFlag();
      updateUserToken();
    }
  }, []);

  const updateUserLoginFlag = async () => {
    try {
      await userServices.updateLoginFlag(userTokenData.userid);
      console.log('Login flag updated successfully');
    } catch (error) {
      console.error('Error updating login flag:', error);
    }
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

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

  // Handle changes of update user form
  const handleChanges = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload of update user form
  const handleUploadBtnClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length > 1) {
      showErrorToast('Multiple inputs are not allowed.');
    }

    if (files.length == 1) {
      const selectedFile = files[0];
      const fileType = selectedFile.type.split('/')[0];
      if (fileType !== 'image') {
        showErrorToast('Please select an image file.');
        return;
      }
      setFormData({ ...formData, file: selectedFile });
    }
  };

  // Remove uploaded image from user from
  const handleRemoveImage = () => {
    setFormData({ ...formData, file: null });
  };


  // Submit the profile updation form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validate the input fields
    const validationErrors = validatProfile(formData);
    setErrorMessage(validationErrors);

    // Pop up an error meassage if validation failed
    if (Object.values(validationErrors).some((error) => error !== '')) {
      showErrorToast('Check the inputs again');
      return
    }

    try {

      // Send updated user data to backend API.
      const {token} = await userServices.updateProfile(userTokenData.userid, formData);

      // Update the JWT token on local storage
      localStorage.setItem('token', token);
      updateUserToken();
      setIsModalOpen(false);
      showSuccessToast('Profile successfully updated');
      handleRemoveImage();
    } catch(error) {
      if (error.response) {
        const { message, attributeName } = error.response.data;
        showErrorToast(`${message}`);
  
        if (attributeName) {
          if (attributeName === 'Email') {
            setErrorMessage({
              email: 'This Email already Exists',
            });
          } else if (attributeName === 'NIC') {
            setErrorMessage({
              nic: 'This National ID/Passport already Exists',
            });
          } else if (attributeName === 'ContactNo') {
            setErrorMessage({
              contactno: 'This Contact Number already Exists',
            });
          }
        }
        console.error('Error:', message);
      } else {
        setErrorMessage('Internal server error.');
        console.error('Unknown error:', error);
      }
    } 
  };

  // Reset the profile updation form
  const handleUpdateReset = () => {
    handleRemoveImage();
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

  // Handle attribute changes of change password form
  const handlePasswordChanges = (event) => {
    const { name, value } = event.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Submit the change password form
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

    if(passwordData.newPW !== passwordData.confirmPW) {
      setPasswordError({
        confirmPW: 'Password mismatch. Please check this field again.'
      })
      showErrorToast(`Password mismatch`);
      return;
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

  // Reset the change password form
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

  // Logout function for the system
  const handleLogout = () => {
    setAnchorEl(null);
    toggleupdateAuthentication()
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="header">
        <div className="left">
          <img src={MenuDarkLogo} alt='Menu Logo' onClick={handleOpenMenu} /> 
          <h2>{getHeaderText()}</h2>
        </div>
        <div className="right">
          <span>
            <button>
              <img title='Profile' src={baseURL + '/' + userTokenData.imageUrl} onError={(e) => { e.target.onerror = null;  e.target.alt = ''; e.target.src = DefaultProfile;  }} alt="User"/>
              <span className='text-container'>
                <div className='uname-text'>{userTokenData.fullname}</div>
                <div className='type-text'>{userTokenData.jobrole}</div>
              </span>
            </button>
          </span>
            <img title='Notification' src={NotificationLogo} alt="Notification Logo"/>
            <img title='Settings' src={SettingsLogo} alt="Settings Logo" onClick={handleClick}/>
        </div>

        {isMenuOpen && (
          <div className='slide-menu'>
          <div className='slide-header'>
          <img src={MenuLightLogo} alt='Menu Logo' onClick={handleCloseMenu} /> 
          </div>
          <div className="sidepanel-container">
          <SidePanelCollapse/>
          </div>
        </div>
        )}

        <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <CustomMenuItem onClick={() => handleRequest('profile')}>
            <button>
              <img src={ProfileLogo} alt="Profile Logo"/>
              <span>Update Profile</span>
            </button>
          </CustomMenuItem>
          <CustomMenuItem onClick={() => handleRequest('updatePassword')}>
            <button>
              <img src={KeyLogo} alt="Key Logo"/>
              <span>Change Password</span>
            </button>
          </CustomMenuItem>
          <CustomMenuItem style={{ minHeight: '10px' }}>
            <button onClick={() => handleRequest('widget')}>
              <img src={WidgetLogo} alt="Widget Logo"/>
              <span>Widgets</span>
            </button>
          </CustomMenuItem>
          <CustomMenuItem onClick={handleClose}>
            <button onClick={() => setDialogOpen(true)}>
              <img src={LogoutLogo} alt="Logout Logo"/>
              <span>Logout</span>
            </button>
          </CustomMenuItem>
        </Menu>

        <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {setIsModalOpen(false);}}
        contentLabel="Header-Model"
        className="modal-content"
        overlayClassName="modal-overlay"
        >
          {modelContent === "profile" ? (
            <div className='edit-model'>
              <h3>Update Profile</h3>
              <form className='form-container'>

              <h3>User Details</h3>
                <CustomTextfield data={formData.fullname} error={errorMessage.fullname} name={'fullname'} label={'Fullname'} classtype={'text-line-type1'} handleChanges={handleChanges} />
                {errorMessage.fullname && (<label className='error-text'>{errorMessage.fullname}</label>)}
                <CustomTextfield data={formData.NIC} error={errorMessage.NIC} name={'NIC'} label={'National ID / Passport'} classtype={'text-line-type1'} handleChanges={handleChanges} />
                {errorMessage.NIC && (<label className='error-text'>{errorMessage.NIC}</label>)}

                <h3>Contact Details</h3>
                <div className='line-type2-container'>
                  <div className='line-type2-content'>
                    <CustomTextfield data={formData.email} error={errorMessage.email} name={'email'} label={'Email'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                    {errorMessage.email && (<label className='error-text'>{errorMessage.email}</label>)}
                  </div>
                  <div className='line-type2-content'>
                    <CustomTextfield data={formData.contactno} error={errorMessage.contactno} name={'contactno'} label={'Contact Number'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                    {errorMessage.contactno && (<label className='error-text'>{errorMessage.contactno}</label>)}
                  </div>
                </div>

                <h3>Address</h3>
                <div className='line-type2-container'>
                  <div className='line-type2-content'>
                    <CustomTextfield data={formData.address} error={errorMessage.address} name={'address'} label={'Address'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                    {errorMessage.address && (<label className='error-text'>{errorMessage.address}</label>)}
                  </div>
                  <div className='line-type2-content'>
                    <CustomTextfield data={formData.city} error={errorMessage.city} name={'city'} label={'City'} classtype={'text-line-type2'} handleChanges={handleChanges} />
                    {errorMessage.city && (<label className='error-text'>{errorMessage.city}</label>)}
                  </div>
                </div>

                <h3>Profile picture</h3>
                <div className='profile-picture-upload-container'>
                  <input ref={fileInputRef} type="file" accept="image/*" className="profile-picture-upload" onChange={handleFileChange} style={{ display: 'none' }} />
                  <button className="profile-picture-upload-btn" onClick={handleUploadBtnClick}>
                    <img src={UploadLogo} alt='Upload' />
                    <span>Upload Image</span>
                  </button>
                  {formData.file && (
                    <button  className="profile-picture-remove-btn"  type="button" onClick={handleRemoveImage}>
                      <img src={DeleteLogo} alt='Delete' />
                    </button>
                  )}
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
                <CustomPasswordfield data={passwordData.currentPW} error={passwordError.currentPW} name={'currentPW'} label={'Current Password'} classtype={'text-line-type1'} handleChanges={handlePasswordChanges} />
                {passwordError.currentPW && (<label className='error-text'>{passwordError.currentPW}</label>)}
                <CustomPasswordfield data={passwordData.newPW} error={passwordError.newPW} name={'newPW'} label={'New Password'} classtype={'text-line-type1'} handleChanges={handlePasswordChanges} />
                {passwordError.newPW && (<label className='error-text'>{passwordError.newPW}</label>)}
                <CustomPasswordfield data={passwordData.confirmPW} error={passwordError.confirmPW} name={'confirmPW'} label={'Confirm Password'} classtype={'text-line-type1'} handleChanges={handlePasswordChanges} />
                {passwordError.confirmPW && (<label className='error-text'>{passwordError.confirmPW}</label>)}
                <div className='button-container'>

                  <button type='submit' class='submit-button' onClick={handlePasswordSubmit}>Submit</button>
                  { (userTokenData.loginFlag) ? (
                    <button type='reset' class='reset-button' onClick={handlePasswordReset}>Reset</button>
                  ) : (
                    <button type='reset' class='reset-button' onClick={handlePasswordReset}>Reset</button>
                  )}
                  
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

