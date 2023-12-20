import React from 'react';
import ProfitLogo from './../assets/icons/dash-profit.png';
import PurchaseLogo from './../assets/icons/dash-purchase.png';
import RevenueLogo from './../assets/icons/dash-revenue.png';
import SaleLogo from './../assets/icons/dash-sale.png';

function Dashboard() {

  return (
    <div className='dashboard-container'>
      <div className='row-container1'>
        <div id='b1' className='box'>
          <div className='r1'>
            Total Purchases
          </div>
          <div className='r2'>
            <span className='c1'>
              <img src={PurchaseLogo}/>
            </span>
            <span className='c2'>
              435
            </span>
          </div>
          <div className='r3'>
            <span className='c1'>
              This Month
            </span>
            <span className='c2'>
              253
            </span>
          </div>
        </div>
        <div id='b2' className='box'>
          <div className='r1'>
            Total Sale
          </div>
          <div className='r2'>
            <span className='c1'>
              <img src={SaleLogo}/>
            </span>
            <span className='c2'>
              1432
            </span>
          </div>
          <div className='r3'>
            <span className='c1'>
              This Month
            </span>
            <span className='c2'>
              324
            </span>
          </div>
        </div>
        <div id='b3' className='box'>
          <div className='r1'>
            Revenue
          </div>
          <div className='r2'>
            <span className='c1'>
              <img src={RevenueLogo}/>
            </span>
            <span className='c2'>
              435
            </span>
          </div>
          <div className='r3'>
            <span className='c1'>
              This Month
            </span>
            <span className='c2'>
              253
            </span>
          </div>
        </div>
        <div id='b4' className='box'>
          <div className='r1'>
            Profit
          </div>
          <div className='r2'>
            <span className='c1'>
              <img src={ProfitLogo}/>
            </span>
            <span className='c2'>
              435
            </span>
          </div>
          <div className='r3'>
            <span className='c1'>
              This Month
            </span>
            <span className='c2'>
              253
            </span>
          </div>
        </div>
      </div>
      <div className='row-container2'>
        <span className='column-container1'>
          <div className='r1'>
            <div className='c1'>Monthly Purchases</div>
            <div className='c2'></div>
          </div>
          <div className='r2'>
            <div className='c1'>Monthly Sales</div>
            <div className='c2'></div>
          </div>
        </span>
        <span className='column-container2'>
          <div className='r1'>Inventory</div>
        </span>
      </div>
    </div>
  );
}

export default Dashboard;
