import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function CustomAutoComplete({ data, error, list, label, name, classtype, handleChanges, setFormData }) {
  
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
    <div>
    <Autocomplete
        disablePortal
        className={classtype}
        options={list}
        renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              name={name}
              error={error ? true : false}
              value={fontSize}
              onChange={(e) => handleChanges(e)}
              InputLabelProps={{
                style: {
                fontSize: fontSize,
                },
              }}
              style={{padding: 0}}
            />
        )}
        onChange={(_, newValue) => {
          setFormData((prevData) => ({ ...prevData, [name]: newValue?.label || '' }));
        }}
        value={data}
    />
    
    </div>
  );
}

export default CustomAutoComplete;
