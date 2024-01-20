import React from 'react';
import WidgetType1 from '../widgets/widget.type1';
import HorizontalBars from '../widgets/barchart.horizontal';

function Dashboard() {

  return (
    <div className='dashboard-container'>

      <div className='row-container1'>
        <WidgetType1 id={1} total={435} monthly={32}/>
        <WidgetType1 id={2} total={435} monthly={32}/>
        <WidgetType1 id={3} total={435} monthly={32}/>
        <WidgetType1 id={4} total={435} monthly={32}/>
      </div>

      <div className='row-container3'>
        <span className='column-container1'>
          <div className='r1'>
            <div className='c1'>Monthly Purchases</div>
            <div className='c2'><HorizontalBars /></div>
          </div>
        </span>
        <span className='column-container2'>
          <div className='r1'>
            <div className='c1'>Monthly Sales</div>
            <div className='c2'><HorizontalBars /></div>
          </div>
        </span>
      </div>

      <div className='row-container2'>
        <span className='column-container1'>
          <div className='r1'>
            <div className='c1'>Monthly Purchases</div>
            <div className='c2'><HorizontalBars /></div>
          </div>
          <div className='r2'>
            <div className='c1'>Monthly Sales</div>
            <div className='c2'><HorizontalBars /></div>
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
