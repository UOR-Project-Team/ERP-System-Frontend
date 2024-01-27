import axios from 'axios';
const apiUrl = 'http://localhost:8081/invoice';

const invoiceServices = {

  getAllCustomers: async () => {
    try {
      const response = await axios.get(`${apiUrl}/customers`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customers');
    }
  },

  getItems: async () => {
    try {
      const response = await axios.get(`${apiUrl}/items`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching items by ID');
    }
  },

  getPrice: async (prodcutId) => {
    try {
      const response = await axios.get(`${apiUrl}/product/${prodcutId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching items by ID');
    }
  },

  getInvoiceData: async(invoiceNo)=>{
    try{
      const response = await axios.get(`${apiUrl}/invoice/${invoiceNo}`);
      console.log(response);
      return response.data;
      
    }catch(error){
      throw new Error('Error fetching invoice by ID');
    }

  },

  getSalesData: async(invoiceNo)=>{
    try{
      const response = await axios.get(`${apiUrl}/sales/${invoiceNo}`);
      console.log(response);
      return response.data;
      
    }catch(error){
      throw new Error('Error fetching sales items by ID');
    }

  },




  getAllInvoices: async () => {
    try {
      const response = await axios.get(`${apiUrl}/invoices`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching invoices');
    }
  },

  invoiceList: async(invoicedata)=>{

    try{
      const response = await axios.post(`${apiUrl}/list`, invoicedata, {
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
