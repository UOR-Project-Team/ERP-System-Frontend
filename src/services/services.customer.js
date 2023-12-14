import axios from 'axios';
const apiUrl = 'http://localhost:5000/customer';

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
};

export default customerServices;
