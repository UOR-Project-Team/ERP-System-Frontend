import React from 'react';
import '../assets/styles/box-widget.css';

function BoxWidget({id, total, name, img, monthly}) {

  return (
    <div id={'b' + id} className='box-widget'>
      <div className='r1'>
          {name}
      </div>
      <div className='r2'>
        <span className='c1'>
          <img
          src={img}
          alt='logo'
          />
        </span>
        <span className='c2'>
          {total}
        </span>
      </div>
      <div className='r3'>
        <span className='c1'>
          This Month
        </span>
        <span className='c2'>
          {monthly}
        </span>
      </div>
    </div>
  );
}

export default BoxWidget;
