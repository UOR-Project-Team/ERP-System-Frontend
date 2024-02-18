import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';

const CustomMenuItem = ({ onClick, children }) => {

    const [height, setHeight] = useState('10px');
    const [padding, setPadding] = useState('10px');

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);
  
    const handleResize = () => {
        const deviceWidth = window.innerWidth;
        const deviceHeight = window.innerHeight;
    
        if(deviceHeight > 600 || deviceWidth > 1300 ) {
            setHeight('36px');
            setPadding('16px');
        }
        if(deviceHeight <= 600 || deviceWidth <= 1300) {
            setHeight('32px');
            setPadding('14px');
        }
        if (deviceHeight <= 400 || deviceWidth <= 890) {
            setHeight('15px');
            setPadding('12px');
        }
        if (deviceWidth <= 370) {
            setHeight('10px');
            setPadding('10px');
        }
    };

    return (
        <MenuItem onClick={onClick} style={{ minHeight: height, paddingLeft: padding, paddingRight: padding }}>
        {children}
        </MenuItem>
    );
};

export default CustomMenuItem;
