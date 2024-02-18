import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

function CustomTextfield({ data, error, label, name, classtype, handleChanges }) {
  
  const [fontSize, setFontSize] = useState('16px');

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
        setFontSize('16px');
      }
      if (deviceHeight <= 400 || deviceWidth <= 890) {
        setFontSize('14px');
      }
      if (deviceWidth <= 370) {
        setFontSize('12px');
      }
  };

  return (
      <TextField
        error={error ? true : false}
        name={name}
        value={data}
        onChange={(e) => handleChanges(e)}
        label={label}
        variant='outlined'
        className={classtype}
        InputProps={{
          style: {
            fontSize: fontSize
          },
        }}
        InputLabelProps={{
          style: {
            fontSize: fontSize
          },
        }}
      />
  );
}

export default CustomTextfield;
