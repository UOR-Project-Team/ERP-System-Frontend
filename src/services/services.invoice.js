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




};

export default invoiceServices;
