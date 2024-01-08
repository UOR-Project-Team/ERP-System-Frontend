import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Modal from 'react-modal';
import { jwtDecode } from "jwt-decode";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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

Modal.setAppElement('#root');

const Header = ({ getHeaderText, toggleupdateAuthentication }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelContent, setModelContent] = useState('profile');
  const [removeClick, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: '',
    fullname: '',
    jobrole:'',
    loginflag:'',
    userid:'',
  })

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser({
        userid: decodedToken.userid,
        username: decodedToken.username,
        fullname: decodedToken.fullname,
        jobrole: decodedToken.jobrole,
        loginflag: decodedToken.loginflag,
      })
    } else {
      console.log('Token not found');
    }
  }, []); 

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
                  <div className='uname-text'>{currentUser.fullname}</div>
                  <div className='type-text'>{currentUser.jobrole === 'admin' ? ('Administrator') : ('System User')}</div>
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
              <p>Load profile</p>
            ) : modelContent === "updatePassword" ? (
              <p>Load Update Password</p>
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

