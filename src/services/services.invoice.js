import connection from "../connection";

const invoiceServices = {

  getAllCustomers: async () => {
    try {
      const response = await connection.get(`/invoice/customers`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customers');
    }
  },

  getItems: async () => {
    try {
      const response = await connection.get(`/invoice/items`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching items by ID');
    }
  },

  getPrice: async (prodcutId) => {
    try {
      const response = await connection.get(`/invoice/product/${prodcutId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching items by ID');
    }
  },

  getInvoiceData: async(invoiceNo)=>{
    try{
      const response = await connection.get(`/invoice/invoice/${invoiceNo}`);
      console.log(response);
      return response.data;
      
    }catch(error){
      throw new Error('Error fetching invoice by ID');
    }

  },

  getSalesData: async(invoiceNo)=>{
    try{
      const response = await connection.get(`/invoice/sales/${invoiceNo}`);
      console.log(response);
      return response.data;
      
    }catch(error){
      throw new Error('Error fetching sales items by ID');
    }

  },

  getAllInvoices: async () => {
    try {
      const response = await connection.get(`/invoice/invoices`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching invoices');
    }
  },

  invoiceList: async(invoicedata)=>{
    try{
      const response = await connection.post(`/invoice/list`, invoicedata, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(response.status === 201){
        return response.status;
      }else{
        throw new Error('Error Reciving  Invoice Data response');
      }
    }catch(error){
      throw new Error('Error Passing Invoice Data');
    }
  },
};

export default invoiceServices;
