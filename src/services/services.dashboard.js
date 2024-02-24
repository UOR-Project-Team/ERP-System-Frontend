import connection from "../connection";

const dashboardService = {
  
getAllGrnsForCurrentYear: async () => {
    try {
      const response = await connection.get(`/dashboard/YearlyGrns`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Yearly GRN Count');
    }
},

getAllGrnsForCurrentYearAndMonth: async () => {
    try {
      const response = await connection.get(`/dashboard/MonthlyGrns`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Monthly GRN Count');
    }
},

getAllInvoicesForCurrentYear: async () => {
    try {
      const response = await connection.get(`/dashboard/YearlyInvoices`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Yearly GRN Count');
    }
},

getAllInvoicesForCurrentYearAndMonth: async () => {
    try {
      const response = await connection.get(`/dashboard/MonthlyInvoices`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Monthly Invoice Count');
    }
},

getTopSellingItems: async () => {
  try {
    const response = await connection.get(`/dashboard/topSales`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching Top Sale Items');
  }
},

getMonthlyGRNCount: async () => {
  try {
    const response = await connection.get(`/dashboard/monthlyGrnCount`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching GRN count');
  }
},

getMonthlyInvoiceCount: async () => {
  try {
    const response = await connection.get(`/dashboard/monthlyInvoiceCount`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching Invoice count');
  }
},

};

export default dashboardService;
