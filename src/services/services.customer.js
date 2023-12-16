import axios from 'axios';
const apiUrl = 'http://localhost:8081/customer';

const customerServices = {
  
  createCustomer: async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error creating customer');
    }
  },

  getAllCustomers: async () => {
    try {
      const response = await axios.get(`${apiUrl}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customers');
    }
  },

  getCustomerById: async (customerId) => {
    try {
      const response = await axios.get(`${apiUrl}/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customer by ID');
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const response = await axios.delete(`${apiUrl}/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting customer: ${error.message}`);
    }
  },

};

export default customerServices;
