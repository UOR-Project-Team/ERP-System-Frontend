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
