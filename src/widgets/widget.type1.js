import React from 'react';
import ProfitLogo from './../assets/icons/dash-profit.png';
import PurchaseLogo from './../assets/icons/dash-purchase.png';
import RevenueLogo from './../assets/icons/dash-revenue.png';
import SaleLogo from './../assets/icons/dash-sale.png';

function WidgetType1({id, total, monthly}) {

  return (
    <div id={'b' + id} className='box'>
      <div className='r1'>
          {id === 1 ? <span>Total Purchases</span> : 
          id === 2 ? <span>Total Sale</span> : 
          id === 3 ? <span>Revenue</span> : 
          <span>Profit</span>}
      </div>
      <div className='r2'>
        <span className='c1'>
          <img
          src={
              id === 1 ? PurchaseLogo : 
              id === 2 ? SaleLogo : 
              id === 3 ? RevenueLogo : 
              ProfitLogo
          }
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

export default WidgetType1;
