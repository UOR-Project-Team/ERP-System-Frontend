import React, { useState, useEffect } from 'react';
import BoxWidget from '../widgets/widget.box';
import dashboardService from '../services/services.dashboard';
import ProfitLogo from './../assets/icons/dash-profit.png';
import PurchaseLogo from './../assets/icons/dash-purchase.png';
import RevenueLogo from './../assets/icons/dash-revenue.png';
import ExpenditureLogo from './../assets/icons/dash-expenditure.png';
import SaleLogo from './../assets/icons/dash-sale.png';
import PieActiveArc from '../widgets/charts.muiPieChart';
import SimpleLineChart from '../widgets/charts.muiSimpleLineChart';
import SimpleBarChart from '../widgets/charts.muiSimpleBarChart';
import DataTable from '../widgets/tables.muiDataTable';

function Dashboard() {

  const [yearlyGrnList, setYearlyGrnList] = useState([]);
  const [yearlyInvoiceList, setYearlyInvoiceList] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [monthlyGrnCounts, setMonthlyGrnCounts] = useState([]);
  const [monthlyInvoiceCounts, setMonthlyInvoiceCounts] = useState([]);

  useEffect(() => {
    fetchYearlyGrn();
    fetchYearlyInvoice();
    fetchTopSales();
    fetchMonthlyGrnCount();
    fetchMonthlyInvoiceCount();
  }, []);

  const fetchYearlyGrn = async () => {
    try {
      const grnList = await dashboardService.getAllGrnsForCurrentYear();
      setYearlyGrnList(grnList);
    } catch (error) {
      console.error('Error fetching grn list:', error.message);
    }
  };

  const fetchYearlyInvoice = async () => {
    try {
      const invoiceList = await dashboardService.getAllInvoicesForCurrentYear();
      setYearlyInvoiceList(invoiceList);
    } catch (error) {
      console.error('Error fetching invoice list:', error.message);
    }
  };

  const filterCurrentMonthData = (data) => {
    const monthlyData = data.filter(item => {
      const itemDate = new Date(item.Date_Time);
      const currentMonth = new Date().getMonth();
      return itemDate.getMonth() === currentMonth;
    });
    return monthlyData;
  }

  const yearlyTotalCalculate = (data) => { 
    return data.reduce((total, item) => {
      const amount = parseFloat(item.Total_Amount) || 0;
      return total + amount;
    }, 0);
  };

  const monthlyTotalCalculate = (data) => {

    const monthlyData = filterCurrentMonthData(data);
    
    return monthlyData.reduce((total, item) => {
      const amount = parseFloat(item.Total_Amount) || 0;
      return total + amount;
    }, 0);
  };

  const fetchTopSales = async () => {
    try {
      const topSales = await dashboardService.getTopSellingItems();
      setTopSellingItems(topSales);
    } catch (error) {
      console.error('Error fetching top selling items:', error.message);
    }
  };

  const fetchMonthlyGrnCount = async () => {
    try {
      const grnCount = await dashboardService.getMonthlyGRNCount();
      setMonthlyGrnCounts(grnCount);
    } catch (error) {
      console.error('Error fetching monthly grn count:', error.message);
    }
  };

  const fetchMonthlyInvoiceCount = async () => {
    try {
      const grnCount = await dashboardService.getMonthlyInvoiceCount();
      setMonthlyInvoiceCounts(grnCount);
    } catch (error) {
      console.error('Error fetching monthly invoice count:', error.message);
    }
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
  
    return months[monthNumber - 1] || "Invalid Month";
  };

  const fetchMonthByArray = (monthNumbersArray) => {
    const monthNamesArray = monthNumbersArray.map(monthNumber => getMonthName(monthNumber));
    return monthNamesArray;
  }

  return (
    <div className='dashboard-container'>

      <div className='row-container1'>
        <BoxWidget id={1} total={yearlyGrnList.length} name={'Total Purchases'} img={PurchaseLogo} monthly={filterCurrentMonthData(yearlyGrnList).length}/>
        <BoxWidget id={2} total={yearlyInvoiceList.length} name={'Total Sale'} img={SaleLogo} monthly={filterCurrentMonthData(yearlyInvoiceList).length}/>
        <BoxWidget id={3} total={yearlyTotalCalculate(yearlyInvoiceList)} name={'Expenditure'} img={ExpenditureLogo} monthly={monthlyTotalCalculate(yearlyInvoiceList)}/>
        <BoxWidget id={4} total={yearlyTotalCalculate(yearlyGrnList)} name={'Revenue'} img={RevenueLogo} monthly={monthlyTotalCalculate(yearlyGrnList)}/>
        <BoxWidget id={5} total={yearlyTotalCalculate(yearlyGrnList)-yearlyTotalCalculate(yearlyInvoiceList)} name={'Profit'} img={ProfitLogo} monthly={monthlyTotalCalculate(yearlyGrnList)-monthlyTotalCalculate(yearlyInvoiceList)}/>
      </div>

      <div className='row-container2'>
        <span className='column-container1'>
          <div className='r1'>
            <div className='c1'>Monthly Expenditure Vs Revenue</div>
            <div className='c2'><SimpleLineChart pLabel={'Revenue'} pData={monthlyGrnCounts.map(item => parseFloat(item.TotalAmount))} uLabel={'Expenditure'} uData={monthlyInvoiceCounts.map(item => parseFloat(item.TotalAmount))} label={fetchMonthByArray(monthlyInvoiceCounts.map(item => parseFloat(item.InvoiceMonth)))}/></div>
          </div>
        </span>
        <span className='column-container2'>
          <div className='r1'>
            <div className='c1'>Top selling items</div>
            <div className='c2'><PieActiveArc data={topSellingItems} /></div>
          </div>
        </span>
      </div>

      <div className='row-container3'>
        <span className='column-container1'>
          <div className='r1'>
            <div className='c1'>Top Customers</div>
            <div className='c2'><DataTable /></div>
          </div>
        </span>
        <span className='column-container2'>
          <div className='r1'>
            <div className='c1'>Monthly GRN vs Invoice Counts</div>
            {/* <div className='c2'><SimpleBarChart pLabel={'Revenue'} pData={monthlyGrnCounts.map(item => parseFloat(item.TotalAmount))} uLabel={'Expenditure'} uData={monthlyInvoiceCounts.map(item => parseFloat(item.TotalAmount))} label={fetchMonthByArray(monthlyInvoiceCounts.map(item => parseFloat(item.InvoiceMonth)))} /></div> */}
          </div>
        </span>
      </div>

    </div>
  );
}

export default Dashboard;
