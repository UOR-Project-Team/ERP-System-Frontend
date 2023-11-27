import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserLogo from './../assets/icons/user.png';
import ProfileLogo from './../assets/icons/profile.png';
import KeyLogo from './../assets/icons/key.png';
import LogoutLogo from './../assets/icons/logout.png';
import SettingsLogo from './../assets/icons/settings.png';
import NotificationLogo from './../assets/icons/notification.png';

const Header = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

    return (
      <div className="header">
          <div className="left">
            <img src={UserLogo} alt="User Logo"/>
            <span>Nuvindu Senarathne</span>
          </div>
          <div className="middle">
                <h2>{props.text}</h2>
          </div>
          <div className="right">
            <img src={NotificationLogo} alt="Notification Logo"/>
            <img src={SettingsLogo} alt="Settings Logo" onClick={handleClick}/>
          </div>

          <Menu className='settings-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>
            <button>
                <img src={ProfileLogo} alt="Profile Logo"/>
                <span>My Profile</span>
              </button>
            </MenuItem>
            <MenuItem onClick={handleClose}>
            <button>
                <img src={KeyLogo} alt="Key Logo"/>
                <span>Change Password</span>
              </button>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <button>
                <img src={LogoutLogo} alt="Logout Logo"/>
                <span>Logout</span>
              </button>
            </MenuItem>
          </Menu>

      </div>
    );
  }
  
  export default Header;

